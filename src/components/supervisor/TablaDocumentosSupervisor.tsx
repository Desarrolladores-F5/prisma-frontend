'use client';

import { useEffect, useState } from 'react';
import { obtenerMisDocumentos, confirmarRecepcionDocumento, obtenerConstanciaProtegida } from '@/lib/api';
import type { Documento } from '@/types';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function TablaDocumentosSupervisor() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);
  const [aceptaciones, setAceptaciones] = useState<Record<number, boolean>>({});
  const [confirmandoId, setConfirmandoId] = useState<number | null>(null);

  const cargarDocumentos = async () => {
    try {
      setLoading(true);
      const data = await obtenerMisDocumentos();
      setDocumentos(data);
    } catch (error) {
      console.error('❌ Error al cargar documentos:', error);
      toast.error('❌ Error al cargar documentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDocumentos();
  }, []);

  const verConstancia = async (asignacionId?: number | null) => {
    if (!asignacionId) {
      toast.error('No se encontró la asignación de este documento.');
      return;
    }

    const ventana = window.open('', '_blank');

    if (!ventana) {
      toast.error('El navegador bloqueó la nueva pestaña. Permite ventanas emergentes para PRISMA.');
      return;
    }

    try {
      const pdf = await obtenerConstanciaProtegida(asignacionId);
      const urlTemporal = URL.createObjectURL(pdf);

      ventana.location.href = urlTemporal;

      window.setTimeout(() => URL.revokeObjectURL(urlTemporal), 60000);
    } catch (error: unknown) {
      ventana.close();
      toast.error(
        error instanceof Error
          ? error.message
          : 'No fue posible abrir la constancia.'
      );
    }
  };

  const confirmarRecepcion = async (documentoId: number) => {
    if (!aceptaciones[documentoId] || confirmandoId !== null) {
      return;
    }

    setConfirmandoId(documentoId);

    try {
      await confirmarRecepcionDocumento(documentoId, true);
      toast.success('Documento recepcionado y constancia generada correctamente.');

      setAceptaciones((prev) => ({ ...prev, [documentoId]: false }));
      await cargarDocumentos();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No fue posible confirmar la recepción del documento.'
      );
    } finally {
      setConfirmandoId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Mis Documentos Asignados</h2>
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Versión</th>
            <th className="border p-2">Asignación</th>
            <th className="border p-2">Acciones</th>
            <th className="border p-2">Recepción</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                Cargando...
              </td>
            </tr>
          ) : documentos.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">
                No tienes documentos asignados.
              </td>
            </tr>
          ) : (
            documentos.map((doc) => (
              <tr key={doc.id} className="text-center border-t hover:bg-gray-50">
                <td className="p-2">{doc.nombre}</td>
                <td className="p-2">{doc.tipo}</td>
                <td className="p-2">{doc.version ?? '—'}</td>
                <td className="p-2">
                  {doc.fecha_asignacion
                    ? new Date(doc.fecha_asignacion).toLocaleDateString('es-CL')
                    : '—'}
                </td>
                <td className="p-2">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <a
                      href={`${BASE_URL}${doc.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Ver
                    </a>
                    <a
                      href={`${BASE_URL}${doc.url}`}
                      download
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Descargar
                    </a>
                  </div>
                </td>
                <td className="p-2">
                  {doc.recepcionado ? (
                    <div className="flex flex-col items-center gap-1">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-semibold">
                        Confirmado
                      </span>
                      {doc.ruta_constancia_pdf && (
                        <button
                          type="button"
                          onClick={() => verConstancia(doc.asignacion_id)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded shadow transition duration-200"
                          title="Abrir constancia de recepción en PDF"
                        >
                          Ver constancia 📄
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <label className="flex items-start gap-2 text-left text-xs max-w-xs cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-0.5"
                          checked={aceptaciones[doc.id] === true}
                          disabled={confirmandoId !== null}
                          onChange={(evento) =>
                            setAceptaciones((prev) => ({
                              ...prev,
                              [doc.id]: evento.target.checked,
                            }))
                          }
                        />
                        <span>
                          Declaro que he leído y comprendido el documento,
                          y confirmo expresamente su recepción.
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => confirmarRecepcion(doc.id)}
                        disabled={!aceptaciones[doc.id] || confirmandoId !== null}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {confirmandoId === doc.id ? 'Confirmando...' : 'Confirmar'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
