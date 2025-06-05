// src/components/inspecciones/TablaInspeccionesSupervisor.tsx
'use client';

import { useEffect, useState } from 'react';
import { obtenerInspecciones } from '@/lib/api';

export interface InspeccionFromTabla {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  observaciones?: string;
  conforme: boolean;
  faena?: { id: number; nombre: string };
  inspector?: { id: number; nombre: string };
}

interface Props {
  refrescar?: boolean;
  onEditar?: (inspeccion: InspeccionFromTabla) => void; // Preparado pero no usado
  onEliminado?: () => void; // Preparado pero no usado
}

export default function TablaInspeccionesSupervisor({ refrescar, onEditar }: Props) {
  const [inspecciones, setInspecciones] = useState<InspeccionFromTabla[]>([]);
  const [filtroDescripcion, setFiltroDescripcion] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroConforme, setFiltroConforme] = useState('todas');

  useEffect(() => {
    const cargarInspecciones = async () => {
      try {
        const data = await obtenerInspecciones();
        setInspecciones(data);
      } catch (error) {
        console.error('❌ Error al obtener inspecciones:', error);
      }
    };
    cargarInspecciones();
  }, [refrescar]);

  const inspeccionesFiltradas = inspecciones.filter((i) => {
    const descripcionMatch =
      filtroDescripcion === '' ||
      i.descripcion?.toLowerCase().includes(filtroDescripcion.toLowerCase()) ||
      i.faena?.nombre?.toLowerCase().includes(filtroDescripcion.toLowerCase());

    const tipoMatch =
      filtroTipo === '' || i.tipo?.toLowerCase().includes(filtroTipo.toLowerCase());

    const conformeMatch =
      filtroConforme === 'todas' ||
      (filtroConforme === 'conforme' && i.conforme) ||
      (filtroConforme === 'no-conforme' && !i.conforme);

    return descripcionMatch && tipoMatch && conformeMatch;
  });

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por descripción o faena"
          value={filtroDescripcion}
          onChange={(e) => setFiltroDescripcion(e.target.value)}
          className="border p-2 rounded w-full md:max-w-xs"
        />
        <input
          type="text"
          placeholder="Filtrar por tipo"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border p-2 rounded w-full md:max-w-xs"
        />
        <select
          value={filtroConforme}
          onChange={(e) => setFiltroConforme(e.target.value)}
          className="border p-2 rounded w-full md:max-w-xs"
        >
          <option value="todas">Todas</option>
          <option value="conforme">✅ Conforme</option>
          <option value="no-conforme">❌ No Conforme</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Faena</th>
              <th className="px-4 py-2 text-left">Inspector</th>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Conforme</th>
              {/* <th className="px-4 py-2 text-left">Acciones</th> */}
            </tr>
          </thead>
          <tbody>
            {inspeccionesFiltradas.map((inspeccion) => (
              <tr key={inspeccion.id} className="border-t">
                <td className="px-4 py-2">{new Date(inspeccion.fecha).toLocaleDateString('es-CL')}</td>
                <td className="px-4 py-2">{inspeccion.faena?.nombre || '—'}</td>
                <td className="px-4 py-2">{inspeccion.inspector?.nombre || '—'}</td>
                <td className="px-4 py-2">{inspeccion.tipo}</td>
                <td className="px-4 py-2">{inspeccion.descripcion}</td>
                <td className="px-4 py-2">{inspeccion.conforme ? '✅' : '❌'}</td>

                {/* 🔒 Acciones deshabilitadas temporalmente */}
                {/* <td className="px-4 py-2">
                  <button
                    onClick={() => onEditar?.(inspeccion)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Editar
                  </button>
                </td> */}
              </tr>
            ))}
            {inspeccionesFiltradas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 py-4">
                  No hay inspecciones registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
