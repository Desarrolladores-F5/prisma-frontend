'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  GraduationCap,
  ShieldAlert,
  FolderKanban,
  Search,
  ScrollText,
  Bell,
  File,
  ClipboardCheck
} from 'lucide-react';

const links = [
  { href: '/supervisor/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/supervisor/usuarios', label: 'Usuarios', icon: Users },
  { href: '/supervisor/inspecciones', label: 'Inspecciones', icon: Search },
  { href: '/supervisor/reportes', label: 'Reportes', icon: ClipboardList },
  { href: '/supervisor/capacitaciones', label: 'Capacitaciones', icon: GraduationCap },
  { href: '/supervisor/protocolos', label: 'Protocolos', icon: ShieldAlert },
  { href: '/supervisor/auditorias', label: 'Auditorías', icon: FolderKanban },
  { href: '/supervisor/medidas', label: 'Medidas Correctivas', icon: ScrollText },
  { href: '/supervisor/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/supervisor/documentos', label: 'Documentos', icon: File },
  { href: '/supervisor/formularios', label: 'Formularios', icon: ClipboardCheck },
];

export default function SidebarSupervisor() {
  const pathname = usePathname() ?? '';

  return (
    <aside className="w-64 bg-indigo-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Panel Supervisor</h2>
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 p-2 rounded text-sm transition ${
              pathname.startsWith(href) ? 'bg-indigo-800' : 'hover:bg-indigo-800'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
