'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Building2 } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

import DashboardCard from '@/components/ui/DashboardCard';
import CampanitaNotificaciones from '@/components/layout/CampanitaNotificaciones';
import {
  obtenerMisEmpresasExternas,
  obtenerMisSolicitudesDocumentalesExternas,
  descargarPlantillaDocumentalExterna,
  subirPdfSolicitudExterna,
  type EmpresaExternaVinculada,
  type SolicitudDocumentalExterna,
} from '@/lib/empresasExternasApi';

const estados: Record<string, { texto: string; color: string }> = {
  pendiente_carga: { texto: 'Pendiente de carga', color: 'bg-amber-100 text-amber-900' },
  pendiente: { texto: 'Pendiente de revisión', color: 'bg-blue-100 text-blue-900' },
  en_revision: { texto: 'En revisión', color: 'bg-blue-100 text-blue-900' },
  aprobado: { texto: 'Aprobado', color: 'bg-green-100 text-green-900' },
  rechazado: { texto: 'Rechazado', color: 'bg-red-100 text-red-900' },
  vencido: { texto: 'Vencido', color: 'bg-gray-100 text-gray-800' },
};

type Consulta<T> =
  | { tipo: 'cargando' }
  | { tipo: 'error'; mensaje: string }
  | { tipo: 'listo'; datos: T };

function mensajeError(error: unknown, alternativo: string) {
  return error instanceof Error ? error.message : alternativo;
}

