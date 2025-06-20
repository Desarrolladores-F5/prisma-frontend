'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { obtenerIdDesdeToken } from '@/lib/validate-role';

interface RespuestaFormulario {
  id: number;
  formulario_id: number;
  respuestas_json: any;
  fecha_respuesta: string;
  estado_firma?: string;
  usuario?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

interface Props {
  formularioId: number;
}

export default function TablaRespuestaFormularioSupervisor({ formularioId }: Props) {
  const [respuestas, setRespuestas] = useState<RespuestaFormulario[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [usuarioId, setUsuarioId] = useState<number | null>(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/respuestas-formulario/mis-respuestas`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Error al obtener respuestas');
        const data = await res.json();

        // Filtrar por formulario_id
        const filtradas = data.filter((r: RespuestaFormulario) => r.formulario_id === formularioId);
        setRespuestas(filtradas);
      } catch (error) {
        console.error('❌ Error al cargar respuestas:', error);
        setMensaje('❌ No se pudieron cargar las respuestas');
      }
    };

    if (formularioId) cargarDatos();
  }, [formularioId]);

  useEffect(() => {
    const id = obtenerIdDesdeToken(localStorage.getItem('token') || '');
    setUsuarioId(id);
  }, []);

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Mis Respuestas Registradas</h2>
      {mensaje && <p className="text-red-600">{mensaje}</p>}

      {respuestas.length === 0 ? (
        <p>No hay respuestas registradas para este formulario.</p>
      ) : (
        <table className="min-w-full text-sm border border-gray-300 mb-6">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Fecha</th>
              <th className="border px-3 py-2">Estado Firma</th>
              <th className="border px-3 py-2">Respuestas</th>
              <th className="border px-3 py-2">Detalle</th>
            </tr>
          </thead>
          <tbody>
            {respuestas.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2">{new Date(r.fecha_respuesta).toLocaleString()}</td>
                <td className="px-3 py-2">
                  {r.estado_firma === 'firmado' ? (
                    <span className="text-green-700 font-semibold">✅ Firmado</span>
                  ) : (
                    <span className="text-red-600">❌ Sin firma</span>
                  )}
                </td>
                <td className="px-3 py-2 text-sm">
                  <ul className="list-disc list-inside space-y-1">
                    {Object.entries(r.respuestas_json).map(([key, value]) => (
                      <li key={key}>
                        <strong className="capitalize">{key}:</strong>{' '}
                        {key.toLowerCase() === 'conforme' ? (
                          value ? (
                            <span className="text-green-700 font-semibold">✅ Conforme</span>
                          ) : (
                            <span className="text-red-600 font-semibold">❌ No conforme</span>
                          )
                        ) : (
                          <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-3 py-2 text-center">
                  <Link
                    href={`/supervisor/formularios/respuestas/detalle/${r.id}`} // ✅ ruta corregida
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm font-medium"
                  >
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
