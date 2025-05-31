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

  rol?: {
    id: number;
    nombre: string;
  };

  faena?: {
    id: number;
    nombre: string;
  };
}

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

  faena?: { id: number; nombre: string };
  auditor?: { id: number; nombre: string; apellido: string };
}

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
  responsable_id: number;
  empresa_id: number;
  faena_id: number;
  vigente: boolean;
  fecha_emision?: string;
  fecha_vigencia?: string;
  fecha_creacion?: string;
  responsable?: Usuario;
  empresa?: Empresa;
  faena?: Faena;
}

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
