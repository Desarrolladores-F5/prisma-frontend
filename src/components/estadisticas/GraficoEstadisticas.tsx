'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  datos: {
    accidentes: number;
    enfermedades: number;
    diasPerdidosAT: number;
    diasPerdidosEP: number;
    accidentesFatales: number;
    tasaAccidentabilidad: number;
    tasaFrecuencia: number;
    tasaGravedad: number;
  };
}

export default function GraficoEstadisticas({ datos }: Props) {
  const data = [
    { nombre: "Accidentes", valor: datos.accidentes },
    { nombre: "Enfermedades", valor: datos.enfermedades },
    { nombre: "Días Perd. AT", valor: datos.diasPerdidosAT },
    { nombre: "Días Perd. EP", valor: datos.diasPerdidosEP },
    { nombre: "Fatales", valor: datos.accidentesFatales },
    { nombre: "Accidentabilidad", valor: datos.tasaAccidentabilidad },
    { nombre: "Frecuencia", valor: datos.tasaFrecuencia },
    { nombre: "Gravedad", valor: datos.tasaGravedad },
  ];

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="valor" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
