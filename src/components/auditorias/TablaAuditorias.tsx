'use client';

import { useEffect, useState } from 'react';
import { obtenerAuditorias, eliminarAuditoria } from '@/lib/api';
import { Auditoria } from '@/types';

interface Props {
  onEditar?: (auditoria: Auditoria) => void;
  onEliminado?: () => void;
  refrescar?: boolean;
}

export default function TablaAuditorias({ onEditar, onEliminado, refrescar }: Props) {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);

  const cargar = async () => {
    const data = await obtenerAuditorias();
    setAuditorias(data);
  };

  useEffect(() => {
    cargar();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Deseas eliminar esta auditoría?')) return;

    const res = await eliminarAuditoria(id);
    if (res?.mensaje?.includes('eliminada')) {
      await cargar();
      onEliminado?.();
    } else {
      alert(res?.mensaje || '❌ Error al eliminar auditoría');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Listado de Auditorías</h2>

      {auditorias.length === 0 ? (
        <p className="text-gray-500">No hay auditorías registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Faena</th>
                <th className="p-2">Auditor</th>
                <th className="p-2">Conforme</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {auditorias.map((a) => (
                <tr key={a.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{a.id}</td>
                  <td className="p-2">{new Date(a.fecha).toLocaleDateString('es-CL')}</td>
                  <td className="p-2">{a.tipo}</td>
                  <td className="p-2">{a.faena?.nombre || `ID: ${a.faena_id}`}</td>
                  <td className="p-2">
                    {a.auditor
                      ? `${a.auditor.nombre} ${a.auditor.apellido}`
                      : `ID: ${a.auditor_id}`}
                  </td>
                  <td className="p-2">{a.conforme ? '✅' : '❌'}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => onEditar?.(a)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(a.id)}
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
      )}
    </div>
  );
}
