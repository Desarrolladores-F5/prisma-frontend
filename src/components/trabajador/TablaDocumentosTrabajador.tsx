'use client';

import { useEffect, useState } from 'react';
import { obtenerMisDocumentos } from '@/lib/api';
import type { Documento } from '@/types';
import { toast } from 'sonner';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function TablaDocumentosTrabajador() {
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

  const confirmarRecepcion = async (documentoId: number) => {
    try {
      const token = localStorage.getItem('token');
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

      toast.success('✅ Documento confirmado correctamente');

      // Actualización local del documento
      setDocumentos(prev =>
        prev.map(doc =>
          doc.id === documentoId
            ? { ...doc, recepcionado: true, fecha_recepcion: new Date().toISOString() }
            : doc
        )
      );
    } catch (error: any) {
      toast.error(`❌ ${error.message}`);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Mis Documentos</h2>
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Versión</th>
            <th className="border p-2">Fecha Asignación</th>
            <th className="border p-2">Acciones</th>
            <th className="border p-2">Recepción</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">Cargando...</td>
            </tr>
          ) : documentos.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-center py-4 text-gray-500">No tienes documentos asignados.</td>
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
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded font-semibold">
                      Confirmado
                    </span>
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
