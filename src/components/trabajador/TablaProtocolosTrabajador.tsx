'use client';

import { useEffect, useState } from 'react';
import { obtenerMisProtocolos } from '@/lib/api';
import { ProtocoloExtendido } from '@/types';

export default function TablaProtocolosTrabajador() {
  const [protocolos, setProtocolos] = useState<ProtocoloExtendido[]>([]);
  const [mensaje, setMensaje] = useState('');

  const cargarProtocolos = async () => {
    try {
      const data = await obtenerMisProtocolos();
      setProtocolos(data);
    } catch (error: any) {
      setMensaje('Error al cargar los protocolos');
      console.error('❌ Error al cargar protocolos:', error.message);
    }
  };

  useEffect(() => {
    cargarProtocolos();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Mis Protocolos</h2>

      {mensaje && <p className="text-red-500 mb-4">{mensaje}</p>}

      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Faena</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {protocolos.map((protocolo) => (
            <tr key={protocolo.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{protocolo.nombre}</td>
              <td className="p-2">{protocolo.descripcion || '—'}</td>
              <td className="p-2">
                {protocolo.fecha_creacion
                  ? new Date(protocolo.fecha_creacion).toLocaleDateString()
                  : '—'}
              </td>
              <td className="p-2">{protocolo.faena?.nombre || '—'}</td>
              <td className="p-2 space-x-2">
                {protocolo.url ? (
                  <>
                    <a
                      href={protocolo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Ver
                    </a>
                    <a
                      href={protocolo.url}
                      download
                      className="text-green-600 hover:underline"
                    >
                      Descargar
                    </a>
                  </>
                ) : (
                  <span className="text-gray-500 italic">Sin archivo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
