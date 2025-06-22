'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { obtenerFaenas } from '@/lib/api';

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

  const [faenas, setFaenas] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [firma, setFirma] = useState<File | null>(null);

  useEffect(() => {
    const cargarFaenas = async () => {
      const data = await obtenerFaenas();
      setFaenas(data);
    };
    cargarFaenas();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFirma(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'contraseña' && (!value || value.trim() === '')) return;
      formData.append(key, value);
    });

    if (firma) formData.append('firma', firma);

    try {
      const token = localStorage.getItem('token');
      const url = edicion
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${usuario.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios`;

      const metodo = edicion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
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
          setFirma(null);
        }
        onUsuarioCreado?.();
      } else {
        setMensaje(data?.mensaje || '❌ Error al guardar usuario');
      }
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error en la solicitud');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mt-6 space-y-6" encType="multipart/form-data">
      <h2 className="text-xl font-bold">{edicion ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>

      {mensaje && (
        <p className="text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">{mensaje}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="rut" value={form.rut} onChange={handleChange} required placeholder="RUT" className="border p-2 rounded" />
        <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Nombres" className="border p-2 rounded" />
        <input name="apellido" value={form.apellido} onChange={handleChange} required placeholder="Apellidos" className="border p-2 rounded" />
        <input name="correo" value={form.correo} onChange={handleChange} type="email" required placeholder="Correo" className="border p-2 rounded" />
        <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" className="border p-2 rounded" />
        <input name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} type="date" className="border p-2 rounded" />
        <input name="fecha_contrato" value={form.fecha_contrato} onChange={handleChange} type="date" className="border p-2 rounded" />

        <select name="tipo_contrato" value={form.tipo_contrato} onChange={handleChange} required className="border p-2 rounded">
          <option value="">-- Selecciona un tipo --</option>
          <option value="Plazo fijo">Plazo fijo</option>
          <option value="Indefinido">Indefinido</option>
          <option value="Honorarios">Honorarios</option>
          <option value="Jornada parcial">Jornada parcial</option>
        </select>

        <input name="contraseña" type="password" value={form.contraseña} onChange={handleChange} placeholder="Contraseña" className="border p-2 rounded" />

        <select name="rol_id" value={form.rol_id} onChange={handleChange} className="border p-2 rounded">
          <option value={1}>Administrador</option>
          <option value={2}>Supervisor</option>
          <option value={3}>Trabajador</option>
        </select>

        <select name="faena_id" value={form.faena_id} onChange={handleChange} required className="border p-2 rounded">
          <option value="">-- Selecciona una faena --</option>
          {faenas.map((f) => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>

        <div>
          <label className="block text-sm font-medium mb-1">Firma (opcional)</label>
          <input type="file" name="firma" onChange={handleFileChange} accept="image/*" className="border p-2 rounded w-full" />

          {usuario?.firma_imagen_url && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Firma actual:</label>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${usuario.firma_imagen_url}?t=${Date.now()}`}
                alt="Firma actual"
                className="mt-1 h-24 border rounded object-contain"
              />
            </div>
          )}
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        {edicion ? 'Actualizar Usuario' : 'Crear Usuario'}
      </button>
    </form>
  );
}
