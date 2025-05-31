'use client';

import { useEffect, useState } from 'react';

interface RespuestaFormulario {
  id: number;
  respuestas_json: any;
  fecha_respuesta: string;
  usuario_id?: number;
}

interface Props {
  formularioId: number;
}

export default function TablaRespuestasFormulario({ formularioId }: Props) {
  const [respuestas, setRespuestas] = useState<RespuestaFormulario[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/respuestas-formulario/por-formulario?formulario_id=${formularioId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!res.ok) throw new Error('Error al obtener respuestas');

        const data = await res.json();
        setRespuestas(data);
      } catch (error) {
        console.error(error);
        setMensaje('❌ Error al cargar respuestas');
      }
    };

    if (formularioId) cargar();
  }, [formularioId]);

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h2 className="text-xl font-semibold mb-4">Respuestas Registradas</h2>
      {mensaje && <p className="text-red-600">{mensaje}</p>}

      {respuestas.length === 0 ? (
        <p>No hay respuestas registradas para este formulario.</p>
      ) : (
        <table className="min-w-full text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">ID</th>
              <th className="border px-3 py-2">Fecha</th>
              <th className="border px-3 py-2">Usuario ID</th>
              <th className="border px-3 py-2">Respuestas</th>
            </tr>
          </thead>
          <tbody>
            {respuestas.map((r) => (
              <tr key={r.id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">{r.id}</td>
                <td className="px-3 py-2">{new Date(r.fecha_respuesta).toLocaleString()}</td>
                <td className="px-3 py-2">{r.usuario_id || '—'}</td>
                <td className="px-3 py-2 whitespace-pre-wrap">
                  <code className="text-xs">
                    {JSON.stringify(r.respuestas_json, null, 2)}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
