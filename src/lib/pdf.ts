import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface RespuestaResumen {
  rut: string;
  nombre: string;
  apellido: string;
  faena_id: number | null;
  fecha_respuesta: string;
  aprobado: boolean;
  porcentaje_aprobacion: number;
}

export function generarPDFResumen(capacitacionTitulo: string, fecha: string, respuestas: RespuestaResumen[]) {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(16);
  doc.text('Resumen de Respuestas', 105, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.text(`Capacitación: ${capacitacionTitulo}`, 14, 30);
  doc.text(`Fecha: ${fecha}`, 14, 38);

  // Tabla
  const tableBody = respuestas.map(r => [
    r.rut,
    r.nombre,
    r.apellido,
    r.faena_id ?? '—',
    new Date(r.fecha_respuesta).toLocaleDateString(),
    r.aprobado ? '✅' : '❌',
    `${r.porcentaje_aprobacion}%`
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['RUT', 'Nombre', 'Apellido', 'Faena', 'Fecha', 'Aprobado', '% Aprobación']],
    body: tableBody
  });

  // Guardar
  doc.save(`Resumen_${capacitacionTitulo.replace(/\s+/g, '_')}.pdf`);
}
