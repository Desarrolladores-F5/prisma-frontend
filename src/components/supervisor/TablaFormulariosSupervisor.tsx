'use client';

import { useEffect, useState } from 'react';
import { obtenerFormularios } from '@/lib/api';

interface Formulario {
  id: number;
  nombre: string;
  tipo: string;
  creador?: { nombre: string };
  fecha_creacion: string;
}

export default function TablaFormulariosSupervisor() {
  const [formularios, setFormularios] = useState<Formulario[]>([]);

  const cargarFormularios = async () => {
    try {
      const data = await obtenerFormularios();
      setFormularios(data);
    } catch (error) {
      console.error('❌ Error al obtener formularios:', error);
    }
  };

  useEffect(() => {
    cargarFormularios();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lista de Formularios</h2>
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr className="text-center">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Creador</th>
            <th className="border p-2">Fecha de Creación</th>
          </tr>
        </thead>
        <tbody>
          {formularios.map((f) => (
            <tr key={f.id} className="border-t hover:bg-gray-50 text-center">
              <td className="p-2">{f.nombre}</td>
              <td className="p-2">{f.tipo}</td>
              <td className="p-2">{f.creador?.nombre || '—'}</td>
              <td className="p-2">{new Date(f.fecha_creacion).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
