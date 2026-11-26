'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import AdminLayout from '@/components/layout/AdminLayout';

type Contrato = { id: number; nombre: string };

type Entrega = {
  id: number;
  requisito_id: number;
  estado: string;
  observaciones: string | null;
};

type Historial = {
  acreditaciones: Entrega[];
  totalPaginas: number;
};

const estados: Record<string, string> = {
  pendiente: 'Pendiente de revisión',
  en_revision: 'En revisión',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
  vencido: 'Vencido',
};

type AccionRevision = 'iniciar_revision' | 'aprobar' | 'rechazar';

async function consultar(
  ruta: string,
  signal?: AbortSignal,
  cuerpo?: { accion: AccionRevision; observaciones?: string } | { nombre: string } | FormData
): Promise<Response> {
  const url = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
  const token = localStorage.getItem('token');

  if (!url) throw new Error('La URL del backend no está configurada.');
  if (!token) throw new Error('Inicia sesión como administrador de la mandante.');

  const respuesta = await fetch(`${url}/api/contratos-externos${ruta}`, {
    method: !cuerpo ? 'GET' : cuerpo instanceof FormData ? 'POST' : 'accion' in cuerpo ? 'PATCH' : 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      ...(cuerpo && !(cuerpo instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    },
    body: cuerpo instanceof FormData ? cuerpo : cuerpo ? JSON.stringify(cuerpo) : undefined,
    cache: 'no-store',
    signal,
  });

  if (!respuesta.ok) {
    const datos = await respuesta.json().catch(() => null);
    throw new Error(datos?.mensaje || `La consulta falló (HTTP ${respuesta.status}).`);
  }

  return respuesta;
}

export default function DocumentosExternosMandantePage() {
  const params = useParams<{ contratoId: string }>();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [contratoId, setContratoId] = useState<number | null>(null);
  const [pagina, setPagina] = useState(1);
  const [historial, setHistorial] = useState<Historial | null>(null);
  const [cargandoContratos, setCargandoContratos] = useState(true);
  const [errorContratos, setErrorContratos] = useState('');
  const [errorHistorial, setErrorHistorial] = useState('');
  const [errorDescarga, setErrorDescarga] = useState('');
  const [descargando, setDescargando] = useState<number | null>(null);
  const [actualizacion, setActualizacion] = useState(0);
  const [revisando, setRevisando] = useState<number | null>(null);
  const [rechazo, setRechazo] = useState<{ id: number; motivo: string } | null>(null);
  const [errorRevision, setErrorRevision] = useState('');
  const [avisoRevision, setAvisoRevision] = useState('');
  const [nombreSolicitud, setNombreSolicitud] = useState('');
  const [archivoSolicitud, setArchivoSolicitud] = useState<File | null>(null);
  const [reinicioArchivo, setReinicioArchivo] = useState(0);
  const [creandoSolicitud, setCreandoSolicitud] = useState(false);
  const [errorSolicitud, setErrorSolicitud] = useState('');
  const [avisoSolicitud, setAvisoSolicitud] = useState('');

  useEffect(() => {
    const control = new AbortController();

    void consultar('', control.signal)
      .then(respuesta => respuesta.json() as Promise<Contrato[]>)
      .then(datos => {
        if (control.signal.aborted) return;
        setContratos(datos);

        const identificador = params?.contratoId ?? '';
        const id = /^\d+$/.test(identificador)
          ? Number(identificador)
          : NaN;

        const autorizado =
          Number.isSafeInteger(id) &&
          id > 0 &&
          datos.some(contrato => contrato.id === id);

        if (!autorizado) {
          setContratoId(null);
          setErrorContratos(
            'El contrato solicitado no existe o no está autorizado.'
          );
          return;
        }

        setContratoId(id);
      })
      .catch((error: Error) => {
        if (!control.signal.aborted) setErrorContratos(error.message);
      })
      .finally(() => {
        if (!control.signal.aborted) setCargandoContratos(false);
      });

    return () => control.abort();
  }, [params?.contratoId]);

  useEffect(() => {
    if (contratoId === null) return;
    const control = new AbortController();

    void consultar(`/${contratoId}/acreditaciones?pagina=${pagina}&limite=20`, control.signal)
      .then(respuesta => respuesta.json() as Promise<Historial>)
      .then(datos => {
        if (!control.signal.aborted) setHistorial(datos);
      })
      .catch((error: Error) => {
        if (!control.signal.aborted) setErrorHistorial(error.message);
      });

    return () => control.abort();
  }, [contratoId, pagina, actualizacion]);

  function limpiarHistorial() {
    setHistorial(null);
    setErrorHistorial('');
    setErrorDescarga('');
    setRechazo(null);
    setErrorRevision('');
    setAvisoRevision('');
  }

  async function revisar(id: number, accion: AccionRevision, motivo?: string) {
    if (revisando !== null) return;

    const observaciones = motivo?.trim();
    if (accion === 'rechazar' && !observaciones) {
      setErrorRevision('Escribe el motivo del rechazo.');
      return;
    }

    setRevisando(id);
    setErrorRevision('');
    setAvisoRevision('');

    try {
      await consultar('/acreditaciones/' + id + '/revision', undefined,
        accion === 'rechazar' ? { accion, observaciones } : { accion }
      );

      limpiarHistorial();
      setActualizacion(valor => valor + 1);
      setAvisoRevision(
        accion === 'iniciar_revision' ? 'Revisión iniciada.' :
        accion === 'aprobar' ? 'Entrega aprobada.' : 'Entrega rechazada.'
      );
    } catch (error: unknown) {
      setErrorRevision(error instanceof Error ? error.message : 'No se pudo confirmar la revisión.');
    } finally {
      setRevisando(null);
    }
  }

  async function solicitarDocumento() {
    const nombre = nombreSolicitud.trim();
    if (contratoId === null || creandoSolicitud || !nombre || nombre.length > 255) return;

    if (archivoSolicitud) {
      const extensionValida = /\.(pdf|doc|docx)$/i.test(archivoSolicitud.name);
      if (!extensionValida) {
        setErrorSolicitud('La plantilla debe ser un archivo PDF, DOC o DOCX.');
        return;
      }

      if (archivoSolicitud.size === 0 || archivoSolicitud.size > 10 * 1024 * 1024) {
        setErrorSolicitud('La plantilla debe tener un tamaño mayor que cero y no superar los 10 MB.');
        return;
      }
    }

    setCreandoSolicitud(true);
    setErrorSolicitud('');
    setAvisoSolicitud('');

    try {
      let cuerpo: { nombre: string } | FormData = { nombre };

      if (archivoSolicitud) {
        const formulario = new FormData();
        formulario.append('nombre', nombre);
        formulario.append('archivo', archivoSolicitud);
        cuerpo = formulario;
      }

      const respuesta = await consultar('/' + contratoId + '/requisitos', undefined, cuerpo);
      if (respuesta.status !== 201) {
        throw new Error('No se confirmó la creación de la solicitud.');
      }

      setNombreSolicitud('');
      setArchivoSolicitud(null);
      setReinicioArchivo(valor => valor + 1);
      setAvisoSolicitud(
        archivoSolicitud
          ? 'Solicitud creada con plantilla adjunta. La empresa externa podrá descargarla desde su portal.'
          : 'Solicitud creada. La empresa externa ya puede verla en su portal.'
      );
    } catch (error: unknown) {
      setErrorSolicitud(error instanceof Error ? error.message : 'No se pudo crear la solicitud.');
    } finally {
      setCreandoSolicitud(false);
    }
  }

  async function descargar(id: number) {
    setDescargando(id);
    setErrorDescarga('');
    try {
      const respuesta = await consultar(`/acreditaciones/${id}/archivo`);
      const pdf = await respuesta.blob();
      if (pdf.type !== 'application/pdf') {
        throw new Error('El servidor no devolvió un PDF.');
      }

      const enlace = document.createElement('a');
      const url = URL.createObjectURL(pdf);
      enlace.href = url;
      enlace.download = `acreditacion-${id}.pdf`;
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error: unknown) {
      setErrorDescarga(error instanceof Error ? error.message : 'No se pudo descargar el PDF.');
    } finally {
      setDescargando(null);
    }
  }

  return (
    <AdminLayout>
      <section className="mx-auto max-w-5xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Entregas de empresas externas</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/dashboard/documentos/externos"
              className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Volver a contratistas
            </Link>

            <Link
              href="/admin/dashboard"
              className="rounded bg-gray-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>

        {cargandoContratos && <p role="status">Cargando contratos…</p>}
        {errorContratos && <p role="alert" className="text-red-700">{errorContratos}</p>}
        {!cargandoContratos && !errorContratos && contratos.length === 0 && (
          <p>No hay contratos externos para esta mandante.</p>
        )}

        {contratoId !== null && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-800">
              Documentación del contrato
            </p>
            <p className="mt-1 font-semibold text-gray-900">
              {contratos.find(contrato => contrato.id === contratoId)?.nombre ??
                `Contrato #${contratoId}`}
            </p>
          </div>
        )}

        {contratoId !== null && (
          <form className="space-y-3 rounded-lg border border-gray-200 p-4" onSubmit={event => {
            event.preventDefault();
            void solicitarDocumento();
          }}>
            <h2 className="text-lg font-semibold">Solicitar documento</h2>
            <label className="block text-sm font-medium">
              Nombre del documento
              <input
                required
                maxLength={255}
                value={nombreSolicitud}
                disabled={creandoSolicitud}
                onChange={event => setNombreSolicitud(event.target.value)}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
              />
            </label>
            <label className="block text-sm font-medium">
              Adjuntar plantilla (opcional)
              <input
                key={reinicioArchivo}
                type="file"
                accept=".pdf,.doc,.docx"
                disabled={creandoSolicitud}
                onChange={event => {
                  setArchivoSolicitud(event.target.files?.[0] ?? null);
                  setErrorSolicitud('');
                }}
                className="mt-1 block w-full rounded border border-gray-300 p-2"
              />
              <span className="mt-1 block text-xs text-gray-600">
                PDF o Word (DOC/DOCX), máximo 10 MB. No es obligatorio adjuntar un archivo.
              </span>
            </label>
            <button
              type="submit"
              disabled={creandoSolicitud || !nombreSolicitud.trim()}
              className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {creandoSolicitud ? 'Creando…' : 'Crear solicitud'}
            </button>
            {avisoSolicitud && <p role="status" className="text-sm text-green-800">{avisoSolicitud}</p>}
            {errorSolicitud && <p role="alert" className="text-sm text-red-800">{errorSolicitud}</p>}
          </form>
        )}

        {contratoId !== null && !historial && !errorHistorial && (
          <p role="status">Cargando entregas…</p>
        )}
        {errorHistorial && <p role="alert" className="text-red-700">{errorHistorial}</p>}
        {errorDescarga && <p role="alert" className="text-red-700">{errorDescarga}</p>}
        {avisoRevision && <p role="status" className="text-green-800">{avisoRevision}</p>}
        {errorRevision && (
          <div className="rounded bg-red-50 p-3 text-sm text-red-800">
            <p role="alert">{errorRevision}</p>
            <button type="button" className="mt-1 underline" onClick={() => {
              limpiarHistorial();
              setActualizacion(valor => valor + 1);
            }}>Actualizar entregas</button>
          </div>
        )}

        {historial && (
          <>
            {historial.acreditaciones.length === 0 && <p>No hay entregas para este contrato.</p>}
            <ul className="divide-y divide-gray-200">
              {historial.acreditaciones.map(entrega => (
                <li key={entrega.id} className="flex flex-wrap items-start justify-between gap-3 py-4">
                  <div>
                    <p className="font-semibold">Entrega #{entrega.id} · Solicitud #{entrega.requisito_id}</p>
                    <p>{estados[entrega.estado] ?? entrega.estado}</p>
                    {entrega.observaciones && (
                      <p className="whitespace-pre-wrap text-sm text-gray-600">{entrega.observaciones}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={descargando !== null}
                    onClick={() => void descargar(entrega.id)}
                    className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {descargando === entrega.id ? 'Descargando…' : 'Descargar PDF'}
                  </button>

                  {entrega.estado === 'pendiente' && (
                    <button type="button" disabled={revisando !== null}
                      onClick={() => void revisar(entrega.id, 'iniciar_revision')}
                      className="rounded border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-800 disabled:opacity-50">
                      {revisando === entrega.id ? 'Guardando…' : 'Iniciar revisión'}
                    </button>
                  )}

                  {entrega.estado === 'en_revision' && (
                    <div className="w-full space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" disabled={revisando !== null}
                          onClick={() => void revisar(entrega.id, 'aprobar')}
                          className="rounded bg-green-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                          Aprobar
                        </button>
                        <button type="button" disabled={revisando !== null}
                          onClick={() => setRechazo({ id: entrega.id, motivo: '' })}
                          className="rounded border border-red-700 px-4 py-2 text-sm font-semibold text-red-800 disabled:opacity-50">
                          Rechazar
                        </button>
                      </div>

                      {rechazo?.id === entrega.id && (
                        <form className="space-y-2" onSubmit={event => {
                          event.preventDefault();
                          void revisar(entrega.id, 'rechazar', rechazo.motivo);
                        }}>
                          <label className="block text-sm font-medium">
                            Motivo del rechazo
                            <textarea required value={rechazo.motivo}
                              disabled={revisando !== null}
                              onChange={event => setRechazo({ id: entrega.id, motivo: event.target.value })}
                              className="mt-1 block w-full rounded border border-gray-300 p-2" />
                          </label>
                          <button type="submit" disabled={revisando !== null || !rechazo.motivo.trim()}
                            className="rounded bg-red-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                            Confirmar rechazo
                          </button>
                          <button type="button" disabled={revisando !== null}
                            onClick={() => setRechazo(null)} className="ml-3 text-sm underline">
                            Cancelar
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
            {historial.totalPaginas > 1 && (
              <nav aria-label="Páginas de entregas" className="flex items-center gap-4 text-sm">
                <button type="button" disabled={revisando !== null || pagina <= 1} onClick={() => {
                  limpiarHistorial();
                  setPagina(actual => actual - 1);
                }}>Anterior</button>
                <span>Página {pagina} de {historial.totalPaginas}</span>
                <button type="button" disabled={revisando !== null || pagina >= historial.totalPaginas} onClick={() => {
                  limpiarHistorial();
                  setPagina(actual => actual + 1);
                }}>Siguiente</button>
              </nav>
            )}
          </>
        )}
      </section>
    </AdminLayout>
  );
}
