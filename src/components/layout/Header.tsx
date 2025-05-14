'use client';

import { useLogout } from '@/hooks/useLogout';

interface Props {
  nombreUsuario: string;
  onLogout: () => void;
}

export default function Header({ nombreUsuario, onLogout }: Props) {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Bienvenido, {nombreUsuario}</h1>
      <button
        onClick={onLogout}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
