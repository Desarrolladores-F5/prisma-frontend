'use client';

import Indicador from './Indicador';
import { useLogout } from '@/hooks/useLogout';
import { useSession } from 'next-auth/react';

export default function DashboardSupervisor() {
  const { cerrarSesion } = useLogout();
  const { data: session } = useSession();

  // 🧠 Asume que session.user.nombre ya viene desde el backend
  const nombre = session?.user?.nombre || 'Supervisor';

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

      <div className="flex gap-6 mb-8">
        <Indicador icono="📄" titulo="Reportes Pendientes" valor={5} />
        <Indicador icono="📝" titulo="Tareas Pendientes" valor={12} />
        <Indicador icono="👷‍♂️" titulo="Trabajadores Activos" valor={8} />
      </div>
    </div>
  );
}
