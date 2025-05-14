'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import TablaFirmas from '@/components/firmas/TablaFirmas';
import FormularioFirma from '@/components/firmas/FormularioFirma';

export default function PageFirmas() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  const [entidadId, setEntidadId] = useState<number | null>(null);
  const [entidadTipo, setEntidadTipo] = useState<string>('');

  useEffect(() => {
    const id = searchParams.get('entidadId');
    const tipo = searchParams.get('entidadTipo');

    if (id && tipo) {
      setEntidadId(parseInt(id));
      setEntidadTipo(tipo);
      setMostrarFormulario(true);
    }
  }, [searchParams]);

  const handleFirmado = () => {
    setMostrarFormulario(false);
    setRefrescar(!refrescar);
    router.replace('/admin/dashboard/firmas');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Firmas</h1>
        <div className="flex space-x-2">
          {mostrarFormulario ? (
            <button
              onClick={() => {
                setMostrarFormulario(false);
                router.replace('/admin/dashboard/firmas');
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
                onClick={() => router.push('/admin/dashboard/firmas?entidadId=1&entidadTipo=inspeccion')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Firmar Documento
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarFormulario && entidadId && entidadTipo ? (
        <FormularioFirma
          entidadId={entidadId}
          entidadTipo={entidadTipo}
          onFirmado={handleFirmado}
        />
      ) : (
        <TablaFirmas key={refrescar.toString()} />
      )}
    </div>
  );
}
