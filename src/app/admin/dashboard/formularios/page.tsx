'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TablaFormularios, { FormularioTabla } from '@/components/formularios/TablaFormularios';
import FormularioFormulario, { FormularioData } from '@/components/formularios/FormularioFormulario';

export default function PageFormularios() {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const [seleccionado, setSeleccionado] = useState<FormularioData | null>(null);

  const manejarEdicion = (f: FormularioTabla) => {
    const transformado: FormularioData = {
      id: f.id,
      nombre: f.nombre,
      tipo: f.tipo,
      estructura_json: f.estructura_json,
      creador_id: f.creador?.id ?? 0,
    };
    setSeleccionado(transformado);
    setMostrarFormulario(true);
  };

  const manejarGuardado = () => {
    setRefrescar(!refrescar);
    setMostrarFormulario(false);
    setSeleccionado(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Formularios</h1>
        <div className="flex space-x-2">
          {mostrarFormulario ? (
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setSeleccionado(null);
              }}
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
                onClick={() => setMostrarFormulario(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Crear Formulario
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarFormulario ? (
        <FormularioFormulario
          formulario={seleccionado ?? undefined}
          onGuardado={manejarGuardado}
        />
      ) : (
        <TablaFormularios
          refrescar={refrescar}
          onEditar={manejarEdicion}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
