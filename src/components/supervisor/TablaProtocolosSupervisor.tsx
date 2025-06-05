'use client';

import { useEffect, useState } from 'react';
import { obtenerProtocolos } from '@/lib/api';

interface Protocolo {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
  faena?: {
    nombre: string;
  };
}

interface Props {
  refrescar?: boolean;
}

export default function TablaProtocolos({ refrescar }: Props) {
  const [protocolos, setProtocolos] = useState<Protocolo[]>([]);

  const cargarProtocolos = async () => {
    const data = await obtenerProtocolos();
    setProtocolos(data);
  };

  useEffect(() => {
    cargarProtocolos();
  }, [refrescar]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Protocolos</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Faena</th>
          </tr>
        </thead>
        <tbody>
          {protocolos.map((protocolo) => (
            <tr key={protocolo.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{protocolo.id}</td>
              <td className="p-2">{protocolo.nombre}</td>
              <td className="p-2">{protocolo.descripcion}</td>
              <td className="p-2">{new Date(protocolo.fecha_creacion).toLocaleDateString()}</td>
              <td className="p-2">{protocolo.faena?.nombre || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
