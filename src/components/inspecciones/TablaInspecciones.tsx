'use client';

import { useEffect, useState } from 'react';
import { obtenerInspecciones, eliminarInspeccion } from '@/lib/api';

export interface InspeccionFromTabla {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  observaciones?: string;
  conforme: boolean;
  faena?: { id: number; nombre: string };
  inspector?: { id: number; nombre: string };
}

interface Props {
  refrescar?: boolean;
  onEditar?: (inspeccion: InspeccionFromTabla) => void;
  onEliminado?: () => void;
}

export default function TablaInspecciones({ refrescar, onEditar, onEliminado }: Props) {
  const [inspecciones, setInspecciones] = useState<InspeccionFromTabla[]>([]);

  const cargarInspecciones = async () => {
    try {
      const data = await obtenerInspecciones();
      setInspecciones(data);
    } catch (error) {
      console.error('❌ Error al obtener inspecciones:', error);
    }
  };

  useEffect(() => {
    cargarInspecciones();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta inspección?')) return;
    try {
      await eliminarInspeccion(id);
      cargarInspecciones();
      onEliminado?.();
    } catch (error) {
      console.error('❌ Error al eliminar inspección:', error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Fecha</th>
            <th className="px-4 py-2 text-left">Faena</th>
            <th className="px-4 py-2 text-left">Inspector</th>
            <th className="px-4 py-2 text-left">Tipo</th>
            <th className="px-4 py-2 text-left">Descripción</th>
            <th className="px-4 py-2 text-left">Conforme</th>
            <th className="px-4 py-2 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inspecciones.map((inspeccion) => (
            <tr key={inspeccion.id} className="border-t">
              <td className="px-4 py-2">{new Date(inspeccion.fecha).toLocaleDateString()}</td>
              <td className="px-4 py-2">{inspeccion.faena?.nombre || '—'}</td>
              <td className="px-4 py-2">{inspeccion.inspector?.nombre || '—'}</td>
              <td className="px-4 py-2">{inspeccion.tipo}</td>
              <td className="px-4 py-2">{inspeccion.descripcion}</td>
              <td className="px-4 py-2">{inspeccion.conforme ? '✅' : '❌'}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => onEditar?.(inspeccion)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(inspeccion.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {inspecciones.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                No hay inspecciones registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
