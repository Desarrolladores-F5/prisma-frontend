'use client';

import { useState, useEffect } from 'react';
import { crearFormulario, actualizarFormulario, obtenerUsuarios } from '@/lib/api';

export interface FormularioData {
  id?: number;
  nombre: string;
  tipo: string;
  estructura_json: string; // Se puede ingresar como string en JSON.stringify
  creador_id: number;
}

interface Props {
  formulario?: FormularioData;
  onGuardado: () => void;
}

export default function FormularioFormulario({ formulario, onGuardado }: Props) {
  const [formData, setFormData] = useState<FormularioData>({
    nombre: '',
    tipo: '',
    estructura_json: '',
    creador_id: 0,
  });
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (formulario) setFormData(formulario);
    const cargar = async () => {
      try {
        setUsuarios(await obtenerUsuarios());
      } catch (error) {
        console.error('❌ Error al cargar usuarios:', error);
      }
    };
    cargar();
  }, [formulario]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formulario?.id) {
        await actualizarFormulario(formulario.id, formData);
        setMensaje('✅ Formulario actualizado correctamente');
      } else {
        await crearFormulario(formData);
        setMensaje('✅ Formulario creado correctamente');
        setFormData({ nombre: '', tipo: '', estructura_json: '', creador_id: 0 });
      }
      onGuardado();
    } catch (error) {
      console.error('❌ Error al guardar formulario:', error);
      setMensaje('❌ Error al guardar formulario');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mensaje && (
        <p className="md:col-span-2 text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">
          {mensaje}
        </p>
      )}

      <div className="md:col-span-2">
        <label className="block font-medium mb-1">Nombre</label>
        <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block font-medium mb-1">Tipo</label>
        <input name="tipo" value={formData.tipo} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block font-medium mb-1">Creador</label>
        <select name="creador_id" value={formData.creador_id} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Seleccionar</option>
          {usuarios.map(u => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block font-medium mb-1">Estructura JSON</label>
        <textarea name="estructura_json" value={formData.estructura_json} onChange={handleChange} required className="w-full border p-2 rounded h-32 font-mono" />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {formulario ? 'Actualizar' : 'Crear'} Formulario
        </button>
      </div>
    </form>
  );
}
