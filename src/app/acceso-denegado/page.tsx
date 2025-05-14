export default function AccesoDenegado() {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <h1 className="text-xl font-bold text-red-600">Acceso Denegado</h1>
          <p className="text-gray-600 mt-2">No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    );
  }
  