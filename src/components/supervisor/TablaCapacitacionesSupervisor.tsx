'use client';

import { useEffect, useState } from 'react';
import { obtenerCapacitaciones } from '@/lib/api';

interface Capacitacion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  usuario?: {
    nombre: string;
    apellido: string;
  };
  faena?: {
    nombre: string;
  };
}

export default function TablaCapacitacionesSupervisor() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);

  const cargarCapacitaciones = async () => {
    const data = await obtenerCapacitaciones();
    setCapacitaciones(data);
  };

  useEffect(() => {
    cargarCapacitaciones();
  }, []);

  return (
    <table className="w-full border text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border p-2">ID</th>
          <th className="border p-2">Título</th>
          <th className="border p-2">Fecha</th>
          <th className="border p-2">Usuario</th>
          <th className="border p-2">Faena</th>
        </tr>
      </thead>
      <tbody>
        {capacitaciones.map((cap) => (
          <tr key={cap.id} className="border-t hover:bg-gray-50">
            <td className="p-2">{cap.id}</td>
            <td className="p-2">{cap.titulo}</td>
            <td className="p-2">{new Date(cap.fecha).toLocaleDateString()}</td>
            <td className="p-2">
              {cap.usuario?.nombre && cap.usuario?.apellido
                ? `${cap.usuario.nombre} ${cap.usuario.apellido}`
                : '—'}
            </td>
            <td className="p-2">{cap.faena?.nombre || '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
