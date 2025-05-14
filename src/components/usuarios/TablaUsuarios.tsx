'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerUsuarios, eliminarUsuario, obtenerFaenas } from '@/lib/api';
import { Usuario, Faena } from '@/types';

interface Props {
  onEditar?: (usuario: Usuario) => void;
  onEliminado?: () => void;
  refrescar?: boolean;
}

export default function TablaUsuarios({ onEditar, onEliminado, refrescar }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [faenas, setFaenas] = useState<Faena[]>([]);

  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroRut, setFiltroRut] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroFaena, setFiltroFaena] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);

  const router = useRouter();

  const cargarUsuarios = async () => {
    const data = await obtenerUsuarios();
    setUsuarios(data);
  };

  const cargarFaenas = async () => {
    const data = await obtenerFaenas();
    setFaenas(data);
  };

  useEffect(() => {
    cargarUsuarios();
    cargarFaenas();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas cambiar el estado de este usuario?')) return;

    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) return;

    const res = await eliminarUsuario(id);

    if (res?.mensaje?.includes('actualizado')) {
      setMensaje(usuario.activo ? '✅ Usuario inactivado' : '✅ Usuario reactivado');
      await cargarUsuarios();
      onEliminado?.();
      setTimeout(() => setMensaje(null), 3000);
    } else {
      alert(res?.mensaje || '❌ Error al actualizar usuario');
    }
  };

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase();
    const rut = u.rut.toLowerCase();
    const rol = u.rol?.nombre?.toLowerCase() || '';
    const faena = u.faena?.nombre?.toLowerCase() || '';

    return (
      nombreCompleto.includes(filtroNombre.toLowerCase()) &&
      rut.includes(filtroRut.toLowerCase()) &&
      (filtroRol === '' || rol === filtroRol.toLowerCase()) &&
      (filtroFaena === '' || faena === filtroFaena.toLowerCase())
    );
  });

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Buscar por RUT..."
          value={filtroRut}
          onChange={(e) => setFiltroRut(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Trabajador">Trabajador</option>
        </select>
        <select
          value={filtroFaena}
          onChange={(e) => setFiltroFaena(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Todas las faenas</option>
          {faenas.map((f) => (
            <option key={f.id} value={f.nombre}>
              {f.nombre}
            </option>
          ))}
        </select>
      </div>

      {mensaje && (
        <div className="mb-4 px-4 py-2 bg-green-100 border border-green-400 text-green-800 rounded shadow">
          {mensaje}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-bold">Usuarios Registrados</h2>
        <p className="text-sm text-gray-600">
          Mostrando <span className="font-semibold">{usuariosFiltrados.length}</span> de{' '}
          <span className="font-semibold">{usuarios.length}</span> usuarios
        </p>
      </div>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">RUT</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Tipo Contrato</th>
            <th className="p-2">Fecha Contrato</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Faena</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.nombre} {u.apellido}</td>
              <td className="p-2">{u.rut}</td>
              <td className="p-2">{u.correo}</td>
              <td className="p-2">{u.telefono || '-'}</td>
              <td className="p-2">{u.tipo_contrato || '-'}</td>
              <td className="p-2">{u.fecha_contrato ? new Date(u.fecha_contrato).toLocaleDateString('es-CL') : '-'}</td>
              <td className="p-2">{u.rol?.nombre}</td>
              <td className="p-2">{u.faena?.nombre || '-'}</td>
              <td className="p-2">
                {u.activo ? (
                  <span className="text-green-600 font-medium">Activo</span>
                ) : (
                  <span className="text-red-500 font-medium">Inactivo</span>
                )}
              </td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => onEditar?.(u)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(u.id)}
                  className={`text-white px-2 py-1 rounded text-sm ${u.activo ? 'bg-red-600' : 'bg-green-600'}`}
                >
                  {u.activo ? 'Inactivar' : 'Reactivar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuariosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No se encontraron usuarios con los filtros aplicados.
        </p>
      )}
    </div>
  );
}
