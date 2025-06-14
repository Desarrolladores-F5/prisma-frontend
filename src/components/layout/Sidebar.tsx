'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  HardHat,
  Building,
  ShieldAlert,
  FolderKanban,
  Search,
  GraduationCap,
  FileText,
  Hammer,
  Bell,
  File,
  FileArchive,
  ScrollText,
  ClipboardCheck,
  PencilLine,
  Landmark,
  BarChart2,
  History,
  MessageCircle,
  Settings
} from 'lucide-react';

const groupedLinks = [
  {
    title: 'Gestión General',
    links: [
      { href: '/admin/dashboard', label: 'Inicio', icon: LayoutDashboard },
      { href: '/admin/dashboard/usuarios', label: 'Usuarios', icon: Users },
      { href: '/admin/dashboard/reportes', label: 'Reportes', icon: ClipboardList },
      { href: '/admin/dashboard/faenas', label: 'Faenas', icon: HardHat },
      { href: '/admin/dashboard/empresas', label: 'Empresas', icon: Building },
    ]
  },
  {
    title: 'Procesos de Prevención',
    links: [
      { href: '/admin/dashboard/protocolos', label: 'Protocolos', icon: ShieldAlert },
      { href: '/admin/dashboard/auditorias', label: 'Auditorías', icon: FolderKanban },
      { href: '/admin/dashboard/inspecciones', label: 'Inspecciones', icon: Search },
      { href: '/admin/dashboard/capacitaciones', label: 'Capacitaciones', icon: GraduationCap },
      { href: '/admin/dashboard/examenes', label: 'Exámenes', icon: FileText },
      { href: '/admin/dashboard/epp', label: 'EPP', icon: Hammer },
      { href: '/admin/dashboard/medidas', label: 'Medidas Correctivas', icon: ScrollText },
    ]
  },
  {
    title: 'Gestión de Contenido',
    links: [
      { href: '/admin/dashboard/notificaciones', label: 'Notificaciones', icon: Bell },
      { href: '/admin/dashboard/documentos', label: 'Documentos', icon: File },
      { href: '/admin/dashboard/archivos', label: 'Archivos', icon: FileArchive },
      { href: '/admin/dashboard/formularios', label: 'Formularios', icon: ClipboardCheck },
      { href: '/admin/dashboard/firmas', label: 'Firmas Digitales', icon: PencilLine },
      { href: '/admin/dashboard/testigos', label: 'Testigos', icon: Landmark },
    ]
  },
  {
    title: 'Monitoreo y Configuración',
    links: [
      { href: '/admin/dashboard/estadisticas', label: 'Estadísticas', icon: BarChart2 },
      { href: '/admin/dashboard/historial', label: 'Historial de Cambios', icon: History },
      { href: '/admin/dashboard/comentarios', label: 'Comentarios', icon: MessageCircle },
      { href: '/admin/dashboard/configuracion', label: 'Configuración', icon: Settings },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname() ?? '';

  return (
    <aside className="w-64 bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Panel Admin</h2>
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
                      className={`flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-700 transition text-sm ${
                        pathname.startsWith(href) ? 'bg-gray-700' : ''
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
