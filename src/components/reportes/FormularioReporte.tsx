'use client';

import { useState, useEffect } from 'react';
import {
  crearReporte,
  actualizarReporte,
  obtenerAuditorias
} from '@/lib/api';
import SelectFaenas from '@/components/faenas/SelectFaenas';

interface Props {
  reporte?: any;
  onGuardado?: () => void;
}

export default function FormularioReporte({ reporte, onGuardado }: Props) {
  const modoEdicion = !!reporte;

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'Incidente',
    estado: 'Abierto',
    prioridad: 'Media',
    faena_id: '',
    auditoria_id: null,
    fecha_evento: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [auditorias, setAuditorias] = useState<any[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      const dataAuditorias = await obtenerAuditorias();
      setAuditorias(dataAuditorias);
    };

    cargarDatos();

    if (modoEdicion) {
      setForm({
        titulo: reporte.titulo || '',
        descripcion: reporte.descripcion || '',
        tipo: reporte.tipo || 'Incidente',
        estado: reporte.estado || 'Abierto',
        prioridad: reporte.prioridad || 'Media',
        faena_id: reporte.faena_id?.toString() || '',
        auditoria_id: reporte.auditoria_id?.toString() || null,
        fecha_evento: reporte.fecha_evento?.substring(0, 10) || '',
      });
    }
  }, [reporte]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      faena_id: parseInt(form.faena_id),
      auditoria_id: form.auditoria_id ? parseInt(form.auditoria_id) : null
    };

    const res = modoEdicion
      ? await actualizarReporte(reporte.id, payload)
      : await crearReporte(payload);

    if (res?.id) {
      setMensaje(modoEdicion ? '✅ Reporte actualizado' : '✅ Reporte creado');
      if (!modoEdicion) {
        setForm({
          titulo: '',
          descripcion: '',
          tipo: 'Incidente',
          estado: 'Abierto',
          prioridad: 'Media',
          faena_id: '',
          auditoria_id: null,
          fecha_evento: '',
        });
      }
      onGuardado?.();
    } else {
      setMensaje(res?.mensaje || '❌ Error al guardar reporte');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-6 space-y-4">
      <h2 className="text-xl font-bold">{modoEdicion ? 'Editar Reporte' : 'Crear Reporte'}</h2>

      {mensaje && <p className="text-sm text-blue-600">{mensaje}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Título</label>
          <input type="text" name="titulo" value={form.titulo} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha del Evento</label>
          <input type="date" name="fecha_evento" value={form.fecha_evento} onChange={handleChange} required className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Reporte</label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="Incidente">Incidente</option>
            <option value="Accidente">Accidente</option>
            <option value="Observación">Observación</option>
            <option value="Denuncia Ley Karin">Denuncia Ley Karin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="Abierto">Abierto</option>
            <option value="En revisión">En revisión</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prioridad</label>
          <select name="prioridad" value={form.prioridad} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Select reutilizable para Faenas */}
        <SelectFaenas value={form.faena_id} onChange={handleChange} required />

        <div>
          <label className="block text-sm font-medium mb-1">Auditoría (opcional)</label>
          <select name="auditoria_id" value={form.auditoria_id || ''} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Sin auditoría</option>
            {auditorias.map((a) => (
              <option key={a.id} value={a.id}>
                {a.tipo} - {new Date(a.fecha).toLocaleDateString('es-CL')}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Descripción detallada</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={4}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        {modoEdicion ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  );
}
