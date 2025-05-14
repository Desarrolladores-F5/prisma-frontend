'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TablaEPP from '@/components/epp/TablaEPP';
import FormularioEPP from '@/components/epp/FormularioEPP';

export default function PageEPP() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [eppSeleccionado, setEppSeleccionado] = useState<any | null>(null);
  const [refrescar, setRefrescar] = useState(false);
  const router = useRouter();

  const handleEditar = (epp: any) => {
    setEppSeleccionado(epp);
    setMostrarFormulario(true);
  };

  const handleGuardado = () => {
    setRefrescar(!refrescar);
    setEppSeleccionado(null);
    setMostrarFormulario(false);
  };

  const volverAlListado = () => {
    setEppSeleccionado(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de EPP</h1>
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
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Volver al Inicio
              </button>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Registrar EPP
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarFormulario ? (
        <FormularioEPP
          epp={eppSeleccionado}
          onGuardado={handleGuardado}
        />
      ) : (
        <TablaEPP
          refrescar={refrescar}
          onEditar={handleEditar}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
