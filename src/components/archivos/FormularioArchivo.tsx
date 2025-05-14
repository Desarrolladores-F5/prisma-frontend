'use client';

import { useState, useEffect } from 'react';

export interface ArchivoAdjunto {
  id?: number;
  entidad_tipo: string;
  entidad_id: number;
  url: string;
  nombre_archivo: string;
  tipo_archivo: string;
  tamaño_archivo?: number;
  descripcion?: string;
  subido_por_id?: number;
  fecha_subida?: string;
}

interface Props {
  archivo: ArchivoAdjunto | null;
  onGuardado: () => void;
}

export default function FormularioArchivo({ archivo, onGuardado }: Props) {
  const [formulario, setFormulario] = useState<ArchivoAdjunto>({
    entidad_tipo: '',
    entidad_id: 0,
    url: '',
    nombre_archivo: '',
    tipo_archivo: '',
  });

  useEffect(() => {
    if (archivo) {
      setFormulario(archivo);
    }
  }, [archivo]);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const manejarEnvio = async () => {
    // Aquí deberías hacer la lógica para enviar datos al backend
    console.log('📤 Datos enviados:', formulario);
    onGuardado();
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-4">{archivo ? 'Editar Archivo' : 'Nuevo Archivo'}</h2>
      <input
        type="text"
        name="nombre_archivo"
        value={formulario.nombre_archivo}
        onChange={manejarCambio}
        className="border p-2 mb-2 w-full"
        placeholder="Nombre del archivo"
      />
      {/* Agrega más campos según sea necesario */}
      <button onClick={manejarEnvio} className="bg-blue-600 text-white px-4 py-2 rounded">
        Guardar
      </button>
    </div>
  );
}
