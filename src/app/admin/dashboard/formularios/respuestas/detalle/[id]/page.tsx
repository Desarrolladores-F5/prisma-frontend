// Ruta: /admin/dashboard/formularios/respuestas/detalle/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { obtenerRespuestaPorId } from '@/lib/api';

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

export default function DetalleRespuestaPage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? parseInt(params.id[0]) : parseInt(params?.id ?? '0');

  const [respuesta, setRespuesta] = useState<RespuestaFormulario | null>(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerRespuestaPorId(id);
        setRespuesta(data);
      } catch (error) {
        console.error(error);
        setMensaje('❌ Error al cargar la respuesta.');
      }
    };

    if (id) cargar();
  }, [id]);

  const generarPDF = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/respuestas-formulario/pdf/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error('Error al generar el PDF');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `respuesta_formulario_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('❌ Error al descargar PDF:', error);
      alert('No se pudo descargar el PDF firmado.');
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
            Volver al Listado
          </button>
          {respuesta && (
            <button
              onClick={generarPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Descargar PDF
            </button>
          )}
        </div>
      </div>

      {mensaje && <p className="text-red-600">{mensaje}</p>}

      {respuesta ? (
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
                let valorFormateado;

                if (campo.toLowerCase() === 'conforme') {
                  valorFormateado = valor ? '✔ Conforme' : '✘ No conforme';
                } else if (typeof valor === 'object') {
                  valorFormateado = JSON.stringify(valor);
                } else {
                  valorFormateado = String(valor);
                }

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
        <p className="text-gray-500">Cargando...</p>
      )}
    </div>
  );
}
