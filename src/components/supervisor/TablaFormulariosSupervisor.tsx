'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
            <th className="border p-2">Acciones</th>
            <th className="border p-2">Respuestas</th>
          </tr>
        </thead>
        <tbody>
          {formularios.map((f) => (
            <tr key={f.id} className="border-t hover:bg-gray-50 text-center">
              <td className="p-2">{f.nombre}</td>
              <td className="p-2">{f.tipo}</td>
              <td className="p-2">{f.creador?.nombre || '—'}</td>
              <td className="p-2">
                {new Date(f.fecha_creacion).toLocaleDateString()}
              </td>
              <td className="p-2 flex justify-center gap-2">
                <Link
                  href={`/supervisor/formularios/responder/${f.id}`}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                >
                  Responder
                </Link>
              </td>
              <td className="p-2">
                <Link
                  href={`/supervisor/formularios/respuestas/${f.id}`}
                  className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm"
                >
                  Ver Respuestas
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
