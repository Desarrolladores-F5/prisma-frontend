'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { obtenerFormularios, eliminarFormulario } from '@/lib/api';

export interface FormularioTabla {
  id: number;
  nombre: string;
  tipo: string;
  estructura_json: string;
  fecha_creacion: string;
  creador?: { id: number; nombre: string };
}

interface Props {
  refrescar?: boolean;
  onEditar?: (formulario: FormularioTabla) => void;
  onEliminado?: () => void;
}

export default function TablaFormularios({ refrescar, onEditar, onEliminado }: Props) {
  const [formularios, setFormularios] = useState<FormularioTabla[]>([]);

  const cargarFormularios = async () => {
    try {
      const data = await obtenerFormularios();
      setFormularios(data);
    } catch (error) {
      console.error('❌ Error al cargar formularios:', error);
    }
  };

  useEffect(() => {
    cargarFormularios();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Deseas eliminar este formulario?')) return;
    try {
      await eliminarFormulario(id);
      cargarFormularios();
      onEliminado?.();
    } catch (error) {
      console.error('❌ Error al eliminar formulario:', error);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Nombre</th>
            <th className="border px-3 py-2">Tipo</th>
            <th className="border px-3 py-2">Creador</th>
            <th className="border px-3 py-2">Fecha</th>
            <th className="border px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {formularios.map((f) => (
            <tr key={f.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2">{f.nombre}</td>
              <td className="p-2">{f.tipo}</td>
              <td className="p-2">{f.creador?.nombre || '—'}</td>
              <td className="p-2">{new Date(f.fecha_creacion).toLocaleDateString()}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => onEditar?.(f)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(f.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
                <Link
                  href={`/admin/dashboard/formularios/probar/${f.id}`}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Probar
                </Link>
                <Link
                  href={`/admin/dashboard/formularios/respuestas/${f.id}`}
                  className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                >
                  Ver Respuestas
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
