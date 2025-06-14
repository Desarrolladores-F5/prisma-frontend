'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { obtenerRolDesdeToken, obtenerNombreDesdeToken } from '@/lib/validate-role';
import { useLogout } from '@/hooks/useLogout';

import {
  obtenerTotalReportesActivos,
  obtenerTotalAuditorias,
  obtenerTotalCapacitaciones,
  obtenerTotalDocumentos,
  obtenerTotalMedidasCorrectivas,
  obtenerTotalInspecciones,
  obtenerTotalProtocolos,
  obtenerTotalNotificaciones
} from '@/lib/api';

import DashboardCard from '@/components/ui/DashboardCard';
import SectionPlaceholder from '@/components/ui/SectionPlaceholder';
import Header from '@/components/layout/Header';

export default function AdminDashboard() {
  const router = useRouter();
  const { cerrarSesion } = useLogout();

  const [permitido, setPermitido] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('');

  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [totalReportes, setTotalReportes] = useState(0);
  const [totalAuditorias, setTotalAuditorias] = useState(0);
  const [totalCapacitaciones, setTotalCapacitaciones] = useState(0);
  const [totalDocumentos, setTotalDocumentos] = useState(0);
  const [totalMedidas, setTotalMedidas] = useState(0);
  const [totalInspecciones, setTotalInspecciones] = useState(0);
  const [totalProtocolos, setTotalProtocolos] = useState(0);
  const [totalNotificaciones, setTotalNotificaciones] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/acceso-denegado');
      return;
    }

    const rol_id = obtenerRolDesdeToken(token);
    const nombre = obtenerNombreDesdeToken(token);
    if (rol_id !== 1) {
      router.push('/acceso-denegado');
      return;
    }

    setPermitido(true);
    setNombreUsuario(nombre || 'Usuario');

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/conteo/total`)
      .then((res) => res.json())
      .then((data) => setTotalUsuarios(data.total || 0))
      .catch(() => setTotalUsuarios(0));

    obtenerTotalReportesActivos().then(setTotalReportes).catch(() => setTotalReportes(0));
    obtenerTotalAuditorias().then(setTotalAuditorias).catch(() => setTotalAuditorias(0));
    obtenerTotalCapacitaciones().then(setTotalCapacitaciones).catch(() => setTotalCapacitaciones(0));
    obtenerTotalDocumentos().then(setTotalDocumentos).catch(() => setTotalDocumentos(0));
    obtenerTotalMedidasCorrectivas().then(setTotalMedidas).catch(() => setTotalMedidas(0));
    obtenerTotalInspecciones().then(setTotalInspecciones).catch(() => setTotalInspecciones(0));
    obtenerTotalProtocolos().then(setTotalProtocolos).catch(() => setTotalProtocolos(0));
    obtenerTotalNotificaciones().then(setTotalNotificaciones).catch(() => setTotalNotificaciones(0));
  }, [router]);

  if (!permitido) return null;

  return (
    <div className="space-y-6 text-sm text-gray-700">
      <Header nombreUsuario={nombreUsuario} onLogout={cerrarSesion} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        <Link href="/admin/dashboard/usuarios" className="block">
          <DashboardCard title="Usuarios" value={totalUsuarios.toString()} icon="👥" />
        </Link>
        <Link href="/admin/dashboard/reportes" className="block">
          <DashboardCard title="Reportes" value={totalReportes.toString()} icon="📊" />
        </Link>
        <Link href="/admin/dashboard/protocolos" className="block">
          <DashboardCard title="Protocolos" value={totalProtocolos.toString()} icon="⚠️" />
        </Link>
        <Link href="/admin/dashboard/auditorias" className="block">
          <DashboardCard title="Auditorías" value={totalAuditorias.toString()} icon="📋" />
        </Link>
        <Link href="/admin/dashboard/inspecciones" className="block">
          <DashboardCard title="Inspecciones" value={totalInspecciones.toString()} icon="🔍" />
        </Link>
        <Link href="/admin/dashboard/capacitaciones" className="block">
          <DashboardCard title="Capacitaciones" value={totalCapacitaciones.toString()} icon="🎓" />
        </Link>
        <Link href="/admin/dashboard/documentos" className="block">
          <DashboardCard title="Documentos" value={totalDocumentos.toString()} icon="📑" />
        </Link>
        <Link href="/admin/dashboard/medidas" className="block">
          <DashboardCard title="Medidas Correctivas" value={totalMedidas.toString()} icon="🛠️" />
        </Link>
        <Link href="/admin/dashboard/notificaciones" className="block">
          <DashboardCard title="Notificaciones" value={totalNotificaciones.toString()} icon="🔔" />
        </Link>
      </div>

      <SectionPlaceholder title="Auditorías recientes" />
      <SectionPlaceholder title="Inspecciones en curso" />
      <SectionPlaceholder title="Historial de entrega de EPP" />
      <SectionPlaceholder title="Capacitaciones programadas" />
    </div>
  );
}
