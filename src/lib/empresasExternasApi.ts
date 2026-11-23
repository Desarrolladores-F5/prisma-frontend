export type PerfilEmpresaExterna = 'administrador_externo' | 'trabajador';

export interface EmpresaExternaVinculada {
  empresaId: number;
  nombre: string;
  perfil: PerfilEmpresaExterna;
}

export interface ResultadoMisEmpresasExternas {
  empresas: EmpresaExternaVinculada[];
}

export interface SolicitudDocumentalExterna {
  id: number;
  contratoId: number;
  nombre: string;
  empresaId: number;
  mandante: string;
  acreditacionId: number | null;
  estado: string;
  observaciones: string | null;
  fechaPresentacion: string | null;
  fechaRevision: string | null;
}

export interface ResultadoMisSolicitudesDocumentalesExternas {
  solicitudes: SolicitudDocumentalExterna[];
}

function obtenerUrlApi(): string {
  const url = process.env.NEXT_PUBLIC_API_URL;

  if (!url) {
    throw new Error('La URL del backend de PRISMA no está configurada.');
  }

  return url.replace(/\/+$/, '');
}

function obtenerToken(): string {
  if (typeof window === 'undefined') {
    throw new Error('Esta operación requiere una sesión del navegador.');
  }

  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Debes iniciar sesión para acceder al portal.');
  }

  return token;
}

async function verificarRespuesta(respuesta: Response, mensajeError: string) {
  if (respuesta.status === 401) {
    throw new Error('Tu sesión no es válida o expiró. Vuelve a iniciar sesión.');
  }

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => null);

    throw new Error(
      typeof error?.mensaje === 'string'
        ? error.mensaje
        : `${mensajeError} (${respuesta.status}).`
    );
  }
}

async function consultarPortal<T>(
  ruta: string,
  campo: 'empresas' | 'solicitudes',
  mensajeError: string,
  signal?: AbortSignal
): Promise<T> {
  const respuesta = await fetch(`${obtenerUrlApi()}${ruta}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${obtenerToken()}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
    signal,
  });

  await verificarRespuesta(respuesta, mensajeError);
  const datos: unknown = await respuesta.json();

  if (
    typeof datos !== 'object' ||
    datos === null ||
    !Array.isArray((datos as Record<string, unknown>)[campo])
  ) {
    throw new Error('La respuesta del servidor no tiene el formato esperado.');
  }

  return datos as T;
}

export const obtenerMisEmpresasExternas = (signal?: AbortSignal) =>
  consultarPortal<ResultadoMisEmpresasExternas>(
    '/api/empresas-externas/mis-empresas',
    'empresas',
    'No fue posible consultar tus empresas',
    signal
  );

export const obtenerMisSolicitudesDocumentalesExternas = (signal?: AbortSignal) =>
  consultarPortal<ResultadoMisSolicitudesDocumentalesExternas>(
    '/api/contratos-externos/mis-requisitos',
    'solicitudes',
    'No fue posible consultar tus solicitudes',
    signal
  );

export async function obtenerTotalEntregasPorResolver(
  signal?: AbortSignal
): Promise<number> {
  const respuesta = await fetch(
    obtenerUrlApi() + '/api/contratos-externos/entregas-por-resolver',
    {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + obtenerToken(),
        Accept: 'application/json',
      },
      cache: 'no-store',
      signal,
    }
  );

  await verificarRespuesta(respuesta, 'No fue posible consultar las entregas por resolver');

  const datos: unknown = await respuesta.json();
  const total = typeof datos === 'object' && datos !== null && 'total' in datos
    ? datos.total
    : undefined;

  if (typeof total !== 'number' || !Number.isSafeInteger(total) || total < 0) {
    throw new Error('El servidor devolvió un total de entregas inválido.');
  }

  return total;
}

export async function subirPdfSolicitudExterna(
  contratoId: number,
  requisitoId: number,
  archivo: File
): Promise<void> {
  if (!Number.isSafeInteger(contratoId) || contratoId <= 0 ||
      !Number.isSafeInteger(requisitoId) || requisitoId <= 0) {
    throw new Error('Contrato o solicitud inválidos.');
  }

  const formulario = new FormData();
  formulario.append('archivo', archivo);

  const respuesta = await fetch(
    `${obtenerUrlApi()}/api/contratos-externos/${contratoId}/requisitos/${requisitoId}/archivo`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${obtenerToken()}`,
        Accept: 'application/json',
      },
      body: formulario,
    }
  );

  await verificarRespuesta(respuesta, 'No fue posible confirmar la entrega del PDF');

  if (respuesta.status !== 201) {
    throw new Error('No se confirmó la entrega. Actualiza la bandeja antes de volver a intentar.');
  }
}
