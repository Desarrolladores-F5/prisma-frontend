'use client';

import { useEffect, useState } from 'react';
import { obtenerMisNotificaciones } from '@/lib/api';
import type { Notificacion } from '@/types';

export default function TablaNotificacionesTrabajador() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(true);

  const cargar = async () => {
    try {
      const data = await obtenerMisNotificaciones();
      setNotificaciones(data);
      if (data.length === 0) {
        setMensaje('No tienes notificaciones por el momento.');
      }
    } catch (error) {
      console.error('❌ Error al cargar notificaciones:', error);
      setMensaje('Error al cargar las notificaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Mis Notificaciones</h2>

      {loading ? (
        <p className="text-gray-500 text-center">Cargando notificaciones...</p>
      ) : mensaje ? (
        <p className="text-gray-600 text-center">{mensaje}</p>
      ) : (
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Mensaje</th>
              <th className="border p-2">Tipo</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Faena</th>
            </tr>
          </thead>
          <tbody>
            {notificaciones.map((n) => (
              <tr key={n.id} className="border-t hover:bg-gray-50 text-center">
                <td className="p-2">{n.mensaje}</td>
                <td className="p-2">{n.tipo}</td>
                <td className="p-2">
                  {new Date(n.fecha).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="p-2">{n.leido ? '✅ Leída' : '📨 No leída'}</td>
                <td className="p-2">{n.faena?.nombre || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
