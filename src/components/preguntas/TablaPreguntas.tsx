'use client';

import { Pregunta } from '@/types';

interface Props {
  preguntas: Pregunta[];
  onEditar: (pregunta: Pregunta) => void;
  onEliminado: () => void;
}

export default function TablaPreguntas({ preguntas, onEditar, onEliminado }: Props) {
  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      try {
        await fetch(`/api/preguntas-examen/${id}`, { method: 'DELETE' });
        onEliminado();
      } catch (error) {
        console.error('❌ Error al eliminar la pregunta:', error);
      }
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg shadow">
      <table className="min-w-full bg-white text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Enunciado</th>
            <th className="px-4 py-3">Respuesta Correcta</th>
            <th className="px-4 py-3">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {preguntas.map((pregunta) => (
            <tr key={pregunta.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{pregunta.enunciado}</td>
              <td className="px-4 py-2">{pregunta.respuesta_correcta}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onEditar(pregunta)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(pregunta.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {preguntas.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center px-4 py-6 text-gray-500">
                No hay preguntas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
