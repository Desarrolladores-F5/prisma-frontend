'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  LabelList,
  Cell,
} from 'recharts';

interface Props {
  reportes: { tipo: string }[];
}

// 🎨 Tipos de reporte predefinidos y sus colores
const tiposPredefinidos: { tipo: string; color: string }[] = [
  { tipo: 'Incidente', color: '#3b82f6' },
  { tipo: 'Accidente', color: '#ef4444' },
  { tipo: 'Observación', color: '#f59e0b' },
  { tipo: 'Denuncia Ley Karin', color: '#10b981' },
];

export default function GraficoReportesPorTipo({ reportes }: Props) {
  const [datos, setDatos] = useState<{ tipo: string; total: number; color: string }[]>([]);

  useEffect(() => {
    // Paso 1: Inicializar conteo con todos en 0
    const conteo: Record<string, number> = {};
    tiposPredefinidos.forEach(({ tipo }) => {
      conteo[tipo] = 0;
    });

    // Paso 2: Sumar datos reales
    reportes.forEach((r) => {
      if (r.tipo && conteo.hasOwnProperty(r.tipo)) {
        conteo[r.tipo]++;
      }
    });

    // Paso 3: Formatear para el gráfico
    const datosProcesados = tiposPredefinidos.map(({ tipo, color }) => ({
      tipo,
      total: conteo[tipo],
      color,
    }));

    setDatos(datosProcesados);
  }, [reportes]);

  if (datos.length === 0) return null;

  return (
    <div className="mt-10 bg-white shadow rounded p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">📊 Reportes por Tipo</h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={datos} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tipo" tick={{ fontSize: 12 }} label={{ value: 'Tipo de Reporte', position: 'insideBottom', offset: -20 }} />
          <YAxis tick={{ fontSize: 12 }} label={{ value: 'Cantidad', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            contentStyle={{ fontSize: '14px' }}
            formatter={(value: number) => [`${value} reportes`, 'Total']}
          />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            <LabelList dataKey="total" position="top" fontSize={12} />
            {datos.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
