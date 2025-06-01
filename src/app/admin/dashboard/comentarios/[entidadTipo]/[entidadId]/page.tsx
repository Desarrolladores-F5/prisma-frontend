'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import FormularioComentario from '@/components/comentarios/FormularioComentario';
import TablaComentarios from '@/components/comentarios/TablaComentarios';

export default function ComentariosEntidadPage() {
  const router = useRouter();
  const params = useParams();

  const entidadTipo = params?.entidadTipo as string;
  const entidadId = parseInt(params?.entidadId as string);

  if (!entidadTipo || isNaN(entidadId)) {
    return <p className="p-6 text-red-600">⚠️ Parámetros inválidos o no disponibles.</p>;
  }

  const [refrescar, setRefrescar] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Comentarios para {entidadTipo} #{entidadId}</h1>
        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
        >
          Volver al Listado
        </button>
      </div>

      <FormularioComentario
        entidadId={entidadId}
        entidadTipo={entidadTipo}
        onComentarioCreado={() => setRefrescar(!refrescar)}
      />

      <TablaComentarios
        entidadId={entidadId}
        entidadTipo={entidadTipo}
        refrescar={refrescar}
      />
    </div>
  );
}
