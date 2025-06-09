'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerCapacitacionesDisponibles } from '@/lib/api';

interface Props {
  refrescar?: boolean;
  onResponder?: (capacitacion: any) => void;
}

export default function TablaCapacitacionesTrabajador({ refrescar, onResponder }: Props) {
  const router = useRouter();
  const [capacitaciones, setCapacitaciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarCapacitaciones = async () => {
      setCargando(true);
      try {
        const data = await obtenerCapacitacionesDisponibles();
        if (Array.isArray(data)) {
          setCapacitaciones(data);
        } else {
          setError('❌ Error al cargar capacitaciones.');
        }
      } catch {
        setError('❌ Error inesperado al cargar.');
      } finally {
        setCargando(false);
      }
    };

    cargarCapacitaciones();
  }, [refrescar]);

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Capacitaciones Disponibles</h2>

      {cargando ? (
        <p className="text-gray-500">Cargando capacitaciones...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : capacitaciones.length === 0 ? (
        <p className="text-gray-500">No hay capacitaciones asignadas.</p>
      ) : (
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Capacitador</th>
              <th className="p-2">Fecha</th>
              <th className="p-2">Descripción</th>
              <th className="p-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {capacitaciones.map((cap) => {
              const examen = cap.examen;
              const yaRespondido = examen?.respuestas && examen.respuestas.length > 0;
              return (
                <tr key={cap.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">
                    {cap.usuario?.nombre && cap.usuario?.apellido
                      ? `${cap.usuario.nombre} ${cap.usuario.apellido}`
                      : '—'}
                  </td>
                  <td className="p-2">
                    {new Date(cap.fecha).toLocaleDateString('es-CL')}
                  </td>
                  <td className="p-2">{cap.descripcion}</td>
                  <td className="p-2 text-center space-x-2">
                    {cap.documento?.url && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}${cap.documento.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Ver Documento
                      </a>
                    )}

                    {!yaRespondido && (
                      <button
                        className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                        onClick={() => onResponder?.(cap)}
                      >
                        Responder
                      </button>
                    )}

                    {yaRespondido && (
                      <button
                        className="bg-purple-600 text-white px-2 py-1 rounded text-sm hover:bg-purple-700"
                        onClick={() => router.push(`/trabajador/capacitaciones/resultado/${cap.id}`)}
                      >
                        Ver Resultado
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
