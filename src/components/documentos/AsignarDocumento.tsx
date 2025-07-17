'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { obtenerDocumentoPorId, obtenerRoles, asignarDocumentoAUsuario } from '@/lib/api';
import { toast } from 'sonner';

interface Rol {
  id: number;
  nombre: string;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
}

export default function AsignarDocumento() {
  const router = useRouter();
  const params = useParams();
  const documentoId = Number(params?.id);

  const [asignacionTipo, setAsignacionTipo] = useState<'todos' | 'rol' | 'usuarios'>('rol');
  const [rolId, setRolId] = useState('');
  const [usuarioIds, setUsuarioIds] = useState('');
  const [roles, setRoles] = useState<Rol[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [documento, setDocumento] = useState<any>(null);

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const doc = await obtenerDocumentoPorId(documentoId);
        const r = await obtenerRoles();
        setDocumento(doc);
        setRoles(r);
      } catch (err) {
        toast.error('❌ Error al cargar datos');
      }
    };
    if (documentoId) fetchDatos();
  }, [documentoId]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/usuarios`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setUsuarios(data);
      } catch (err) {
        toast.error('❌ Error al cargar usuarios');
      }
    };
    if (asignacionTipo === 'usuarios') {
      fetchUsuarios();
    }
  }, [asignacionTipo]);

  const handleAsignar = async () => {
    if (!documentoId) {
      toast.error('ID de documento no válido');
      return;
    }

    let payload: any = {
      documento_id: documentoId,
      asignacion_tipo: asignacionTipo,
    };

    if (asignacionTipo === 'usuarios') {
      if (!usuarioIds) return toast.warning('Debe seleccionar al menos un usuario');
      const ids = usuarioIds.split(',').map((id) => parseInt(id.trim(), 10));
      payload.usuario_ids = ids;
    }

    if ((asignacionTipo === 'rol' || asignacionTipo === 'todos') && !rolId) {
      return toast.warning('Debe seleccionar un rol');
    }

    if (asignacionTipo === 'rol' || asignacionTipo === 'todos') {
      payload.rol_id = Number(rolId);
    }

    try {
      await asignarDocumentoAUsuario(payload);
      toast.success('✅ Documento asignado correctamente', {
        duration: 5000, // ⏱ 5 segundos
      });
    } catch (err) {
      toast.error('❌ Error al asignar documento');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => router.push('/admin/dashboard/documentos')}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Volver
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4">📄 Asignar Documento</h2>
      {documento && (
        <p className="mb-4">
          <strong>Documento:</strong> {documento.nombre} (v{documento.version})
        </p>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Tipo de asignación</label>
        <select
          value={asignacionTipo}
          onChange={(e) => {
            setAsignacionTipo(e.target.value as any);
            setUsuarioIds('');
            setRolId('');
          }}
          className="w-full border border-gray-300 rounded px-3 py-2"
        >
          <option value="todos">A todos los usuarios</option>
          <option value="rol">Por rol específico</option>
          <option value="usuarios">Seleccionar usuarios</option>
        </select>
      </div>

      {(asignacionTipo === 'rol' || asignacionTipo === 'todos') && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Seleccionar Rol</label>
          <select
            value={rolId}
            onChange={(e) => setRolId(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">-- Selecciona un rol --</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      {asignacionTipo === 'usuarios' && (
        <div className="mb-4">
          <label className="block font-semibold mb-1">Seleccionar Usuarios</label>
          <select
            multiple
            value={usuarioIds.split(',').map(id => id.trim())}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => option.value);
              setUsuarioIds(values.join(','));
            }}
            className="w-full border border-gray-300 rounded px-3 py-2 h-48"
          >
            {usuarios.map((u) => {
              const seleccionados = usuarioIds.split(',').filter(id => id);
              const mostrarID = seleccionados.length > 1;
              return (
                <option key={u.id} value={u.id}>
                  {u.nombre} {u.apellido} {mostrarID ? `(ID: ${u.id})` : ''}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <button
        onClick={handleAsignar}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-2"
      >
        Asignar Documento
      </button>
    </div>
  );
}
