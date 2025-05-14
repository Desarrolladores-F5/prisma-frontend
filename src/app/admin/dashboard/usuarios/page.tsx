'use client';

import { useState } from 'react';
import TablaUsuarios from '@/components/usuarios/TablaUsuarios';
import FormularioUsuario from '@/components/usuarios/FormularioUsuario';
import { useRouter } from 'next/navigation';

export default function UsuariosPage() {
  const [refrescar, setRefrescar] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState<any | null>(null);
  const [modoFormulario, setModoFormulario] = useState<'crear' | 'editar' | null>(null);
  const router = useRouter();

  const mostrarListado = () => {
    setModoFormulario(null);
    setUsuarioSeleccionado(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      {modoFormulario === 'crear' || modoFormulario === 'editar' ? (
        <>
          <FormularioUsuario
            usuario={usuarioSeleccionado}
            onUsuarioCreado={() => {
              setRefrescar(!refrescar);
              mostrarListado();
            }}
          />
          <div className="mt-4">
            <button
              onClick={mostrarListado}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Volver al Listado
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-end mb-4 gap-2">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => setModoFormulario('crear')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Crear Usuario
            </button>
          </div>

          <TablaUsuarios
            refrescar={refrescar}
            onEditar={(usuario) => {
              setUsuarioSeleccionado(usuario);
              setModoFormulario('editar');
            }}
            onEliminado={() => setRefrescar(!refrescar)}
          />
        </>
      )}
    </div>
  );
}
