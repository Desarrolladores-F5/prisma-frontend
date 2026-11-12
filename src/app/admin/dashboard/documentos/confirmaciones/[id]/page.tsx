// src/app/admin/dashboard/documentos/confirmaciones/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { obtenerConstanciaProtegida } from '@/lib/api';

interface ConfirmacionDocumento {
  id: number;
  usuario_id: number;
  nombre_usuario: string;
  correo_usuario: string;
  documento_id: number;
  nombre_documento: string;
  tipo_documento: string;
  fecha_recepcion: string | null;
  ruta_constancia_pdf?: string | null;
  confirmado: boolean;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ConfirmacionesDocumentoPage() {
  const params = useParams() as { id?: string | string[] };
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [confirmaciones, setConfirmaciones] = useState<ConfirmacionDocumento[]>([]);
  const [loading, setLoading] = useState(true);
  const [nombreDocumento, setNombreDocumento] = useState<string>('');
  const [abriendoId, setAbriendoId] = useState<number | null>(null);

  useEffect(() => {
    const obtenerConfirmaciones = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('Debes iniciar sesión para consultar las confirmaciones.');
        }

        const res = await fetch(
          `${BASE_URL}/api/rel-documentos-usuarios/documento/${id}/confirmaciones`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
          }
        );

        if (!res.ok) {
          throw new Error('Error al obtener confirmaciones');
        }

        const data: ConfirmacionDocumento[] = await res.json();
        setConfirmaciones(data);

        setNombreDocumento(
          data.length > 0 && data[0].nombre_documento
            ? data[0].nombre_documento
            : ''
        );
      } catch (error: unknown) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'No fue posible cargar las confirmaciones.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void obtenerConfirmaciones();
    }
  }, [id]);

  const verConstancia = async (asignacionId: number) => {
    if (!Number.isSafeInteger(asignacionId) || asignacionId <= 0) {
      toast.error('Identificador de asignación inválido.');
      return;
    }

    if (abriendoId !== null) {
      return;
    }

    // Abrir inmediatamente desde el clic evita bloqueos de ventanas emergentes.
    const ventana = window.open('', '_blank');

    if (!ventana) {
      toast.error(
        'El navegador bloqueó la nueva pestaña. Permite ventanas emergentes para PRISMA.'
      );
      return;
    }

    setAbriendoId(asignacionId);

    try {
      const pdf = await obtenerConstanciaProtegida(asignacionId);
      const urlTemporal = URL.createObjectURL(pdf);

      ventana.location.href = urlTemporal;

      window.setTimeout(() => {
        URL.revokeObjectURL(urlTemporal);
      }, 60000);
    } catch (error: unknown) {
      ventana.close();

      toast.error(
        error instanceof Error
          ? error.message
          : 'No fue posible abrir la constancia.'
      );
    } finally {
      setAbriendoId(null);
    }
  };

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
        <p className="text-gray-500">
          No hay confirmaciones registradas aún.
        </p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Correo</th>
              <th className="border p-2">Confirmado</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Constancia</th>
            </tr>
          </thead>

          <tbody>
            {confirmaciones.map((conf, index) => (
              <tr key={conf.id} className="border-t text-center">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{conf.nombre_usuario}</td>
                <td className="p-2">{conf.correo_usuario}</td>

                <td className="p-2">
                  {conf.confirmado ? (
                    <span className="text-green-600 font-semibold">
                      ✅ Sí
                    </span>
                  ) : (
                    <span className="text-gray-500">
                      ⏳ No
                    </span>
                  )}
                </td>

                <td className="p-2">
                  {conf.fecha_recepcion
                    ? new Date(conf.fecha_recepcion).toLocaleDateString('es-CL')
                    : '—'}
                </td>

                <td className="p-2">
                  {conf.confirmado && conf.ruta_constancia_pdf ? (
                    <button
                      type="button"
                      onClick={() => void verConstancia(conf.id)}
                      disabled={abriendoId !== null}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {abriendoId === conf.id ? 'Abriendo...' : 'Ver PDF'}
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">
                      Pendiente
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
