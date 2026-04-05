'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLogout } from '@/hooks/useLogout';
import {
  obtenerUsuarios,
  obtenerReportes,
  obtenerCapacitaciones,
  obtenerAuditorias,
  obtenerInspecciones,
  obtenerTotalMedidasCorrectivas,
  obtenerNotificaciones,
  obtenerMisDocumentos,
  obtenerFormularios
} from '@/lib/api';

import DashboardCard from '@/components/ui/DashboardCard';
import { obtenerNombreDesdeToken } from '@/lib/validate-role';
import Header from '@/components/layout/Header';

export default function DashboardSupervisor() {
  const { cerrarSesion } = useLogout();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const nombre = token ? obtenerNombreDesdeToken(token) : 'Usuario';

  const [data, setData] = useState({
    usuarios: 0,
    reportes: 0,
    capacitaciones: 0,
    auditorias: 0,
    inspecciones: 0,
    medidas: 0,
    notificaciones: 0,
    documentos: 0,
    formularios: 0
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [
          usuarios,
          reportes,
          capacitaciones,
          auditorias,
          inspecciones,
          medidas,
          notificaciones,
          documentos,
          formularios
        ] = await Promise.all([
          obtenerUsuarios(),
          obtenerReportes(),
          obtenerCapacitaciones(),
          obtenerAuditorias(),
          obtenerInspecciones(),
          obtenerTotalMedidasCorrectivas(),
          obtenerNotificaciones(),
          obtenerMisDocumentos(),
          obtenerFormularios()
        ]);

        setData({
          usuarios: usuarios.length,
          reportes: reportes.length,
          capacitaciones: capacitaciones.length,
          auditorias: auditorias.length,
          inspecciones: inspecciones.length,
          medidas: medidas || 0,
          notificaciones: notificaciones.length,
          documentos: documentos.length,
          formularios: formularios.length
        });
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    cargarDatos();
  }, []);

  const tarjetas = [
    { title: 'Usuarios', value: data.usuarios, icon: '👥', link: '/supervisor/usuarios' },
    { title: 'Reportes', value: data.reportes, icon: '📋', link: '/supervisor/reportes' },
    { title: 'Capacitaciones', value: data.capacitaciones, icon: '🎓', link: '/supervisor/capacitaciones' },
    { title: 'Auditorías', value: data.auditorias, icon: '📂', link: '/supervisor/auditorias' },
    { title: 'Inspecciones', value: data.inspecciones, icon: '🔎', link: '/supervisor/inspecciones' },
    { title: 'Medidas Correctivas', value: data.medidas, icon: '🛠️', link: '/supervisor/medidas' },
    { title: 'Notificaciones', value: data.notificaciones, icon: '🔔', link: '/supervisor/notificaciones' },
    { title: 'Documentos', value: data.documentos, icon: '📁', link: '/supervisor/documentos' },
    { title: 'Formularios', value: data.formularios, icon: '📝', link: '/supervisor/formularios' },
  ] as const;

  // Color de números alineado al header del supervisor
  const accentRole: 'admin' | 'supervisor' | 'trabajador' = 'supervisor';

  return (
    <div className="space-y-6 text-sm text-gray-700">
      <Header nombreUsuario={nombre ?? 'Usuario'} onLogout={cerrarSesion} rol="supervisor" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tarjetas.map(({ title, value, icon, link }) => (
          <Link href={link} key={title} className="block">
            <DashboardCard
              title={title}
              value={value.toString()}
              icon={icon}
              accentRole={accentRole}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
