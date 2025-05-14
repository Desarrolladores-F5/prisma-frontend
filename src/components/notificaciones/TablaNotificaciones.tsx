'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerNotificaciones, eliminarNotificacion } from '@/lib/api';

interface Notificacion {
  id: number;
  mensaje: string;
  tipo: string;
  fecha: string;
  usuario?: {
    nombre: string;
    apellido: string;
  };
  faena?: {
    nombre: string;
  };
  origen?: string;
  leido: boolean;
}

interface Props {
  refrescar?: boolean;
  onEditar?: (notificacion: Notificacion) => void;
  onEliminado?: () => void;
}

export default function TablaNotificaciones({ refrescar, onEditar, onEliminado }: Props) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const router = useRouter();

  const cargarNotificaciones = async () => {
    try {
      const data = await obtenerNotificaciones();
      setNotificaciones(data);
    } catch (error) {
      console.error('❌ Error al obtener notificaciones:', error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta notificación?')) return;
    try {
      await eliminarNotificacion(id);
      await cargarNotificaciones();
      onEliminado?.();
    } catch (error) {
      console.error('❌ Error al eliminar notificación:', error);
    }
  };

  useEffect(() => {
    cargarNotificaciones();
  }, [refrescar]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Notificaciones</h2>
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Mensaje</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Usuario</th>
            <th className="border p-2">Faena</th>
            <th className="border p-2">Origen</th>
            <th className="border p-2">Leído</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {notificaciones.map((n) => (
            <tr key={n.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{n.mensaje}</td>
              <td className="p-2">{n.tipo}</td>
              <td className="p-2">{new Date(n.fecha).toLocaleDateString()}</td>
              <td className="p-2">
                {n.usuario ? `${n.usuario.nombre} ${n.usuario.apellido}` : '—'}
              </td>
              <td className="p-2">
                {n.faena?.nombre || '—'}
              </td>
              <td className="p-2">{n.origen || '—'}</td>
              <td className="p-2">{n.leido ? '✅' : '❌'}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => onEditar?.(n)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(n.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
