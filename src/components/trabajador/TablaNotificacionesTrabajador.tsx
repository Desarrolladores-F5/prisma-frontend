'use client';

import { useEffect, useState } from 'react';
import {
  obtenerMisNotificaciones,
  marcarNotificacionComoLeida
} from '@/lib/api';
import type { Notificacion } from '@/types';
import { toast } from 'sonner';

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

  const marcarLeida = async (id: number) => {
    try {
      await marcarNotificacionComoLeida(id);
      toast.success('✅ Notificación marcada como leída');
      await cargar();
    } catch (error) {
      console.error(error);
      toast.error('❌ Error al actualizar notificación');
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
              <th className="border p-2">Acción</th>
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
                <td className="p-2">
                  <button
                    onClick={() => marcarLeida(n.id)}
                    disabled={n.leido}
                    className={`px-3 py-1 rounded text-white ${
                      n.leido ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {n.leido ? 'Leída' : 'Marcar como leída'}
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
