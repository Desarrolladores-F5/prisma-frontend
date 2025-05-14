'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerFaenas, obtenerUsuarios, crearCapacitacion, actualizarCapacitacion } from '@/lib/api';

interface Props {
  capacitacion?: any;
  onGuardado?: () => void;
}

export default function FormularioCapacitacion({ capacitacion, onGuardado }: Props) {
  const modoEdicion = !!capacitacion;
  const router = useRouter();

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    fecha: '',
    usuario_id: '',
    faena_id: '',
    asistencia: '',
    documento_id: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [faenas, setFaenas] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const faenas = await obtenerFaenas();
      const usuarios = await obtenerUsuarios();
      setFaenas(faenas);
      setUsuarios(usuarios);
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (modoEdicion) {
      setForm({
        titulo: capacitacion.titulo || '',
        descripcion: capacitacion.descripcion || '',
        fecha: capacitacion.fecha?.substring(0, 10) || '',
        usuario_id: capacitacion.usuario_id || '',
        faena_id: capacitacion.faena_id || '',
        asistencia: capacitacion.asistencia || '',
        documento_id: capacitacion.documento_id || '',
      });
    }
  }, [capacitacion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...form,
      usuario_id: parseInt(form.usuario_id),
      faena_id: parseInt(form.faena_id),
      documento_id: form.documento_id ? parseInt(form.documento_id) : null,
    };

    const res = modoEdicion
      ? await actualizarCapacitacion(capacitacion.id, data)
      : await crearCapacitacion(data);

    if (res?.id) {
      setMensaje(modoEdicion ? '✅ Capacitación actualizada' : '✅ Capacitación creada');
      if (!modoEdicion) {
        setForm({
          titulo: '',
          descripcion: '',
          fecha: '',
          usuario_id: '',
          faena_id: '',
          asistencia: '',
          documento_id: '',
        });
      }
      onGuardado?.();
    } else {
      setMensaje(res?.mensaje || '❌ Error al guardar la capacitación');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow-md">
      <h2 className="md:col-span-2 text-xl font-bold">{modoEdicion ? 'Editar Capacitación' : 'Registrar Capacitación'}</h2>

      {mensaje && <p className="md:col-span-2 text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">{mensaje}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input name="titulo" value={form.titulo} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha</label>
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border p-2 rounded" rows={3} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Usuario</label>
        <select name="usuario_id" value={form.usuario_id} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Seleccione un usuario</option>
          {usuarios.map(u => (
            <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Faena</label>
        <select name="faena_id" value={form.faena_id} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Seleccione una faena</option>
          {faenas.map(f => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Asistencia (JSON)</label>
        <textarea name="asistencia" value={form.asistencia} onChange={handleChange} className="w-full border p-2 rounded" rows={2} />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">ID Documento (opcional)</label>
        <input type="number" name="documento_id" value={form.documento_id} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {modoEdicion ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}
