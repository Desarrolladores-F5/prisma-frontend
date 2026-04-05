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
    // si edita, usamos su rol; si crea, queda vacío para mostrar “Roles”
    rol_id: edicion ? (usuario?.rol_id ?? '') : ('' as '' | number),
    faena_id: usuario?.faena_id || '',
    contraseña: '',
    contacto_emergencia_nombre: usuario?.contacto_emergencia_nombre || '',
    contacto_emergencia_telefono: usuario?.contacto_emergencia_telefono || '',
  });

  const [faenas, setFaenas] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [firma, setFirma] = useState<File | null>(null);
  const [foto, setFoto] = useState<File | null>(null);

  const hoy = new Date().toISOString().split('T')[0];

  useEffect(() => {
    obtenerFaenas().then(setFaenas);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'rol_id' || name === 'faena_id') {
      setForm(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFirmaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFirma(e.target.files[0]);
  };

  const handleFotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFoto(e.target.files[0]);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === 'contraseña' && (!value || String(value).trim() === '')) return;
      formData.append(key, String(value));
    });
    if (firma) formData.append('firma', firma);
    if (foto) formData.append('foto', foto);

    try {
      const token = localStorage.getItem('token');
      const url = edicion
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${usuario.id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios`;
      const metodo = edicion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: metodo,
        headers: { Authorization: `Bearer ${token}` },
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
            rol_id: '', // vuelve al placeholder “Roles”
            faena_id: '',
            contraseña: '',
            contacto_emergencia_nombre: '',
            contacto_emergencia_telefono: '',
          });
          setFirma(null);
          setFoto(null);
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
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded shadow-md mt-6 space-y-6"
      encType="multipart/form-data"
    >
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

        <div className="flex flex-col">
          <label htmlFor="fecha_nacimiento" className="text-sm font-medium text-gray-700">Fecha de nacimiento</label>
          <input id="fecha_nacimiento" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={handleChange} type="date" max={hoy} className="border p-2 rounded" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="fecha_contrato" className="text-sm font-medium text-gray-700">Fecha de inicio de contrato</label>
          <input id="fecha_contrato" name="fecha_contrato" value={form.fecha_contrato} onChange={handleChange} type="date" min="2000-01-01" max={hoy} className="border p-2 rounded" />
        </div>

        <select name="tipo_contrato" value={form.tipo_contrato} onChange={handleChange} required className="border p-2 rounded">
          <option value="">-- Selecciona un tipo --</option>
          <option value="Plazo fijo">Plazo fijo</option>
          <option value="Indefinido">Indefinido</option>
          <option value="Honorarios">Honorarios</option>
          <option value="Jornada parcial">Jornada parcial</option>
        </select>

        <input name="contraseña" type="password" value={form.contraseña} onChange={handleChange} placeholder="Contraseña" className="border p-2 rounded" />

        {/* Rol con placeholder “Roles” */}
        <div className="flex flex-col">
          <label htmlFor="rol_id" className="text-sm font-medium text-gray-700">Rol</label>
          <select
            id="rol_id"
            name="rol_id"
            value={form.rol_id as any}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          >
            <option value="" disabled>Roles</option>
            <option value={1}>Administrador</option>
            <option value={2}>Supervisor</option>
            <option value={3}>Trabajador</option>
          </select>
          <small className="text-xs text-gray-500 mt-1">Seleccione el rol del usuario.</small>
        </div>

        <select name="faena_id" value={form.faena_id as any} onChange={handleChange} required className="border p-2 rounded">
          <option value="">-- Selecciona una faena --</option>
          {faenas.map((f) => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>

        {/* Foto */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="foto">Foto del usuario</label>
          <input id="foto" type="file" name="foto" onChange={handleFotoChange} accept="image/jpeg,image/png,image/webp" className="border p-2 rounded w-full" />
          {usuario?.foto_url && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Foto actual:</label>
              <img src={`${process.env.NEXT_PUBLIC_API_URL}${usuario.foto_url}?t=${Date.now()}`} alt="Foto actual" className="mt-1 h-24 w-24 border rounded object-cover" />
            </div>
          )}
        </div>

        {/* Firma */}
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="firma">Firma (opcional)</label>
          <input id="firma" type="file" name="firma" onChange={handleFirmaChange} accept="image/jpeg,image/png,image/webp" className="border p-2 rounded w-full" />
          {usuario?.firma_imagen_url && (
            <div className="mt-2">
              <label className="block text-sm font-medium mb-1">Firma actual:</label>
              <img src={`${process.env.NEXT_PUBLIC_API_URL}${usuario.firma_imagen_url}?t=${Date.now()}`} alt="Firma actual" className="mt-1 h-24 border rounded object-contain" />
            </div>
          )}
        </div>

        {/* Contacto de emergencia */}
        <div className="flex flex-col">
          <label htmlFor="contacto_emergencia_nombre" className="text-sm font-medium text-gray-700">Nombre contacto de emergencia</label>
          <input id="contacto_emergencia_nombre" name="contacto_emergencia_nombre" value={form.contacto_emergencia_nombre} onChange={handleChange} className="border p-2 rounded" placeholder="Nombre completo" />
        </div>

        <div className="flex flex-col">
          <label htmlFor="contacto_emergencia_telefono" className="text-sm font-medium text-gray-700">Teléfono contacto de emergencia</label>
          <input id="contacto_emergencia_telefono" name="contacto_emergencia_telefono" value={form.contacto_emergencia_telefono} onChange={handleChange} className="border p-2 rounded" inputMode="tel" placeholder="+56 9 1234 5678" />
        </div>
      </div>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        {edicion ? 'Actualizar Usuario' : 'Crear Usuario'}
      </button>
    </form>
  );
}
