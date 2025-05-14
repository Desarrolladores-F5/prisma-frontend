'use client';

import { useState } from 'react';
import TablaEmpresas from '@/components/empresas/TablaEmpresas';
import FormularioEmpresa from '@/components/empresas/FormularioEmpresa';
import { useRouter } from 'next/navigation';

export default function EmpresasPage() {
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState<any | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const router = useRouter();

  const manejarGuardado = () => {
    setEmpresaSeleccionada(null);
    setMostrarFormulario(false);
    setRefrescar(!refrescar);
  };

  const manejarEdicion = (empresa: any) => {
    setEmpresaSeleccionada(empresa);
    setMostrarFormulario(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Empresas</h1>

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
                setEmpresaSeleccionada(null);
                setMostrarFormulario(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Registrar Empresa
            </button>
          </div>

          <TablaEmpresas
            onEditar={manejarEdicion}
            refrescar={refrescar}
          />
        </>
      ) : (
        <>
          <FormularioEmpresa
            empresa={empresaSeleccionada}
            onGuardado={manejarGuardado}
          />
          <div className="mt-4">
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setEmpresaSeleccionada(null);
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
