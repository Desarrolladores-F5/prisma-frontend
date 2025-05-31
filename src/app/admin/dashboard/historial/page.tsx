'use client';

import { useRouter } from 'next/navigation';
import TablaHistorial from '@/components/historial/TablaHistorial';

export default function HistorialPage() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Historial de Cambios</h1>
          <p className="text-gray-600">
            Registro detallado de acciones realizadas en el sistema.
          </p>
        </div>
        <button
          onClick={() => router.push('/admin/dashboard')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Volver al Inicio
        </button>
      </div>

      <TablaHistorial />
    </div>
  );
}
