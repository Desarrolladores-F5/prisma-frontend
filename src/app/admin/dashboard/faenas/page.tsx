'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TablaFaenas from '@/components/faenas/TablaFaenas';
import FormularioFaena from '@/components/faenas/FormularioFaena';

export default function FaenasPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [faenaSeleccionada, setFaenaSeleccionada] = useState<any | null>(null);
  const [refrescar, setRefrescar] = useState(false);
  const router = useRouter();

  const manejarGuardado = () => {
    setFaenaSeleccionada(null);
    setMostrarFormulario(false);
    setRefrescar(!refrescar);
  };

  const manejarEdicion = (faena: any) => {
    setFaenaSeleccionada(faena);
    setMostrarFormulario(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Faenas</h1>

      {!mostrarFormulario ? (
        <>
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => {
                setFaenaSeleccionada(null);
                setMostrarFormulario(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Crear Faena
            </button>
          </div>

          <TablaFaenas
            onEditar={manejarEdicion}
            refrescar={refrescar}
          />
        </>
      ) : (
        <>
          <FormularioFaena
            faena={faenaSeleccionada}
            onGuardado={manejarGuardado}
          />
          <div className="mt-4">
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setFaenaSeleccionada(null);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Volver al Listado
            </button>
          </div>
        </>
      )}
    </div>
  );
}
