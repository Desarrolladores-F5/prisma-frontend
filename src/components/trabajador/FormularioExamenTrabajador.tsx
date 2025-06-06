'use client';

import { useEffect, useState } from 'react';
import { enviarRespuestasExamen, obtenerPreguntasCapacitacion } from '@/lib/api';

interface Props {
  capacitacion: any;
  onVolver: () => void;
}

export default function FormularioExamenTrabajador({ capacitacion, onVolver }: Props) {
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [respuestas, setRespuestas] = useState<{ [key: string]: string }>({});
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarPreguntas = async () => {
      try {
        const data = await obtenerPreguntasCapacitacion(capacitacion.id);
        setPreguntas(data || []);
      } catch {
        setMensaje('❌ Error al cargar preguntas.');
      } finally {
        setCargando(false);
      }
    };

    cargarPreguntas();
  }, [capacitacion]);

  const handleChange = (preguntaId: number, valor: string) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: valor }));
  };

  const handleSubmit = async () => {
    try {
      await enviarRespuestasExamen(capacitacion.id, respuestas);
      setMensaje('✅ Examen enviado correctamente.');
    } catch {
      setMensaje('❌ Error al enviar respuestas.');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Examen: {capacitacion.nombre}</h2>

      {cargando ? (
        <p>Cargando preguntas...</p>
      ) : preguntas.length === 0 ? (
        <p>No hay preguntas para esta capacitación.</p>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          {preguntas.map((pregunta) => (
            <div key={pregunta.id} className="mb-4">
              <label className="block font-medium mb-1">{pregunta.texto}</label>
              <input
                type="text"
                className="border p-2 rounded w-full"
                value={respuestas[pregunta.id] || ''}
                onChange={(e) => handleChange(pregunta.id, e.target.value)}
              />
            </div>
          ))}

          <div className="flex space-x-2 mt-6">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Enviar Examen
            </button>
            <button
              onClick={onVolver}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Volver
            </button>
          </div>
        </form>
      )}

      {mensaje && <p className="mt-4">{mensaje}</p>}
    </div>
  );
}
