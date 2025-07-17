// src/lib/api.ts
import type { Documento } from '@/types';
import type { Notificacion } from '@/types';


const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null);

async function handleFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody?.mensaje || `Error ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error(`❌ Error al hacer fetch a ${url}:`, error.message);
    throw error;
  }
}

// --- USUARIOS ---
export const obtenerUsuarios = () => handleFetch<any[]>(`${API_BASE}/usuarios`);

export const crearUsuario = async (data: any): Promise<any> => {
  const token = getToken();

  const formData = new FormData();
  for (const key in data) {
    if (data[key] !== null && data[key] !== undefined) {
      formData.append(key, data[key]);
    }
  }

  try {
    const res = await fetch(`${API_BASE}/usuarios`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody?.mensaje || `Error ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error(`❌ Error al crear usuario con firma:`, error.message);
    throw error;
  }
};

export const actualizarUsuario = (id: number, data: any) =>
  handleFetch<any>(`${API_BASE}/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const eliminarUsuario = (id: number) =>
  handleFetch<any>(`${API_BASE}/usuarios/${id}`, { method: 'DELETE' });

export const obtenerUsuariosPorFaena = (faenaId: number) =>
  handleFetch<any[]>(`${API_BASE}/usuarios/faena/${faenaId}`);

// --- ROLES ---
export const obtenerRoles = () => handleFetch<any[]>(`${API_BASE}/roles`);

// --- REPORTES ---
export const obtenerReportes = () => handleFetch<any[]>(`${API_BASE}/reportes`);
export const crearReporte = (data: any) => handleFetch<any>(`${API_BASE}/reportes`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarReporte = (id: number, data: any) => handleFetch<any>(`${API_BASE}/reportes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarReporte = (id: number) => handleFetch<any>(`${API_BASE}/reportes/${id}`, { method: 'DELETE' });
export const obtenerMisReportes = () =>
  handleFetch<any[]>(`${API_BASE}/reportes/mis-reportes`);

// --- FAENAS ---
export const obtenerFaenas = () => handleFetch<any[]>(`${API_BASE}/faenas`);
export const crearFaena = (data: any) => handleFetch<any>(`${API_BASE}/faenas`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarFaena = (id: number, data: any) => handleFetch<any>(`${API_BASE}/faenas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarFaena = (id: number) => handleFetch<any>(`${API_BASE}/faenas/${id}`, { method: 'DELETE' });

// --- AUDITORÍAS ---
export const obtenerAuditorias = () => handleFetch<any[]>(`${API_BASE}/auditorias`);
export const crearAuditoria = (data: any) => handleFetch<any>(`${API_BASE}/auditorias`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarAuditoria = (id: number, data: any) => handleFetch<any>(`${API_BASE}/auditorias/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarAuditoria = (id: number) => handleFetch<any>(`${API_BASE}/auditorias/${id}`, { method: 'DELETE' });

// --- EMPRESAS ---
export const obtenerEmpresas = () => handleFetch<any[]>(`${API_BASE}/empresas`);
export const crearEmpresa = (data: any) => handleFetch<any>(`${API_BASE}/empresas`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarEmpresa = (id: number, data: any) => handleFetch<any>(`${API_BASE}/empresas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarEmpresa = (id: number) => handleFetch<any>(`${API_BASE}/empresas/${id}`, { method: 'DELETE' });

// --- CAPACITACIONES ---
export const obtenerCapacitaciones = () => handleFetch<any[]>(`${API_BASE}/capacitaciones`);
export const crearCapacitacion = (data: any) => handleFetch<any>(`${API_BASE}/capacitaciones`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarCapacitacion = (id: number, data: any) => handleFetch<any>(`${API_BASE}/capacitaciones/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarCapacitacion = (id: number) => handleFetch<any>(`${API_BASE}/capacitaciones/${id}`, { method: 'DELETE' });

// ✅ CAPACITACIONES DISPONIBLES PARA TRABAJADOR
export const obtenerCapacitacionesDisponibles = () =>
  handleFetch<any[]>(`${API_BASE}/capacitaciones/disponibles`);

// ✅ Obtener resumen de respuestas por capacitación (nuevo)
export const obtenerCapacitacionRespuestas = (id: number) =>
  handleFetch<any[]>(`${API_BASE}/capacitaciones/${id}/respuestas`);

// --- EXÁMENES DE CAPACITACIÓN ---
export const obtenerPreguntasCapacitacion = (id: number) =>
  handleFetch<any[]>(`${API_BASE}/capacitaciones/${id}/preguntas`);

export const enviarRespuestasExamen = (capacitacionId: number, respuestas: any) =>
  handleFetch<any>(`${API_BASE}/capacitaciones/${capacitacionId}/responder`, {
    method: 'POST',
    body: JSON.stringify({ respuestas }),
  });

// --- PREGUNTAS DE EXAMEN ---
export const obtenerPreguntasExamen = (examenId: string) =>
  handleFetch<any[]>(`${API_BASE}/preguntas-examen/${examenId}`);

export const crearPreguntaExamen = (data: any) =>
  handleFetch<any>(`${API_BASE}/preguntas-examen`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const actualizarPreguntaExamen = (id: number, data: any) =>
  handleFetch<any>(`${API_BASE}/preguntas-examen/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const eliminarPreguntaExamen = (id: number) =>
  handleFetch<any>(`${API_BASE}/preguntas-examen/${id}`, {
    method: 'DELETE',
  });

  export const obtenerExamenPorId = (id: string | number) =>
  handleFetch<any>(`${API_BASE}/examenes/${id}`);

// --- EPP ---
export const obtenerEPP = () => handleFetch<any[]>(`${API_BASE}/epp`);
export const crearEPP = (data: any) => handleFetch<any>(`${API_BASE}/epp`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarEPP = (id: number, data: any) => handleFetch<any>(`${API_BASE}/epp/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarEPP = (id: number) => handleFetch<any>(`${API_BASE}/epp/${id}`, { method: 'DELETE' });

// --- EPP asignados por trabajador autenticado ---
export const obtenerEppAsignados = () =>
  handleFetch<any[]>(`${API_BASE}/epp/mis-epp`);


// --- DOCUMENTOS ---
export const obtenerDocumentos = () => handleFetch<any[]>(`${API_BASE}/documentos`);
export const crearDocumento = (data: any) => handleFetch<any>(`${API_BASE}/documentos`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarDocumento = (id: number, data: any) => handleFetch<any>(`${API_BASE}/documentos/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarDocumento = (id: number) => handleFetch<any>(`${API_BASE}/documentos/${id}`, { method: 'DELETE' });

export async function obtenerMisDocumentos() {
  return await handleFetch<Documento[]>(`${API_BASE}/documentos/mis-documentos`);
}

export const confirmarRecepcionDocumento = (documentoId: number) =>
  handleFetch(`${API_BASE}/documentos/recepcionar/${documentoId}`, {
    method: 'PUT',
  });

// --- RELACIÓN DOCUMENTO - USUARIO ---
export const asignarDocumentoAUsuario = (data: {
  documento_id: number;
  asignacion_tipo: 'usuarios' | 'rol' | 'todos';
  usuario_ids?: number[];
  rol_id?: number;
}) =>
  handleFetch<any>(`${API_BASE}/rel-documentos-usuarios`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// --- Obtener documento por ID ---
export const obtenerDocumentoPorId = (id: number) =>
  handleFetch<any>(`${API_BASE}/documentos/${id}`);

// --- NOTIFICACIONES ---
export const obtenerNotificaciones = () => handleFetch<any[]>(`${API_BASE}/notificaciones`);
export const crearNotificacion = (data: any) => handleFetch<any>(`${API_BASE}/notificaciones`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarNotificacion = (id: number, data: any) => handleFetch<any>(`${API_BASE}/notificaciones/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarNotificacion = (id: number) => handleFetch<any>(`${API_BASE}/notificaciones/${id}`, { method: 'DELETE' });

export async function obtenerMisNotificaciones() {
  return await handleFetch<Notificacion[]>(`${API_BASE}/notificaciones/mis-notificaciones`);
}

export const marcarNotificacionComoLeida = async (id: number) => {
  return await handleFetch<any>(`${API_BASE}/notificaciones/${id}/leido`, {
    method: 'PUT',
  });
};

// --- MEDIDAS CORRECTIVAS ---
export const obtenerMedidas = () => handleFetch<any[]>(`${API_BASE}/medidas`);
export const crearMedida = (data: any) => handleFetch<any>(`${API_BASE}/medidas`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarMedida = (id: number, data: any) => handleFetch<any>(`${API_BASE}/medidas/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarMedida = (id: number) => handleFetch<any>(`${API_BASE}/medidas/${id}`, { method: 'DELETE' });

// --- INSPECCIONES ---
export const obtenerInspecciones = () => handleFetch<any[]>(`${API_BASE}/inspecciones`);
export const crearInspeccion = (data: any) => handleFetch<any>(`${API_BASE}/inspecciones`, { method: 'POST', body: JSON.stringify(data) });
export const actualizarInspeccion = (id: number, data: any) => handleFetch<any>(`${API_BASE}/inspecciones/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const eliminarInspeccion = (id: number) => handleFetch<any>(`${API_BASE}/inspecciones/${id}`, { method: 'DELETE' });




// --- FIRMAS DIGITALES ---
export const obtenerFirmas = () => handleFetch<any[]>(`${API_BASE}/firmas`);
export const crearFirma = (data: any) => handleFetch<any>(`${API_BASE}/firmas`, { method: 'POST', body: JSON.stringify(data) });
export const eliminarFirma = (id: number) => handleFetch<any>(`${API_BASE}/firmas/${id}`, { method: 'DELETE' });


// --- FORMULARIOS ---
export const obtenerFormularios = () => handleFetch<any[]>(`${API_BASE}/formularios`);

export const obtenerFormularioPorId = (id: number) =>
  handleFetch<any>(`${API_BASE}/formularios/${id}`);

export const crearFormulario = (data: any) =>
  handleFetch<any>(`${API_BASE}/formularios`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const actualizarFormulario = (id: number, data: any) =>
  handleFetch<any>(`${API_BASE}/formularios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const eliminarFormulario = (id: number) =>
  handleFetch<any>(`${API_BASE}/formularios/${id}`, {
    method: 'DELETE',
  });

// --- RESPUESTAS DE FORMULARIO ---
export const enviarRespuestaFormulario = (data: any) =>
  handleFetch<any>(`${API_BASE}/respuestas-formulario`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const obtenerRespuestaPorId = (id: number) =>
  handleFetch<any>(`${API_BASE}/respuestas-formulario/${id}`);

export const obtenerMisRespuestasFormulario = () =>
  handleFetch<any[]>(`${API_BASE}/respuestas-formulario/mis-respuestas`);

// --- RESPUESTAS DE FORMULARIO: Descargar PDF ---
export const descargarPDFRespuestaFormulario = async (id: number) => {
  const token = getToken();
  const url = `${API_BASE}/respuestas-formulario/pdf/${id}`;

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody?.mensaje || `Error ${res.status}`);
    }

    // ✅ Convertir respuesta a blob (PDF)
    const blob = await res.blob();
    const urlBlob = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlBlob;
    link.setAttribute('download', `respuesta_formulario_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error: any) {
    console.error(`❌ Error al descargar PDF de respuesta:`, error.message);
    throw error;
  }
};

// --- TESTIGOS ---
export const obtenerTestigos = () => handleFetch<any[]>(`${API_BASE}/testigos`);
export const crearTestigo = (data: any) =>
  handleFetch<any>(`${API_BASE}/testigos`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const actualizarTestigo = (id: number, data: any) =>
  handleFetch<any>(`${API_BASE}/testigos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const eliminarTestigo = (id: number) =>
  handleFetch<any>(`${API_BASE}/testigos/${id}`, {
    method: 'DELETE',
  });

// --- ESTADÍSTICAS ---
export const obtenerEstadisticas = () => handleFetch<any[]>(`${API_BASE}/estadisticas`);
export const crearEstadistica = (data: any) =>
  handleFetch<any>(`${API_BASE}/estadisticas`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
export const actualizarEstadistica = (id: number, data: any) =>
  handleFetch<any>(`${API_BASE}/estadisticas/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
export const eliminarEstadistica = (id: number) =>
  handleFetch<any>(`${API_BASE}/estadisticas/${id}`, {
    method: 'DELETE',
  });

export async function obtenerTotalUsuarios(): Promise<number> {
  const data = await handleFetch<{ total: number }>(`${API_BASE}/usuarios/conteo/total`);
  return data.total;
}

// --- HISTORIAL DE CAMBIOS ---
export const obtenerHistorialCambios = () =>
  handleFetch<any[]>(`${API_BASE}/historial-cambios`);

export const crearHistorialCambio = (data: any) =>
  handleFetch<any>(`${API_BASE}/historial-cambios`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// --- COMENTARIOS ---
export const obtenerComentarios = () =>
  handleFetch<any[]>(`${API_BASE}/comentarios`);

export const obtenerComentariosPorEntidad = (
  entidadTipo: string,
  entidadId: number
) =>
  handleFetch<any[]>(
    `${API_BASE}/comentarios?entidadTipo=${entidadTipo}&entidadId=${entidadId}`
  );

export const crearComentario = (data: any) =>
  handleFetch<any>(`${API_BASE}/comentarios`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

// --- EXÁMENES ---
export const obtenerExamenes = () =>
  handleFetch<any[]>(`${API_BASE}/examenes`);

export const crearExamen = (data: any) =>
  handleFetch<any>(`${API_BASE}/examenes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const actualizarExamen = (id: number, data: any) =>
  handleFetch<any>(`${API_BASE}/examenes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const eliminarExamen = (id: number) =>
  handleFetch<any>(`${API_BASE}/examenes/${id}`, {
    method: 'DELETE',
  });

// --- RESULTADO DE EXAMEN ---
export const obtenerResultadoExamen = (capacitacionId: number) =>
  handleFetch<any>(`${API_BASE}/capacitaciones/${capacitacionId}/resultado`);

  // --- TOTALES (Estadísticas) ---
export async function obtenerTotalReportesActivos(): Promise<number> {
  const reportes = await obtenerReportes();
  return reportes.filter((r: any) => r.activo).length;
}

export async function obtenerTotalAuditorias(): Promise<number> {
  const auditorias = await obtenerAuditorias();
  return Array.isArray(auditorias) ? auditorias.length : 0;
}

export async function obtenerTotalCapacitaciones(): Promise<number> {
  const capacitaciones = await obtenerCapacitaciones();
  return capacitaciones.filter((c: any) => c.activo !== false).length;
}

export async function obtenerTotalDocumentos(): Promise<number> {
  const documentos = await obtenerDocumentos();
  return documentos.filter((d: any) => d.activo !== false).length;
}

export async function obtenerTotalMedidasCorrectivas(): Promise<number> {
  const medidas = await obtenerMedidas();
  return medidas.filter((m: any) => m.activo !== false).length;
}

export async function obtenerTotalInspecciones(): Promise<number> {
  const inspecciones = await obtenerInspecciones();
  return inspecciones.filter((i: any) => i.activo !== false).length;
}


export async function obtenerTotalNotificaciones(): Promise<number> {
  const notificaciones = await obtenerNotificaciones();
  return notificaciones.filter((n: any) => n.activo !== false).length;
}

export async function obtenerTotalEPP(): Promise<number> {
  const epp = await obtenerEPP();
  return Array.isArray(epp) ? epp.length : 0;
}

export async function obtenerTotalFormularios(): Promise<number> {
  const formularios = await obtenerFormularios();
  return Array.isArray(formularios) ? formularios.length : 0;
}

export async function obtenerTotalExamenes(): Promise<number> {
  const examenes = await obtenerExamenes();
  return Array.isArray(examenes) ? examenes.length : 0;
}

export async function obtenerTotalEstadisticas(): Promise<number> {
  const estadisticas = await obtenerEstadisticas();
  return Array.isArray(estadisticas) ? estadisticas.length : 0;
}
