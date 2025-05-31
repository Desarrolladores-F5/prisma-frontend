'use client';

import { useEffect, useState } from 'react';
import { obtenerTestigos, eliminarTestigo } from '@/lib/api';

interface Testigo {
  id: number;
  nombre: string;
  apellido: string;
  rut: string;
  correo?: string;
  telefono?: string;
  empresa?: { id: number; nombre: string };
  reporte?: { id: number; titulo: string };
  declaracion?: string;
  fecha_creacion: string;
}

interface Props {
  refrescar?: boolean;
  onEditar?: (testigo: Testigo) => void;
  onEliminado?: () => void;
}

export default function TablaTestigos({ refrescar, onEditar, onEliminado }: Props) {
  const [testigos, setTestigos] = useState<Testigo[]>([]);

  const cargarTestigos = async () => {
    try {
      const data = await obtenerTestigos();
      setTestigos(data);
    } catch (error) {
      console.error('❌ Error al cargar testigos:', error);
    }
  };

  useEffect(() => {
    cargarTestigos();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Deseas eliminar este testigo?')) return;
    try {
      await eliminarTestigo(id);
      cargarTestigos();
      onEliminado?.();
    } catch (error) {
      console.error('❌ Error al eliminar testigo:', error);
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Nombre</th>
            <th className="border px-3 py-2">Apellido</th>
            <th className="border px-3 py-2">RUT</th>
            <th className="border px-3 py-2">Empresa</th>
            <th className="border px-3 py-2">Reporte</th>
            <th className="border px-3 py-2">Fecha</th>
            <th className="border px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {testigos.map((t) => (
            <tr key={t.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2">{t.nombre}</td>
              <td className="p-2">{t.apellido}</td>
              <td className="p-2">{t.rut}</td>
              <td className="p-2">{t.empresa?.nombre || '—'}</td>
              <td className="p-2">{t.reporte?.titulo || '—'}</td>
              <td className="p-2">{new Date(t.fecha_creacion).toLocaleDateString()}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => onEditar?.(t)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Editar</button>
                <button onClick={() => handleEliminar(t.id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
