'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TablaDocumentos from '@/components/documentos/TablaDocumentos';
import FormularioDocumento from '@/components/documentos/FormularioDocumento';

export default function PageDocumentos() {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState<any>(null);
  const [refrescar, setRefrescar] = useState(false);

  const handleEditar = (documento: any) => {
    setDocumentoSeleccionado(documento);
    setMostrarFormulario(true);
  };

  const handleGuardado = () => {
    setDocumentoSeleccionado(null);
    setMostrarFormulario(false);
    setRefrescar(!refrescar);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Documentos</h1>
        <div className="flex space-x-2">
          {mostrarFormulario ? (
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setDocumentoSeleccionado(null);
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
                Registrar Documento
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarFormulario ? (
        <FormularioDocumento
          documento={documentoSeleccionado}
          onGuardado={handleGuardado}
        />
      ) : (
        <TablaDocumentos
          refrescar={refrescar}
          onEditar={handleEditar}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
