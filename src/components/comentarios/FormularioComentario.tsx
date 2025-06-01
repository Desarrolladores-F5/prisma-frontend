'use client';

import { useState } from 'react';
import { crearComentario } from '@/lib/api';
import { useSession } from 'next-auth/react';

interface Props {
  entidadId: number;
  entidadTipo: string;
  onComentarioCreado?: () => void;
}

export default function FormularioComentario({ entidadId, entidadTipo, onComentarioCreado }: Props) {
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mensaje.trim()) {
      setError('El comentario no puede estar vacío.');
      return;
    }

    try {
      await crearComentario({
        mensaje: mensaje.trim(),
        entidad_id: entidadId,
        entidad_tipo: entidadTipo,
        autor_id: session?.user?.id,
      });
      setMensaje('');
      setError('');
      onComentarioCreado?.();
    } catch (err) {
      console.error('❌ Error al crear comentario:', err);
      setError('No se pudo enviar el comentario. Intente nuevamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        className="w-full border rounded p-2"
        placeholder="Escribe un comentario..."
        rows={3}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Enviar
      </button>
    </form>
  );
}
