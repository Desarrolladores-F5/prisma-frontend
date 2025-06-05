'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TablaProtocolos from '@/components/supervisor/TablaProtocolosSupervisor';

export default function PageProtocolosSupervisor() {
  const router = useRouter();
  const [refrescar, setRefrescar] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Protocolos</h1>
        <button
          onClick={() => router.push('/supervisor/dashboard')}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        >
          Volver al Inicio
        </button>
      </div>

      <TablaProtocolos refrescar={refrescar} />
    </div>
  );
}
