'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { obtenerFormularios } from '@/lib/api';

interface Formulario {
  id: number;
  nombre: string;
  tipo: string;
  fecha_creacion: string;
}

export default function TablaFormulariosTrabajador() {
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
      <h2 className="text-xl font-semibold mb-4">Formularios Disponibles</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr className="text-center">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Fecha de Creación</th>
            <th className="border p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {formularios.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">No hay formularios disponibles.</td>
            </tr>
          ) : (
            formularios.map((f) => (
              <tr key={f.id} className="border-t hover:bg-gray-50 text-center">
                <td className="p-2">{f.nombre}</td>
                <td className="p-2">{f.tipo}</td>
                <td className="p-2">{new Date(f.fecha_creacion).toLocaleDateString()}</td>
                <td className="p-2">
                  <Link
                    href={`/trabajador/formularios/responder/${f.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                  >
                    Responder
                  </Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
