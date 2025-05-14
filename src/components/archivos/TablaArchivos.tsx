'use client';

import { useEffect, useState } from 'react';
import { ArchivoAdjunto } from './FormularioArchivo'; 

interface Props {
  refrescar: boolean;
  onEditarArchivo: (archivo: ArchivoAdjunto) => void;
}

export default function TablaArchivos({ refrescar, onEditarArchivo }: Props) {
  const [archivos, setArchivos] = useState<ArchivoAdjunto[]>([]);

  useEffect(() => {
    // Aquí simula una carga de archivos o llama al backend
    console.log('🔄 Cargando archivos...');
    setArchivos([
      {
        id: 1,
        entidad_tipo: 'reporte',
        entidad_id: 123,
        url: 'https://ejemplo.com/archivo1.pdf',
        nombre_archivo: 'Informe.pdf',
        tipo_archivo: 'application/pdf',
      },
    ]);
  }, [refrescar]);

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">Archivos Adjuntos</h2>
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Nombre</th>
            <th className="border px-4 py-2">Entidad</th>
            <th className="border px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {archivos.map((archivo) => (
            <tr key={archivo.id}>
              <td className="border px-4 py-2">{archivo.id}</td>
              <td className="border px-4 py-2">{archivo.nombre_archivo}</td>
              <td className="border px-4 py-2">{archivo.entidad_tipo}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => onEditarArchivo(archivo)}
                  className="text-blue-600 hover:underline"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
