'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { obtenerRespuestaPorId } from '@/lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

  const generarPDF = () => {
    if (!respuesta) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Detalle de Respuesta #${respuesta.id}`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Formulario ID: ${respuesta.formulario_id}`, 14, 30);
    doc.text(
      `Usuario: ${respuesta.usuario?.nombre ?? '—'} ${respuesta.usuario?.apellido ?? ''}`,
      14,
      38
    );
    doc.text(`Fecha: ${new Date(respuesta.fecha_respuesta).toLocaleString()}`, 14, 46);
    doc.text(`Estado de Firma: ${respuesta.estado_firma}`, 14, 54);

    const body = Object.entries(respuesta.respuestas_json).map(([campo, valor]) => {
      const campoFormateado = campo.charAt(0).toUpperCase() + campo.slice(1);
      const respuestaFormateada =
        campo.toLowerCase() === 'conforme'
          ? valor
            ? '✔ Conforme'
            : '✘ No conforme'
          : typeof valor === 'object'
          ? JSON.stringify(valor)
          : String(valor);
      return [campoFormateado, respuestaFormateada];
    });

    autoTable(doc, {
      startY: 65,
      head: [['Campo', 'Respuesta']],
      body,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [40, 60, 100] }
    });

    doc.save(`respuesta_formulario_${respuesta.id}.pdf`);
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
              onClick={generarPDF}
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
        <p className="text-red-500">No se encontró la respuesta solicitada.</p>
      )}
    </div>
  );
}
