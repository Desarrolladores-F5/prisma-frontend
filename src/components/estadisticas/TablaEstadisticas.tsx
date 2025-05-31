"use client";

import { useEffect, useState } from "react";
import { obtenerEstadisticas, eliminarEstadistica } from "@/lib/api";

interface Estadistica {
  id: number;
  tipo: string;
  datos: {
    accidentes: number;
    enfermedades: number;
    diasPerdidosAT: number;
    diasPerdidosEP: number;
    trabajadores: number;
    accidentesFatales: number;
    pensionados: number;
    indemnizados: number;
    tasaSiniestralidad: number;
    factorInvalidezMuerte: number;
    tasaAccidentabilidad: number;
    tasaFrecuencia: number;
    tasaGravedad: number;
    horasHombre: number;
  };
  descripcion?: string;
  numero_certificado?: string;
  organismo_admin?: string;
  cotizacion_riesgo_presunto?: number | string;
  faena?: { id: number; nombre: string };
  usuario?: { id: number; nombre: string };
  fecha_generacion: string;
}

interface Props {
  refrescar?: boolean;
  onEditar?: (estadistica: Estadistica) => void;
  onEliminado?: () => void;
}

export default function TablaEstadisticas({ refrescar, onEditar, onEliminado }: Props) {
  const [estadisticas, setEstadisticas] = useState<Estadistica[]>([]);

  const cargarEstadisticas = async () => {
    try {
      const data = await obtenerEstadisticas();
      setEstadisticas(data);
    } catch (error) {
      console.error("❌ Error al cargar estadísticas:", error);
    }
  };

  useEffect(() => {
    cargarEstadisticas();
  }, [refrescar]);

  const handleEliminar = async (id: number) => {
    if (!confirm("¿Deseas eliminar esta estadística?")) return;
    try {
      await eliminarEstadistica(id);
      cargarEstadisticas();
      onEliminado?.();
    } catch (error) {
      console.error("❌ Error al eliminar estadística:", error);
    }
  };

  const descargarPDF = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token no disponible. Por favor, inicia sesión nuevamente.");
      return;
    }

    // ✅ Abrir la ventana antes del await para evitar bloqueo
    const ventana = window.open("", "_blank");
    if (!ventana) {
      alert("Por favor, permite las ventanas emergentes en tu navegador.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/estadisticas/${id}/pdf`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener el PDF");

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      ventana.location.href = url;
    } catch (error) {
      console.error("❌ Error al generar PDF:", error);
      ventana.close();
      alert("No se pudo generar el PDF.");
    }
  };

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2">Nombre</th>
            <th className="border px-3 py-2">Faena</th>
            <th className="border px-3 py-2">Usuario</th>
            <th className="border px-3 py-2">N° Certificado</th>
            <th className="border px-3 py-2">Organismo Admin.</th>
            <th className="border px-3 py-2">Cotización Riesgo (%)</th>
            <th className="border px-3 py-2">Fecha</th>
            <th className="border px-3 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estadisticas.map((e) => (
            <tr key={e.id} className="text-center border-t hover:bg-gray-50">
              <td className="p-2">{e.tipo}</td>
              <td className="p-2">{e.faena?.nombre || "—"}</td>
              <td className="p-2">{e.usuario?.nombre || "—"}</td>
              <td className="p-2">{e.numero_certificado || "—"}</td>
              <td className="p-2">{e.organismo_admin || "—"}</td>
              <td className="p-2">
                {!isNaN(Number(e.cotizacion_riesgo_presunto))
                  ? `${Number(e.cotizacion_riesgo_presunto).toFixed(2)}%`
                  : "—"}
              </td>
              <td className="p-2">
                {new Date(e.fecha_generacion).toLocaleDateString()}
              </td>
              <td className="p-2 flex flex-col items-center space-y-1">
                <button
                  onClick={() => onEditar?.(e)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(e.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
                <button
                  onClick={() => descargarPDF(e.id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  PDF
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
