'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/supervisor/dashboard', label: '🏠 Inicio' },
  { href: '/supervisor/usuarios', label: '👥 Usuarios' }, 
  { href: '/supervisor/inspecciones', label: '🔍 Inspecciones' },
  { href: '/supervisor/reportes', label: '📋 Reportes' },
  { href: '/supervisor/capacitaciones', label: '🎓 Capacitaciones' },
  { href: '/supervisor/protocolos', label: '⚠️ Protocolos' }, 
  { href: '/supervisor/auditorias', label: '🗂️ Auditorías' },
  { href: '/supervisor/medidas', label: '🛠️ Medidas Correctivas' }, 
  { href: '/supervisor/notificaciones', label: '🔔 Notificaciones' },
  { href: '/supervisor/documentos', label: '📁 Documentos' },
  { href: '/supervisor/formularios', label: '📝 Formularios' }, 
];

export default function SidebarSupervisor() {
  const pathname = usePathname() ?? '';

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Panel Supervisor</h2>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block p-2 rounded hover:bg-gray-700 transition ${
              pathname.startsWith(link.href) ? 'bg-gray-700' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
