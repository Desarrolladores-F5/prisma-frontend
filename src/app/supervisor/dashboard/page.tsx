'use client';

import SupervisorLayout from '@/components/layout/SupervisorLayout';
import DashboardSupervisor from '@/components/supervisor/DashboardSupervisor';

export default function Page() {
  return (
    <SupervisorLayout>
      <DashboardSupervisor />
    </SupervisorLayout>
  );
}
