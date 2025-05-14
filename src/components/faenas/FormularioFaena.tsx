'use client';

import { useState, useEffect } from 'react';

interface Props {
  faena?: any;
  onGuardado?: () => void;
}

export default function FormularioFaena({ faena, onGuardado }: Props) {
  const modoEdicion = !!faena;

  const [form, setForm] = useState({
    nombre: faena?.nombre || '',
    descripcion: faena?.descripcion || '',
    empresa_id: faena?.empresa_id || '',
    ubicacion: faena?.ubicacion || '',
    responsable_id: faena?.responsable_id || '',
    estado: faena?.estado || '',
    fecha_inicio: faena?.fecha_inicio?.substring(0, 10) || '',
    fecha_termino: faena?.fecha_termino?.substring(0, 10) || '',
  });

  const [mensaje, setMensaje] = useState('');
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    const fetchDatos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('❌ Token no encontrado');
        return;
      }

      try {
        const [resEmpresas, resUsuarios] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/empresas`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (!resEmpresas.ok || !resUsuarios.ok) {
          console.error('❌ Error al obtener empresas o usuarios');
          return;
        }

        const dataEmpresas = await resEmpresas.json();
        const dataUsuarios = await resUsuarios.json();

        setEmpresas(dataEmpresas);
        setUsuarios(dataUsuarios);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
      }
    };

    fetchDatos();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...form,
      empresa_id: parseInt(form.empresa_id),
      responsable_id: parseInt(form.responsable_id),
    };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/faenas${modoEdicion ? `/${faena.id}` : ''}`,
        {
          method: modoEdicion ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data?.id) {
        setMensaje(modoEdicion ? '✅ Faena actualizada' : '✅ Faena creada');
        onGuardado?.();
      } else {
        setMensaje(data?.mensaje || '❌ Error al guardar la faena');
      }
    } catch (error) {
      setMensaje('❌ Error inesperado');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-6 space-y-4">
      <h2 className="text-xl font-bold">{modoEdicion ? 'Editar Faena' : 'Crear Faena'}</h2>

      {mensaje && <p className="text-sm text-blue-600">{mensaje}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ubicación</label>
          <input
            name="ubicacion"
            value={form.ubicacion}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Empresa</label>
          <select
            name="empresa_id"
            value={form.empresa_id}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccione una empresa</option>
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Responsable</label>
          <select
            name="responsable_id"
            value={form.responsable_id}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          >
            <option value="">Seleccione un responsable</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} {u.apellido}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <input
            name="estado"
            value={form.estado}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
          <input
            name="fecha_inicio"
            type="date"
            value={form.fecha_inicio}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha Término</label>
          <input
            name="fecha_termino"
            type="date"
            value={form.fecha_termino}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            rows={3}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        {modoEdicion ? 'Actualizar' : 'Crear'}
      </button>
    </form>
  );
}
