'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

interface Props {
  children: ReactNode;
}

// Componente que guarda el token JWT en localStorage
function GuardarTokenLocalStorage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.token) {
      localStorage.setItem('token', session.user.token);
    }
  }, [session]);

  return null;
}

// Envoltura de sesión global
export default function SessionWrapper({ children }: Props) {
  return (
    <SessionProvider>
      <GuardarTokenLocalStorage />
      {children}
    </SessionProvider>
  );
}
