import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate('/profile');
    } catch (err) {
      console.error('Error en login:', err);
      if (err.detail) {
        setError(err.detail);
      } else {
        setError('Credenciales incorrectas o error en el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-light-background font-body">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-heading font-bold text-dark-blue-gray mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-medium-text-gray font-semibold mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-medium-text-gray font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary-blue text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'
            }`}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <p className="text-center text-medium-text-gray mt-4">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-primary-blue hover:underline font-semibold">
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
