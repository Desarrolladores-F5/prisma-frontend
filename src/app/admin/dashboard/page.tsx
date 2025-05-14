'use client';

import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminLayout from '@/components/layout/AdminLayout';

export default function Page() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
