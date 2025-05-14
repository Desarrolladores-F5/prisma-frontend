'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { obtenerRolDesdeToken } from '@/lib/validate-role';

export default function TrabajadorDashboard() {
  const router = useRouter();
  const [permitido, setPermitido] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/acceso-denegado');
      return;
    }

    const rol_id = obtenerRolDesdeToken(token);
    if (rol_id !== 3) {
      router.push('/acceso-denegado');
    } else {
      setPermitido(true);
    }
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!permitido) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-8">Panel Trabajador</h2>
        <nav className="space-y-4 text-sm">
          <a href="#" className="block hover:text-yellow-400">Inicio</a>
          <a href="#" className="block hover:text-yellow-400">Mis EPP</a>
          <a href="#" className="block hover:text-yellow-400">Capacitaciones</a>
          <a href="#" className="block hover:text-yellow-400">Notificaciones</a>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Bienvenido, Trabajador</h1>
          <button
            onClick={cerrarSesion}
            className="bg-yellow-400 text-white px-4 py-2 rounded shadow hover:bg-yellow-500"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="text-gray-700">
          <p>Resumen de tus actividades, capacitaciones y elementos entregados.</p>
        </div>
      </main>
    </div>
  );
}
