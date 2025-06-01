'use client';

import { useEffect, useState } from 'react';
import { obtenerReportes, eliminarReporte } from '@/lib/api';
import GraficoReportesPorTipo from './GraficoReportesPorTipo';
import Link from 'next/link';

interface Props {
  onEditar?: (reporte: any) => void;
  onEliminado?: () => void;
  refrescar?: boolean;
}

export default function TablaReportes({ onEditar, onEliminado, refrescar }: Props) {
  const [reportes, setReportes] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtroFaena, setFiltroFaena] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarReportes = async () => {
      try {
        const data = await obtenerReportes();
        if (Array.isArray(data)) {
          setReportes(data);
        } else {
          setError('❌ Error al cargar reportes. Formato de datos inválido.');
          setReportes([]);
        }
      } catch (err) {
        setError('❌ Error inesperado al cargar reportes.');
      } finally {
        setCargando(false);
      }
    };

    cargarReportes();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    const confirmar = confirm('¿Estás seguro de que deseas eliminar este reporte?');
    if (!confirmar) return;

    const res = await eliminarReporte(id);
    if (res?.mensaje?.includes('eliminado')) {
      const actualizados = reportes.filter(r => r.id !== id);
      setReportes(actualizados);
      onEliminado?.();
    }
  };

  const reportesFiltrados = reportes.filter((reporte) => {
    const tipoMatch = filtroTipo === '' || reporte.tipo?.toLowerCase().includes(filtroTipo.toLowerCase());
    const estadoMatch = filtroEstado === '' || reporte.estado?.toLowerCase().includes(filtroEstado.toLowerCase());
    const faenaMatch = filtroFaena === '' || reporte.faena?.nombre?.toLowerCase().includes(filtroFaena.toLowerCase());
    return tipoMatch && estadoMatch && faenaMatch;
  });

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Lista de Reportes</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por tipo..."
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border p-2 rounded w-full md:max-w-xs"
        />
        <input
          type="text"
          placeholder="Buscar por estado..."
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border p-2 rounded w-full md:max-w-xs"
        />
        <input
          type="text"
          placeholder="Buscar por faena..."
          value={filtroFaena}
          onChange={(e) => setFiltroFaena(e.target.value)}
          className="border p-2 rounded w-full md:max-w-xs"
        />
      </div>

      <div className="overflow-x-auto">
        {cargando ? (
          <p className="text-gray-500 py-4">Cargando reportes...</p>
        ) : error ? (
          <p className="text-red-600 py-4">{error}</p>
        ) : reportesFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No hay reportes registrados.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Título</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Faena</th>
                <th className="p-2">Auditoría</th>
                <th className="p-2">Fecha</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.map((reporte: any) => (
                <tr key={reporte.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{reporte.id}</td>
                  <td className="p-2">{reporte.titulo}</td>
                  <td className="p-2">{reporte.tipo}</td>
                  <td className="p-2">{reporte.estado}</td>
                  <td className="p-2">{reporte.faena?.nombre || '-'}</td>
                  <td className="p-2">{reporte.auditoria?.tipo || '-'}</td>
                  <td className="p-2">
                    {reporte.fecha_evento
                      ? new Date(reporte.fecha_evento).toLocaleDateString('es-CL')
                      : '-'}
                  </td>
                  <td className="p-2 space-y-1">
                    <div className="space-x-2">
                      <button
                        onClick={() => onEditar?.(reporte)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleEliminar(reporte.id)}
                        className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="mt-1">
                      <Link
                        href={`/admin/dashboard/comentarios/reporte/${reporte.id}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        💬 Ver Comentarios
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🔹 Gráfico por tipo de reporte */}
      <GraficoReportesPorTipo reportes={reportesFiltrados} />
    </div>
  );
}
