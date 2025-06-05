'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/trabajador/dashboard', label: '🏠 Inicio' },
  { href: '/trabajador/reportes', label: '📋 Mis Reportes' },
  { href: '/trabajador/capacitaciones', label: '🎓 Capacitaciones' },
  { href: '/trabajador/epp', label: '👷‍♂️ EPP' },
  { href: '/trabajador/protocolos', label: '⚠️ Protocolos' },
  { href: '/trabajador/notificaciones', label: '🔔 Notificaciones' },
  { href: '/trabajador/documentos', label: '📁 Documentos' },
  { href: '/trabajador/formularios', label: '📝 Formularios' },
];

export default function SidebarTrabajador() {
  const pathname = usePathname() ?? '';

  return (
    <aside className="w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Panel Trabajador</h2>
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
