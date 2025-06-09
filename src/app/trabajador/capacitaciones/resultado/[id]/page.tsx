'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { obtenerResultadoExamen } from '@/lib/api';

export default function ResultadoExamenPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [resultado, setResultado] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!id) return;

    const cargarResultado = async () => {
      try {
        const data = await obtenerResultadoExamen(Number(id));
        setResultado(data);
      } catch (error) {
        console.error('❌ Error al cargar el resultado del examen:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarResultado();
  }, [id]);

  if (!id) {
    return <p className="text-red-500 text-center mt-4">❌ ID de capacitación no válido</p>;
  }

  if (cargando) {
    return <p className="text-center mt-4">Cargando resultado...</p>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-2xl font-bold text-center">Resultado del Examen</h1>

      {resultado ? (
        <div className="space-y-2 text-gray-800">
          <p><strong>Capacitación:</strong> {resultado?.capacitacion?.descripcion || '—'}</p>
          <p><strong>Examen:</strong> {resultado?.examen?.titulo || '—'}</p>
          <p><strong>Respuestas correctas:</strong> {resultado.respuestas_correctas}</p>
          <p><strong>Total de preguntas:</strong> {resultado.total_preguntas}</p>
          <p><strong>Porcentaje de aprobación:</strong> {resultado.porcentaje_aprobacion}%</p>
          <p>
            <strong>Estado:</strong>{' '}
            {resultado.aprobado ? '✅ Aprobado' : '❌ Reprobado'}
          </p>
        </div>
      ) : (
        <p className="text-center text-red-500">No se encontró un resultado para este examen.</p>
      )}

      <div className="text-center pt-4">
        <button
          onClick={() => router.push('/trabajador/capacitaciones')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
