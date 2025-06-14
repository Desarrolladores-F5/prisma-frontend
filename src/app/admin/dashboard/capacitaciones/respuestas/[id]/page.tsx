'use client';

import { useParams, useRouter } from 'next/navigation';
import TablaRespuestasCapacitacion from '@/components/capacitaciones/TablaRespuestasCapacitacion';

export default function ResumenRespuestasCapacitacionPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? Number(params.id[0]) : Number(params?.id);

  if (!id) return <p className="text-center mt-4 text-red-500">ID de capacitación inválido.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Resumen de Respuestas</h1>

      <TablaRespuestasCapacitacion capacitacionId={id} />

      <div className="text-center pt-6">
        <button
          onClick={() => router.push('/admin/dashboard/capacitaciones')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
