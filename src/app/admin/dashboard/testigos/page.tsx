'use client';

import { useState } from 'react';
import FormularioTestigo from '@/components/testigos/FormularioTestigo';
import TablaTestigos from '@/components/testigos/TablaTestigos';
import Link from 'next/link';

export default function PageTestigos() {
  const [refrescar, setRefrescar] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [testigoSeleccionado, setTestigoSeleccionado] = useState<any>(null);

  const manejarGuardado = () => {
    setRefrescar(!refrescar);
    setMostrarFormulario(false);
    setTestigoSeleccionado(null);
  };

  const manejarEdicion = (testigo: any) => {
    setTestigoSeleccionado(testigo);
    setMostrarFormulario(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        {!mostrarFormulario && (
          <Link href="/admin/dashboard">
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
              Volver al Inicio
            </button>
          </Link>
        )}

        {mostrarFormulario ? (
          <button
            onClick={() => {
              setMostrarFormulario(false);
              setTestigoSeleccionado(null);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Volver al Listado
          </button>
        ) : (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear Testigo
          </button>
        )}
      </div>

      {mostrarFormulario ? (
        <FormularioTestigo
          testigo={testigoSeleccionado ?? undefined}
          onGuardado={manejarGuardado}
        />
      ) : (
        <TablaTestigos
          refrescar={refrescar}
          onEditar={manejarEdicion}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
