'use client';

import { useParams } from 'next/navigation';
import TablaRespuestaFormularioSupervisor from '@/components/supervisor/TablaRespuestaFormularioSupervisor'; // ✅ nuevo componente
import Link from 'next/link';

export default function RespuestasFormularioSupervisorPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id ?? '';

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Respuestas del Formulario #{id}</h1>
        <Link
          href="/supervisor/formularios"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Volver al Listado
        </Link>
      </div>

      {!isNaN(Number(id)) ? (
        <TablaRespuestaFormularioSupervisor formularioId={parseInt(id)} /> // ✅ componente actualizado
      ) : (
        <p className="text-red-600">⚠️ ID de formulario inválido.</p>
      )}
    </div>
  );
}
