'use client';

import { useEffect, useState } from 'react';
import { obtenerEmpresas, eliminarEmpresa } from '@/lib/api';

interface Props {
  onEditar?: (empresa: any) => void;
  refrescar?: boolean;
}

export default function TablaEmpresas({ onEditar, refrescar }: Props) {
  const [empresas, setEmpresas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarEmpresas = async () => {
      try {
        const data = await obtenerEmpresas();
        if (Array.isArray(data)) {
          setEmpresas(data);
        } else {
          setError('❌ Error al cargar empresas.');
        }
      } catch (err) {
        setError('❌ Error inesperado.');
      } finally {
        setCargando(false);
      }
    };

    cargarEmpresas();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    const confirmar = confirm('¿Deseas eliminar esta empresa?');
    if (!confirmar) return;

    const res = await eliminarEmpresa(id);
    if (res?.mensaje?.includes('eliminada')) {
      setEmpresas(empresas.filter(e => e.id !== id));
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-4">Listado de Empresas</h2>

      {cargando ? (
        <p className="text-gray-500">Cargando empresas...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : empresas.length === 0 ? (
        <p className="text-gray-500">No hay empresas registradas.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">Nombre</th>
                <th className="p-2">RUT</th>
                <th className="p-2">Dirección</th>
                <th className="p-2">Correo</th>
                <th className="p-2">Teléfono</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empresas.map((empresa) => (
                <tr key={empresa.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{empresa.id}</td>
                  <td className="p-2">{empresa.nombre}</td>
                  <td className="p-2">{empresa.rut}</td>
                  <td className="p-2">{empresa.direccion}</td>
                  <td className="p-2">{empresa.correo}</td>
                  <td className="p-2">{empresa.telefono}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => onEditar?.(empresa)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(empresa.id)}
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
