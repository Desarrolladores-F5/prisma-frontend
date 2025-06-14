'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TablaRespuestasCapacitacion from '@/components/capacitaciones/TablaRespuestasCapacitacion';

export default function RespuestasCapacitacionSupervisorPage() {
  const params = useParams();
  const router = useRouter();

  // ✅ Validar ID como string
  const id = typeof params?.id === 'string'
    ? params.id
    : Array.isArray(params?.id)
    ? params.id[0]
    : null;

  if (!id || isNaN(Number(id))) {
    return <p className="text-red-600 text-center mt-4">❌ ID de capacitación no válido.</p>;
  }

  const capacitacionId = parseInt(id, 10);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Respuestas de la Capacitación</h1>
        <button
          onClick={() => router.push('/supervisor/capacitaciones')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver
        </button>
      </div>

      <TablaRespuestasCapacitacion capacitacionId={capacitacionId} />
    </div>
  );
}
