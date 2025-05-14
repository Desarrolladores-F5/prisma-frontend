'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface Props {
  reportes: { tipo: string }[];
}

export default function GraficoReportesPorTipo({ reportes }: Props) {
  const [datos, setDatos] = useState<{ tipo: string; total: number }[]>([]);

  useEffect(() => {
    const conteo: Record<string, number> = {};
    reportes.forEach((r) => {
      if (r.tipo) {
        conteo[r.tipo] = (conteo[r.tipo] || 0) + 1;
      }
    });

    const datosProcesados = Object.entries(conteo).map(([tipo, total]) => ({
      tipo,
      total,
    }));

    setDatos(datosProcesados);
  }, [reportes]);

  if (datos.length === 0) return null;

  return (
    <div className="mt-10">
      <h3 className="text-lg font-semibold mb-2">Gráfico por Tipo de Reporte</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="tipo" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
