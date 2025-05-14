'use client';

import { useRouter } from 'next/navigation';

export function useLogout() {
  const router = useRouter();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return { cerrarSesion };
}
