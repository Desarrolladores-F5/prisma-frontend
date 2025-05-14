'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerDocumentos, eliminarDocumento } from '@/lib/api';

interface Documento {
  id: number;
  nombre: string;
  tipo: string;
  url: string;
  version: string;
  fecha_creacion: string;
  activo: boolean;
}

interface Props {
  refrescar?: boolean;
  onEditar?: (documento: Documento) => void;
  onEliminado?: () => void;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function TablaDocumentos({ refrescar, onEditar, onEliminado }: Props) {
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const router = useRouter();

  const cargarDocumentos = async () => {
    try {
      const data = await obtenerDocumentos();
      setDocumentos(data);
    } catch (error) {
      console.error('❌ Error al obtener documentos:', error);
    }
  };

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este documento?')) return;
    try {
      await eliminarDocumento(id);
      await cargarDocumentos();
      onEliminado?.();
    } catch (error) {
      console.error('❌ Error al eliminar documento:', error);
    }
  };

  useEffect(() => {
    cargarDocumentos();
  }, [refrescar]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Lista de Documentos</h2>
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Versión</th>
            <th className="border p-2">Fecha de Creación</th>
            <th className="border p-2">Activo</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc) => (
            <tr key={doc.id} className="border-t hover:bg-gray-50">
              <td className="p-2">{doc.nombre}</td>
              <td className="p-2">{doc.tipo}</td>
              <td className="p-2">{doc.version}</td>
              <td className="p-2">{new Date(doc.fecha_creacion).toLocaleDateString()}</td>
              <td className="p-2 text-center">{doc.activo ? '✅' : '❌'}</td>
              <td className="p-2 flex flex-wrap gap-2 justify-center">
                <a
                  href={`${BASE_URL}${doc.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Ver
                </a>
                <a
                  href={`${BASE_URL}${doc.url}`}
                  download
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Descargar
                </a>
                <button
                  onClick={() => onEditar?.(doc)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(doc.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
