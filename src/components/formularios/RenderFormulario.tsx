'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { enviarRespuestaFormulario } from '@/lib/api';

interface CampoFormulario {
  label: string;
  name: string;
  type: 'text' | 'date' | 'checkbox' | 'textarea';
  required?: boolean;
}

interface Props {
  estructura: CampoFormulario[];
}

export default function RenderFormulario({ estructura }: Props) {
  const { id } = useParams();
  const [datos, setDatos] = useState<Record<string, any>>({});
  const [mensaje, setMensaje] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setDatos((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formularioId = parseInt(id as string);
      await enviarRespuestaFormulario({
        formulario_id: formularioId,
        respuestas_json: datos,
      });

      setMensaje('✅ Respuesta enviada correctamente');
      setDatos({});
    } catch (error) {
      console.error('❌ Error al enviar:', error);
      setMensaje('❌ Error al guardar la respuesta');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mensaje && (
        <p className="text-sm text-blue-700 bg-blue-100 p-2 rounded border border-blue-300">
          {mensaje}
        </p>
      )}

      {estructura.map((campo, idx) => (
        <div key={idx}>
          <label className="block font-medium mb-1">{campo.label}</label>

          {campo.type === 'textarea' ? (
            <textarea
              name={campo.name}
              required={campo.required}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              value={datos[campo.name] || ''}
            />
          ) : (
            <input
              type={campo.type}
              name={campo.name}
              required={campo.required}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              value={campo.type === 'checkbox' ? undefined : datos[campo.name] || ''}
              checked={campo.type === 'checkbox' ? datos[campo.name] || false : undefined}
            />
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </form>
  );
}
