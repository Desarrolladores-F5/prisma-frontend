'use client';

import { useEffect, useState } from 'react';
import { obtenerMedidas } from '@/lib/api';

interface Medida {
  id: number;
  descripcion: string;
  fecha_cumplimiento: string;
  estado: string;
  prioridad: string;
  responsable?: { id: number; nombre: string };
  documento_evidencia?: { id: number; nombre: string };
  fecha_creacion: string;
}

export default function TablaMedidasSupervisor() {
  const [medidas, setMedidas] = useState<Medida[]>([]);

  const cargarMedidas = async () => {
    try {
      const data = await obtenerMedidas();
      setMedidas(data);
    } catch (error) {
      console.error('❌ Error al cargar medidas correctivas:', error);
    }
  };

  useEffect(() => {
    cargarMedidas();
  }, []);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Descripción</th>
            <th className="border px-3 py-2">Fecha Cumplimiento</th>
            <th className="border px-3 py-2">Estado</th>
            <th className="border px-3 py-2">Prioridad</th>
            <th className="border px-3 py-2">Responsable</th>
            <th className="border px-3 py-2">Documento</th>
            <th className="border px-3 py-2">Fecha Creación</th>
          </tr>
        </thead>
        <tbody>
          {medidas.map((m) => (
            <tr key={m.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2">{m.descripcion}</td>
              <td className="p-2">{new Date(m.fecha_cumplimiento).toLocaleDateString()}</td>
              <td className="p-2">{m.estado}</td>
              <td className="p-2">{m.prioridad}</td>
              <td className="p-2">{m.responsable?.nombre || '—'}</td>
              <td className="p-2">{m.documento_evidencia?.nombre || '—'}</td>
              <td className="p-2">{new Date(m.fecha_creacion).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
