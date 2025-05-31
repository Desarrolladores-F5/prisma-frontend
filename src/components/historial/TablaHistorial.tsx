'use client';

import { useEffect, useState } from 'react';
import { obtenerHistorialCambios } from '@/lib/api';
import { HistorialCambio } from '@/types';

export default function TablaHistorial() {
  const [historial, setHistorial] = useState<HistorialCambio[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await obtenerHistorialCambios();
        setHistorial(datos);
      } catch (error) {
        console.error('❌ Error al obtener historial:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) return <p className="text-gray-600 p-4">Cargando historial de cambios...</p>;

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Fecha</th>
            <th className="border px-3 py-2 text-left">Usuario</th>
            <th className="border px-3 py-2 text-left">Entidad</th>
            <th className="border px-3 py-2 text-left">Acción</th>
            <th className="border px-3 py-2 text-left">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{new Date(item.timestamp).toLocaleString()}</td>
              <td className="p-2">{item.usuario?.nombre || '—'}</td>
              <td className="p-2">{item.entidad_tipo}</td>
              <td className="p-2">{item.accion}</td>
              <td className="p-2">
                <pre className="whitespace-pre-wrap text-xs text-gray-700 bg-gray-50 p-2 rounded max-w-xl overflow-x-auto">
                  {JSON.stringify(item.detalles, null, 2)}
                </pre>
              </td>
            </tr>
          ))}
          {historial.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
                No hay cambios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
