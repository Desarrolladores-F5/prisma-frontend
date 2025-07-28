'use client';

import { useEffect, useState } from 'react';
import { obtenerMisDocumentos, crearFirma } from '@/lib/api';
import type { Documento } from '@/types';
import { toast } from 'sonner';
import { obtenerIdDesdeToken } from '@/lib/validate-role';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 📡 Función para obtener la IP pública
const obtenerIpPublica = async (): Promise<string> => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    return data.ip;
  } catch {
    return 'Desconocida';
  }
};

export default function TablaDocumentosSupervisor() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(false);

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

  const generarHash = async (entidadId: number, firmanteId: number): Promise<string> => {
    const raw = `documento-${entidadId}-${firmanteId}-${new Date().toISOString()}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(raw);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const confirmarRecepcion = async (documentoId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Token no encontrado');
        return;
      }

      const firmanteId = obtenerIdDesdeToken(token);
      if (firmanteId === null) {
        toast.error('No se pudo obtener el ID del usuario desde el token');
        return;
      }

      const res = await fetch(`${BASE_URL}/api/documentos/recepcionar/${documentoId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.mensaje || 'Error al confirmar recepción');
      }

      const data = await res.json();
      const hash = await generarHash(documentoId, firmanteId);
      const ip = await obtenerIpPublica();

      const metadata = {
        documento_id: documentoId,
        entidad: 'documento',
        entidad_id: documentoId,
        navegador: navigator.userAgent,
        dispositivo: navigator.platform,
        ip,
        timestamp: new Date().toISOString(),
      };

      // Registrar firma
      await crearFirma({
        firmante_id: firmanteId,
        hash_firma: hash,
        tipo_firma: 'validacion',
        metadata,
      });

      toast.success('✅ Documento confirmado correctamente');

      setDocumentos((prev) =>
        prev.map((doc) =>
          doc.id === documentoId
            ? {
                ...doc,
                recepcionado: true,
                fecha_recepcion: new Date().toISOString(),
                ruta_constancia_pdf: data.ruta_constancia_pdf,
              }
            : doc
        )
      );
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
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
                        <a
                          href={`${BASE_URL}${doc.ruta_constancia_pdf}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-indigo-500 hover:bg-indigo-600 text-white text-xs px-3 py-1 rounded shadow transition duration-200"
                          title="Abrir constancia de recepción en PDF"
                        >
                          Ver constancia 📄
                        </a>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => confirmarRecepcion(doc.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Confirmar
                    </button>
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
