import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    setLoading(true);

    if (password !== password2) {
      setErrors(prev => ({ ...prev, password2: ['Las contraseñas no coinciden.'] }));
      setLoading(false);
      return;
    }

    try {
      await authRegister({ username, email, password, password2 }); // Aquí se pasa el objeto completo al AuthContext
      console.log('Usuario registrado exitosamente');
      navigate('/login'); // Redirige a la página de login después del registro exitoso
    } catch (err) {
      console.error('Error al registrar usuario:', err);
      if (err.username || err.email || err.password || err.password2) {
        setErrors(err);
      } else if (err.detail) {
        setGeneralError(err.detail);
      } else {
        setGeneralError('Ocurrió un error inesperado al registrar el usuario.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-light-background font-body">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-heading font-bold text-dark-blue-gray mb-6 text-center">Registrarse</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-medium-text-gray text-sm font-semibold mb-2">Usuario</label>
            <input
              type="text"
              id="username"
              placeholder="Escribe tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
              required
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-medium-text-gray text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Escribe tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-medium-text-gray text-sm font-semibold mb-2">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Escribe tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
          </div>

          <div>
            <label htmlFor="password2" className="block text-medium-text-gray text-sm font-semibold mb-2">Confirmar Contraseña</label>
            <input
              type="password"
              id="password2"
              placeholder="Repite tu contraseña"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              className={`w-full p-3 border ${errors.password2 ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
              required
            />
            {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2[0]}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-blue text-white font-bold py-3 px-4 rounded-lg text-lg
                       hover:bg-opacity-80 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        {generalError && (
          <p className="text-red-500 text-center mt-4 p-2 bg-red-100 rounded-md border border-red-200">
            {generalError}
          </p>
        )}

        <p className="text-center text-medium-text-gray mt-4">
          ¿Ya tienes una cuenta? <Link to="/login" className="text-primary-blue hover:underline font-semibold">Inicia Sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;