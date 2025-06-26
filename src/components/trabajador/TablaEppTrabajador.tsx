'use client';

import { useEffect, useState } from 'react';
import { obtenerEppAsignados } from '@/lib/api';

interface EPP {
  id: number;
  tipo: string;
  descripcion?: string;
  estado: string;
  fecha_entrega?: string;
  fecha_vencimiento?: string;
  faena?: {
    nombre: string;
  };
  documento?: {
    url: string;
  };
}

export default function TablaEppTrabajador() {
  const [epps, setEpps] = useState<EPP[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarEpp = async () => {
      try {
        const data = await obtenerEppAsignados();
        setEpps(data);
        if (data.length === 0) {
          setMensaje('No tienes EPP asignados actualmente.');
        }
      } catch (error) {
        setMensaje('Error al cargar los EPP asignados.');
        console.error(error);
      }
    };

    cargarEpp();
  }, []);

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow p-4">
      {mensaje ? (
        <p className="text-center text-gray-600">{mensaje}</p>
      ) : (
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Tipo</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Fecha Entrega</th>
              <th className="p-2">Fecha Vencimiento</th>
              <th className="p-2">Faena</th>
              <th className="p-2">Documento</th>
            </tr>
          </thead>
          <tbody>
            {epps.map((epp) => (
              <tr key={epp.id} className="border-t">
                <td className="p-2">{epp.tipo}</td>
                <td className="p-2">{epp.descripcion || '—'}</td>
                <td className="p-2">{epp.estado}</td>
                <td className="p-2">{epp.fecha_entrega?.substring(0, 10) || '-'}</td>
                <td className="p-2">{epp.fecha_vencimiento?.substring(0, 10) || '-'}</td>
                <td className="p-2">{epp.faena?.nombre || '-'}</td>
                <td className="p-2">
                  {epp.documento?.url ? (
                    <a
                      href={epp.documento.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Ver / Descargar
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
