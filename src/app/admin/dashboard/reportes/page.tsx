'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TablaReportes from '@/components/reportes/TablaReportes';
import FormularioReporte from '@/components/reportes/FormularioReporte';

export default function ReportesPage() {
  const router = useRouter();
  const [reporteSeleccionado, setReporteSeleccionado] = useState<any | null>(null);
  const [refrescar, setRefrescar] = useState(false);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar' | null>(null);

  const mostrarListado = () => {
    setModoFormulario(null);
    setReporteSeleccionado(null);
  };

  return (
    <div className="p-6">
      {!modoFormulario && (
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Gestor de Reportes</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => setModoFormulario('crear')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Crear Reporte
            </button>
          </div>
        </div>
      )}

      {modoFormulario ? (
        <>
          <FormularioReporte
            reporte={reporteSeleccionado}
            onGuardado={() => {
              setRefrescar(!refrescar);
              mostrarListado();
            }}
          />
          <div className="mt-4">
            <button
              onClick={mostrarListado}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Volver al Listado
            </button>
          </div>
        </>
      ) : (
        <TablaReportes
          refrescar={refrescar}
          onEditar={(reporte) => {
            setReporteSeleccionado(reporte);
            setModoFormulario('editar');
          }}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
