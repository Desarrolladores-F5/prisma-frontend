'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/dashboard', label: '🏠 Inicio' },
  { href: '/admin/dashboard/usuarios', label: '👥 Usuarios' },
  { href: '/admin/dashboard/reportes', label: '📋 Reportes' },
  { href: '/admin/dashboard/faenas', label: '🛠️ Faenas' },
  { href: '/admin/dashboard/empresas', label: '🏢 Empresas' },
  { href: '/admin/dashboard/protocolos', label: '⚠️ Protocolos' },
  { href: '/admin/dashboard/auditorias', label: '🗂️ Auditorías' },
  { href: '/admin/dashboard/inspecciones', label: '🔍 Inspecciones' },
  { href: '/admin/dashboard/capacitaciones', label: '🎓 Capacitaciones' },
  { href: '/admin/dashboard/epp', label: '👷 EPP' },
  { href: '/admin/dashboard/notificaciones', label: '🔔 Notificaciones' },
  { href: '/admin/dashboard/documentos', label: '📄 Documentos' },
  { href: '/admin/dashboard/archivos', label: '📎 Archivos' },
  { href: '/admin/dashboard/medidas', label: '🛠️ Medidas Correctivas' },
  { href: '/admin/dashboard/firmas', label: '✍️ Firmas Digitales' },
  { href: '/admin/dashboard/configuracion', label: '⚙️ Configuración' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Panel Admin</h2>
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
