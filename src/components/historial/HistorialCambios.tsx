'use client';

import { useEffect, useState } from 'react';
import { obtenerHistorialCambios } from '@/lib/api';
import { HistorialCambio } from '@/types';

interface Props {
  entidad: string;
  entidad_id: number;
}

export default function HistorialCambios({ entidad, entidad_id }: Props) {
  const [historial, setHistorial] = useState<HistorialCambio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerHistorialCambios();
        const filtrado = data.filter(
          (h) => h.entidad_tipo === entidad && h.entidad_id === entidad_id
        );
        setHistorial(filtrado);
      } catch (error) {
        console.error('❌ Error al cargar historial:', error);
      } finally {
        setCargando(false);
      }
    };

    if (entidad && entidad_id) cargar();
  }, [entidad, entidad_id]);

  if (cargando) return <p className="text-gray-500">Cargando historial...</p>;

  if (historial.length === 0)
    return <p className="text-gray-500">No hay historial registrado para esta entidad.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">Fecha</th>
            <th className="border px-2 py-1">Usuario</th>
            <th className="border px-2 py-1">Acción</th>
            <th className="border px-2 py-1">Detalles</th>
          </tr>
        </thead>
        <tbody>
          {historial.map((h) => (
            <tr key={h.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{new Date(h.timestamp).toLocaleString()}</td>
              <td className="p-2">{h.usuario?.nombre || '—'}</td>
              <td className="p-2">{h.accion}</td>
              <td className="p-2 whitespace-pre-wrap text-xs">
                <pre>{JSON.stringify(h.detalles, null, 2)}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
