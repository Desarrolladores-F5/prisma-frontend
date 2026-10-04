'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import TablaFirmas from '@/components/firmas/TablaFirmas';
import FormularioFirma from '@/components/firmas/FormularioFirma';

function FirmasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const [entidadId, setEntidadId] = useState<number | null>(null);
  const [entidadTipo, setEntidadTipo] = useState('');

  useEffect(() => {
    if (!searchParams) {
      return;
    }

    const id = searchParams.get('entidadId');
    const tipo = searchParams.get('entidadTipo');

    if (id && tipo) {
      setEntidadId(parseInt(id, 10));
      setEntidadTipo(tipo);
      setMostrarFormulario(true);
    }
  }, [searchParams]);

  const handleFirmado = () => {
    setMostrarFormulario(false);
    setRefrescar((valorActual) => !valorActual);
    router.replace('/admin/dashboard/firmas');
  };

  const volverAlListado = () => {
    setMostrarFormulario(false);
    setEntidadId(null);
    setEntidadTipo('');
    router.replace('/admin/dashboard/firmas');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Firmas</h1>

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
                onClick={() =>
                  router.push(
                    '/admin/dashboard/firmas?entidadId=1&entidadTipo=inspeccion'
                  )
                }
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Firmar Documento
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarFormulario && entidadId !== null && entidadTipo ? (
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

export default function PageFirmas() {
  return (
    <Suspense
      fallback={
        <div className="p-6">
          <p>Cargando gestión de firmas...</p>
        </div>
      }
    >
      <FirmasContent />
    </Suspense>
  );
}
