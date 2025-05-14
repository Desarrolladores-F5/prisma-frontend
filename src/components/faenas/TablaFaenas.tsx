'use client';

import { useEffect, useState } from 'react';
import { obtenerFaenas, eliminarFaena } from '@/lib/api';

interface Props {
  onEditar?: (faena: any) => void;
  refrescar?: boolean;
}

export default function TablaFaenas({ onEditar, refrescar }: Props) {
  const [faenas, setFaenas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarFaenas = async () => {
      try {
        const data = await obtenerFaenas();
        if (Array.isArray(data)) {
          setFaenas(data);
        } else {
          setError('❌ Error al cargar faenas.');
        }
      } catch (err) {
        setError('❌ Error inesperado.');
      } finally {
        setCargando(false);
      }
    };

    cargarFaenas();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    const confirmar = confirm('¿Deseas eliminar esta faena?');
    if (!confirmar) return;

    const res = await eliminarFaena(id);
    if (res?.mensaje?.includes('eliminada')) {
      setFaenas(faenas.filter(f => f.id !== id));
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Listado de Faenas</h2>

      {cargando ? (
        <p className="text-gray-500">Cargando faenas...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : faenas.length === 0 ? (
        <p className="text-gray-500">No hay faenas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">Ubicación</th>
                <th className="p-2">Empresa</th>
                <th className="p-2">Responsable</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {faenas.map((faena) => (
                <tr key={faena.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{faena.id}</td>
                  <td className="p-2">{faena.nombre}</td>
                  <td className="p-2">{faena.ubicacion}</td>
                  <td className="p-2">{faena.empresa?.nombre || '-'}</td>
                  <td className="p-2">
                    {faena.responsable
                      ? `${faena.responsable.nombre} ${faena.responsable.apellido}`
                      : '-'}
                  </td>
                  <td className="p-2">{faena.estado || '-'}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => onEditar?.(faena)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(faena.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
