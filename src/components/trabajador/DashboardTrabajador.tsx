'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardCard from '@/components/ui/DashboardCard';
import { useLogout } from '@/hooks/useLogout';
import {
  obtenerMisReportes,
  obtenerCapacitacionesDisponibles,
  obtenerEppAsignados,
  obtenerMisNotificaciones,
  obtenerMisDocumentos,
  obtenerFormularios,
} from '@/lib/api';
import { obtenerNombreDesdeToken } from '@/lib/validate-role';
import Header from '@/components/layout/Header';

export default function DashboardTrabajador() {
  const { cerrarSesion } = useLogout();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const nombre = token ? obtenerNombreDesdeToken(token) : 'Trabajador';

  const [data, setData] = useState({
    reportes: 0,
    capacitaciones: 0,
    epp: 0,
    notificaciones: 0,
    documentos: 0,
    formularios: 0,
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [
          reportes,
          capacitaciones,
          epp,
          notificaciones,
          documentos,
          formularios,
        ] = await Promise.all([
          obtenerMisReportes(),
          obtenerCapacitacionesDisponibles(),
          obtenerEppAsignados(),
          obtenerMisNotificaciones(),
          obtenerMisDocumentos(),
          obtenerFormularios(),
        ]);

        setData({
          reportes: reportes.length,
          capacitaciones: capacitaciones.length,
          epp: epp.length,
          notificaciones: notificaciones.length,
          documentos: documentos.length,
          formularios: formularios.length,
        });
      } catch (error) {
        console.error('Error al cargar datos del trabajador:', error);
      }
    };

    cargarDatos();
  }, []);

  const tarjetas = [
    { title: 'Reportes Enviados', value: data.reportes, icon: '📋', link: '/trabajador/reportes' },
    { title: 'Mis Capacitaciones', value: data.capacitaciones, icon: '🎓', link: '/trabajador/capacitaciones' },
    { title: 'EPP Asignados', value: data.epp, icon: '👷‍♂️', link: '/trabajador/epp' },
    { title: 'Mis Notificaciones', value: data.notificaciones, icon: '🔔', link: '/trabajador/notificaciones' },
    { title: 'Mis Documentos', value: data.documentos, icon: '📁', link: '/trabajador/documentos' },
    { title: 'Mis Formularios', value: data.formularios, icon: '📝', link: '/trabajador/formularios' },
  ] as const;

  // Rol visual para colorear valores numéricos en las tarjetas
  const accentRole: 'admin' | 'supervisor' | 'trabajador' = 'trabajador';

  return (
    <div className="space-y-6 text-sm text-gray-700">
      {/* Header unificado con rol trabajador */}
      <Header nombreUsuario={nombre ?? 'Trabajador'} onLogout={cerrarSesion} rol="trabajador" />

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
