// src/components/supervisor/TablaUsuariosSupervisor.tsx
'use client';

import { useEffect, useState } from 'react';
import { Usuario } from '@/types';
import { obtenerUsuarios } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function TablaUsuariosSupervisor() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const router = useRouter();

  useEffect(() => {
    const cargarUsuarios = async () => {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    };

    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) => {
    const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase();
    const rolNombre = u.rol?.nombre?.toLowerCase() || '';

    return (
      nombreCompleto.includes(filtroNombre.toLowerCase()) &&
      (filtroRol.trim() === '' || rolNombre === filtroRol.toLowerCase())
    );
  });

  return (
    <div className="mt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />

        <select
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="">Todos los roles</option>
          <option value="administrador">Administrador</option>
          <option value="supervisor">Supervisor</option>
          <option value="trabajador">Trabajador</option>
        </select>
      </div>

      <h2 className="text-xl font-bold mb-2">Usuarios del Sistema</h2>

      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Nombre</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Faena</th>
            <th className="p-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{u.nombre} {u.apellido}</td>
              <td className="p-2">{u.rol?.nombre}</td>
              <td className="p-2">{u.faena?.nombre ?? '—'}</td>
              <td className="p-2">
                {u.activo ? (
                  <span className="text-green-600 font-medium">Activo</span>
                ) : (
                  <span className="text-red-500 font-medium">Inactivo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuariosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No se encontraron usuarios registrados.
        </p>
      )}

      <div className="mt-6">
        <button
          onClick={() => router.push('/supervisor/dashboard')}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
