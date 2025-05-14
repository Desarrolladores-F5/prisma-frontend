'use client';

import { useEffect, useState } from 'react';
import { obtenerProtocolos, eliminarProtocolo } from '@/lib/api';
import { Usuario, Empresa, Faena } from '@/types';

export interface ProtocoloExtendido {
  id: number;
  nombre: string;
  descripcion?: string;
  version?: string;
  responsable_id: number;
  empresa_id: number;
  faena_id: number;
  vigente: boolean;
  fecha_emision?: string;
  fecha_vigencia?: string;
  fecha_creacion?: string;
  responsable?: Usuario;
  empresa?: Empresa;
  faena?: Faena;
}

interface Props {
  refrescar?: boolean;
  onEditar?: (protocolo: ProtocoloExtendido) => void;
  onEliminado?: () => void;
}

export default function TablaProtocolo({ refrescar, onEditar, onEliminado }: Props) {
  const [protocolos, setProtocolos] = useState<ProtocoloExtendido[]>([]);

  const cargarProtocolos = async () => {
    try {
      const data = await obtenerProtocolos();
      setProtocolos(data);
    } catch (error) {
      console.error('❌ Error al cargar protocolos:', error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Deseas eliminar este protocolo?')) return;
    try {
      await eliminarProtocolo(id);
      cargarProtocolos();
      onEliminado?.();
    } catch (error) {
      console.error('❌ Error al eliminar protocolo:', error);
    }
  };

  useEffect(() => {
    cargarProtocolos();
  }, [refrescar]);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Nombre</th>
            <th className="border px-3 py-2">Versión</th>
            <th className="border px-3 py-2">Responsable</th>
            <th className="border px-3 py-2">Empresa</th>
            <th className="border px-3 py-2">Faena</th>
            <th className="border px-3 py-2">Fecha Emisión</th>
            <th className="border px-3 py-2">Vigente</th>
            <th className="border px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {protocolos.map((p) => (
            <tr key={p.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2">{p.nombre}</td>
              <td className="p-2">{p.version || '-'}</td>
              <td className="p-2">{p.responsable?.nombre} {p.responsable?.apellido}</td>
              <td className="p-2">{p.empresa?.nombre}</td>
              <td className="p-2">{p.faena?.nombre}</td>
              <td className="p-2">{p.fecha_emision ? new Date(p.fecha_emision).toLocaleDateString() : '-'}</td>
              <td className="p-2">{p.vigente ? 'Sí' : 'No'}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => onEditar?.(p)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
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
