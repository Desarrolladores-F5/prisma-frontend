'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TablaMedidas, { MedidaFromTabla } from '@/components/medidas/TablaMedidas';
import FormularioMedida, { MedidaCorrectiva } from '@/components/medidas/FormularioMedida';

export default function PageMedidas() {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const [medidaSeleccionada, setMedidaSeleccionada] = useState<MedidaCorrectiva | null>(null);

  const manejarEdicion = (medida: MedidaFromTabla) => {
    const transformada: MedidaCorrectiva = {
      id: medida.id,
      descripcion: medida.descripcion,
      fecha_cumplimiento: medida.fecha_cumplimiento,
      estado: medida.estado,
      prioridad: medida.prioridad,
      responsable_id: medida.responsable?.id ?? 0,
      evidencia_documento_id: medida.documento_evidencia?.id,
    };
    setMedidaSeleccionada(transformada);
    setMostrarFormulario(true);
  };

  const manejarGuardado = () => {
    setRefrescar(!refrescar);
    setMostrarFormulario(false);
    setMedidaSeleccionada(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Medidas Correctivas</h1>
        <div className="flex space-x-2">
          {mostrarFormulario ? (
            <button
              onClick={() => {
                setMostrarFormulario(false);
                setMedidaSeleccionada(null);
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
                Crear Medida
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarFormulario ? (
        <FormularioMedida
          medida={medidaSeleccionada ?? undefined}
          onGuardado={manejarGuardado}
        />
      ) : (
        <TablaMedidas
          refrescar={refrescar}
          onEditar={manejarEdicion}
          onEliminado={() => setRefrescar(!refrescar)}
        />
      )}
    </div>
  );
}
