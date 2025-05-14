'use client';

import { useState, useEffect } from 'react';
import { crearEmpresa, actualizarEmpresa } from '@/lib/api';

interface Props {
  empresa?: any;
  onGuardado?: () => void;
}

export default function FormularioEmpresa({ empresa, onGuardado }: Props) {
  const modoEdicion = !!empresa;

  const [form, setForm] = useState({
    nombre: '',
    rut: '',
    razon_social: '',
    direccion: '',
    telefono: '',
    correo: '',
    representante_legal: '',
    rubro: '',
  });

  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (modoEdicion) {
      setForm({
        nombre: empresa.nombre || '',
        rut: empresa.rut || '',
        razon_social: empresa.razon_social || '',
        direccion: empresa.direccion || '',
        telefono: empresa.telefono || '',
        correo: empresa.correo || '',
        representante_legal: empresa.representante_legal || '',
        rubro: empresa.rubro || '',
      });
    }
  }, [empresa]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = modoEdicion
      ? await actualizarEmpresa(empresa.id, form)
      : await crearEmpresa(form);

    if (res?.id) {
      setMensaje(modoEdicion ? '✅ Empresa actualizada correctamente' : '✅ Empresa creada correctamente');
      if (!modoEdicion) {
        setForm({
          nombre: '',
          rut: '',
          razon_social: '',
          direccion: '',
          telefono: '',
          correo: '',
          representante_legal: '',
          rubro: '',
        });
      }
      onGuardado?.();
    } else {
      setMensaje(res?.mensaje || '❌ Error al guardar empresa');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-6 space-y-4">
      <h2 className="text-xl font-bold">{modoEdicion ? 'Editar Empresa' : 'Registrar Empresa'}</h2>

      {mensaje && <p className="text-sm text-blue-600">{mensaje}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">RUT</label>
          <input type="text" name="rut" value={form.rut} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Razón Social</label>
          <input type="text" name="razon_social" value={form.razon_social} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Dirección</label>
          <input type="text" name="direccion" value={form.direccion} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input type="email" name="correo" value={form.correo} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Representante Legal</label>
          <input type="text" name="representante_legal" value={form.representante_legal} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rubro</label>
          <input type="text" name="rubro" value={form.rubro} onChange={handleChange} className="border p-2 rounded w-full" />
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        {modoEdicion ? 'Actualizar' : 'Registrar'}
      </button>
    </form>
  );
}
