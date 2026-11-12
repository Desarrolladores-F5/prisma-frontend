'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { crearMedida, actualizarMedida, obtenerUsuarios, obtenerDocumentos } from '@/lib/api';

export interface MedidaCorrectiva {
  id?: number;
  descripcion: string;
  fecha_cumplimiento: string;
  estado: string;
  prioridad: string;
  evidencia_documento_id?: number;
  responsable_id: number;
}

interface Props {
  medida?: MedidaCorrectiva;
  onGuardado: () => void;
}

export default function FormularioMedida({ medida, onGuardado }: Props) {
  const [formulario, setFormulario] = useState<MedidaCorrectiva>({
    descripcion: '',
    fecha_cumplimiento: '',
    estado: '',
    prioridad: '',
    responsable_id: 0,
    evidencia_documento_id: undefined,
  });

  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [documentos, setDocumentos] = useState<any[]>([]);
  const [mensaje, setMensaje] = useState('');

  const { data: session } = useSession();
  const usuarioId = session?.user?.id;

  useEffect(() => {
    if (medida) setFormulario(medida);

    const cargar = async () => {
      try {
        setUsuarios(await obtenerUsuarios());
        setDocumentos(await obtenerDocumentos());
      } catch (error) {
        console.error('❌ Error al cargar datos:', error);
      }
    };

    cargar();
  }, [medida]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormulario(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuarioId) {
      setMensaje('❌ No se puede guardar: usuario no autenticado');
      return;
    }

    const datosConUsuario = {
      ...formulario,
      usuario_id: usuarioId,
    };

    try {
      if (medida?.id) {
        await actualizarMedida(medida.id, datosConUsuario);
        setMensaje('✅ Medida actualizada correctamente');
      } else {
        await crearMedida(datosConUsuario);
        setMensaje('✅ Medida creada correctamente');
        setFormulario({
          descripcion: '',
          fecha_cumplimiento: '',
          estado: '',
          prioridad: '',
          responsable_id: 0,
          evidencia_documento_id: undefined,
        });
      }
      onGuardado();
    } catch (error) {
      console.error('❌ Error al guardar medida:', error);
      setMensaje('❌ Error al guardar medida');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {mensaje && (
        <p className="md:col-span-2 text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">
          {mensaje}
        </p>
      )}

      <div className="md:col-span-2">
        <label className="block font-medium mb-1">Descripción</label>
        <textarea name="descripcion" value={formulario.descripcion} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block font-medium mb-1">Fecha de Cumplimiento</label>
        <input type="date" name="fecha_cumplimiento" value={formulario.fecha_cumplimiento} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block font-medium mb-1">Estado</label>
        <select name="estado" value={formulario.estado} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Seleccionar</option>
          <option value="pendiente">Pendiente</option>
          <option value="en curso">En Curso</option>
          <option value="cumplida">Cumplida</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Prioridad</label>
        <select name="prioridad" value={formulario.prioridad} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Seleccionar</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Responsable</label>
        <select name="responsable_id" value={formulario.responsable_id} onChange={handleChange} required className="w-full border p-2 rounded">
          <option value="">Seleccionar</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>{u.nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">Documento Evidencia (opcional)</label>
        <select name="evidencia_documento_id" value={formulario.evidencia_documento_id || ''} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">Ninguno</option>
          {documentos.map((d) => (
            <option key={d.id} value={d.id}>{d.nombre}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {medida ? 'Actualizar' : 'Registrar'} Medida
        </button>
      </div>
    </form>
  );
}
