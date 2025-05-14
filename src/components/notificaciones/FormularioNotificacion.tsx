'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerUsuarios, obtenerFaenas, crearNotificacion, actualizarNotificacion } from '@/lib/api';

interface Notificacion {
  id?: number;
  mensaje: string;
  tipo: string;
  usuario_id: string;
  origen?: string;
  faena_id?: string;
  leido: boolean;
}

interface Props {
  notificacion?: Notificacion;
  onGuardado?: () => void;
}

export default function FormularioNotificacion({ notificacion, onGuardado }: Props) {
  const modoEdicion = !!notificacion;
  const router = useRouter();

  const [form, setForm] = useState<Notificacion>({
    mensaje: '',
    tipo: '',
    usuario_id: '',
    origen: '',
    faena_id: '',
    leido: false,
  });

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [faenas, setFaenas] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      const usuariosData = await obtenerUsuarios();
      const faenasData = await obtenerFaenas();
      setUsuarios(usuariosData);
      setFaenas(faenasData);
    };
    cargarDatos();
  }, []);

  useEffect(() => {
    if (modoEdicion && notificacion) {
      setForm({
        mensaje: notificacion.mensaje || '',
        tipo: notificacion.tipo || '',
        usuario_id: notificacion.usuario_id?.toString() || '',
        origen: notificacion.origen || '',
        faena_id: notificacion.faena_id?.toString() || '',
        leido: notificacion.leido ?? false,
      });
    }
  }, [notificacion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setForm({ ...form, [name]: target.checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...form,
      usuario_id: parseInt(form.usuario_id),
      faena_id: form.faena_id ? parseInt(form.faena_id) : undefined,
    };

    try {
      const res = modoEdicion
        ? await actualizarNotificacion(notificacion!.id!, data)
        : await crearNotificacion(data);

      if (res?.id) {
        setMensaje(modoEdicion ? '✅ Notificación actualizada' : '✅ Notificación creada');
        if (!modoEdicion) {
          setForm({
            mensaje: '',
            tipo: '',
            usuario_id: '',
            origen: '',
            faena_id: '',
            leido: false,
          });
        }
        onGuardado?.();
      } else {
        setMensaje(res?.mensaje || '❌ Error al guardar la notificación');
      }
    } catch (error) {
      console.error('❌ Error en submit notificación:', error);
      setMensaje('❌ Error interno');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow-md">
      <h2 className="md:col-span-2 text-xl font-bold">{modoEdicion ? 'Editar Notificación' : 'Registrar Notificación'}</h2>

      {mensaje && <p className="md:col-span-2 text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">{mensaje}</p>}

      <div>
        <label className="block text-sm font-medium mb-1">Mensaje</label>
        <textarea
          name="mensaje"
          value={form.mensaje}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <input
          name="tipo"
          value={form.tipo}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Usuario</label>
        <select
          name="usuario_id"
          value={form.usuario_id}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccione un usuario</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nombre} {u.apellido}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Faena (opcional)</label>
        <select
          name="faena_id"
          value={form.faena_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccione una faena</option>
          {faenas.map((f) => (
            <option key={f.id} value={f.id}>
              {f.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Origen (opcional)</label>
        <input
          name="origen"
          value={form.origen}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="md:col-span-2 flex items-center space-x-2">
        <input
          type="checkbox"
          name="leido"
          checked={form.leido}
          onChange={handleChange}
          className="h-4 w-4"
        />
        <label className="text-sm font-medium">Marcar como leído</label>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {modoEdicion ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}
