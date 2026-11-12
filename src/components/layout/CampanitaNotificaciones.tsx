'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  obtenerMisNotificaciones,
  marcarNotificacionComoLeida,
} from '@/lib/api';
import type { Notificacion } from '@/types';

type Rol = 'admin' | 'supervisor' | 'trabajador';

interface Props {
  rol: Rol;
}

const rutas: Record<Rol, string> = {
  admin: '/admin/dashboard/notificaciones',
  supervisor: '/supervisor/notificaciones',
  trabajador: '/trabajador/notificaciones',
};

const formatoFecha = (fecha: string) => {
  const valor = new Date(fecha);
  return Number.isNaN(valor.getTime())
    ? ''
    : valor.toLocaleString('es-CL', {
        dateStyle: 'short',
        timeStyle: 'short',
      });
};

export default function CampanitaNotificaciones({ rol }: Props) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [abierto, setAbierto] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [actualizandoId, setActualizandoId] = useState<number | null>(null);
  const contenedor = useRef<HTMLDivElement>(null);
  const solicitudActual = useRef(0);

  const cargar = useCallback(async (mostrarError = false) => {
    const solicitud = ++solicitudActual.current;

    try {
      const datos = await obtenerMisNotificaciones();

      if (solicitud !== solicitudActual.current) return;

      setNotificaciones(Array.isArray(datos) ? datos : []);
    } catch {
      if (mostrarError && solicitud === solicitudActual.current) {
        toast.error('No fue posible cargar las notificaciones.');
      }
    } finally {
      if (solicitud === solicitudActual.current) {
        setCargando(false);
      }
    }
  }, []);

  useEffect(() => {
    void cargar();

    const intervalo = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        void cargar();
      }
    }, 30000);

    const alVolver = () => {
      if (document.visibilityState === 'visible') {
        void cargar();
      }
    };

    document.addEventListener('visibilitychange', alVolver);

    return () => {
      solicitudActual.current++;
      window.clearInterval(intervalo);
      document.removeEventListener('visibilitychange', alVolver);
    };
  }, [cargar]);

  useEffect(() => {
    if (!abierto) return;

    const cerrarFuera = (evento: MouseEvent) => {
      if (
        contenedor.current &&
        !contenedor.current.contains(evento.target as Node)
      ) {
        setAbierto(false);
      }
    };

    const cerrarEscape = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setAbierto(false);
    };

    document.addEventListener('mousedown', cerrarFuera);
    document.addEventListener('keydown', cerrarEscape);

    return () => {
      document.removeEventListener('mousedown', cerrarFuera);
      document.removeEventListener('keydown', cerrarEscape);
    };
  }, [abierto]);

  const pendientes = notificaciones.filter((n) => !n.leido).length;
  const recientes = notificaciones.slice(0, 8);

  const marcarLeida = async (id: number) => {
    if (actualizandoId !== null) return;

    const notificacion = notificaciones.find((n) => n.id === id);
    if (!notificacion || notificacion.leido) return;

    setActualizandoId(id);

    try {
      await marcarNotificacionComoLeida(id);
      setNotificaciones((actuales) =>
        actuales.map((n) =>
          n.id === id ? { ...n, leido: true } : n
        )
      );
      void cargar();
    } catch {
      toast.error('No fue posible marcar la notificación como leída.');
    } finally {
      setActualizandoId(null);
    }
  };

  return (
    <div ref={contenedor} className="relative">
      <button
        type="button"
        onClick={() => {
          setAbierto((valor) => !valor);
          void cargar();
        }}
        className="relative rounded-full p-2.5 text-gray-700 hover:bg-gray-100 transition border border-gray-200 bg-white"
        aria-label={`Notificaciones: ${pendientes} sin leer`}
        aria-expanded={abierto}
        aria-haspopup="dialog"
        title="Notificaciones"
      >
        <Bell className="w-6 h-6" />

        {pendientes > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold px-1 flex items-center justify-center">
            {pendientes > 99 ? '99+' : pendientes}
          </span>
        )}
      </button>

      {abierto && (
        <div
          role="dialog"
          aria-label="Notificaciones personales"
          className="absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-2rem))] max-h-[min(30rem,75vh)] overflow-y-auto rounded-xl bg-white text-gray-900 border border-gray-200 shadow-xl z-50"
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center gap-2">
            <div>
              <h3 className="font-bold text-base">Notificaciones</h3>
              <p className="text-xs text-gray-500">
                {pendientes} sin leer
              </p>
            </div>

            <button
              type="button"
              onClick={() => void cargar(true)}
              className="p-2 rounded-lg hover:bg-gray-100"
              aria-label="Actualizar notificaciones"
              title="Actualizar"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {cargando ? (
            <p className="p-5 text-sm text-gray-500">
              Cargando notificaciones...
            </p>
          ) : recientes.length === 0 ? (
            <p className="p-5 text-sm text-gray-500">
              No tienes notificaciones por el momento.
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recientes.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 ${n.leido ? 'bg-white' : 'bg-blue-50'}`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-2 w-2 h-2 rounded-full shrink-0 ${
                        n.leido ? 'bg-gray-200' : 'bg-blue-600'
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      <p className="text-sm break-words">
                        {n.mensaje}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatoFecha(n.fecha)}
                      </p>

                      {!n.leido && (
                        <button
                          type="button"
                          disabled={actualizandoId !== null}
                          onClick={() => void marcarLeida(n.id)}
                          className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline disabled:opacity-50"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="sticky bottom-0 bg-white border-t border-gray-100 p-3">
            <Link
              href={rutas[rol]}
              onClick={() => setAbierto(false)}
              className="block text-center text-sm font-semibold text-blue-700 hover:underline"
            >
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
