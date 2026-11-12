'use client';

import CampanitaNotificaciones from './CampanitaNotificaciones';

import Sidebar from './Sidebar';
import ProtectedRoute from './ProtectedRoute';

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <ProtectedRoute rolPermitido={1}>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content (sin Header aquí) */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-end mb-3 relative z-20">
            <CampanitaNotificaciones rol="admin" />
          </div>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
