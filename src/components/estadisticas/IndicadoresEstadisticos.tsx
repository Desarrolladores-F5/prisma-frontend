'use client';

import {
  calcularTasaAccidentabilidad,
  calcularIndiceFrecuencia,
  calcularIndiceGravedad,
  calcularTasaEP,
  calcularTasaFatalidadPorTrabajador,
  calcularTasaFatalidadPorAccidente,
} from '@/lib/calculos';

import { Activity, AlertTriangle, BriefcaseMedical, HeartPulse, Skull, ShieldAlert } from 'lucide-react';

export interface DatosIndicadoresProps {
  accidentes: number;
  trabajadores: number;
  horasHombre: number;
  diasPerdidosAT: number;
  diasPerdidosEP: number; 
  enfermedades: number;
  accidentesFatales: number;
}

interface Props {
  datos: DatosIndicadoresProps;
}

export default function IndicadoresEstadisticos({ datos }: Props) {
  const tasaAcc = calcularTasaAccidentabilidad(datos.accidentes, datos.trabajadores);
  const indiceFrecuencia = calcularIndiceFrecuencia(datos.accidentes, datos.horasHombre);
  const indiceGravedad = calcularIndiceGravedad(
    datos.diasPerdidosAT + datos.diasPerdidosEP, 
    datos.horasHombre
  );
  const tasaEP = calcularTasaEP(datos.enfermedades, datos.trabajadores);
  const tasaFatalidad = calcularTasaFatalidadPorTrabajador(datos.accidentesFatales, datos.trabajadores);
  const tasaFatalidadAccidentes = calcularTasaFatalidadPorAccidente(datos.accidentesFatales, datos.accidentes);

  const indicadores = [
    { titulo: 'Tasa de Accidentabilidad', valor: `${tasaAcc.toFixed(2)}%`, icono: <Activity size={32} /> },
    { titulo: 'Índice de Frecuencia', valor: indiceFrecuencia.toFixed(2), icono: <AlertTriangle size={32} /> },
    { titulo: 'Índice de Gravedad', valor: indiceGravedad.toFixed(2), icono: <BriefcaseMedical size={32} /> },
    { titulo: 'Tasa de Enfermedades Profesionales', valor: `${tasaEP.toFixed(2)}%`, icono: <HeartPulse size={32} /> },
    { titulo: 'Tasa de Fatalidad (trabajadores)', valor: `${tasaFatalidad.toFixed(2)}%`, icono: <Skull size={32} /> },
    { titulo: 'Tasa de Fatalidad (accidentes)', valor: `${tasaFatalidadAccidentes.toFixed(2)}%`, icono: <ShieldAlert size={32} /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {indicadores.map((i, index) => (
        <div key={index} className="bg-white shadow-md rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2 text-blue-600">{i.icono}</div>
          <h3 className="text-lg font-semibold mb-1">{i.titulo}</h3>
          <p className="text-2xl font-bold text-blue-800">{i.valor}</p>
        </div>
      ))}
    </div>
  );
}
