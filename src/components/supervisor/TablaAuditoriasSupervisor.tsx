'use client';

import { useEffect, useState } from 'react';
import { obtenerAuditorias } from '@/lib/api';

interface Auditoria {
  id: number;
  tipo: string;
  descripcion: string;
  fecha: string;
  faena?: { nombre: string };
  auditor?: { nombre: string; apellido: string };
}

interface Props {
  soloLectura?: boolean;
  onEditar?: (auditoria: Auditoria) => void;
  onEliminado?: () => void;
}

export default function TablaAuditorias({ soloLectura, onEditar, onEliminado }: Props) {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);

  const cargarAuditorias = async () => {
    const data = await obtenerAuditorias();
    setAuditorias(data);
  };

  useEffect(() => {
    cargarAuditorias();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Lista de Auditorías</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Descripción</th>
            <th className="border p-2">Faena</th>
            <th className="border p-2">Auditor</th>
            {!soloLectura && <th className="border p-2">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {auditorias.map((aud) => (
            <tr key={aud.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{aud.id}</td>
              <td className="p-2">{new Date(aud.fecha).toLocaleDateString()}</td>
              <td className="p-2">{aud.tipo}</td>
              <td className="p-2">{aud.descripcion}</td>
              <td className="p-2">{aud.faena?.nombre || '—'}</td>
              <td className="p-2">
                {aud.auditor ? `${aud.auditor.nombre} ${aud.auditor.apellido}` : '—'}
              </td>
              {!soloLectura && (
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => onEditar?.(aud)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => alert('Eliminar no implementado')}
                    className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
