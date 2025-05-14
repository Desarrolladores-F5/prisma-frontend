'use client';

import { useEffect, useState } from 'react';
import { obtenerFirmas, obtenerUsuarios } from '@/lib/api';

interface Firma {
  id: number;
  firmante_id: number;
  fecha: string;
  hash_firma: string;
  tipo_firma: string;
  metadata?: any;
}

export default function TablaFirmas() {
  const [firmas, setFirmas] = useState<Firma[]>([]);
  const [usuarios, setUsuarios] = useState<Record<number, string>>({});

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const dataFirmas = await obtenerFirmas();
        const dataUsuarios = await obtenerUsuarios();

        const mapaUsuarios: Record<number, string> = {};
        dataUsuarios.forEach((u: any) => {
          mapaUsuarios[u.id] = `${u.nombre} ${u.apellido}`;
        });

        setUsuarios(mapaUsuarios);
        setFirmas(dataFirmas);
      } catch (error) {
        console.error('❌ Error al cargar datos de firmas:', error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Firmante</th>
            <th className="py-2 px-4 border">Fecha</th>
            <th className="py-2 px-4 border">Tipo</th>
            <th className="py-2 px-4 border">Hash</th>
            <th className="py-2 px-4 border">Metadata</th>
          </tr>
        </thead>
        <tbody>
          {firmas.map((firma) => (
            <tr key={firma.id} className="text-sm">
              <td className="py-2 px-4 border text-center">{firma.id}</td>
              <td className="py-2 px-4 border">{usuarios[firma.firmante_id] || 'Desconocido'}</td>
              <td className="py-2 px-4 border">{new Date(firma.fecha).toLocaleString()}</td>
              <td className="py-2 px-4 border">{firma.tipo_firma}</td>
              <td className="py-2 px-4 border truncate max-w-xs">{firma.hash_firma}</td>
              <td className="py-2 px-4 border text-xs">
                <div><strong>Entidad:</strong> {firma.metadata?.entidad || 'N/A'}</div>
                <div><strong>ID:</strong> {firma.metadata?.entidad_id || 'N/A'}</div>
                <div><strong>Dispositivo:</strong> {firma.metadata?.dispositivo || 'N/A'}</div>
                <div><strong>Navegador:</strong> {firma.metadata?.navegador?.substring(0, 25) || 'N/A'}...</div>
                <div><strong>Fecha:</strong> {firma.metadata?.timestamp || 'N/A'}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
