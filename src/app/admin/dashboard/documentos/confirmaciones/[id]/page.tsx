// src/app/admin/dashboard/documentos/confirmaciones/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface ConfirmacionDocumento {
  id: number;
  usuario: {
    nombre: string;
    apellido: string;
    correo: string;
  };
  documento: {
    nombre: string;
  };
  fecha_recepcion: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ConfirmacionesDocumentoPage() {
  const params = useParams() as { id?: string | string[] };
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [confirmaciones, setConfirmaciones] = useState<ConfirmacionDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombreDocumento, setNombreDocumento] = useState<string>('');

  useEffect(() => {
    const obtenerConfirmaciones = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE_URL}/api/documentos/${id}/confirmaciones`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Error al obtener confirmaciones');
        }

        const data: ConfirmacionDocumento[] = await res.json();
        setConfirmaciones(data);

        // Extraer el nombre del documento desde la primera confirmación
        if (data.length > 0 && data[0].documento?.nombre) {
          setNombreDocumento(data[0].documento.nombre);
        }
      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      obtenerConfirmaciones();
    }
  }, [id]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Confirmaciones del Documento: {nombreDocumento || `#${id}`}
        </h2>
        <Link
          href="/admin/dashboard/documentos"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando confirmaciones...</p>
      ) : confirmaciones.length === 0 ? (
        <p className="text-gray-500">No hay confirmaciones registradas aún.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Fecha de Confirmación</th>
            </tr>
          </thead>
          <tbody>
            {confirmaciones.map((conf, index) => (
              <tr key={conf.id} className="border-t text-center">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{conf.usuario?.nombre} {conf.usuario?.apellido}</td>
                <td className="p-2">{conf.usuario?.correo}</td>
                <td className="p-2">
                  {conf.fecha_recepcion
                    ? new Date(conf.fecha_recepcion).toLocaleDateString('es-CL')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
