import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const CategoryAdmin = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulación de fetch de categorías
    setTimeout(() => {
      setCategories([
        { id: 1, name: 'Electrónica' },
        { id: 2, name: 'Ropa' },
        { id: 3, name: 'Hogar' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  if (!user || !user.isAdmin) {
    return (
      <div className="flex justify-center items-center h-64 bg-red-100 border border-red-300 text-red-700 p-4 rounded-md mt-8">
        <p className="text-xl font-semibold">Acceso denegado. Solo administradores pueden ver esta página.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-8">Cargando categorías...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-3xl font-heading font-bold mb-6">Administrar Categorías</h2>
      <ul className="space-y-4">
        {categories.map((cat) => (
          <li key={cat.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
            <span className="font-medium text-lg">{cat.name}</span>
            {/* Aquí podrías agregar botones para editar/eliminar */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryAdmin;
