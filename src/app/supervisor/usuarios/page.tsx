// src/app/supervisor/dashboard/usuarios/page.tsx
'use client';

import TablaUsuariosSupervisor from '@/components/supervisor/TablaUsuariosSupervisor';

export default function UsuariosSupervisorPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <TablaUsuariosSupervisor />
    </div>
  );
}
