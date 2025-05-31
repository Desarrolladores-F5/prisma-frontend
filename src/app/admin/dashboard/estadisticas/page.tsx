'use client';

import { useEffect, useState } from "react";
import FormularioEstadistica from "@/components/estadisticas/FormularioEstadistica";
import TablaEstadisticas from "@/components/estadisticas/TablaEstadisticas";
import IndicadoresEstadisticos from "@/components/estadisticas/IndicadoresEstadisticos";
import GraficoEstadisticas from "@/components/estadisticas/GraficoEstadisticas";
import GraficoComparativoMensual from "@/components/estadisticas/GraficoComparativoMensual";
import Link from "next/link";
import { obtenerEstadisticas } from "@/lib/api";

interface DatosIndicadoresProps {
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
}

interface EstadisticaMensual {
  descripcion: string;
  datos: {
    tasaAccidentabilidad: number;
    tasaFrecuencia: number;
    tasaGravedad: number;
  };
}

export default function PageEstadisticas() {
  const [refrescar, setRefrescar] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [estadisticaSeleccionada, setEstadisticaSeleccionada] = useState<any>(null);
  const [estadisticasMensuales, setEstadisticasMensuales] = useState<EstadisticaMensual[]>([]);
  const [datosIndicadores, setDatosIndicadores] = useState<DatosIndicadoresProps>({
    accidentes: 0,
    enfermedades: 0,
    diasPerdidosAT: 0,
    diasPerdidosEP: 0,
    trabajadores: 0,
    accidentesFatales: 0,
    pensionados: 0,
    indemnizados: 0,
    tasaSiniestralidad: 0,
    factorInvalidezMuerte: 0,
    tasaAccidentabilidad: 0,
    tasaFrecuencia: 0,
    tasaGravedad: 0,
    horasHombre: 0,
  });

  const manejarGuardado = () => {
    setRefrescar(!refrescar);
    setMostrarFormulario(false);
    setEstadisticaSeleccionada(null);
  };

  const manejarEdicion = (estadistica: any) => {
    setEstadisticaSeleccionada(estadistica);
    setMostrarFormulario(true);
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const estadisticas = await obtenerEstadisticas();

        // Resumen general acumulado
        const resumen = estadisticas.reduce((acc: DatosIndicadoresProps, actual: any) => {
          const datos = actual.datos || {};
          acc.accidentes += datos.accidentes || 0;
          acc.enfermedades += datos.enfermedades || 0;
          acc.diasPerdidosAT += datos.diasPerdidosAT || 0;
          acc.diasPerdidosEP += datos.diasPerdidosEP || 0;
          acc.trabajadores += datos.trabajadores || 0;
          acc.accidentesFatales += datos.accidentesFatales || 0;
          acc.pensionados += datos.pensionados || 0;
          acc.indemnizados += datos.indemnizados || 0;
          acc.tasaSiniestralidad += datos.tasaSiniestralidad || 0;
          acc.factorInvalidezMuerte += datos.factorInvalidezMuerte || 0;
          acc.tasaAccidentabilidad += datos.tasaAccidentabilidad || 0;
          acc.tasaFrecuencia += datos.tasaFrecuencia || 0;
          acc.tasaGravedad += datos.tasaGravedad || 0;
          acc.horasHombre += datos.horasHombre || 0;
          return acc;
        }, {
          accidentes: 0,
          enfermedades: 0,
          diasPerdidosAT: 0,
          diasPerdidosEP: 0,
          trabajadores: 0,
          accidentesFatales: 0,
          pensionados: 0,
          indemnizados: 0,
          tasaSiniestralidad: 0,
          factorInvalidezMuerte: 0,
          tasaAccidentabilidad: 0,
          tasaFrecuencia: 0,
          tasaGravedad: 0,
          horasHombre: 0,
        });

        setDatosIndicadores(resumen);

        // Agrupación mensual para gráfico comparativo
        const agrupadoMensual: EstadisticaMensual[] = estadisticas.map((e: any) => ({
          descripcion: e.descripcion || "—",
          datos: {
            tasaAccidentabilidad: e.datos?.tasaAccidentabilidad || 0,
            tasaFrecuencia: e.datos?.tasaFrecuencia || 0,
            tasaGravedad: e.datos?.tasaGravedad || 0,
          }
        }));

        setEstadisticasMensuales(agrupadoMensual);
      } catch (error) {
        console.error("❌ Error al obtener indicadores:", error);
      }
    };

    if (!mostrarFormulario) {
      cargarDatos();
    }
  }, [refrescar, mostrarFormulario]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        {!mostrarFormulario && (
          <Link href="/admin/dashboard">
            <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">
              Volver al Inicio
            </button>
          </Link>
        )}

        {mostrarFormulario ? (
          <button
            onClick={() => {
              setMostrarFormulario(false);
              setEstadisticaSeleccionada(null);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Volver al Listado
          </button>
        ) : (
          <button
            onClick={() => setMostrarFormulario(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear Estadística
          </button>
        )}
      </div>

      {mostrarFormulario ? (
        <FormularioEstadistica
          estadistica={estadisticaSeleccionada ?? undefined}
          onGuardado={manejarGuardado}
        />
      ) : (
        <>
          <TablaEstadisticas
            refrescar={refrescar}
            onEditar={manejarEdicion}
            onEliminado={() => setRefrescar(!refrescar)}
          />

          <div className="mt-10">
            <IndicadoresEstadisticos datos={datosIndicadores} />

            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-2">📊 Resumen Global de Indicadores</h2>
              <GraficoEstadisticas datos={datosIndicadores} />
            </div>

            <div className="mt-10">
              <h2 className="text-lg font-semibold mb-2">📆 Comparación Mensual de Indicadores</h2>
              <GraficoComparativoMensual estadisticas={estadisticasMensuales} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
