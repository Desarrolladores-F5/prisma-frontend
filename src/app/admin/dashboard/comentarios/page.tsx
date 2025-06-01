// src/app/admin/dashboard/comentarios/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerReportes, obtenerAuditorias } from '@/lib/api';

export default function ComentariosPage() {
  const router = useRouter();
  const [entidadSeleccionada, setEntidadSeleccionada] = useState<'reporte' | 'auditoria'>('reporte');
  const [registros, setRegistros] = useState<any[]>([]);

  useEffect(() => {
    const cargarRegistros = async () => {
      try {
        if (entidadSeleccionada === 'reporte') {
          const data = await obtenerReportes();
          setRegistros(data);
        } else if (entidadSeleccionada === 'auditoria') {
          const data = await obtenerAuditorias();
          setRegistros(data);
        }
      } catch (error) {
        console.error('❌ Error al cargar registros:', error);
      }
    };

    cargarRegistros();
  }, [entidadSeleccionada]);

  const manejarRedireccion = (id: number) => {
    router.push(`/admin/dashboard/comentarios/${entidadSeleccionada}/${id}`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión General de Comentarios</h1>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver al Inicio
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold mb-1">Selecciona la entidad:</label>
        <select
          value={entidadSeleccionada}
          onChange={(e) => setEntidadSeleccionada(e.target.value as 'reporte' | 'auditoria')}
          className="border p-2 rounded w-full max-w-xs"
        >
          <option value="reporte">Reporte</option>
          <option value="auditoria">Auditoría</option>
        </select>
      </div>

      {registros.length === 0 ? (
        <p className="text-gray-600">No hay registros para mostrar.</p>
      ) : (
        <table className="w-full table-auto border-collapse text-sm mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Autor</th>
              <th className="border px-3 py-2">Título / Tipo</th>
              <th className="border px-3 py-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {registros.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  {entidadSeleccionada === 'reporte' && item.usuario ? (
                    <>
                      <div className="font-medium">
                        {item.usuario.nombre} {item.usuario.apellido}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.usuario.rol?.nombre ?? 'Sin cargo'}
                      </div>
                    </>
                  ) : entidadSeleccionada === 'auditoria' && item.auditor ? (
                    <>
                      <div className="font-medium">
                        {item.auditor.nombre} {item.auditor.apellido}
                      </div>
                      <div className="text-xs text-gray-500">
                        {item.auditor.rol?.nombre ?? 'Sin cargo'}
                      </div>
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="border px-3 py-2">
                  {entidadSeleccionada === 'reporte' ? item.titulo : item.tipo}
                </td>
                <td className="border px-3 py-2">
                  <button
                    onClick={() => manejarRedireccion(item.id)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    💬 Ver Comentarios
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
