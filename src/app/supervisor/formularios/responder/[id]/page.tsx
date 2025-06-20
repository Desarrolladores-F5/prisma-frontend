'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RenderFormulario from '@/components/formularios/RenderFormulario';
import { enviarRespuestaFormulario } from '@/lib/api';

interface CampoFormulario {
  etiqueta: string;
  nombre: string;
  tipo: 'text' | 'date' | 'checkbox' | 'textarea' | 'radio';
  requerido: boolean;
  opciones?: string[];
}

export default function ResponderFormularioSupervisorPage() {
  const params = useParams() as { id: string };
  const router = useRouter();
  const [estructura, setEstructura] = useState<CampoFormulario[] | null>(null);
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarFormulario = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/formularios/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('No se pudo cargar el formulario');

        const data = await res.json();
        const estructuraValida = typeof data.estructura_json === 'string'
          ? JSON.parse(data.estructura_json)
          : data.estructura_json;

        if (Array.isArray(estructuraValida)) {
          setEstructura(estructuraValida);
          setTitulo(data.nombre);
        } else {
          setMensaje('⚠️ El campo estructura_json no contiene un arreglo válido.');
        }
      } catch (error) {
        console.error('❌ Error al obtener formulario:', error);
        setMensaje('❌ Error al cargar el formulario.');
      } finally {
        setCargando(false);
      }
    };

    if (params.id) cargarFormulario();
  }, [params.id]);

  const manejarEnvio = async (datos: Record<string, any>): Promise<number> => {
    try {
      const respuesta = await enviarRespuestaFormulario({
        formulario_id: parseInt(params.id),
        respuestas_json: datos
      });

      const id = respuesta.id;
      setMensaje('✅ Respuestas registradas correctamente.');
      return id; // ✅ Retornar el ID es obligatorio para que RenderFormulario funcione correctamente
    } catch (error) {
      console.error('❌ Error al guardar respuestas:', error);
      setMensaje('❌ No se pudo registrar la respuesta.');
      throw error;
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Responder Formulario</h1>
        <button
          onClick={() => router.push('/supervisor/formularios')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver al Listado
        </button>
      </div>

      {titulo && <h2 className="text-lg font-semibold mb-2">{titulo}</h2>}
      {mensaje && <p className="text-sm text-blue-700 mb-4">{mensaje}</p>}

      {cargando ? (
        <p>Cargando formulario...</p>
      ) : estructura ? (
        <RenderFormulario estructura={estructura} onEnviar={manejarEnvio} />
      ) : (
        <p className="text-red-600">No se puede renderizar el formulario.</p>
      )}
    </div>
  );
}
