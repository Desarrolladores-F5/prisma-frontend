'use client';

import { useEffect, useState } from 'react';
import { crearPreguntaExamen, actualizarPreguntaExamen } from '@/lib/api';

interface Props {
  examenId: string;
  pregunta?: any; // puede ser de tipo Pregunta si defines la interfaz
  onGuardado: () => void;
}

export default function FormularioPregunta({ examenId, pregunta, onGuardado }: Props) {
  const modoEdicion = !!pregunta;

  const [form, setForm] = useState({
    enunciado: '',
    alternativas: ['', '', '', ''],
    respuesta_correcta: '',
  });

  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (modoEdicion && pregunta) {
      setForm({
        enunciado: pregunta.enunciado || '',
        alternativas: pregunta.alternativas || ['', '', '', ''],
        respuesta_correcta: pregunta.respuesta_correcta || '',
      });
    }
  }, [modoEdicion, pregunta]);

  const handleAlternativaChange = (index: number, valor: string) => {
    const nuevas = [...form.alternativas];
    nuevas[index] = valor;
    setForm({ ...form, alternativas: nuevas });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      examen_id: parseInt(examenId),
    };

    try {
      if (modoEdicion) {
        await actualizarPreguntaExamen(pregunta.id, payload);
        setMensaje('✅ Pregunta actualizada correctamente');
      } else {
        await crearPreguntaExamen(payload);
        setMensaje('✅ Pregunta creada correctamente');
      }
      onGuardado();
    } catch (error: any) {
      setMensaje(`❌ Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold">
        {modoEdicion ? 'Editar Pregunta' : 'Nueva Pregunta'}
      </h2>

      <div>
        <label className="block text-sm font-medium">Enunciado</label>
        <textarea
          value={form.enunciado}
          onChange={(e) => setForm({ ...form, enunciado: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {form.alternativas.map((alt, index) => (
          <div key={index}>
            <label className="block text-sm font-medium">Alternativa {index + 1}</label>
            <input
              type="text"
              value={alt}
              onChange={(e) => handleAlternativaChange(index, e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium">Respuesta correcta</label>
        <select
          value={form.respuesta_correcta}
          onChange={(e) => setForm({ ...form, respuesta_correcta: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Seleccione una alternativa</option>
          {form.alternativas.map((alt, idx) => (
            <option key={idx} value={alt}>
              {alt}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {modoEdicion ? 'Actualizar' : 'Crear'}
      </button>

      {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
    </form>
  );
}
