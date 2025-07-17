'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import {
  LayoutDashboard,
  ClipboardList,
  GraduationCap,
  HardHat,
  ShieldAlert,
  Bell,
  File,
  ClipboardCheck,
} from 'lucide-react';

// 🗂️ Agrupación por categorías
const groupedLinks = [
  {
    title: 'Gestión Personal',
    links: [
      { href: '/trabajador/dashboard', label: 'Inicio', icon: LayoutDashboard },
      { href: '/trabajador/reportes', label: 'Mis Reportes', icon: ClipboardList },
      { href: '/trabajador/epp', label: 'EPP', icon: HardHat },
    ],
  },
  {
    title: 'Prevención y Formación',
    links: [
      { href: '/trabajador/capacitaciones', label: 'Capacitaciones', icon: GraduationCap },
    ],
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
    <aside className="w-64 bg-sky-900 text-white p-4 h-screen">
      <h2 className="text-xl font-bold mb-6">Panel Trabajador</h2>
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
                      className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-sky-800 transition text-sm ${
                        pathname.startsWith(href) ? 'bg-sky-700' : ''
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
