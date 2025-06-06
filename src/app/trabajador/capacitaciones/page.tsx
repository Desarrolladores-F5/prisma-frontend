'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TablaCapacitacionesTrabajador from '@/components/trabajador/TablaCapacitacionesTrabajador';
import FormularioExamenTrabajador from '@/components/trabajador/FormularioExamenTrabajador';

export default function CapacitacionesTrabajadorPage() {
  const [capacitacionSeleccionada, setCapacitacionSeleccionada] = useState<any | null>(null);
  const [refrescar, setRefrescar] = useState(false);
  const router = useRouter();

  return (
    <div className="p-6">
      {!capacitacionSeleccionada ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Capacitaciones Disponibles</h1>
            <button
              onClick={() => router.push('/trabajador/dashboard')}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Volver al Inicio
            </button>
          </div>

          <TablaCapacitacionesTrabajador
            refrescar={refrescar}
            onResponder={(cap) => setCapacitacionSeleccionada(cap)}
          />
        </>
      ) : (
        <FormularioExamenTrabajador
          capacitacion={capacitacionSeleccionada}
          onVolver={() => {
            setCapacitacionSeleccionada(null);
            setRefrescar(!refrescar);
          }}
        />
      )}
    </div>
  );
}
