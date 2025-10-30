import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importar el hook useAuth

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); // Renombramos 'login' para evitar conflicto
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Para errores generales o de credenciales

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    try {
      await authLogin(username, password); // Llama a la función login del AuthContext
      console.log('Login exitoso');
      navigate('/'); // <--- ¡AQUÍ ESTÁ LA REDIRECCIÓN AL HOME DESPUÉS DEL LOGIN EXITOSO!
      // El AuthContext ya se encarga de guardar los tokens
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      if (err.detail) {
        setError(err.detail); // Muestra el mensaje de error del backend (ej. "No active account found with the given credentials")
      } else {
        setError('Credenciales incorrectas o error desconocido.');
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-light-background font-body">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-heading font-bold text-dark-blue-gray mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-medium-text-gray text-sm font-semibold mb-2">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-medium-text-gray text-sm font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary-blue text-white font-bold py-3 px-4 rounded-lg text-lg
                       hover:bg-opacity-80 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
          >
            Iniciar Sesión
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-center mt-4 p-2 bg-red-100 rounded-md border border-red-200">
            {error}
          </p>
        )}

        <p className="text-center text-medium-text-gray mt-4">
          ¿No tienes una cuenta? <Link to="/register" className="text-primary-blue hover:underline font-semibold">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;