'use client';

import SidebarTrabajador from './SidebarTrabajador';

import ProtectedRoute from '../layout/ProtectedRoute';

interface Props {
  children: React.ReactNode;
}

export default function TrabajadorLayout({ children }: Props) {
  return (
    <ProtectedRoute rolPermitido={3}>
      <div className="flex h-screen bg-gray-100">
        <SidebarTrabajador />
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
