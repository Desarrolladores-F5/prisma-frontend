'use client';

import { useEffect, useState } from 'react';
import { crearUsuario, actualizarUsuario, obtenerFaenas } from '@/lib/api';

interface Props {
  usuario?: any;
  onUsuarioCreado?: () => void;
}

export default function FormularioUsuario({ usuario, onUsuarioCreado }: Props) {
  const edicion = !!usuario;

  const [form, setForm] = useState({
    rut: usuario?.rut || '',
    nombre: usuario?.nombre || '',
    apellido: usuario?.apellido || '',
    correo: usuario?.correo || '',
    telefono: usuario?.telefono || '',
    fecha_nacimiento: usuario?.fecha_nacimiento?.substring(0, 10) || '',
    fecha_contrato: usuario?.fecha_contrato?.substring(0, 10) || '',
    tipo_contrato: usuario?.tipo_contrato || '',
    rol_id: usuario?.rol_id || 1,
    faena_id: usuario?.faena_id || '',
    contraseña: '',
  });

  const [mensaje, setMensaje] = useState('');
  const [faenas, setFaenas] = useState<any[]>([]);

  useEffect(() => {
    const cargarFaenas = async () => {
      const data = await obtenerFaenas();
      setFaenas(data);
    };
    cargarFaenas();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data: { [key: string]: any } = { ...form };
    if (!data.contraseña || data.contraseña.trim() === '') {
      delete data['contraseña']; // ✅ ahora es seguro
    }

    const res = edicion
      ? await actualizarUsuario(usuario.id, data)
      : await crearUsuario(data);

    if (res?.id) {
      setMensaje(edicion ? '✅ Usuario actualizado' : '✅ Usuario creado correctamente');

      if (!edicion) {
        setForm({
          rut: '',
          nombre: '',
          apellido: '',
          correo: '',
          telefono: '',
          fecha_nacimiento: '',
          fecha_contrato: '',
          tipo_contrato: '',
          rol_id: 1,
          faena_id: '',
          contraseña: '',
        });
      }

      onUsuarioCreado?.();
    } else {
      setMensaje(res?.mensaje || '❌ Error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-6 space-y-6">
      <h2 className="text-xl font-bold">{edicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>

      {mensaje && (
        <p className="text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">
          {mensaje}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">RUT</label>
          <input type="text" name="rut" value={form.rut} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nombres</label>
          <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Apellidos</label>
          <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Correo</label>
          <input type="email" name="correo" value={form.correo} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha de Nacimiento</label>
          <input type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha de Contrato</label>
          <input type="date" name="fecha_contrato" value={form.fecha_contrato} onChange={handleChange} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Contrato</label>
          <select
            name="tipo_contrato"
            value={form.tipo_contrato}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Selecciona un tipo --</option>
            <option value="Plazo fijo">Plazo fijo</option>
            <option value="Indefinido">Indefinido</option>
            <option value="Honorarios">Honorarios</option>
            <option value="Jornada parcial">Jornada parcial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Contraseña</label>
          <input type="password" name="contraseña" value={form.contraseña} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Nueva contraseña (opcional)" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Rol</label>
          <select name="rol_id" value={form.rol_id} onChange={handleChange} className="w-full border p-2 rounded">
            <option value={1}>Administrador</option>
            <option value={2}>Supervisor</option>
            <option value={3}>Trabajador</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Faena</label>
          <select
            name="faena_id"
            value={form.faena_id}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">-- Selecciona una faena --</option>
            {faenas.map((faena) => (
              <option key={faena.id} value={faena.id}>
                {faena.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {edicion ? 'Actualizar Usuario' : 'Crear Usuario'}
        </button>
      </div>
    </form>
  );
}
