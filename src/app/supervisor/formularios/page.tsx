'use client';

import { useRouter } from 'next/navigation';
import TablaFormulariosSupervisor from '@/components/supervisor/TablaFormulariosSupervisor';

export default function PageFormulariosSupervisor() {
  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Formularios Registrados</h1>
        <button
          onClick={() => router.push('/supervisor/dashboard')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver al Inicio
        </button>
      </div>

      <TablaFormulariosSupervisor />
    </div>
  );
}
