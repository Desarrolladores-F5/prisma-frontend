'use client';

import { useEffect, useState } from 'react';
import { obtenerExamenes, eliminarExamen } from '@/lib/api';
import { Button } from '@/components/ui/button';

interface Props {
  onEditar: (examen: any) => void;
  onEliminado: () => void;
  refrescar?: boolean;
}

export default function TablaExamenes({ onEditar, onEliminado, refrescar }: Props) {
  const [examenes, setExamenes] = useState<any[]>([]);

  const cargarExamenes = async () => {
    try {
      const data = await obtenerExamenes();
      setExamenes(data);
    } catch (error) {
      console.error('❌ Error al cargar exámenes:', error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este examen?')) {
      try {
        await eliminarExamen(id);
        onEliminado();
        cargarExamenes();
      } catch (error) {
        console.error('❌ Error al eliminar examen:', error);
      }
    }
  };

  useEffect(() => {
    cargarExamenes();
  }, [refrescar]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Título</th>
            <th className="p-2 border">Descripción</th>
            <th className="p-2 border">Capacitación ID</th>
            <th className="p-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {examenes.map((examen, index) => (
            <tr key={examen.id} className="hover:bg-gray-50">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{examen.titulo}</td>
              <td className="p-2 border">{examen.descripcion || '—'}</td>
              <td className="p-2 border">{examen.capacitacion_id}</td>
              <td className="p-2 border space-x-2">
                <Button variant="outline" onClick={() => onEditar(examen)}>
                  Editar
                </Button>
                <Button variant="destructive" onClick={() => handleEliminar(examen.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
          {examenes.length === 0 && (
            <tr>
              <td colSpan={5} className="p-2 text-center text-gray-500">
                No hay exámenes registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
