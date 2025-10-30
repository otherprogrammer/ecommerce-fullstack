import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/profile');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-light-background font-body">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-heading font-bold text-dark-blue-gray mb-6 text-center">Iniciar Sesión</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-medium-text-gray font-semibold mb-2">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-medium-text-gray font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-primary-blue text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-opacity-80 transition-colors duration-300 shadow-lg"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
