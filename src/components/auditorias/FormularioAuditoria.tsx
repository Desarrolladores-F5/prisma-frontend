'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  crearAuditoria,
  actualizarAuditoria,
  obtenerFaenas,
  obtenerUsuarios,
} from '@/lib/api';
import { registrarCambioHistorial } from '@/lib/registrarCambio';
import HistorialCambios from '@/components/historial/HistorialCambios';

interface Props {
  auditoria?: any;
  onGuardado?: () => void;
}

export default function FormularioAuditoria({ auditoria, onGuardado }: Props) {
  const modoEdicion = !!auditoria;
  const { data: session } = useSession();
  const usuarioId = session?.user?.id;

  const [form, setForm] = useState({
    fecha: '',
    tipo: '',
    descripcion: '',
    observaciones: '',
    conforme: false,
    faena_id: '',
    auditor_id: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [faenas, setFaenas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const faenas = await obtenerFaenas();
      const usuarios = await obtenerUsuarios();
      setFaenas(faenas);
      setUsuarios(usuarios.filter((u: any) => u.rol?.nombre?.toLowerCase() === 'supervisor'));
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    if (modoEdicion) {
      setForm({
        fecha: auditoria.fecha?.substring(0, 10) || '',
        tipo: auditoria.tipo || '',
        descripcion: auditoria.descripcion || '',
        observaciones: auditoria.observaciones || '',
        conforme: auditoria.conforme || false,
        faena_id: auditoria.faena_id || '',
        auditor_id: auditoria.auditor_id || '',
      });
    }
  }, [auditoria]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = modoEdicion
      ? await actualizarAuditoria(auditoria.id, form)
      : await crearAuditoria(form);

    if (res?.id) {
      setMensaje(modoEdicion ? '✅ Auditoría actualizada' : '✅ Auditoría creada');

      if (usuarioId) {
        await registrarCambioHistorial({
          usuario_id: usuarioId,
          entidad: 'auditoria',
          entidad_id: modoEdicion ? auditoria.id : res.id,
          accion: modoEdicion ? 'edición' : 'creación',
          detalles: form,
        });
      }

      if (!modoEdicion) {
        setForm({
          fecha: '',
          tipo: '',
          descripcion: '',
          observaciones: '',
          conforme: false,
          faena_id: '',
          auditor_id: '',
        });
      }

      onGuardado?.();
    } else {
      setMensaje(res?.mensaje || '❌ Error al guardar auditoría');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-6 space-y-6">
        <h2 className="text-xl font-bold">
          {modoEdicion ? 'Editar Auditoría' : 'Registrar Auditoría'}
        </h2>

        {mensaje && (
          <p className="text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">
            {mensaje}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tipo</label>
            <input
              type="text"
              name="tipo"
              placeholder="Tipo de auditoría"
              value={form.tipo}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Faena</label>
            <select
              name="faena_id"
              value={form.faena_id}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">-- Selecciona Faena --</option>
              {faenas.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Auditor</label>
            <select
              name="auditor_id"
              value={form.auditor_id}
              onChange={handleChange}
              className="border p-2 rounded w-full"
              required
            >
              <option value="">-- Selecciona Auditor --</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre} {u.apellido}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea
              name="observaciones"
              placeholder="Observaciones"
              value={form.observaciones}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              rows={2}
            />
          </div>

          <div className="md:col-span-2">
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                name="conforme"
                checked={form.conforme}
                onChange={handleChange}
              />
              <span>Auditoría conforme</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {modoEdicion ? 'Actualizar' : 'Registrar'}
        </button>
      </form>

      {modoEdicion && (
        <div className="mt-6">
          <HistorialCambios entidad="auditoria" entidad_id={auditoria?.id} />
        </div>
      )}
    </div>
  );
}
