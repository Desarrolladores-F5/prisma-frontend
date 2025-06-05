'use client';

import { useSession } from 'next-auth/react';
import { useLogout } from '@/hooks/useLogout';

export default function DashboardTrabajador() {
  const { data: session } = useSession();
  const { cerrarSesion } = useLogout();

  const nombre = session?.user?.nombre || 'Trabajador';

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bienvenido, {nombre}</h1>
        <button
          onClick={cerrarSesion}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">📋 Reportes Enviados</h2>
          <p className="text-blue-600 text-xl mt-2">3</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">🎓 Capacitaciones</h2>
          <p className="text-green-600 text-xl mt-2">4</p>
        </div>
        <div className="bg-white p-4 rounded shadow text-center">
          <h2 className="text-lg font-semibold">👷‍♂️ EPP Asignados</h2>
          <p className="text-yellow-600 text-xl mt-2">2</p>
        </div>
      </div>
    </div>
  );
}
