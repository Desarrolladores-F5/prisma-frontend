'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { obtenerPreguntasExamen } from '@/lib/api';

export default function PreguntasExamenSupervisorPage() {
  const params = useParams();
  const router = useRouter();

  // ✅ id como string, validado
  const id = typeof params?.id === 'string'
    ? params.id
    : Array.isArray(params?.id)
    ? params.id[0]
    : null;

  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPreguntas = async () => {
      if (!id) return;
      try {
        const data = await obtenerPreguntasExamen(id); // ✅ id ya es string
        setPreguntas(data);
      } catch (error) {
        console.error('❌ Error al obtener preguntas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPreguntas();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Cargando preguntas...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Preguntas del Examen</h1>
        <button
          onClick={() => router.push('/supervisor/capacitaciones')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver
        </button>
      </div>

      <ul className="space-y-4">
        {preguntas.map((pregunta, index) => (
          <li key={pregunta.id} className="border p-4 rounded bg-gray-50">
            <p className="font-semibold mb-2">
              {index + 1}. {pregunta.enunciado}
            </p>
            <ul className="list-disc pl-5">
              {pregunta.alternativas.map((alt: string, idx: number) => (
                <li key={idx}>{alt}</li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-green-700">
              ✅ Respuesta correcta: {pregunta.respuesta_correcta}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
