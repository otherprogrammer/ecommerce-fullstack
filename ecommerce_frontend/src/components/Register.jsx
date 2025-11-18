import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    phone_number: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validación básica en frontend
    if (formData.password !== formData.password2) {
      setErrors({ password2: 'Las contraseñas no coinciden' });
      setLoading(false);
      return;
    }

    try {
      const response = await register(formData);
      console.log('Registro exitoso:', response);
      // Mostrar mensaje de éxito y redirigir
      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      console.error('Error en registro:', err);
      // Manejar errores del backend - err ya viene como objeto con los campos
      if (err && typeof err === 'object') {
        // Procesar errores que vienen como arrays (ej: password: ["error1", "error2"])
        const processedErrors = {};
        Object.keys(err).forEach(key => {
          if (Array.isArray(err[key])) {
            // Si es array, unir los mensajes
            processedErrors[key] = err[key].join(' ');
          } else {
            processedErrors[key] = err[key];
          }
        });
        
        // Si viene con estructura de errores de campo
        if (processedErrors.username || processedErrors.email || processedErrors.password || 
            processedErrors.password2 || processedErrors.phone_number) {
          setErrors(processedErrors);
        } else if (processedErrors.detail) {
          setErrors({ general: processedErrors.detail });
        } else if (processedErrors.error) {
          setErrors({ general: processedErrors.error });
        } else {
          setErrors({ general: JSON.stringify(processedErrors) });
        }
      } else {
        setErrors({ general: 'No se pudo registrar. Intenta de nuevo.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] bg-light-background font-body py-8">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-heading font-bold text-dark-blue-gray mb-6 text-center">Registrarse</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {errors.general}
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="block text-medium-text-gray font-semibold mb-2">
              Nombre de usuario *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.username ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-blue'
              }`}
              required
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-medium-text-gray font-semibold mb-2">
              Correo electrónico *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-blue'
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-medium-text-gray font-semibold mb-2">
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-blue'
              }`}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            <p className="text-xs text-gray-500 mt-1">Mínimo 8 caracteres</p>
          </div>

          <div>
            <label htmlFor="password2" className="block text-medium-text-gray font-semibold mb-2">
              Confirmar contraseña *
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.password2 ? 'border-red-500 focus:ring-red-500' : 'focus:ring-primary-blue'
              }`}
              required
            />
            {errors.password2 && <p className="text-red-500 text-sm mt-1">{errors.password2}</p>}
          </div>

          <div>
            <label htmlFor="phone_number" className="block text-medium-text-gray font-semibold mb-2">
              Teléfono (opcional)
            </label>
            <input
              type="tel"
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              placeholder="+51 999 999 999"
            />
            {errors.phone_number && <p className="text-red-500 text-sm mt-1">{errors.phone_number}</p>}
          </div>

          <div>
            <label htmlFor="address" className="block text-medium-text-gray font-semibold mb-2">
              Dirección (opcional)
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              rows="2"
              placeholder="Av. Principal 123, Lima"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary-blue text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-80'
            }`}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <p className="text-center text-medium-text-gray mt-4">
            ¿Ya tienes cuenta?{' '}
            <a href="/login" className="text-primary-blue hover:underline font-semibold">
              Inicia sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
