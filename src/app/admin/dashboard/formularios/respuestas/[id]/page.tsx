'use client';

import { useParams } from 'next/navigation';
import TablaRespuestasFormulario from '@/components/formularios/TablaRespuestasFormulario';
import Link from 'next/link';

export default function RespuestasFormularioPage() {
  const { id } = useParams();

  if (!id) return <p>⚠️ ID de formulario no proporcionado.</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Respuestas del Formulario #{id}</h1>
        <Link
          href="/admin/dashboard/formularios"
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          ← Volver al Listado
        </Link>
      </div>

      <TablaRespuestasFormulario formularioId={parseInt(id as string)} />
    </div>
  );
}
