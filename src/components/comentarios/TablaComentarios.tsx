// src/components/comentarios/TablaComentarios.tsx
'use client';

import { useEffect, useState } from 'react';
import { obtenerComentariosPorEntidad } from '@/lib/api';

interface Props {
  entidadId: number;
  entidadTipo: string;
  refrescar: boolean;
}

export default function TablaComentarios({ entidadId, entidadTipo, refrescar }: Props) {
  const [comentarios, setComentarios] = useState<any[]>([]);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerComentariosPorEntidad(entidadTipo, entidadId);
        setComentarios(data);
      } catch (error) {
        console.error('❌ Error al cargar comentarios:', error);
      }
    };
    cargar();
  }, [entidadId, entidadTipo, refrescar]);

  return (
    <div className="p-4 border border-gray-300 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-3">Comentarios Registrados</h2>
      {comentarios.length === 0 ? (
        <p className="text-sm text-gray-600">No hay comentarios registrados para esta entidad.</p>
      ) : (
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Fecha</th>
              <th className="border px-3 py-2">Mensaje</th>
              <th className="border px-3 py-2">Autor</th>
            </tr>
          </thead>
          <tbody>
            {comentarios.map((comentario) => (
              <tr key={comentario.id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">
                  {new Date(comentario.fecha).toLocaleString()}
                </td>
                <td className="border px-3 py-2">{comentario.mensaje}</td>
                <td className="border px-3 py-2">
                  <div>
                    <p className="font-medium">
                      {comentario.autor?.nombre || `ID ${comentario.autor_id}`}
                    </p>
                    {comentario.autor?.correo && (
                      <p className="text-xs text-gray-500">{comentario.autor.correo}</p>
                    )}
                    {comentario.autor?.faena && (
                      <p className="text-xs text-gray-500">
                        Faena: {comentario.autor.faena.nombre}
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
