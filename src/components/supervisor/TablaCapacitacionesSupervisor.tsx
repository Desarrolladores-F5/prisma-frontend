'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  documento?: {
    id: number;
    nombre: string;
    url: string;
  };
  examen?: {
    id: number;
  } | null;
}

export default function TablaCapacitacionesSupervisor() {
  const [capacitaciones, setCapacitaciones] = useState<Capacitacion[]>([]);
  const router = useRouter();

  const cargarCapacitaciones = async () => {
    const data = await obtenerCapacitaciones();
    setCapacitaciones(data);
  };

  useEffect(() => {
    cargarCapacitaciones();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Capacitaciones</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Título</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Capacitador</th>
            <th className="border p-2">Faena</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {capacitaciones.map((cap) => (
            <tr key={cap.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{cap.id}</td>
              <td className="p-2">{cap.titulo}</td>
              <td className="p-2">{new Date(cap.fecha).toLocaleDateString('es-CL')}</td>
              <td className="p-2">
                {cap.usuario?.nombre && cap.usuario?.apellido
                  ? `${cap.usuario.nombre} ${cap.usuario.apellido}`
                  : '—'}
              </td>
              <td className="p-2">{cap.faena?.nombre || '—'}</td>
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
                  <>
                    <button
                      onClick={() =>
                        router.push(`/supervisor/dashboard/examenes/${cap.examen!.id}/preguntas`)
                      }
                      className="bg-indigo-600 text-white px-2 py-1 rounded text-sm hover:bg-indigo-700"
                    >
                      Preguntas
                    </button>
                    <button
                      onClick={() =>
                        router.push(`/supervisor/dashboard/capacitaciones/respuestas/${cap.id}`)
                      }
                      className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                    >
                      Resultado
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
