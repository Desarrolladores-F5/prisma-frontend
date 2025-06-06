// src/app/admin/dashboard/examenes/page.tsx
'use client';

import { useState } from 'react';
import FormularioExamen from '@/components/examenes/FormularioExamen';
import TablaExamenes from '@/components/examenes/TablaExamenes';

export default function ExamenesPage() {
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

  return (
    <div className="p-6">
      {!modoFormulario && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Gestión de Exámenes</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={mostrarFormularioCrear}
          >
            Crear Examen
          </button>
        </div>
      )}

      {modoFormulario ? (
        <FormularioExamen examen={examenSeleccionado} onGuardado={manejarGuardado} />
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
