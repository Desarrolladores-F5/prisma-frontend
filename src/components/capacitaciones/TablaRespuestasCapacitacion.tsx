// src/components/capacitaciones/TablaRespuestasCapacitacion.tsx
'use client';

import { useEffect, useState } from 'react';
import { obtenerCapacitacionRespuestas, obtenerCapacitaciones } from '@/lib/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  capacitacionId: number;
}

export default function TablaRespuestasCapacitacion({ capacitacionId }: Props) {
  const [respuestas, setRespuestas] = useState<any[]>([]);
  const [capacitacion, setCapacitacion] = useState<any>(null);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    try {
      const [respuestasData, todasCapacitaciones] = await Promise.all([
        obtenerCapacitacionRespuestas(capacitacionId),
        obtenerCapacitaciones()
      ]);

      setRespuestas(respuestasData);
      const cap = todasCapacitaciones.find((c) => c.id === capacitacionId);
      setCapacitacion(cap);
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [capacitacionId]);

  const exportarPDF = () => {
    if (!capacitacion) return;

    const doc = new jsPDF();
    doc.text('Resumen de Respuestas', 14, 18);
    doc.text(`Capacitación: ${capacitacion.titulo}`, 14, 26);
    doc.text(`Fecha: ${new Date(capacitacion.fecha).toLocaleDateString()}`, 14, 34);

    const filas = respuestas.map(r => [
      r.rut,
      r.nombre,
      r.apellido,
      r.faena_id || '—',
      new Date(r.fecha_respuesta).toLocaleDateString(),
      r.aprobado ? 'Sí' : 'No',
      `${r.porcentaje_aprobacion}%`
    ]);

    autoTable(doc, {
      head: [['RUT', 'Nombre', 'Apellido', 'Faena', 'Fecha', 'Aprobado', '% Aprobación']],
      body: filas,
      startY: 40
    });

    doc.save(`resumen_capacitacion_${capacitacionId}.pdf`);
  };

  if (cargando) return <p className="text-center mt-4">Cargando datos...</p>;

  return (
    <div>
      {capacitacion && (
        <div className="text-center mb-6">
          <p><strong>Capacitación:</strong> {capacitacion.titulo}</p>
          <p><strong>Fecha:</strong> {new Date(capacitacion.fecha).toLocaleDateString()}</p>
        </div>
      )}

      <div className="flex justify-end mb-4">
        <button
          onClick={exportarPDF}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Descargar PDF
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">RUT</th>
              <th className="border p-2">Nombre</th>
              <th className="border p-2">Apellido</th>
              <th className="border p-2">Faena</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Aprobado</th>
              <th className="border p-2">% Aprobación</th>
            </tr>
          </thead>
          <tbody>
            {respuestas.map((r) => (
              <tr key={r.usuario_id}>
                <td className="border p-2">{r.rut}</td>
                <td className="border p-2">{r.nombre}</td>
                <td className="border p-2">{r.apellido}</td>
                <td className="border p-2">{r.faena_id || '—'}</td>
                <td className="border p-2">{new Date(r.fecha_respuesta).toLocaleDateString()}</td>
                <td className="border p-2">{r.aprobado ? '✅' : '❌'}</td>
                <td className="border p-2">{r.porcentaje_aprobacion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
