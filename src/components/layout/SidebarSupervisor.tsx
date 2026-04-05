'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import {
  Users, ClipboardList, GraduationCap, FolderKanban, Search,
  ScrollText, Bell, File, ClipboardCheck
} from 'lucide-react';

const groupedLinks = [
  {
    title: 'Gestión Operativa',
    links: [
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
    <aside className="w-64 bg-emerald-700 text-white p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-6">Panel Supervisor</h2>
      <nav className="space-y-4">
        {groupedLinks.map((section) => (
          <Disclosure key={section.title}>
            {() => (
              <div>
                <Disclosure.Button className="w-full text-left font-semibold text-sm text-emerald-100 hover:text-white">
                  {section.title}
                </Disclosure.Button>
                <Disclosure.Panel className="mt-2 space-y-1">
                  {section.links.map(({ href, label, icon: Icon }) => {
                    const active = pathname.startsWith(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors
                          ${active ? 'bg-emerald-600 text-white' : 'text-white/90 hover:bg-emerald-600'}`}
                      >
                        <Icon className="w-4 h-4 opacity-90" />
                        {label}
                      </Link>
                    );
                  })}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        ))}
      </nav>
    </aside>
  );
}
