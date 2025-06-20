// src/components/formularios/RenderFormulario.tsx
'use client';

import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { crearFirma } from '@/lib/api';
import { obtenerIdDesdeToken } from '@/lib/validate-role';

interface CampoFormulario {
  nombre: string;
  tipo: 'text' | 'date' | 'textarea' | 'checkbox' | 'radio';
  etiqueta: string;
  requerido: boolean;
  opciones?: string[];
  observacion?: string;
}

interface RenderFormularioProps {
  estructura: CampoFormulario[];
  onEnviar?: (datos: Record<string, any>) => Promise<number>; // debe devolver el ID de la respuesta
}

const RenderFormulario: React.FC<RenderFormularioProps> = ({ estructura, onEnviar }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [respuestaId, setRespuestaId] = useState<number | null>(null);
  const [firmaCompletada, setFirmaCompletada] = useState<boolean>(false);

  useEffect(() => {
    const initialData: Record<string, any> = {};
    estructura.forEach((campo) => {
      initialData[campo.nombre] = campo.tipo === 'checkbox' ? false : '';
    });
    setFormData(initialData);
    setErrors({});
    setSubmitMessage(null);
  }, [estructura]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target;
    const { name, type, value } = target;
    const newValue = type === 'checkbox' && target instanceof HTMLInputElement ? target.checked : value;

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    estructura.forEach((campo) => {
      if (campo.requerido && (formData[campo.nombre] === '' || formData[campo.nombre] == null)) {
        newErrors[campo.nombre] = 'Este campo es obligatorio';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (onEnviar) {
        const id = await onEnviar(formData);
        setRespuestaId(id);
        setSubmitMessage('✅ Respuesta enviada. Generando firma digital...');

        const token = localStorage.getItem('token');
        const firmante_id = token ? obtenerIdDesdeToken(token) : null;
        if (!firmante_id) throw new Error('No se pudo obtener el ID del firmante.');

        const raw = `respuesta_formulario-${id}-${firmante_id}-${new Date().toISOString()}`;
        const encoder = new TextEncoder();
        const data = encoder.encode(raw);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hash_firma = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const metadata = {
          entidad: 'respuesta_formulario',
          entidad_id: id,
          navegador: navigator.userAgent,
          dispositivo: navigator.platform,
          timestamp: new Date().toISOString(),
        };

        await crearFirma({
          firmante_id,
          entidad_tipo: 'respuesta_formulario',
          entidad_id: id,
          tipo_firma: 'firma_digital',
          hash_firma,
          metadata,
        });

        setFirmaCompletada(true);
        setSubmitMessage('✅ Formulario enviado y firmado exitosamente.');
      }
    } catch (error) {
      console.error(error);
      setSubmitMessage('❌ Error al enviar el formulario o generar la firma.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {estructura.map((campo) => (
        <div key={campo.nombre} className="flex flex-col border-b pb-4">
          {campo.tipo !== 'checkbox' && campo.tipo !== 'radio' && (
            <label htmlFor={campo.nombre} className="mb-1 font-semibold">
              {campo.etiqueta} {campo.requerido && <span className="text-red-600">*</span>}
            </label>
          )}

          {campo.tipo === 'text' || campo.tipo === 'date' ? (
            <input
              type={campo.tipo}
              id={campo.nombre}
              name={campo.nombre}
              value={formData[campo.nombre] || ''}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          ) : campo.tipo === 'textarea' ? (
            <textarea
              id={campo.nombre}
              name={campo.nombre}
              value={formData[campo.nombre] || ''}
              onChange={handleChange}
              className="border rounded px-3 py-2 h-28"
            />
          ) : campo.tipo === 'checkbox' ? (
            <label className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                id={campo.nombre}
                name={campo.nombre}
                checked={!!formData[campo.nombre]}
                onChange={handleChange}
              />
              <span>{campo.etiqueta}{campo.requerido && ' *'}</span>
            </label>
          ) : campo.tipo === 'radio' && campo.opciones ? (
            <>
              <p className="font-semibold">{campo.etiqueta} {campo.requerido && <span className="text-red-600">*</span>}</p>
              <div className="flex items-center gap-4 mt-1">
                {campo.opciones.map((opcion) => (
                  <label key={opcion} className="inline-flex items-center gap-1">
                    <input
                      type="radio"
                      name={campo.nombre}
                      value={opcion}
                      checked={formData[campo.nombre] === opcion}
                      onChange={handleChange}
                    />
                    <span>{opcion}</span>
                  </label>
                ))}
              </div>
              {campo.observacion && (
                <p className="text-sm text-gray-600 mt-1">{campo.observacion}</p>
              )}
            </>
          ) : null}

          {errors[campo.nombre] && (
            <p className="text-red-500 text-sm mt-1">{errors[campo.nombre]}</p>
          )}
        </div>
      ))}

      {!respuestaId && (
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      )}

      {submitMessage && (
        <p className={`mt-2 ${submitMessage.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
          {submitMessage}
        </p>
      )}
    </form>
  );
};

export default RenderFormulario;