function DescargarPlantilla({
  solicitud,
}: {
  solicitud: SolicitudDocumentalExterna;
}) {
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState('');

  async function descargar() {
    if (descargando) return;

    setDescargando(true);
    setError('');

    try {
      const { archivo, nombre } = await descargarPlantillaDocumentalExterna(
        solicitud.contratoId,
        solicitud.id
      );

      const url = URL.createObjectURL(archivo);

      try {
        const enlace = document.createElement('a');
        enlace.href = url;
        enlace.download = nombre;
        document.body.appendChild(enlace);

        try {
          enlace.click();
        } finally {
          enlace.remove();
        }
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch (err: unknown) {
      setError(mensajeError(err, 'No fue posible descargar la plantilla.'));
    } finally {
      setDescargando(false);
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        disabled={descargando}
        onClick={() => void descargar()}
        className="rounded-lg border border-blue-700 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-50"
      >
        {descargando ? 'Descargando plantilla…' : 'Descargar plantilla'}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-800">
          {error}
        </p>
      )}
    </div>
  );
}

function EntregarPdf({
  solicitud,
  alEntregar,
}: {
  solicitud: SolicitudDocumentalExterna;
  alEntregar: () => void;
}) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!archivo || enviando) return;

    setError('');
    if (!/\.pdf$/i.test(archivo.name) || archivo.size === 0 || archivo.size > 10 * 1024 * 1024) {
      setError('Selecciona un PDF válido de hasta 10 MB.');
      return;
    }

    setEnviando(true);
    try {
      await subirPdfSolicitudExterna(solicitud.contratoId, solicitud.id, archivo);
      alEntregar();
    } catch (err: unknown) {
      setError(mensajeError(err, 'No se pudo confirmar la entrega.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mt-4 space-y-2 border-t border-gray-100 pt-3">
      <label className="block text-sm font-medium text-gray-700">
        Archivo PDF (hasta 10 MB)
        <input
          type="file"
          accept=".pdf,application/pdf"
          disabled={enviando}
          onChange={event => {
            setArchivo(event.target.files?.[0] ?? null);
            setError('');
          }}
          className="mt-1 block w-full text-sm text-gray-700"
        />
      </label>
      <button
        type="submit"
        disabled={!archivo || enviando}
        className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
      >
        {enviando ? 'Enviando…' : solicitud.estado === 'rechazado' ? 'Reenviar PDF' : 'Subir PDF'}
      </button>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    </form>
  );
}

function DocumentosSolicitados({ empresa }: { empresa: EmpresaExternaVinculada }) {
  const [consulta, setConsulta] = useState<Consulta<SolicitudDocumentalExterna[]>>({
    tipo: 'cargando',
  });
  const [intento, setIntento] = useState(0);
  const [aviso, setAviso] = useState('');

  function actualizar() {
    setConsulta({ tipo: 'cargando' });
    setIntento(valor => valor + 1);
  }

  useEffect(() => {
    const control = new AbortController();

    void obtenerMisSolicitudesDocumentalesExternas(control.signal)
      .then(({ solicitudes }) => {
        if (!control.signal.aborted) {
          setConsulta({ tipo: 'listo', datos: solicitudes });
        }
      })
      .catch((error: unknown) => {
        if (!control.signal.aborted) {
          setConsulta({
            tipo: 'error',
            mensaje: mensajeError(error, 'No fue posible consultar las solicitudes.'),
          });
        }
      });

    return () => control.abort();
  }, [intento]);

  const solicitudes = consulta.tipo === 'listo'
    ? consulta.datos.filter(solicitud => solicitud.empresaId === empresa.empresaId)
    : [];

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Documentos solicitados</h2>
      <p className="mt-1 text-sm text-gray-600">{empresa.nombre}</p>
      {aviso && <p role="status" className="mt-3 text-sm text-green-800">{aviso}</p>}

      {consulta.tipo === 'cargando' ? (
        <p role="status" className="mt-4 text-sm text-gray-600">Cargando solicitudes…</p>
      ) : consulta.tipo === 'error' ? (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <p role="alert">{consulta.mensaje}</p>
          <button type="button" className="mt-2 font-semibold underline" onClick={actualizar}>
            Reintentar consulta
          </button>
        </div>
      ) : solicitudes.length === 0 ? (
        <p className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          Esta empresa todavía no tiene documentos solicitados.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-gray-200 rounded-lg border border-gray-200">
          {solicitudes.map(solicitud => {
            const estado = estados[solicitud.estado] ?? {
              texto: 'Estado no disponible',
              color: 'bg-gray-100 text-gray-800',
            };

            return (
              <li key={solicitud.id} className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{solicitud.nombre}</h3>
                    <p className="text-sm text-gray-600">Mandante: {solicitud.mandante}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${estado.color}`}>
                    {estado.texto}
                  </span>
                </div>

                {solicitud.estado === 'rechazado' && solicitud.observaciones && (
                  <p className="mt-3 whitespace-pre-wrap rounded-lg bg-red-50 p-3 text-sm text-red-800">
                    <strong>Motivo del rechazo:</strong> {solicitud.observaciones}
                  </p>
                )}

                {Boolean(solicitud.tienePlantilla) && (
                  <DescargarPlantilla solicitud={solicitud} />
                )}

                {(solicitud.estado === 'pendiente_carga' || solicitud.estado === 'rechazado') && (
                  <EntregarPdf
                    solicitud={solicitud}
                    alEntregar={() => {
                      setAviso(`PDF entregado: ${solicitud.nombre}.`);
                      actualizar();
                    }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function CerrarSesionPortal() {
  const { status } = useSession();
  const [cerrando, setCerrando] = useState(false);
  const [error, setError] = useState('');

  async function cerrarSesion() {
    setCerrando(true);
    setError('');

    try {
      if (status === 'authenticated') {
        await signOut({ redirect: false });
      }

      localStorage.removeItem('token');
      localStorage.removeItem('rol_id');
      window.location.replace('/login');
    } catch {
      setError('No se pudo cerrar la sesión. Inténtalo nuevamente.');
      setCerrando(false);
    }
  }

  return (
    <div className="text-right">
      <button
        type="button"
        disabled={cerrando || status === 'loading'}
        onClick={() => void cerrarSesion()}
        className="font-semibold text-lg px-5 py-2.5 rounded transition bg-white text-blue-800 border border-blue-800 hover:bg-blue-800 hover:text-white disabled:opacity-50"
      >
        {cerrando ? 'Cerrando sesión…' : 'Cerrar sesión'}
      </button>
      {error && <p role="alert" className="mt-2 text-sm text-white">{error}</p>}
    </div>
  );
}

export default function EmpresaExternaDashboard() {
  const [consulta, setConsulta] = useState<Consulta<EmpresaExternaVinculada[]>>({
    tipo: 'cargando',
  });
  const [empresaId, setEmpresaId] = useState<number | null>(null);

  useEffect(() => {
    const control = new AbortController();

    void obtenerMisEmpresasExternas(control.signal)
      .then(({ empresas }) => {
        if (control.signal.aborted) return;
        const autorizadas = empresas.filter(empresa => empresa.perfil === 'administrador_externo');
        setEmpresaId(autorizadas.length === 1 ? autorizadas[0].empresaId : null);
        setConsulta({ tipo: 'listo', datos: autorizadas });
      })
      .catch((error: unknown) => {
        if (!control.signal.aborted) {
          setConsulta({
            tipo: 'error',
            mensaje: mensajeError(error, 'No fue posible consultar las empresas autorizadas.'),
          });
        }
      });

    return () => control.abort();
  }, []);

  if (consulta.tipo === 'cargando') {
    return <p role="status" className="p-6 text-gray-600">Verificando tus empresas autorizadas…</p>;
  }

  if (consulta.tipo === 'error') {
    return (
      <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-800">
        <h1 className="text-xl font-bold">No fue posible acceder al portal</h1>
        <p className="mt-2 text-sm">{consulta.mensaje}</p>
      </div>
    );
  }

  const empresas = consulta.datos;
  if (empresas.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
        <h1 className="text-xl font-bold">Sin empresas autorizadas</h1>
        <p className="mt-2 text-sm">
          Tu usuario no tiene vinculaciones administrativas activas con empresas externas.
        </p>
      </div>
    );
  }

  const seleccionada = empresas.find(empresa => empresa.empresaId === empresaId);

  return (
    <div className="space-y-6">
      <div className="relative z-20 flex justify-end">
        <CampanitaNotificaciones rol="externo" />
      </div>

      <header className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-blue-800 p-6 text-white shadow-sm">
        <div className="flex items-center gap-3">
          <Building2 aria-hidden="true" className="h-9 w-9 shrink-0" />
          <div>
          <h1 className="text-2xl font-bold">Portal de Empresas Externas</h1>
          <p className="mt-1 text-sm text-blue-100">
              Gestión documental para contratistas y subcontratistas
            </p>
          </div>
        </div>
        <div className="ml-auto"><CerrarSesionPortal /></div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardCard title="Empresas autorizadas" value={String(empresas.length)} icon="🏢" accentRole="admin" />
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">Seleccionar empresa</h2>
        <p className="mb-4 mt-1 text-sm text-gray-600">
          Elige la empresa para consultar los documentos que le solicitaron.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {empresas.map(empresa => (
            <button
              key={empresa.empresaId}
              type="button"
              aria-pressed={empresa.empresaId === empresaId}
              onClick={() => setEmpresaId(empresa.empresaId)}
              className={`flex items-center gap-3 rounded-lg border p-4 text-left ${
                empresa.empresaId === empresaId
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 bg-white hover:border-blue-400'
              }`}
            >
              <Building2 aria-hidden="true" className="h-7 w-7 text-blue-700" />
              <span>
                <span className="block font-semibold text-gray-800">{empresa.nombre}</span>
                <span className="block text-sm text-gray-500">Administrador externo</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {seleccionada && <DocumentosSolicitados key={seleccionada.empresaId} empresa={seleccionada} />}
    </div>
  );
}
