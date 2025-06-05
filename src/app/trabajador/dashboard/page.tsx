'use client';

import TrabajadorLayout from '@/components/layout/TrabajadorLayout';
import DashboardTrabajador from '@/components/trabajador/DashboardTrabajador';

export default function Page() {
  return (
    <TrabajadorLayout>
      <DashboardTrabajador />
    </TrabajadorLayout>
  );
}
