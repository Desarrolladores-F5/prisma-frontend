// src/lib/validate-role.ts

export function obtenerRolDesdeToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.rol_id;
  } catch {
    return null;
  }
}

export function obtenerNombreDesdeToken(token: string): string | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.nombre || null;
  } catch {
    return null;
  }
}

export function obtenerIdDesdeToken(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.id || null;
  } catch {
    return null;
  }
}
