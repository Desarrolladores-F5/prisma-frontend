'use client';

interface Props {
  nombreUsuario: string;
  onLogout: () => void;
  rol: 'admin' | 'supervisor' | 'trabajador';
}

/* Fondo + texto por rol */
const headerByRole: Record<Props['rol'], string> = {
  admin: 'bg-blue-800 text-white',        // Admin
  supervisor: 'bg-emerald-700 text-white',// Supervisor
  trabajador: 'bg-amber-600 text-white',  // Trabajador
};

/* Botón invertido por rol */
const btnByRole: Record<Props['rol'], string> = {
  admin:
    'bg-white text-blue-800 border border-blue-800 hover:bg-blue-800 hover:text-white',
  supervisor:
    'bg-white text-emerald-700 border border-emerald-700 hover:bg-emerald-700 hover:text-white',
  trabajador:
    'bg-white text-amber-600 border border-amber-600 hover:bg-amber-600 hover:text-white',
};

export default function Header({ nombreUsuario, onLogout, rol }: Props) {
  const headerClass = headerByRole[rol];
  const buttonClass = btnByRole[rol];

  return (
    <header className={`px-6 py-4 flex justify-between items-center shadow ${headerClass}`}>
      <h1 className="text-xl font-bold">Bienvenido, {nombreUsuario}</h1>
      <button
        type="button"
        onClick={onLogout}
        className={`font-semibold text-lg px-5 py-2.5 rounded transition ${buttonClass}`}
        aria-label="Cerrar sesión"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
