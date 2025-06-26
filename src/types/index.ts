// --- Auditoría ---
export interface Auditoria {
  id: number;
  fecha: string;
  faena_id: number;
  auditor_id: number;
  tipo: string;
  descripcion?: string;
  observaciones?: string;
  conforme: boolean;
  fecha_creacion: string;
  activo: boolean;

  auditor?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  faena?: {
    id: number;
    nombre: string;
  };
}

// --- Capacitaciones ---
export interface Capacitacion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  asistentes: any[];
  documento_id?: number;
  faena_id: number;
  activo: boolean;
  fecha_creacion: string;
}

export interface CapacitacionConRelaciones {
  id: number;
  titulo: string;
  fecha: string;
  usuario?: {
    nombre: string;
    apellido: string;
  };
  faena?: {
    nombre: string;
  };
  examen?: {
    titulo: string;
  } | null;
}

// --- Comentarios ---
export interface Comentario {
  id: number;
  autor_id: number;
  mensaje: string;
  entidad_tipo: string;
  entidad_id: number;
  fecha: string;
}

// --- Documentos ---
export interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  url: string;
  version?: string;
  fecha_subida: string;
  activo: boolean;
  fecha_creacion: string;
}

// --- Empresa ---
export interface Empresa {
  id: number;
  nombre: string;
  rut: string;
  razon_social?: string;
  direccion?: string;
  telefono?: string;
  correo?: string;
  representante_legal?: string;
  rubro?: string;
  activo: boolean;
  fecha_creacion: string;
}

// --- EPP ---
export interface EPP {
  id: number;
  nombre: string;
  descripcion?: string;
  usuario_id: number;
  faena_id: number;
  estado: string;
  fecha_entrega: string;
  fecha_vencimiento?: string;
  activo: boolean;
  fecha_creacion: string;
}

export interface EPPAsignado {
  id: number;
  tipo: string;
  descripcion?: string;
  fecha_entrega: string;
  fecha_vencimiento: string;
  estado: string;
  faena?: {
    nombre: string;
  };
}

// --- Faena ---
export interface Faena {
  id: number;
  nombre: string;
  descripcion?: string;
  empresa_id: number;
  ubicacion?: string;
  responsable_id?: number;
  estado: string;
  fecha_inicio?: string;
  fecha_termino?: string;
  activo: boolean;
  fecha_creacion: string;
}

// --- Firmas Digitales ---
export interface FirmaDigital {
  id: number;
  usuario_id: number;
  tipo: string;
  hash: string;
  fecha: string;
  metadatos?: any;
  activo: boolean;
  fecha_creacion: string;
}

// --- Historial de Cambios ---
export interface HistorialCambio {
  id: number;
  entidad_tipo: string;
  entidad_id: number;
  accion: string;
  detalles: any;
  usuario_id: number;
  timestamp: string;

  usuario?: {
    id: number;
    nombre: string;
  };
}

// --- Inspecciones ---
export interface Inspeccion {
  id: number;
  fecha: string;
  faena_id: number;
  inspector_id: number;
  tipo: string;
  descripcion?: string;
  observaciones?: string;
  conforme: boolean;
  fecha_creacion: string;
  activo: boolean;
}

// --- Medidas Correctivas ---
export interface MedidaCorrectiva {
  id: number;
  descripcion: string;
  fecha_cumplimiento: string;
  estado: string;
  prioridad: string;
  responsable_id: number;
  documento_evidencia_id?: number;
  fecha_creacion: string;
  activo: boolean;
}

// --- Notificaciones ---
export interface Notificacion {
  id: number;
  mensaje: string;
  tipo: string;
  fecha: string;
  leido: boolean;
  usuario_id: number;
  faena_id?: number;
  origen?: string;

  usuario?: {
    nombre: string;
    apellido: string;
  };
  faena?: {
    nombre: string;
  };
}

// --- Preguntas de Examen ---
export interface Pregunta {
  id: number;
  enunciado: string;
  alternativas: string[];
  respuesta_correcta: string;
  examen_id: number;
}

// --- Protocolos ---
export interface Protocolo {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: string;
  responsable_id: number;
  empresa_id: number;
  faena_id: number;
  fecha_emision?: string;
  fecha_vigencia?: string;
  fecha_creacion: string;
  activo: boolean;
}

export interface ProtocoloExtendido {
  id: number;
  nombre: string;
  descripcion?: string;
  version?: string;
  vigente?: boolean;
  fecha_emision?: string;
  fecha_vigencia?: string;
  fecha_creacion?: string;
  url?: string;

  faena?: {
    id: number;
    nombre: string;
  };
  empresa?: {
    id: number;
    nombre: string;
  };
  responsable?: {
    id: number;
    nombre: string;
    apellido: string;
  };
}

// --- Reportes ---
export interface Reporte {
  id: number;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: string;
  prioridad: string;
  usuario_id: number;
  faena_id: number;
  auditoria_id?: number;
  fecha_evento: string;
  fecha_creacion: string;
  activo: boolean;
}

// --- Usuario ---
export interface Usuario {
  id: number;
  rut: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  fecha_nacimiento: string;
  fecha_contrato: string;
  tipo_contrato: string;
  rol_id: number;
  empresa_id?: number;
  faena_id?: number;
  activo: boolean;
  fecha_creacion: string;
  firma_imagen_url?: string;

  rol?: {
    id: number;
    nombre: string;
  };
  faena?: {
    id: number;
    nombre: string;
  };
}
