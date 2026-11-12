'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
  crearMedida,
  actualizarMedida,
  obtenerFaenas,
  obtenerUsuariosPorFaena,
  obtenerDocumentos,
} from '@/lib/api';

export interface MedidaCorrectiva {
  id?: number;
  descripcion: string;
  fecha_cumplimiento: string;
  estado: string;
  prioridad: string;
  faena_id?: number | null;
  responsable_id: number;
  evidencia_documento_id?: number | null;
}

interface Props {
  medida?: MedidaCorrectiva;
  onGuardado: () => void;
}

interface Faena {
  id: number;
  nombre: string;
  activo?: boolean;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido?: string;
  activo?: boolean;
}

interface Documento {
  id: number;
  nombre: string;
}

const formularioInicial = (): MedidaCorrectiva => ({
  descripcion: '',
  fecha_cumplimiento: '',
  estado: '',
  prioridad: '',
  faena_id: null,
  responsable_id: 0,
  evidencia_documento_id: null,
});

const normalizarFecha = (fecha: string): string =>
  fecha ? fecha.substring(0, 10) : '';

export default function FormularioMedida({
  medida,
  onGuardado,
}: Props) {
  const [formulario, setFormulario] = useState<MedidaCorrectiva>(
    formularioInicial
  );

  const [faenas, setFaenas] = useState<Faena[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [documentos, setDocumentos] = useState<Documento[]>([]);

  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);

  const { data: session } = useSession();
  const usuarioId = session?.user?.id;

  const modoEdicion = Boolean(medida?.id);

  const faenaOriginal = Number(medida?.faena_id);
  const tieneFaenaOriginal =
    Number.isSafeInteger(faenaOriginal) && faenaOriginal > 0;

  useEffect(() => {
    if (medida) {
      setFormulario({
        ...formularioInicial(),
        ...medida,
        fecha_cumplimiento: normalizarFecha(
          medida.fecha_cumplimiento
        ),
        faena_id: medida.faena_id ?? null,
        evidencia_documento_id:
          medida.evidencia_documento_id ?? null,
      });
    } else {
      setFormulario(formularioInicial());
    }

    setMensaje('');
  }, [medida]);

  useEffect(() => {
    let vigente = true;

    const cargarDatos = async () => {
      try {
        const [listaFaenas, listaDocumentos] = await Promise.all([
          obtenerFaenas(),
          obtenerDocumentos(),
        ]);

        if (!vigente) return;

        setFaenas(Array.isArray(listaFaenas) ? listaFaenas : []);
        setDocumentos(
          Array.isArray(listaDocumentos) ? listaDocumentos : []
        );
      } catch (error) {
        console.error('Error al cargar faenas o documentos:', error);

        if (vigente) {
          setMensaje(
            '❌ No fue posible cargar las faenas o los documentos.'
          );
        }
      }
    };

    cargarDatos();

    return () => {
      vigente = false;
    };
  }, []);

  useEffect(() => {
    const faenaId = Number(formulario.faena_id);

    if (!Number.isSafeInteger(faenaId) || faenaId <= 0) {
      setUsuarios([]);
      setCargandoUsuarios(false);
      return;
    }

    let vigente = true;

    const cargarResponsables = async () => {
      setCargandoUsuarios(true);

      try {
        const lista = await obtenerUsuariosPorFaena(faenaId);

        if (!vigente) return;

        setUsuarios(
          Array.isArray(lista)
            ? lista.filter((usuario: Usuario) =>
                usuario.activo !== false
              )
            : []
        );
      } catch (error) {
        console.error('Error al cargar responsables:', error);

        if (vigente) {
          setUsuarios([]);
          setMensaje(
            '❌ No fue posible cargar los responsables de la faena.'
          );
        }
      } finally {
        if (vigente) {
          setCargandoUsuarios(false);
        }
      }
    };

    cargarResponsables();

    return () => {
      vigente = false;
    };
  }, [formulario.faena_id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setMensaje('');

    if (name === 'faena_id') {
      setFormulario(prev => ({
        ...prev,
        faena_id: value ? Number(value) : null,
        responsable_id: 0,
      }));
      return;
    }

    if (name === 'responsable_id') {
      setFormulario(prev => ({
        ...prev,
        responsable_id: value ? Number(value) : 0,
      }));
      return;
    }

    if (name === 'evidencia_documento_id') {
      setFormulario(prev => ({
        ...prev,
        evidencia_documento_id: value ? Number(value) : null,
      }));
      return;
    }

    setFormulario(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cargando) return;

    if (!usuarioId) {
      setMensaje('❌ No se puede guardar: usuario no autenticado.');
      return;
    }

    const faenaId = Number(formulario.faena_id);
    const responsableId = Number(formulario.responsable_id);

    if (!Number.isSafeInteger(faenaId) || faenaId <= 0) {
      setMensaje('❌ Debes seleccionar una faena válida.');
      return;
    }

    if (
      modoEdicion &&
      tieneFaenaOriginal &&
      faenaId !== faenaOriginal
    ) {
      setMensaje(
        '❌ No se permite cambiar la faena original de la medida.'
      );
      return;
    }

    if (
      !Number.isSafeInteger(responsableId) ||
      responsableId <= 0
    ) {
      setMensaje('❌ Debes seleccionar un responsable válido.');
      return;
    }

    if (
      !usuarios.some(usuario =>
        Number(usuario.id) === responsableId
      )
    ) {
      setMensaje(
        '❌ El responsable debe pertenecer a la faena seleccionada.'
      );
      return;
    }

    if (
      !formulario.descripcion.trim() ||
      !formulario.fecha_cumplimiento ||
      !formulario.estado ||
      !formulario.prioridad
    ) {
      setMensaje('❌ Completa los campos obligatorios.');
      return;
    }

    const datosConUsuario = {
      descripcion: formulario.descripcion.trim(),
      fecha_cumplimiento: formulario.fecha_cumplimiento,
      estado: formulario.estado,
      prioridad: formulario.prioridad,
      faena_id: faenaId,
      responsable_id: responsableId,
      evidencia_documento_id:
        formulario.evidencia_documento_id ?? null,
      usuario_id: usuarioId,
    };

    setCargando(true);
    setMensaje('');

    try {
      if (medida?.id) {
        await actualizarMedida(medida.id, datosConUsuario);
        setMensaje('✅ Medida actualizada correctamente.');
      } else {
        await crearMedida(datosConUsuario);
        setMensaje('✅ Medida creada correctamente.');
        setFormulario(formularioInicial());
        setUsuarios([]);
      }

      onGuardado();
    } catch (error) {
      console.error('Error al guardar la medida:', error);
      setMensaje(
        '❌ No fue posible guardar la medida correctiva.'
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      {mensaje && (
        <p className="md:col-span-2 text-sm text-blue-700 bg-blue-100 p-3 rounded border border-blue-300">
          {mensaje}
        </p>
      )}

      <div className="md:col-span-2">
        <label className="block font-medium mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formulario.descripcion}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block font-medium mb-1">
          Faena de origen
        </label>

        <select
          name="faena_id"
          value={formulario.faena_id ?? ''}
          onChange={handleChange}
          required
          disabled={cargando || (modoEdicion && tieneFaenaOriginal)}
          className="w-full border p-2 rounded disabled:bg-gray-100"
        >
          <option value="">Seleccionar faena</option>

          {faenas
            .filter(faena =>
              faena.activo !== false ||
              Number(faena.id) === Number(formulario.faena_id)
            )
            .map(faena => (
              <option key={faena.id} value={faena.id}>
                {faena.nombre}
              </option>
            ))}
        </select>

        {modoEdicion && tieneFaenaOriginal && (
          <p className="text-xs text-gray-500 mt-1">
            La faena de origen no puede modificarse desde este formulario.
          </p>
        )}

        {modoEdicion && !tieneFaenaOriginal && (
          <p className="text-xs text-amber-700 mt-1">
            Esta medida histórica no tiene una faena de origen registrada.
            Su asignación debe ser verificada y autorizada antes de guardarla.
          </p>
        )}
      </div>

      <div>
        <label className="block font-medium mb-1">
          Fecha de cumplimiento
        </label>
        <input
          type="date"
          name="fecha_cumplimiento"
          value={formulario.fecha_cumplimiento}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium mb-1">
          Estado
        </label>
        <select
          name="estado"
          value={formulario.estado}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccionar</option>
          <option value="pendiente">Pendiente</option>
          <option value="en curso">En curso</option>
          <option value="cumplida">Cumplida</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Prioridad
        </label>
        <select
          name="prioridad"
          value={formulario.prioridad}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Seleccionar</option>
          <option value="alta">Alta</option>
          <option value="media">Media</option>
          <option value="baja">Baja</option>
        </select>
      </div>

      <div>
        <label className="block font-medium mb-1">
          Responsable
        </label>
        <select
          name="responsable_id"
          value={formulario.responsable_id}
          onChange={handleChange}
          required
          disabled={
            !formulario.faena_id ||
            cargandoUsuarios ||
            cargando
          }
          className="w-full border p-2 rounded disabled:bg-gray-100"
        >
          <option value="0">
            {cargandoUsuarios
              ? 'Cargando responsables...'
              : 'Seleccionar responsable'}
          </option>

          {usuarios.map(usuario => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre} {usuario.apellido ?? ''}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="block font-medium mb-1">
          Documento de evidencia (opcional)
        </label>
        <select
          name="evidencia_documento_id"
          value={formulario.evidencia_documento_id ?? ''}
          onChange={handleChange}
          disabled={cargando}
          className="w-full border p-2 rounded"
        >
          <option value="">Ninguno</option>

          {documentos.map(documento => (
            <option key={documento.id} value={documento.id}>
              {documento.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button
          type="submit"
          disabled={cargando || cargandoUsuarios}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cargando
            ? 'Guardando...'
            : `${modoEdicion ? 'Actualizar' : 'Registrar'} medida`}
        </button>
      </div>
    </form>
  );
}
