'use client';

import { useEffect, useState } from 'react';
import {
  crearTestigo,
  actualizarTestigo,
  obtenerEmpresas,
  obtenerReportes,
} from '@/lib/api';

interface Testigo {
  id?: number;
  nombre: string;
  apellido: string;
  rut: string;
  correo?: string;
  telefono?: string;
  empresa_id?: number;
  reporte_id: number;
  declaracion?: string;
}

interface Props {
  testigo?: Testigo;
  onGuardado: () => void;
}

export default function FormularioTestigo({ testigo, onGuardado }: Props) {
  const [formulario, setFormulario] = useState<Testigo>({
    nombre: '',
    apellido: '',
    rut: '',
    correo: '',
    telefono: '',
    empresa_id: undefined,
    reporte_id: 0,
    declaracion: '',
  });

  const [empresas, setEmpresas] = useState<any[]>([]);
  const [reportes, setReportes] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (testigo) setFormulario(testigo);

    const cargar = async () => {
      try {
        const [empresasRes, reportesRes] = await Promise.all([
          obtenerEmpresas(),
          obtenerReportes(),
        ]);
        setEmpresas(empresasRes);
        setReportes(reportesRes);
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
      }
    };

    cargar();
  }, [testigo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (testigo?.id) {
        await actualizarTestigo(testigo.id, formulario);
        setMensaje('✅ Testigo actualizado correctamente');
      } else {
        await crearTestigo(formulario);
        setMensaje('✅ Testigo registrado correctamente');
        setFormulario({
          nombre: '',
          apellido: '',
          rut: '',
          correo: '',
          telefono: '',
          empresa_id: undefined,
          reporte_id: 0,
          declaracion: '',
        });
      }
      onGuardado();
    } catch (error) {
      console.error('❌ Error al guardar testigo:', error);
      setMensaje('❌ Error al guardar testigo');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mensaje && (
        <p className="md:col-span-2 text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">
          {mensaje}
        </p>
      )}

      <input name="nombre" value={formulario.nombre} onChange={handleChange} placeholder="Nombre" required className="border p-2 rounded" />
      <input name="apellido" value={formulario.apellido} onChange={handleChange} placeholder="Apellido" required className="border p-2 rounded" />
      <input name="rut" value={formulario.rut} onChange={handleChange} placeholder="RUT" required className="border p-2 rounded" />
      <input name="correo" value={formulario.correo || ''} onChange={handleChange} placeholder="Correo" type="email" className="border p-2 rounded" />
      <input name="telefono" value={formulario.telefono || ''} onChange={handleChange} placeholder="Teléfono" className="border p-2 rounded" />

      <select name="empresa_id" value={formulario.empresa_id || ''} onChange={handleChange} className="border p-2 rounded">
        <option value="">Empresa (opcional)</option>
        {empresas.map((e) => (
          <option key={e.id} value={e.id}>{e.nombre}</option>
        ))}
      </select>

      <select name="reporte_id" value={formulario.reporte_id} onChange={handleChange} required className="border p-2 rounded">
        <option value="">Seleccione Reporte</option>
        {reportes.map((r) => (
          <option key={r.id} value={r.id}>{r.titulo}</option>
        ))}
      </select>

      <div className="md:col-span-2">
        <label className="block font-medium mb-1">Declaración</label>
        <textarea name="declaracion" value={formulario.declaracion || ''} onChange={handleChange} className="w-full border p-2 rounded" />
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {testigo ? 'Actualizar' : 'Registrar'} Testigo
        </button>
      </div>
    </form>
  );
}
