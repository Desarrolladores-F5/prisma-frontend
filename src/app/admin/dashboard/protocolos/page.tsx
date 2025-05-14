'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TablaProtocolo from '@/components/protocolos/TablaProtocolo';
import FormularioProtocolo from '@/components/protocolos/FormularioProtocolo';
import { ProtocoloExtendido } from '@/types';

export default function PageProtocolos() {
  const router = useRouter();
  const [refrescar, setRefrescar] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [protocoloSeleccionado, setProtocoloSeleccionado] = useState<ProtocoloExtendido | null>(null);

  const manejarGuardado = () => {
    setRefrescar(prev => !prev);
    setMostrarFormulario(false);
    setProtocoloSeleccionado(null);
  };

  const manejarEditar = (protocolo: ProtocoloExtendido) => {
    setProtocoloSeleccionado(protocolo);
    setMostrarFormulario(true);
  };

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Protocolos</h1>
        <div className="flex space-x-2">
          {mostrarFormulario ? (
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setProtocoloSeleccionado(null);
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
                Crear Protocolo
              </button>
            </>
          )}
        </div>
      </header>

      {mostrarFormulario ? (
        <FormularioProtocolo
          protocolo={protocoloSeleccionado ?? undefined}
          onGuardado={manejarGuardado}
        />
      ) : (
        <TablaProtocolo
          refrescar={refrescar}
          onEditar={manejarEditar}
          onEliminado={() => setRefrescar(prev => !prev)}
        />
      )}
    </div>
  );
}
