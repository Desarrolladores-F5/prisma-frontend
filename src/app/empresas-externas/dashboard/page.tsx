// src/app/empresas-externas/dashboard/page.tsx

'use client';

import EmpresaExternaDashboard from '@/components/empresas-externas/EmpresaExternaDashboard';

export default function EmpresasExternasDashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <EmpresaExternaDashboard />
      </div>
    </main>
  );
}
