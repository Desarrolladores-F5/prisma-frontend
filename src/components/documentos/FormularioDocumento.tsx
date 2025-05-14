'use client';

import { useState, useEffect, useCallback } from 'react';
import { crearDocumento, actualizarDocumento } from '@/lib/api';
import { useDropzone } from 'react-dropzone';

interface Documento {
  id?: number;
  nombre: string;
  tipo: string;
  url: string;
  version: string;
  activo: boolean;
}

interface Props {
  documento?: Documento;
  onGuardado?: () => void;
}

export default function FormularioDocumento({ documento, onGuardado }: Props) {
  const modoEdicion = !!documento;

  const [form, setForm] = useState<Documento>({
    nombre: '',
    tipo: '',
    url: '',
    version: '',
    activo: true,
  });

  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (modoEdicion && documento) {
      setForm({
        nombre: documento.nombre || '',
        tipo: documento.tipo || '',
        url: documento.url || '',
        version: documento.version || '',
        activo: documento.activo ?? true,
      });
    }
  }, [documento, modoEdicion]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('archivo', file);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: formData,
    });

    if (!res.ok) {
      setMensaje('❌ Error al subir archivo');
      return;
    }

    const data = await res.json();
    setForm(prev => ({ ...prev, url: data.url }));
    setMensaje('✅ Archivo subido correctamente');
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (modoEdicion && documento?.id) {
        await actualizarDocumento(documento.id, form);
        setMensaje('✅ Documento actualizado correctamente');
      } else {
        await crearDocumento(form);
        setMensaje('✅ Documento creado correctamente');
        setForm({ nombre: '', tipo: '', url: '', version: '', activo: true });
      }
      onGuardado?.();
    } catch (error) {
      setMensaje('❌ Error al guardar el documento');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded shadow-md">
      <h2 className="md:col-span-2 text-xl font-bold">{modoEdicion ? 'Editar Documento' : 'Registrar Documento'}</h2>

      {mensaje && (
        <p className="md:col-span-2 text-sm text-blue-600 bg-blue-100 p-2 rounded border border-blue-300">
          {mensaje}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">Nombre</label>
        <input name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tipo</label>
        <input name="tipo" value={form.tipo} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-1">Archivo</label>
        <div {...getRootProps()} className="border-2 border-dashed rounded p-4 text-center cursor-pointer hover:border-blue-500">
          <input {...getInputProps()} />
          {isDragActive ? <p>Suelta el archivo aquí...</p> : <p>Arrastra o haz clic para subir un documento</p>}
        </div>
        {form.url && <p className="text-sm text-green-600 mt-2">✅ Archivo cargado: {form.url}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Versión</label>
        <input name="version" value={form.version} onChange={handleChange} required className="w-full border p-2 rounded" />
      </div>

      <div className="flex items-center space-x-2">
        <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="w-5 h-5" />
        <label className="text-sm">Activo</label>
      </div>

      <div className="md:col-span-2 flex justify-end">
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          {modoEdicion ? 'Actualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
}
