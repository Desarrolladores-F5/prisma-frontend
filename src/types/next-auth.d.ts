// src/types/next-auth.d.ts
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: number;
      nombre?: string;
      correo?: string;
      rol_id: number;
      token: string;
    };
  }

  interface User {
    id: number;
    nombre?: string;
    correo?: string;
    rol_id: number;
    token: string;
  }
}
