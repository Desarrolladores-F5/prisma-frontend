'use client';

import { useEffect, useState } from 'react';
import {
  crearEstadistica,
  actualizarEstadistica,
  obtenerFaenas,
  obtenerUsuarios,
} from '@/lib/api';

interface Estadistica {
  id?: number;
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
  faena_id?: number;
  generado_por?: number;
  numero_certificado?: string;
  organismo_admin?: string;
  cotizacion_riesgo_presunto?: number;
}

interface Props {
  estadistica?: Estadistica;
  onGuardado: () => void;
}

const datosIniciales = {
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
};

export default function FormularioEstadistica({ estadistica, onGuardado }: Props) {
  const [formulario, setFormulario] = useState<Estadistica>({
    tipo: '',
    datos: { ...datosIniciales },
    descripcion: '',
    faena_id: undefined,
    generado_por: undefined,
    numero_certificado: '',
    organismo_admin: '',
    cotizacion_riesgo_presunto: 0,
  });

  const [faenas, setFaenas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (estadistica) {
      setFormulario({
        ...formulario,
        ...estadistica,
        datos: {
          ...datosIniciales,
          ...estadistica.datos,
        },
      });
    }

    const cargar = async () => {
      try {
        const [faenasRes, usuariosRes] = await Promise.all([
          obtenerFaenas(),
          obtenerUsuarios(),
        ]);
        setFaenas(faenasRes);
        setUsuarios(usuariosRes);
      } catch (error) {
        console.error('❌ Error al cargar faenas o usuarios:', error);
      }
    };

    cargar();
  }, [estadistica]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name in formulario.datos) {
      setFormulario((prev) => ({
        ...prev,
        datos: {
          ...prev.datos,
          [name]: Number(value),
        },
      }));
    } else {
      const parsedValue = name === 'cotizacion_riesgo_presunto'
        ? parseFloat(value)
        : value;

      setFormulario((prev) => ({ ...prev, [name]: parsedValue }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (estadistica?.id) {
        await actualizarEstadistica(estadistica.id, formulario);
        setMensaje('✅ Estadística actualizada correctamente');
      } else {
        await crearEstadistica(formulario);
        setMensaje('✅ Estadística registrada correctamente');
        setFormulario({
          tipo: '',
          datos: { ...datosIniciales },
          descripcion: '',
          faena_id: undefined,
          generado_por: undefined,
          numero_certificado: '',
          organismo_admin: '',
          cotizacion_riesgo_presunto: 0,
        });
      }
      onGuardado();
    } catch (error) {
      console.error('❌ Error al guardar estadística:', error);
      setMensaje('❌ Error al guardar estadística');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mensaje && (
        <p className="md:col-span-2 text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">
          {mensaje}
        </p>
      )}

      {/* Datos generales */}
      <div>
        <label className="block mb-1 font-medium">Tipo de Estadística</label>
        <input name="tipo" value={formulario.tipo} onChange={handleChange} required className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Descripción (opcional)</label>
        <input name="descripcion" value={formulario.descripcion || ''} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">N° de Certificado</label>
        <input name="numero_certificado" value={formulario.numero_certificado || ''} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Organismo Administrador</label>
        <input name="organismo_admin" value={formulario.organismo_admin || ''} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Cotización Adicional por Riesgo Presunto (%)</label>
        <input
          type="number"
          step="0.01"
          name="cotizacion_riesgo_presunto"
          value={formulario.cotizacion_riesgo_presunto ?? ''}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* Campos administrativos adicionales */}
      <div>
        <label className="block mb-1 font-medium">Faena (opcional)</label>
        <select name="faena_id" value={formulario.faena_id || ''} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Seleccione</option>
          {faenas.map((f) => (
            <option key={f.id} value={f.id}>{f.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Generado por (opcional)</label>
        <select name="generado_por" value={formulario.generado_por || ''} onChange={handleChange} className="border p-2 rounded w-full">
          <option value="">Seleccione</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>
      </div>

      {/* Datos técnicos (según orden del certificado) */}
      <div>
        <label className="block mb-1 font-medium">N° de Accidentes</label>
        <input type="number" name="accidentes" value={formulario.datos.accidentes} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">N° de Enfermedades Profesionales</label>
        <input type="number" name="enfermedades" value={formulario.datos.enfermedades} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Días Perdidos por Accidente de Trabajo</label>
        <input type="number" name="diasPerdidosAT" value={formulario.datos.diasPerdidosAT} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Días Perdidos por Enfermedad Profesional</label>
        <input type="number" name="diasPerdidosEP" value={formulario.datos.diasPerdidosEP} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Promedio de Trabajadores</label>
        <input type="number" step="0.01" name="trabajadores" value={formulario.datos.trabajadores} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">N° de Accidentes Fatales</label>
        <input type="number" name="accidentesFatales" value={formulario.datos.accidentesFatales} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">N° de Pensionados</label>
        <input type="number" name="pensionados" value={formulario.datos.pensionados} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">N° de Indemnizados</label>
        <input type="number" name="indemnizados" value={formulario.datos.indemnizados} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Tasa de Siniestralidad por Incapacidad Temporal</label>
        <input type="number" name="tasaSiniestralidad" value={formulario.datos.tasaSiniestralidad} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Factor de Invalidez y Muerte</label>
        <input type="number" name="factorInvalidezMuerte" value={formulario.datos.factorInvalidezMuerte} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Tasa de Accidentabilidad</label>
        <input type="number" name="tasaAccidentabilidad" value={formulario.datos.tasaAccidentabilidad} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Tasa de Frecuencia</label>
        <input type="number" name="tasaFrecuencia" value={formulario.datos.tasaFrecuencia} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Tasa de Gravedad</label>
        <input type="number" name="tasaGravedad" value={formulario.datos.tasaGravedad} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div>
        <label className="block mb-1 font-medium">Horas Hombre</label>
        <input type="number" name="horasHombre" value={formulario.datos.horasHombre} onChange={handleChange} className="border p-2 rounded w-full" />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {estadistica ? 'Actualizar' : 'Registrar'} Estadística
        </button>
      </div>
    </form>
  );
}
