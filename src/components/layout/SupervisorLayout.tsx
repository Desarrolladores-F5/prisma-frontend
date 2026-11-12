'use client';

import CampanitaNotificaciones from './CampanitaNotificaciones';

import SidebarSupervisor from './SidebarSupervisor';
import ProtectedRoute from './ProtectedRoute';

interface Props {
  children: React.ReactNode;
}

export default function SupervisorLayout({ children }: Props) {
  return (
    <ProtectedRoute rolPermitido={2}>
      <div className="flex h-screen bg-gray-100">
        <SidebarSupervisor />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-end mb-3 relative z-20">
            <CampanitaNotificaciones rol="supervisor" />
          </div>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
