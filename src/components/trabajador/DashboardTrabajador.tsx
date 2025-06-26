'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import DashboardCard from '@/components/ui/DashboardCard';
import { useLogout } from '@/hooks/useLogout';
import {
  obtenerMisReportes,
  obtenerCapacitacionesDisponibles, 
  obtenerEppAsignados,
  obtenerMisProtocolos, 
  obtenerMisNotificaciones, 
  obtenerDocumentos,
  obtenerFormularios,
} from '@/lib/api';
import { obtenerNombreDesdeToken } from '@/lib/validate-role';

export default function DashboardTrabajador() {
  const { cerrarSesion } = useLogout();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const nombre = token ? obtenerNombreDesdeToken(token) : 'Trabajador';

  const [data, setData] = useState({
    reportes: 0,
    capacitaciones: 0,
    epp: 0,
    protocolos: 0,
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
          protocolos,
          notificaciones,
          documentos,
          formularios,
        ] = await Promise.all([
          obtenerMisReportes(),
          obtenerCapacitacionesDisponibles(), 
          obtenerEppAsignados(),
          obtenerMisProtocolos(), 
          obtenerMisNotificaciones(),
          obtenerDocumentos(),
          obtenerFormularios(),
        ]);

        setData({
          reportes: reportes.length,
          capacitaciones: capacitaciones.length,
          epp: epp.length,
          protocolos: protocolos.length,
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
    { title: 'Capacitaciones', value: data.capacitaciones, icon: '🎓', link: '/trabajador/capacitaciones' },
    { title: 'EPP Asignados', value: data.epp, icon: '👷‍♂️', link: '/trabajador/epp' },
    { title: 'Protocolos', value: data.protocolos, icon: '⚠️', link: '/trabajador/protocolos' },
    { title: 'Notificaciones', value: data.notificaciones, icon: '🔔', link: '/trabajador/notificaciones' },
    { title: 'Documentos', value: data.documentos, icon: '📁', link: '/trabajador/documentos' },
    { title: 'Formularios', value: data.formularios, icon: '📝', link: '/trabajador/formularios' },
  ];

  return (
    <div>
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Bienvenido, {nombre}</h1>
        <button
          onClick={cerrarSesion}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
        >
          Cerrar sesión
        </button>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tarjetas.map(({ title, value, icon, link }) => (
          <Link href={link} key={title}>
            <DashboardCard title={title} value={value.toString()} icon={icon} />
          </Link>
        ))}
      </div>
    </div>
  );
}
