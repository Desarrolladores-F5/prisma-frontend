'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { ClipboardList, GraduationCap, HardHat, Bell, File, ClipboardCheck } from 'lucide-react';

const groupedLinks = [
  {
    title: 'Gestión Personal',
    links: [
      { href: '/trabajador/reportes', label: 'Mis Reportes', icon: ClipboardList },
      { href: '/trabajador/epp', label: 'EPP', icon: HardHat },
    ],
  },
  {
    title: 'Prevención y Formación',
    links: [{ href: '/trabajador/capacitaciones', label: 'Capacitaciones', icon: GraduationCap }],
  },
  {
    title: 'Recursos y Comunicaciones',
    links: [
      { href: '/trabajador/notificaciones', label: 'Notificaciones', icon: Bell },
      { href: '/trabajador/documentos', label: 'Documentos', icon: File },
      { href: '/trabajador/formularios', label: 'Formularios', icon: ClipboardCheck },
    ],
  },
];

export default function SidebarTrabajador() {
  const pathname = usePathname() ?? '';

  return (
    <aside className="w-64 bg-amber-600 text-white p-4 min-h-screen">
      <h2 className="text-xl font-bold mb-6">Panel Trabajador</h2>
      <nav className="space-y-4">
        {groupedLinks.map((section) => (
          <Disclosure key={section.title}>
            {() => (
              <div>
                <Disclosure.Button className="w-full text-left font-semibold text-sm text-amber-100 hover:text-white">
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
                          ${active ? 'bg-amber-500 text-white' : 'text-white/90 hover:bg-amber-500'}`}
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
