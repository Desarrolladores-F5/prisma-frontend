import { crearHistorialCambio } from './api';

interface HistorialCambioPayload {
  usuario_id: number;
  entidad: string;
  entidad_id: number;
  accion: string;
  detalles: any;
}

export async function registrarCambioHistorial({
  usuario_id,
  entidad,
  entidad_id,
  accion,
  detalles,
}: HistorialCambioPayload) {
  try {
    await crearHistorialCambio({
      usuario_id,
      entidad_tipo: entidad, 
      entidad_id,
      accion,
      detalles,
    });
  } catch (error) {
    console.error('❌ Error al registrar historial:', error);
  }
}
