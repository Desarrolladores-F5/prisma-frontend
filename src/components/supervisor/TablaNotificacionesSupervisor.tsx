'use client';

import { useEffect, useState } from 'react';
import { obtenerNotificaciones } from '@/lib/api';

interface Notificacion {
  id: number;
  mensaje: string;
  tipo: string;
  fecha: string;
  leido: boolean;
  faena?: { nombre: string };
  usuario?: { nombre: string; apellido: string };
}

interface Props {
  soloLectura?: boolean;
}

export default function TablaNotificacionesSupervisor({ soloLectura }: Props) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  const cargarNotificaciones = async () => {
    const data = await obtenerNotificaciones();
    setNotificaciones(data);
  };

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Notificaciones</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Mensaje</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Usuario</th>
            <th className="border p-2">Faena</th>
            {!soloLectura && <th className="border p-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {notificaciones.map((n) => (
            <tr key={n.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{n.id}</td>
              <td className="p-2">{n.mensaje}</td>
              <td className="p-2">{n.tipo}</td>
              <td className="p-2">{new Date(n.fecha).toLocaleString()}</td>
              <td className="p-2">{n.leido ? '✅ Leída' : '📨 No leída'}</td>
              <td className="p-2">{n.usuario ? `${n.usuario.nombre} ${n.usuario.apellido}` : '—'}</td>
              <td className="p-2">{n.faena?.nombre || '—'}</td>
              {!soloLectura && (
                <td className="p-2 space-x-2">
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Editar</button>
                  <button className="bg-red-600 text-white px-2 py-1 rounded text-sm">Eliminar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
