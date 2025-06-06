'use client';

import { useEffect, useState } from 'react';
import { crearExamen, actualizarExamen, obtenerCapacitaciones } from '@/lib/api';

interface Props {
  examen?: any; // para modo edición
  onGuardado?: () => void; // se ejecuta luego de guardar
}

export default function FormularioExamen({ examen, onGuardado }: Props) {
  const modoEdicion = !!examen;

  const [form, setForm] = useState({
    titulo: '',
    descripcion: '',
    capacitacion_id: '',
  });

  const [capacitaciones, setCapacitaciones] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      const dataCapacitaciones = await obtenerCapacitaciones();
      setCapacitaciones(dataCapacitaciones);
    };

    cargarDatos();

    if (modoEdicion && examen) {
      setForm({
        titulo: examen.titulo || '',
        descripcion: examen.descripcion || '',
        capacitacion_id: examen.capacitacion_id || '',
      });
    }
  }, [modoEdicion, examen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        await actualizarExamen(examen.id, form);
        setMensaje('✅ Examen actualizado correctamente');
      } else {
        await crearExamen(form);
        setMensaje('✅ Examen creado correctamente');
        setForm({ titulo: '', descripcion: '', capacitacion_id: '' }); // limpiar si es creación
      }

      onGuardado?.();
    } catch (error: any) {
      setMensaje(`❌ Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold">
        {modoEdicion ? 'Editar Examen' : 'Nuevo Examen'}
      </h2>

      <div>
        <label className="block text-sm font-medium">Título</label>
        <input
          type="text"
          value={form.titulo}
          onChange={(e) => setForm({ ...form, titulo: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Capacitación asociada</label>
        <select
          value={form.capacitacion_id}
          onChange={(e) => setForm({ ...form, capacitacion_id: e.target.value })}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Seleccionar capacitación</option>
          {capacitaciones.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {modoEdicion ? 'Actualizar' : 'Crear'}
      </button>

      {mensaje && <p className="mt-2 text-sm">{mensaje}</p>}
    </form>
  );
}
