'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerUsuarios, eliminarUsuario, obtenerFaenas } from '@/lib/api';
import { Usuario, Faena } from '@/types';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Props {
  onEditar?: (usuario: Usuario) => void;
  onEliminado?: () => void;
  refrescar?: boolean;
}

export default function TablaUsuarios({ onEditar, onEliminado, refrescar }: Props) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [faenas, setFaenas] = useState<Faena[]>([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroRut, setFiltroRut] = useState('');
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroFaena, setFiltroFaena] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);

  const router = useRouter();

  const cargarUsuarios = async () => {
    const data = await obtenerUsuarios();
    setUsuarios(data);
  };

  const cargarFaenas = async () => {
    const data = await obtenerFaenas();
    setFaenas(data);
  };

  useEffect(() => {
    cargarUsuarios();
    cargarFaenas();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas cambiar el estado de este usuario?')) return;
    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) return;

    const res = await eliminarUsuario(id);

    if (res?.mensaje?.includes('desactivado') || res?.mensaje?.includes('reactivado')) {
      setMensaje(usuario.activo ? '✅ Usuario inactivado' : '✅ Usuario reactivado');
      await cargarUsuarios();
      onEliminado?.();
      setTimeout(() => setMensaje(null), 3000);
    } else {
      alert(res?.mensaje || '❌ Error al actualizar usuario');
    }
  };

  const exportarPDFPorUsuario = (usuario: Usuario) => {
  const doc = new jsPDF();

  // Título principal
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.setFont('helvetica', 'bold');
  doc.text('Ficha del Usuario', 14, 20);

  // Subtítulo con nombre
  doc.setFontSize(16);
  doc.setTextColor(70, 70, 70);
  doc.setFont('helvetica', 'bold');
  doc.text(`${usuario.nombre} ${usuario.apellido}`, 14, 30);

  // Tabla con datos del usuario
  autoTable(doc, {
    startY: 40,
    head: [['Atributo', 'Dato']],
    body: [
      ['ID', usuario.id],
      ['Nombre', `${usuario.nombre} ${usuario.apellido}`],
      ['RUT', usuario.rut],
      ['Correo', usuario.correo],
      ['Teléfono', usuario.telefono || '-'],
      ['Contacto Emergencia', usuario.contacto_emergencia_nombre || '-'],
      ['Teléfono Emergencia', usuario.contacto_emergencia_telefono || '-'],
      ['Tipo Contrato', usuario.tipo_contrato || '-'],
      ['Fecha Contrato', usuario.fecha_contrato
        ? new Date(usuario.fecha_contrato).toLocaleDateString('es-CL')
        : '-'],
      ['Rol', usuario.rol?.nombre || '-'],
      ['Faena', usuario.faena?.nombre || '-'],
      ['Firma Digital', usuario.firma_imagen_url ? 'Sí' : 'No'],
      ['Estado', usuario.activo ? 'Activo' : 'Inactivo'],
    ],
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: 255,
      halign: 'left',
      fontStyle: 'bold',
    },
    bodyStyles: {
      textColor: 50,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    margin: { top: 40 },
  });

  // Pie de página con fecha y hora
  const fecha = new Date().toLocaleString('es-CL');
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(`Generado el: ${fecha}`, 14, doc.internal.pageSize.height - 10);

  // Guardar PDF
  doc.save(`usuario_${usuario.id}.pdf`);
};


  const usuariosFiltrados = usuarios.filter((u) => {
    const nombreCompleto = `${u.nombre} ${u.apellido}`.toLowerCase();
    const rut = u.rut.toLowerCase();
    const rol = u.rol?.nombre?.toLowerCase() || '';
    const faena = u.faena?.nombre?.toLowerCase() || '';

    return (
      nombreCompleto.includes(filtroNombre.toLowerCase()) &&
      rut.includes(filtroRut.toLowerCase()) &&
      (filtroRol === '' || rol === filtroRol.toLowerCase()) &&
      (filtroFaena === '' || faena === filtroFaena.toLowerCase())
    );
  });

  return (
    <div className="mt-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <input type="text" placeholder="Buscar por nombre..." value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} className="border p-2 rounded" />
        <input type="text" placeholder="Buscar por RUT..." value={filtroRut} onChange={(e) => setFiltroRut(e.target.value)} className="border p-2 rounded" />
        <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)} className="border p-2 rounded">
          <option value="">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Supervisor">Supervisor</option>
          <option value="Trabajador">Trabajador</option>
        </select>
        <select value={filtroFaena} onChange={(e) => setFiltroFaena(e.target.value)} className="border p-2 rounded">
          <option value="">Todas las faenas</option>
          {faenas.map((f) => (
            <option key={f.id} value={f.nombre}>{f.nombre}</option>
          ))}
        </select>
      </div>

      {/* Mensaje */}
      {mensaje && (
        <div className="mb-4 px-4 py-2 bg-green-100 border border-green-400 text-green-800 rounded shadow">
          {mensaje}
        </div>
      )}

      {/* Conteo */}
      <h2 className="text-lg font-semibold mb-2">
        Usuarios Registrados
        <span className="ml-2 text-gray-600 text-sm">
          Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios
        </span>
      </h2>

      {/* Tabla */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">ID</th>
            <th className="p-2">Foto</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">RUT</th>
            <th className="p-2">Correo</th>
            <th className="p-2">Teléfono</th>
            <th className="p-2">Contacto</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Fecha</th>
            <th className="p-2">Rol</th>
            <th className="p-2">Faena</th>
            <th className="p-2">Firma</th>
            <th className="p-2">Estado</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((u) => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="p-2">{u.id}</td>
              <td className="p-2">
                {u.foto_url ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}${u.foto_url}?t=${Date.now()}`}
                    alt={`${u.nombre} ${u.apellido}`}
                    className="h-10 w-10 rounded-full object-cover border"
                  />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-2">{u.nombre} {u.apellido}</td>
              <td className="p-2">{u.rut}</td>
              <td className="p-2">{u.correo}</td>
              <td className="p-2">{u.telefono || '-'}</td>
              <td className="p-2">
                {u.contacto_emergencia_nombre || u.contacto_emergencia_telefono ? (
                  <>
                    <div className="font-medium">{u.contacto_emergencia_nombre || '-'}</div>
                    <div className="text-gray-600">{u.contacto_emergencia_telefono || '-'}</div>
                  </>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="p-2">{u.tipo_contrato || '-'}</td>
              <td className="p-2">{u.fecha_contrato ? new Date(u.fecha_contrato).toLocaleDateString('es-CL') : '-'}</td>
              <td className="p-2">{u.rol?.nombre}</td>
              <td className="p-2">{u.faena?.nombre || '-'}</td>
              <td className="p-2">{u.firma_imagen_url ? <span className="text-green-600 font-medium">Sí</span> : <span className="text-red-500 font-medium">No</span>}</td>
              <td className="p-2">{u.activo ? <span className="text-green-600 font-medium">Activo</span> : <span className="text-red-500 font-medium">Inactivo</span>}</td>
              <td className="p-2 space-x-2">
                <button onClick={() => onEditar?.(u)} className="bg-yellow-500 text-white px-2 py-1 rounded text-sm">Editar</button>
                <button
                  onClick={() => handleEliminar(u.id)}
                  className={`text-white px-2 py-1 rounded text-sm ${u.activo ? 'bg-red-600' : 'bg-green-600'}`}
                >
                  {u.activo ? 'Inactivar' : 'Reactivar'}
                </button>
                <button
                  onClick={() => exportarPDFPorUsuario(u)}
                  className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700 transition"
                >
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {usuariosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 mt-4">No se encontraron usuarios con los filtros aplicados.</p>
      )}
    </div>
  );
}
