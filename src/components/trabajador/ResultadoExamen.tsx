'use client';

import { useEffect, useState } from 'react';
import { obtenerResultadoExamen } from '@/lib/api';

interface Props {
  capacitacionId: number;
  onVolver: () => void;
}

export default function ResultadoExamen({ capacitacionId, onVolver }: Props) {
  const [resultado, setResultado] = useState<any | null>(null);
  const [cargando, setCargando] = useState(true);

  const cargarResultado = async () => {
    try {
      const data = await obtenerResultadoExamen(capacitacionId);
      setResultado(data);
    } catch (error) {
      console.error('Error al cargar resultado:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarResultado();
  }, [capacitacionId]);

  if (cargando) return <p className="text-center">⏳ Cargando resultado...</p>;

  if (!resultado)
    return (
      <p className="text-center text-red-500">
        ❌ No se encontró el resultado del examen.
      </p>
    );

  const fecha = resultado.fecha_respuesta
    ? new Date(resultado.fecha_respuesta).toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Fecha no disponible';

  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold text-center text-blue-800">📄 Resultado del Examen</h2>

      <ul className="space-y-1 text-gray-800 text-sm">
        <li>
          <strong>📅 Fecha de respuesta:</strong> {fecha}
        </li>
        <li>
          <strong>❓ Total de preguntas:</strong> {resultado.total_preguntas}
        </li>
        <li>
          <strong>✅ Respuestas correctas:</strong> {resultado.respuestas_correctas}
        </li>
        <li>
          <strong>📊 Porcentaje de aprobación:</strong> {resultado.porcentaje_aprobacion}%
        </li>
        <li>
          <strong>🧪 Estado:</strong>{' '}
          <span
            className={
              resultado.resultado.includes('Aprobado')
                ? 'text-green-600 font-semibold'
                : 'text-red-600 font-semibold'
            }
          >
            {resultado.resultado}
          </span>
        </li>
      </ul>

      <div className="text-center mt-6">
        <button
          onClick={onVolver}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          ⬅ Volver
        </button>
      </div>
    </div>
  );
}
