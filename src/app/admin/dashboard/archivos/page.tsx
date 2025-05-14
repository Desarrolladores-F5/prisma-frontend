'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import TablaArchivos from '@/components/archivos/TablaArchivos';
import FormularioArchivo, { ArchivoAdjunto } from '@/components/archivos/FormularioArchivo';
import { obtenerArchivosAdjuntos } from '@/lib/api';

export default function PageArchivos() {
  const router = useRouter();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<ArchivoAdjunto | null>(null);
  const [archivos, setArchivos] = useState<ArchivoAdjunto[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await obtenerArchivosAdjuntos();
        setArchivos(data);
      } catch (error) {
        console.error('❌ Error al obtener archivos adjuntos:', error);
      }
    };
    cargarDatos();
  }, [refrescar]);

  const handleEditar = (archivo: ArchivoAdjunto) => {
    setArchivoSeleccionado(archivo);
    setMostrarFormulario(true);
  };

  const handleGuardado = () => {
    setArchivoSeleccionado(null);
    setMostrarFormulario(false);
    setRefrescar(!refrescar);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Gestión de Archivos Adjuntos</h1>
        <div className="flex space-x-2">
          {mostrarFormulario ? (
            <button
              onClick={() => {
                setArchivoSeleccionado(null);
                setMostrarFormulario(false);
              }}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Volver al Listado
            </button>
          ) : (
            <>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
              >
                Volver al Inicio
              </button>
              <button
                onClick={() => setMostrarFormulario(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Nuevo Archivo
              </button>
            </>
          )}
        </div>
      </div>

      {mostrarFormulario ? (
        <FormularioArchivo archivo={archivoSeleccionado} onGuardado={handleGuardado} />
      ) : (
        <TablaArchivos refrescar={refrescar} onEditarArchivo={handleEditar} />
      )}
    </div>
  );
}
