'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerFaenas, obtenerUsuarios, crearEPP, actualizarEPP } from '@/lib/api';

interface Props {
  epp?: any;
  onGuardado?: () => void;
}

export default function FormularioEPP({ epp, onGuardado }: Props) {
  const modoEdicion = !!epp;
  const router = useRouter();

  const [form, setForm] = useState({
    usuario_id: '',
    tipo: '',
    descripcion: '',
    faena_id: '',
    fecha_entrega: '',
    fecha_vencimiento: '',
    estado: '',
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
        usuario_id: epp.usuario_id || '',
        tipo: epp.tipo || '',
        descripcion: epp.descripcion || '',
        faena_id: epp.faena_id || '',
        fecha_entrega: epp.fecha_entrega?.substring(0, 10) || '',
        fecha_vencimiento: epp.fecha_vencimiento?.substring(0, 10) || '',
        estado: epp.estado || '',
        documento_id: epp.documento_id || '',
      });
    }
  }, [epp]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...form,
      usuario_id: parseInt(form.usuario_id),
      faena_id: form.faena_id ? parseInt(form.faena_id) : null,
      documento_id: form.documento_id ? parseInt(form.documento_id) : null,
    };

    const res = modoEdicion
      ? await actualizarEPP(epp.id, data)
      : await crearEPP(data);

    if (res?.id) {
      setMensaje(modoEdicion ? '✅ EPP actualizado' : '✅ EPP creado');
      if (!modoEdicion) {
        setForm({
          usuario_id: '',
          tipo: '',
          descripcion: '',
          faena_id: '',
          fecha_entrega: '',
          fecha_vencimiento: '',
          estado: '',
          documento_id: '',
        });
      }
      onGuardado?.();
    } else {
      setMensaje(res?.mensaje || '❌ Error al guardar el EPP');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow-md">
      <h2 className="md:col-span-2 text-xl font-bold">{modoEdicion ? 'Editar EPP' : 'Registrar EPP'}</h2>

      {mensaje && <p className="md:col-span-2 text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">{mensaje}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <input name="tipo" value={form.tipo} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha Entrega</label>
        <input type="date" name="fecha_entrega" value={form.fecha_entrega} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Descripción</label>
        <textarea name="descripcion" value={form.descripcion} onChange={handleChange} className="w-full border p-2 rounded" rows={2} />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Fecha Vencimiento</label>
        <input type="date" name="fecha_vencimiento" value={form.fecha_vencimiento} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Estado</label>
        <input name="estado" value={form.estado} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Usuario</label>
        <select name="usuario_id" value={form.usuario_id} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Seleccione un usuario</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>{u.nombre} {u.apellido}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Faena (opcional)</label>
        <select name="faena_id" value={form.faena_id} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Seleccione una faena</option>
          {faenas.map((f) => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>
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
