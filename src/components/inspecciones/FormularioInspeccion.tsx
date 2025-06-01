'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  crearInspeccion,
  actualizarInspeccion,
  obtenerFaenas,
  obtenerUsuarios
} from '@/lib/api';
import { registrarCambioHistorial } from '@/lib/registrarCambio';
import HistorialCambios from '@/components/historial/HistorialCambios';

export interface Inspeccion {
  id?: number;
  fecha: string;
  faena_id: number;
  inspector_id: number;
  tipo: string;
  descripcion: string;
  observaciones?: string;
  conforme: boolean;
}

interface Props {
  inspeccion?: Inspeccion;
  onGuardado: () => void;
}

const FormularioInspeccion: React.FC<Props> = ({ inspeccion, onGuardado }) => {
  const { data: session } = useSession();
  const usuarioId = session?.user?.id;

  const [formulario, setFormulario] = useState<Inspeccion>({
    fecha: '',
    faena_id: 0,
    inspector_id: 0,
    tipo: '',
    descripcion: '',
    observaciones: '',
    conforme: false,
  });

  const [faenas, setFaenas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (inspeccion) setFormulario(inspeccion);

    const cargarDatos = async () => {
      setFaenas(await obtenerFaenas());
      setUsuarios(await obtenerUsuarios());
    };

    cargarDatos();
  }, [inspeccion]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const isChecked = type === 'checkbox' ? target.checked : undefined;

    setFormulario((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? isChecked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (inspeccion?.id) {
        await actualizarInspeccion(inspeccion.id, formulario);
        setMensaje('✅ Inspección actualizada correctamente');

        if (usuarioId) {
          await registrarCambioHistorial({
            usuario_id: usuarioId,
            entidad: 'inspeccion',
            entidad_id: inspeccion.id,
            accion: 'edición',
            detalles: formulario,
          });
        }
      } else {
        await crearInspeccion(formulario);
        setMensaje('✅ Inspección registrada correctamente');
        setFormulario({
          fecha: '',
          faena_id: 0,
          inspector_id: 0,
          tipo: '',
          descripcion: '',
          observaciones: '',
          conforme: false,
        });
      }
      onGuardado();
    } catch (error) {
      console.error('❌ Error al guardar inspección:', error);
      setMensaje('❌ Error al guardar inspección');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold mb-4">Gestión de Inspecciones</h2>

        {mensaje && (
          <p className="text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">
            {mensaje}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold mb-1">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formulario.fecha}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Tipo de inspección</label>
            <input
              type="text"
              name="tipo"
              value={formulario.tipo}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Faena</label>
            <select
              name="faena_id"
              value={formulario.faena_id}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Seleccione una faena</option>
              {faenas.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">Inspector</label>
            <select
              name="inspector_id"
              value={formulario.inspector_id}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Seleccione un usuario</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={formulario.descripcion}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">Observaciones (opcional)</label>
          <textarea
            name="observaciones"
            value={formulario.observaciones || ''}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="conforme"
            checked={formulario.conforme}
            onChange={handleChange}
          />
          <label className="font-medium">¿Conforme?</label>
        </div>

        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            {inspeccion ? 'Actualizar' : 'Registrar'} Inspección
          </button>
        </div>
      </form>

      {inspeccion?.id && (
        <div className="mt-6">
          <HistorialCambios entidad="inspeccion" entidad_id={inspeccion.id} />
        </div>
      )}
    </div>
  );
};

export default FormularioInspeccion;
