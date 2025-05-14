'use client';

import { useEffect, useState } from 'react';
import {
  crearProtocolo,
  actualizarProtocolo,
  obtenerEmpresas,
  obtenerFaenas,
  obtenerUsuarios
} from '@/lib/api';

export interface Protocolo {
  id?: number;
  nombre: string;
  descripcion?: string;
  version?: string;
  responsable_id: number;
  empresa_id: number;
  faena_id: number;
  vigente: boolean;
  fecha_emision?: string;
  fecha_vigencia?: string;
  activo: boolean; // ✅ Agregado aquí
}

interface Props {
  protocolo?: Protocolo;
  onGuardado: () => void;
}

export default function FormularioProtocolo({ protocolo, onGuardado }: Props) {
  const [formulario, setFormulario] = useState<Protocolo>({
    nombre: '',
    descripcion: '',
    version: '',
    responsable_id: 0,
    empresa_id: 0,
    faena_id: 0,
    vigente: true,
    fecha_emision: '',
    fecha_vigencia: '',
    activo: true, // ✅ Inicialización
  });

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [faenas, setFaenas] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (protocolo) setFormulario(protocolo);
    cargarDatosRelacionados();
  }, [protocolo]);

  const cargarDatosRelacionados = async () => {
    const [usuariosData, empresasData, faenasData] = await Promise.all([
      obtenerUsuarios(),
      obtenerEmpresas(),
      obtenerFaenas(),
    ]);
    setUsuarios(usuariosData);
    setEmpresas(empresasData);
    setFaenas(faenasData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({
      ...prev,
      [name]: name === 'vigente' || name === 'activo' ? value === 'true' : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (protocolo?.id) {
        await actualizarProtocolo(protocolo.id, formulario);
        setMensaje('✅ Protocolo actualizado correctamente');
      } else {
        await crearProtocolo(formulario); // ✅ asegúrate que "activo" se incluya aquí
        setMensaje('✅ Protocolo creado correctamente');
        setFormulario({
          nombre: '', descripcion: '', version: '', responsable_id: 0, empresa_id: 0,
          faena_id: 0, vigente: true, fecha_emision: '', fecha_vigencia: '', activo: true
        });
      }
      onGuardado();
    } catch (error) {
      console.error('❌ Error al guardar protocolo:', error);
      setMensaje('❌ Error al guardar protocolo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mensaje && <p className="md:col-span-2 text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">{mensaje}</p>}

      <div className="md:col-span-2">
        <label className="block font-medium mb-1">Nombre</label>
        <input name="nombre" value={formulario.nombre} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div className="md:col-span-2">
        <label className="block font-medium mb-1">Descripción</label>
        <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block font-medium mb-1">Versión</label>
        <input name="version" value={formulario.version} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block font-medium mb-1">Responsable</label>
        <select name="responsable_id" value={formulario.responsable_id} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Seleccione</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Empresa</label>
        <select name="empresa_id" value={formulario.empresa_id} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Seleccione</option>
          {empresas.map(e => <option key={e.id} value={e.id}>{e.nombre}</option>)}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Faena</label>
        <select name="faena_id" value={formulario.faena_id} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Seleccione</option>
          {faenas.map(f => <option key={f.id} value={f.id}>{f.nombre}</option>)}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Vigente</label>
        <select name="vigente" value={String(formulario.vigente)} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Activo</label>
        <select name="activo" value={String(formulario.activo)} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="true">Sí</option>
          <option value="false">No</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Fecha de Emisión</label>
        <input type="date" name="fecha_emision" value={formulario.fecha_emision || ''} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block font-medium mb-1">Fecha de Vigencia</label>
        <input type="date" name="fecha_vigencia" value={formulario.fecha_vigencia || ''} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {protocolo ? 'Actualizar' : 'Registrar'} Protocolo
        </button>
      </div>
    </form>
  );
}
