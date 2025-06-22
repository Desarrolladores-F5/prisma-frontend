'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { obtenerRespuestaPorId, descargarPDFRespuestaFormulario } from '@/lib/api';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
}

interface RespuestaFormulario {
  id: number;
  formulario_id: number;
  usuario?: Usuario;
  respuestas_json: any;
  fecha_respuesta: string;
  estado_firma: string;
}

export default function DetalleRespuestaSupervisor() {
  const router = useRouter();
  const params = useParams();
  const id = Number(Array.isArray(params?.id) ? params.id[0] : params?.id);

  const [respuesta, setRespuesta] = useState<RespuestaFormulario | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerRespuestaPorId(id);
        setRespuesta(data);
      } catch (error) {
        console.error(error);
        setMensaje('❌ Error al cargar la respuesta.');
      } finally {
        setCargando(false);
      }
    };

    if (!isNaN(id) && id > 0) cargar();
  }, [id]);

  const manejarDescargaPDF = async () => {
    try {
      await descargarPDFRespuestaFormulario(id);
    } catch (error) {
      alert('❌ No se pudo descargar el PDF firmado.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Detalle de la Respuesta</h1>
        <div className="flex gap-2">
          <button
            onClick={() => router.back()}
            className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Volver
          </button>
          {respuesta && (
            <button
              onClick={manejarDescargaPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Descargar PDF
            </button>
          )}
        </div>
      </div>

      {mensaje && <p className="text-red-600">{mensaje}</p>}

      {cargando ? (
        <p className="text-gray-500">Cargando...</p>
      ) : respuesta ? (
        <div className="bg-white p-4 shadow rounded">
          <p><strong>ID:</strong> {respuesta.id}</p>
          <p><strong>Formulario:</strong> #{respuesta.formulario_id}</p>
          <p><strong>Usuario:</strong> {respuesta.usuario ? `${respuesta.usuario.nombre} ${respuesta.usuario.apellido}` : '—'}</p>
          <p><strong>Fecha:</strong> {new Date(respuesta.fecha_respuesta).toLocaleString()}</p>
          <p><strong>Estado de Firma:</strong> {respuesta.estado_firma}</p>

          <hr className="my-4" />

          <h2 className="text-lg font-semibold mb-2">Contenido del Formulario</h2>
          <table className="w-full text-sm border border-gray-300 bg-gray-50 rounded overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-4 py-2 text-left">Campo</th>
                <th className="border px-4 py-2 text-left">Respuesta</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(respuesta.respuestas_json).map(([campo, valor]) => {
                const valorFormateado =
                  campo.toLowerCase() === 'conforme'
                    ? valor
                      ? '✔ Conforme'
                      : '✘ No conforme'
                    : typeof valor === 'object'
                    ? JSON.stringify(valor)
                    : String(valor);

                return (
                  <tr key={campo} className="border-t">
                    <td className="border px-4 py-2 font-medium capitalize">{campo}</td>
                    <td className="border px-4 py-2">{valorFormateado}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-red-500">No se encontró la respuesta solicitada.</p>
      )}
    </div>
  );
}
