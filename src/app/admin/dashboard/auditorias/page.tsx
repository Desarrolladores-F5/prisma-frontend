'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TablaAuditorias from '@/components/auditorias/TablaAuditorias';
import FormularioAuditoria from '@/components/auditorias/FormularioAuditoria';

export default function PageAuditorias() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState<any | null>(null);
  const [refrescar, setRefrescar] = useState(false);
  const router = useRouter();

  const handleEditar = (auditoria: any) => {
    setAuditoriaSeleccionada(auditoria);
    setMostrarFormulario(true);
  };

  const handleGuardado = () => {
    setRefrescar(!refrescar);
    setAuditoriaSeleccionada(null);
    setMostrarFormulario(false);
  };

  const volverAlListado = () => {
    setAuditoriaSeleccionada(null);
    setMostrarFormulario(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Auditorías</h1>
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
                Registrar Auditoría
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarFormulario ? (
        <FormularioAuditoria
          auditoria={auditoriaSeleccionada}
          onGuardado={handleGuardado}
        />
      ) : (
        <TablaAuditorias
          refrescar={refrescar}
          onEditar={handleEditar}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
