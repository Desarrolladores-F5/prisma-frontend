'use client';

import { useEffect, useState } from 'react';
import { obtenerMisDocumentos } from '@/lib/api';
import type { Documento } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function TablaDocumentosTrabajador() {
  const [documentos, setDocumentos] = useState<Documento[]>([]);

  const cargar = async () => {
    try {
      const data = await obtenerMisDocumentos();
      setDocumentos(data);
    } catch (error) {
      console.error('❌ Error al cargar documentos:', error);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Mis Documentos</h2>
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Versión</th>
            <th className="border p-2">Fecha</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {documentos.map((doc) => (
            <tr key={doc.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2">{doc.nombre}</td>
              <td className="p-2">{doc.tipo}</td>
              <td className="p-2">{doc.version ?? 'N/A'}</td>
              <td className="p-2">{new Date(doc.fecha_creacion).toLocaleDateString()}</td>
              <td className="p-2 space-x-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
