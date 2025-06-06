'use client';

import { useEffect, useState } from 'react';
import { obtenerMisReportes } from '@/lib/api';

interface Props {
  refrescar?: boolean;
}

export default function TablaReportesTrabajador({ refrescar }: Props) {
  const [reportes, setReportes] = useState<any[]>([]);
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarReportes = async () => {
      setCargando(true);
      try {
        const data = await obtenerMisReportes();
        if (Array.isArray(data)) {
          setReportes(data);
        } else {
          setError('❌ Error al cargar reportes.');
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

  const reportesFiltrados = reportes.filter((r) => {
    const tipoMatch = filtroTipo === '' || r.tipo?.toLowerCase().includes(filtroTipo.toLowerCase());
    const estadoMatch = filtroEstado === '' || r.estado?.toLowerCase().includes(filtroEstado.toLowerCase());
    return tipoMatch && estadoMatch;
  });

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Mis Reportes</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <input
          type="text"
          placeholder="Filtrar por tipo..."
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border p-2 rounded w-full md:max-w-xs"
        />
        <input
          type="text"
          placeholder="Filtrar por estado..."
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="border p-2 rounded w-full md:max-w-xs"
        />
      </div>

      <div className="overflow-x-auto">
        {cargando ? (
          <p className="text-gray-500 py-4">Cargando reportes...</p>
        ) : error ? (
          <p className="text-red-600 py-4">{error}</p>
        ) : reportesFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No hay reportes disponibles.</p>
        ) : (
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Título</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Faena</th>
                <th className="p-2">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {reportesFiltrados.map((reporte) => (
                <tr key={reporte.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{reporte.titulo}</td>
                  <td className="p-2">{reporte.tipo}</td>
                  <td className="p-2">{reporte.estado}</td>
                  <td className="p-2">{reporte.faena?.nombre || '-'}</td>
                  <td className="p-2">
                    {reporte.fecha_evento
                      ? new Date(reporte.fecha_evento).toLocaleDateString('es-CL')
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
