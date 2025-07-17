'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
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
  ClipboardCheck,
} from 'lucide-react';

const groupedLinks = [
  {
    title: 'Gestión Operativa',
    links: [
      { href: '/supervisor/dashboard', label: 'Inicio', icon: LayoutDashboard },
      { href: '/supervisor/usuarios', label: 'Usuarios', icon: Users },
      { href: '/supervisor/reportes', label: 'Reportes', icon: ClipboardList },
      { href: '/supervisor/inspecciones', label: 'Inspecciones', icon: Search },
    ],
  },
  {
    title: 'Prevención y Control',
    links: [
      { href: '/supervisor/capacitaciones', label: 'Capacitaciones', icon: GraduationCap },
      { href: '/supervisor/auditorias', label: 'Auditorías', icon: FolderKanban },
      { href: '/supervisor/medidas', label: 'Medidas Correctivas', icon: ScrollText },
    ],
  },
  {
    title: 'Recursos y Gestión',
    links: [
      { href: '/supervisor/notificaciones', label: 'Notificaciones', icon: Bell },
      { href: '/supervisor/documentos', label: 'Documentos', icon: File },
      { href: '/supervisor/formularios', label: 'Formularios', icon: ClipboardCheck },
    ],
  },
];

export default function SidebarSupervisor() {
  const pathname = usePathname() ?? '';

  return (
    <aside className="w-64 bg-blue-900 text-white p-4 h-screen">
      <h2 className="text-xl font-bold mb-6">Panel Supervisor</h2>
      <nav className="space-y-4">
        {groupedLinks.map((section) => (
          <Disclosure key={section.title}>
            {({ open }) => (
              <div>
                <Disclosure.Button className="w-full text-left font-semibold text-sm text-gray-300 hover:text-white">
                  {section.title}
                </Disclosure.Button>
                <Disclosure.Panel className="mt-2 space-y-1">
                  {section.links.map(({ href, label, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-blue-800 transition text-sm ${
                        pathname.startsWith(href) ? 'bg-blue-700' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </Link>
                  ))}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </nav>
    </aside>
  );
}
