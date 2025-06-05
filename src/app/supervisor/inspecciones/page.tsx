// src/app/supervisor/dashboard/inspecciones/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TablaInspeccionesSupervisor from '@/components/supervisor/TablaInspeccionesSupervisor';
import FormularioInspeccionSupervisor from '@/components/supervisor/FormularioInspeccionSupervisor';
import { InspeccionFromTabla } from '@/components/inspecciones/TablaInspecciones';

export default function PageInspeccionesSupervisor() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [inspeccionSeleccionada, setInspeccionSeleccionada] = useState<InspeccionFromTabla | null>(null);
  const [refrescar, setRefrescar] = useState(false);
  const router = useRouter();

  const handleEditar = (inspeccion: InspeccionFromTabla) => {
    setInspeccionSeleccionada(inspeccion);
    setMostrarFormulario(true);
  };

  const handleGuardado = () => {
    setRefrescar(!refrescar);
    setInspeccionSeleccionada(null);
    setMostrarFormulario(false);
  };

  const volverAlListado = () => {
    setInspeccionSeleccionada(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Inspecciones</h1>
        <div className="flex space-x-2">
          {mostrarFormulario ? (
            <button
              onClick={volverAlListado}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Volver al Listado
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/supervisor/dashboard')}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Volver al Inicio
              </button>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Registrar Inspección
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarFormulario ? (
        <FormularioInspeccionSupervisor
          inspeccion={
            inspeccionSeleccionada
              ? {
                  id: inspeccionSeleccionada.id,
                  fecha: inspeccionSeleccionada.fecha,
                  tipo: inspeccionSeleccionada.tipo,
                  descripcion: inspeccionSeleccionada.descripcion,
                  observaciones: inspeccionSeleccionada.observaciones,
                  conforme: inspeccionSeleccionada.conforme,
                  faena_id: inspeccionSeleccionada.faena?.id ?? 0,
                  inspector_id: inspeccionSeleccionada.inspector?.id ?? 0,
                }
              : undefined
          }
          onGuardado={handleGuardado}
        />
      ) : (
        <TablaInspeccionesSupervisor
          refrescar={refrescar}
          onEditar={handleEditar}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
