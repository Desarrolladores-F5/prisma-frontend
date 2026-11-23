'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';

import TablaContratistas, {
  type ResumenContratoExterno,
} from '@/components/contratistas/TablaContratistas';

export default function GestionContratistasPage() {
  const router = useRouter();

  const [contratos, setContratos] = useState<ResumenContratoExterno[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizacion, setActualizacion] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarContratos() {
      setCargando(true);
      setError('');

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '');
        const token = localStorage.getItem('token');

        if (!apiUrl) {
          throw new Error('La URL del backend no está configurada.');
        }

        if (!token) {
          throw new Error('Debes iniciar sesión como administrador.');
        }

        const respuesta = await fetch(
          `${apiUrl}/api/contratos-externos/resumen-documental`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: 'no-store',
            signal: controlador.signal,
          }
        );

        if (!respuesta.ok) {
          const datos = await respuesta.json().catch(() => null);

          throw new Error(
            datos?.mensaje ||
            `No fue posible consultar los contratos (HTTP ${respuesta.status}).`
          );
        }

        const datos: unknown = await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error('El servidor devolvió un listado inválido.');
        }

        if (!controlador.signal.aborted) {
          setContratos(datos as ResumenContratoExterno[]);
        }
      } catch (error: unknown) {
        if (!controlador.signal.aborted) {
          setError(
            error instanceof Error
              ? error.message
              : 'No fue posible cargar los contratos externos.'
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    void cargarContratos();

    return () => controlador.abort();
  }, [actualizacion]);

  function verDocumentos(contratoId: number) {
    const contratoAutorizado = contratos.some(
      contrato => contrato.id === contratoId
    );

    if (!contratoAutorizado) {
      setError('El contrato seleccionado no está disponible.');
      return;
    }

    router.push(
      `/admin/dashboard/documentos/externos/${contratoId}`
    );
  }

  return (
    <AdminLayout>
      <section className="mx-auto max-w-7xl rounded-xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestión de contratistas
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Contratos, contratistas, subcontratistas y documentación externa.
            </p>
          </div>

          <Link
            href="/admin/dashboard"
            className="rounded bg-gray-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            Volver al Inicio
          </Link>
        </div>

        {cargando && (
          <p role="status" className="mt-6 text-gray-600">
            Cargando contratistas y subcontratistas…
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded border border-red-200 bg-red-50 p-4 text-red-800"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={() => setActualizacion(valor => valor + 1)}
              className="mt-2 text-sm font-semibold underline"
            >
              Reintentar consulta
            </button>
          </div>
        )}

        {!cargando && !error && (
          <TablaContratistas
            contratos={contratos}
            onVerDocumentos={verDocumentos}
          />
        )}
      </section>
    </AdminLayout>
  );
}
