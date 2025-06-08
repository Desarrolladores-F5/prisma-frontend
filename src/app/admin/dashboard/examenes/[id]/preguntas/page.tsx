'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { obtenerPreguntasExamen, obtenerExamenPorId } from '@/lib/api';
import TablaPreguntas from '@/components/preguntas/TablaPreguntas';
import FormularioPregunta from '@/components/preguntas/FormularioPregunta';
import { Pregunta } from '@/types';


export default function PreguntasExamenPage() {
  const router = useRouter();
  const params = useParams();
  const examenId = params?.id ? String(params.id) : '';

  const [preguntas, setPreguntas] = useState<Pregunta[]>([]);
  const [tituloExamen, setTituloExamen] = useState('');
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar' | null>(null);
  const [preguntaSeleccionada, setPreguntaSeleccionada] = useState<Pregunta | null>(null);
  const [refrescar, setRefrescar] = useState(false);

  const cargarPreguntas = async () => {
    try {
      const data = await obtenerPreguntasExamen(examenId);
      setPreguntas(data || []);
    } catch (error) {
      console.error('❌ Error al cargar preguntas:', error);
    }
  };

  const cargarTituloExamen = async () => {
    try {
      const examen = await obtenerExamenPorId(examenId);
      setTituloExamen(examen.titulo);
    } catch (error) {
      console.error('❌ Error al obtener título del examen:', error);
    }
  };

  useEffect(() => {
    if (examenId) {
      cargarTituloExamen();
      cargarPreguntas();
    }
  }, [examenId, refrescar]);

  const manejarGuardado = () => {
    setModoFormulario(null);
    setPreguntaSeleccionada(null);
    setRefrescar(!refrescar);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Preguntas del Examen: <span className="text-blue-700">{tituloExamen}</span>
        </h1>
        <div className="space-x-2">
          <button
            onClick={() => router.push('/admin/dashboard/examenes')}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Volver
          </button>
          {!modoFormulario && (
            <button
              onClick={() => setModoFormulario('crear')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Crear Pregunta
            </button>
          )}
        </div>
      </div>

      {modoFormulario ? (
        <FormularioPregunta
          examenId={examenId}
          pregunta={preguntaSeleccionada}
          onGuardado={manejarGuardado}
        />
      ) : (
        <TablaPreguntas
          preguntas={preguntas}
          onEditar={(pregunta: Pregunta) => {
            setPreguntaSeleccionada(pregunta);
            setModoFormulario('editar');
          }}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
