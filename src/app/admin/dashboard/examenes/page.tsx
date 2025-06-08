// src/app/admin/dashboard/examenes/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import FormularioExamen from '@/components/examenes/FormularioExamen';
import TablaExamenes from '@/components/examenes/TablaExamenes';

export default function ExamenesPage() {
  const router = useRouter();
  const [examenSeleccionado, setExamenSeleccionado] = useState<any | null>(null);
  const [refrescar, setRefrescar] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar' | null>(null);

  const manejarGuardado = () => {
    setRefrescar(!refrescar);
    setModoFormulario(null);
    setExamenSeleccionado(null);
  };

  const manejarEditar = (examen: any) => {
    setExamenSeleccionado(examen);
    setModoFormulario('editar');
  };

  const mostrarFormularioCrear = () => {
    setExamenSeleccionado(null);
    setModoFormulario('crear');
  };

  const volverAlListado = () => {
    setModoFormulario(null);
    setExamenSeleccionado(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Exámenes</h1>
        <div className="flex space-x-2">
          {modoFormulario ? (
            <button
              onClick={volverAlListado}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Volver al Listado
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Volver al Inicio
              </button>
              <button
                onClick={mostrarFormularioCrear}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Crear Examen
              </button>
            </>
          )}
        </div>
      </div>

      {modoFormulario ? (
        <FormularioExamen
          examen={examenSeleccionado}
          onGuardado={manejarGuardado}
        />
      ) : (
        <TablaExamenes
          refrescar={refrescar}
          onEditar={manejarEditar}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
