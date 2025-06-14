'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  HardHat,
  ShieldAlert,
  Bell,
  File,
  ClipboardCheck
} from 'lucide-react';

const links = [
  { href: '/trabajador/dashboard', label: 'Inicio', icon: LayoutDashboard },
  { href: '/trabajador/reportes', label: 'Mis Reportes', icon: ClipboardList },
  { href: '/trabajador/capacitaciones', label: 'Capacitaciones', icon: GraduationCap },
  { href: '/trabajador/epp', label: 'EPP', icon: HardHat },
  { href: '/trabajador/protocolos', label: 'Protocolos', icon: ShieldAlert },
  { href: '/trabajador/notificaciones', label: 'Notificaciones', icon: Bell },
  { href: '/trabajador/documentos', label: 'Documentos', icon: File },
  { href: '/trabajador/formularios', label: 'Formularios', icon: ClipboardCheck },
];

export default function SidebarTrabajador() {
  const pathname = usePathname() ?? '';

  return (
    <aside className="w-64 bg-sky-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Panel Trabajador</h2>
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 p-2 rounded transition text-sm ${
              pathname.startsWith(href) ? 'bg-sky-800' : 'hover:bg-sky-800'
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
