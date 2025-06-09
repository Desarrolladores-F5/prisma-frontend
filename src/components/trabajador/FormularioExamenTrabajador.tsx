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
  const [cargando, setCargando] = useState(true);
  const [resultado, setResultado] = useState<{
    fecha: string;
    porcentaje: number;
    aprobado: boolean;
  } | null>(null);
  const [mensaje, setMensaje] = useState('');

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
    const totalRespondidas = Object.keys(respuestas).length;
    if (totalRespondidas !== preguntas.length) {
      setMensaje('❌ Debes responder todas las preguntas antes de enviar el examen.');
      return;
    }

    try {
      const res = await enviarRespuestasExamen(capacitacion.id, respuestas);
      setResultado({
        fecha: new Date(res.fecha).toLocaleString(),
        porcentaje: res.porcentaje,
        aprobado: res.aprobado,
      });
    } catch {
      setMensaje('❌ Error al enviar respuestas.');
    }
  };

  if (resultado) {
    return (
      <div className="p-6 border rounded shadow space-y-4">
        <h2 className="text-2xl font-bold">Resultado del Examen</h2>
        <p><strong>Fecha:</strong> {resultado.fecha}</p>
        <p><strong>Porcentaje de Aprobación:</strong> {resultado.porcentaje}%</p>
        <p className={`font-semibold ${resultado.aprobado ? 'text-green-700' : 'text-red-700'}`}>
          {resultado.aprobado ? '✅ Aprobado' : '❌ Reprobado'}
        </p>
        <button
          onClick={onVolver}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">
        Examen: <span className="text-blue-700">{capacitacion.titulo}</span>
      </h2>

      {cargando ? (
        <p>Cargando preguntas...</p>
      ) : preguntas.length === 0 ? (
        <p>No hay preguntas disponibles para este examen.</p>
      ) : (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {preguntas.map((pregunta) => (
            <div key={pregunta.id} className="border p-4 rounded shadow">
              <p className="font-medium mb-2">{pregunta.enunciado}</p>
              <div className="space-y-1">
                {pregunta.alternativas.map((alt: string, index: number) => (
                  <label key={index} className="block">
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      value={alt}
                      checked={respuestas[pregunta.id] === alt}
                      onChange={() => handleChange(pregunta.id, alt)}
                      className="mr-2"
                    />
                    {alt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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

      {mensaje && <p className="mt-4 font-semibold">{mensaje}</p>}
    </div>
  );
}
