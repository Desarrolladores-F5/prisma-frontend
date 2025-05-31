"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface EstadisticaMensual {
  descripcion: string; // Debe tener un valor como "Mayo 2025"
  datos: {
    tasaAccidentabilidad: number;
    tasaFrecuencia: number;
    tasaGravedad: number;
  };
}

interface Props {
  estadisticas: EstadisticaMensual[];
}

export default function GraficoComparativoMensual({ estadisticas }: Props) {
  // ✅ Preparar datos del gráfico, asegurando que haya descripción válida
  const data = estadisticas.map((e, index) => ({
    periodo: e.descripcion?.trim() || `Periodo ${index + 1}`,
    Accidentabilidad: e.datos?.tasaAccidentabilidad || 0,
    Frecuencia: e.datos?.tasaFrecuencia || 0,
    Gravedad: e.datos?.tasaGravedad || 0,
  }));

  return (
    <div className="mt-10">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="periodo" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Accidentabilidad" fill="#8884d8" />
          <Bar dataKey="Frecuencia" fill="#82ca9d" />
          <Bar dataKey="Gravedad" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
