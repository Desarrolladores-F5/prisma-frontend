'use client';

import Link from 'next/link';
import TablaEppTrabajador from '@/components/trabajador/TablaEppTrabajador';

export default function PaginaEppTrabajador() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Mis EPP Asignados</h1>
        <Link
          href="/trabajador/dashboard"
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver al Inicio
        </Link>
      </div>
      <TablaEppTrabajador />
    </div>
  );
}
