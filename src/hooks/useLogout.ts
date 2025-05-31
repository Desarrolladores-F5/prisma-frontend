'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export function useLogout() {
  const router = useRouter();

  const cerrarSesion = async () => {
    await signOut({ redirect: false });
    router.push('/login'); // redirección manual si estás en App Router
  };

  return { cerrarSesion };
}
