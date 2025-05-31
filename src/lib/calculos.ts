// src/lib/calculos.ts

// Tasa de accidentabilidad = (Nº accidentes con tiempo perdido * 100) / Nº total de trabajadores
export const calcularTasaAccidentabilidad = (accidentesConTiempo: number, totalTrabajadores: number): number => {
  if (totalTrabajadores === 0) return 0;
  return (accidentesConTiempo * 100) / totalTrabajadores;
};

// Índice de frecuencia = (Nº accidentes con tiempo perdido * 1.000.000) / Total horas-hombre trabajadas
export const calcularIndiceFrecuencia = (accidentesConTiempo: number, horasTrabajadas: number): number => {
  if (horasTrabajadas === 0) return 0;
  return (accidentesConTiempo * 1_000_000) / horasTrabajadas;
};

// Índice de gravedad = (Total días perdidos * 1.000) / Total horas-hombre trabajadas
export const calcularIndiceGravedad = (diasPerdidos: number, horasTrabajadas: number): number => {
  if (horasTrabajadas === 0) return 0;
  return (diasPerdidos * 1000) / horasTrabajadas;
};

// Tasa de enfermedades profesionales = (Casos EP * 100.000) / Total trabajadores
export const calcularTasaEP = (casosEP: number, totalTrabajadores: number): number => {
  if (totalTrabajadores === 0) return 0;
  return (casosEP * 100_000) / totalTrabajadores;
};

// Tasa de fatalidad por trabajador = (Nº fatalidades * 100.000) / Nº trabajadores
export const calcularTasaFatalidadPorTrabajador = (fatalidades: number, totalTrabajadores: number): number => {
  if (totalTrabajadores === 0) return 0;
  return (fatalidades * 100_000) / totalTrabajadores;
};

// Tasa de fatalidad por accidente = (Fatalidades * 100) / Nº accidentes con tiempo perdido
export const calcularTasaFatalidadPorAccidente = (fatalidades: number, accidentesConTiempo: number): number => {
  if (accidentesConTiempo === 0) return 0;
  return (fatalidades * 100) / accidentesConTiempo;
};
