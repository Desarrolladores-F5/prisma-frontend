// src/components/capacitaciones/TablaCapacitaciones.tsx
'use client';

import { useEffect, useState } from 'react';
import { obtenerCapacitaciones, eliminarCapacitacion } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

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
  documento?: {
    id: number;
    nombre: string;
    url: string;
  };
  examen?: {
    id: number;
  } | null;
}

interface Props {
  refrescar?: boolean;
  onEditar?: (capacitacion: Capacitacion) => void;
  onEliminado?: () => void;
}

export default function TablaCapacitaciones({ refrescar, onEditar, onEliminado }: Props) {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const router = useRouter();

  const cargarCapacitaciones = async () => {
    const data = await obtenerCapacitaciones();
    setCapacitaciones(data);
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Deseas eliminar esta capacitación?')) return;
    const res = await eliminarCapacitacion(id);
    if (res?.mensaje?.includes('eliminada')) {
      await cargarCapacitaciones();
      onEliminado?.();
    } else {
      alert(res?.mensaje || '❌ Error al eliminar capacitación');
    }
  };

  useEffect(() => {
    cargarCapacitaciones();
  }, [refrescar]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Capacitaciones</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Título</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Capacitador</th>
            <th className="border p-2">Faena</th>
            <th className="border p-2">Examen</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {capacitaciones.map((cap) => (
            <tr key={cap.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{cap.id}</td>
              <td className="p-2">{cap.titulo}</td>
              <td className="p-2">{format(new Date(cap.fecha), 'dd-MM-yyyy')}</td>
              <td className="p-2">
                {cap.usuario?.nombre && cap.usuario?.apellido
                  ? `${cap.usuario.nombre} ${cap.usuario.apellido}`
                  : '—'}
              </td>
              <td className="p-2">{cap.faena?.nombre || '—'}</td>
              <td className="p-2">{cap.examen?.id ? 'Con examen' : 'Sin examen'}</td>
              <td className="p-2 space-x-2">
                {cap.documento?.url && (
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}${cap.documento.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Ver
                  </a>
                )}
                {!!cap.examen?.id && (
                  <button
                    onClick={() =>
                      router.push(`/admin/dashboard/examenes/${cap.examen!.id}/preguntas`)
                    }
                    className="bg-indigo-600 text-white px-2 py-1 rounded text-sm hover:bg-indigo-700"
                  >
                    Preguntas
                  </button>
                )}
                <button
                  onClick={() => onEditar?.(cap)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(cap.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
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
