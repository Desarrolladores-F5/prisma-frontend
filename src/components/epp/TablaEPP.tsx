'use client';

import { useEffect, useState } from 'react';
import { obtenerEPP, eliminarEPP } from '@/lib/api';

interface EPP {
  id: number;
  tipo: string;
  estado: string;
  fecha_entrega: string;
  fecha_vencimiento: string;
  usuario?: {
    nombre: string;
    apellido: string;
  };
  faena?: {
    nombre: string;
  };
}

interface Props {
  refrescar?: boolean;
  onEditar?: (epp: EPP) => void;
  onEliminado?: () => void;
}

export default function TablaEPP({ refrescar, onEditar, onEliminado }: Props) {
  const [epps, setEpps] = useState<EPP[]>([]);

  const cargarEPP = async () => {
    try {
      const data = await obtenerEPP();
      setEpps(data);
    } catch (error) {
      console.error('❌ Error al obtener EPP:', error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este EPP?')) return;
    try {
      await eliminarEPP(id);
      await cargarEPP();
      onEliminado?.();
    } catch (error) {
      console.error('❌ Error al eliminar EPP:', error);
    }
  };

  useEffect(() => {
    cargarEPP();
  }, [refrescar]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de EPP</h2>

      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Fecha Entrega</th>
            <th className="border p-2">Fecha Vencimiento</th>
            <th className="border p-2">Usuario</th>
            <th className="border p-2">Faena</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {epps.map((item) => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{item.tipo}</td>
              <td className="p-2">{item.estado}</td>
              <td className="p-2">{new Date(item.fecha_entrega).toLocaleDateString()}</td>
              <td className="p-2">{new Date(item.fecha_vencimiento).toLocaleDateString()}</td>
              <td className="p-2">
                {item.usuario ? `${item.usuario.nombre} ${item.usuario.apellido}` : '—'}
              </td>
              <td className="p-2">
                {item.faena?.nombre || '—'}
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => onEditar?.(item)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(item.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
