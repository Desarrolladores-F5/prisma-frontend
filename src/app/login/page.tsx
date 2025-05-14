'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mostrarContraseña, setMostrarContraseña] = useState(false);
  const [mensajeBienvenida, setMensajeBienvenida] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) {
      setMensajeBienvenida('¡Buenos días! Bienvenido');
    } else if (hora >= 12 && hora < 18) {
      setMensajeBienvenida('¡Buenas tardes! Bienvenido');
    } else {
      setMensajeBienvenida('¡Buenas noches! Bienvenido');
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contraseña }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem('token', data.token);

      try {
        const payload = JSON.parse(atob(data.token.split('.')[1]));
        const rol_id = payload.rol_id;

        switch (rol_id) {
          case 1:
            router.push('/admin/dashboard');
            break;
          case 2:
            router.push('/supervisor/dashboard');
            break;
          case 3:
            router.push('/trabajador/dashboard');
            break;
          default:
            setError('Rol no reconocido');
        }
      } catch (error) {
        setError('Token inválido');
      }
    } else {
      setError(data.mensaje || 'Error de autenticación');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-500 px-4">
      <div className="text-3xl font-semibold text-white mb-6 text-center">
        {mensajeBienvenida}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md transition-transform hover:scale-[1.02]">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Iniciar sesión</h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Introduce tu correo"
            />
          </div>

          <div className="mb-5 relative">
            <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              type={mostrarContraseña ? 'text' : 'password'}
              id="contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="Introduce tu contraseña"
            />
            <span
              onClick={() => setMostrarContraseña(!mostrarContraseña)}
              className="absolute top-10 right-3 cursor-pointer text-gray-500 hover:text-blue-600 text-lg"
            >
              👁️
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Iniciar sesión
          </button>

          <div className="text-center mt-4">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>

      <footer className="text-white text-sm mt-8 text-center">
        © 2025 Plataforma de Prevención de Riesgos. Todos los derechos reservados.
        <br />
        <a href="#" className="hover:underline">Términos y condiciones</a> |{' '}
        <a href="#" className="hover:underline">Política de privacidad</a>
      </footer>
    </div>
  );
}
