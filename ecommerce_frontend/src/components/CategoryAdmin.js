import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CategoryAdmin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [generalMessage, setGeneralMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || !user.is_staff) {
            navigate('/');
            return;
        }
        fetchCategories();
    }, [user, navigate]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            // Usa axiosInstance y la ruta relativa. Headers ya los pone el interceptor.
            const response = await axiosInstance.get('/categories/'); 
            setCategories(response.data);
        } catch (err) {
            setGeneralMessage({ type: 'error', text: 'Error al cargar categorías.' });
            console.error("Error fetching categories:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormErrors({});
        setGeneralMessage({ type: '', text: '' });

        const categoryData = { name: editingCategory ? editingCategory.name : newCategoryName };

        if (!categoryData.name.trim()) {
            setFormErrors({ name: ["El nombre de la categoría es obligatorio."] });
            setLoading(false);
            return;
        }

        try {
            if (editingCategory) {
                // Usa axiosInstance y la ruta relativa. Headers ya los pone el interceptor.
                await axiosInstance.put(`/categories/${editingCategory.id}/`, categoryData); 
                setGeneralMessage({ type: 'success', text: 'Categoría actualizada exitosamente.' });
                setEditingCategory(null);
            } else {
                // Usa axiosInstance y la ruta relativa. Headers ya los pone el interceptor.
                await axiosInstance.post('/categories/', categoryData); 
                setGeneralMessage({ type: 'success', text: 'Categoría creada exitosamente.' });
                setNewCategoryName('');
            }
            fetchCategories();
        } catch (err) {
            console.error("Error saving category:", err.response?.data || err);
            if (err.response?.data) {
                setFormErrors(err.response.data);
                setGeneralMessage({ type: 'error', text: 'Errores en el formulario. Revisa los campos.' });
            } else {
                setGeneralMessage({ type: 'error', text: 'Error de red o desconocido al guardar categoría.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría? Esto también eliminará sus productos asociados.')) {
            setLoading(true);
            setGeneralMessage({ type: '', text: '' });
            try {
                // Usa axiosInstance y la ruta relativa. Headers ya los pone el interceptor.
                await axiosInstance.delete(`/categories/${categoryId}/`); 
                setGeneralMessage({ type: 'success', text: 'Categoría eliminada exitosamente.' });
                fetchCategories();
            } catch (err) {
                setGeneralMessage({ type: 'error', text: 'Error al eliminar la categoría.' });
                console.error("Error deleting category:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        setFormErrors({});
        setGeneralMessage({ type: '', text: '' });
    };

    const cancelEdit = () => {
        setEditingCategory(null);
        setFormErrors({});
        setGeneralMessage({ type: '', text: '' });
    };

    if (!user || !user.is_staff) {
        return (
            <div className="flex justify-center items-center h-64 bg-red-100 border border-red-300 text-red-700 p-4 rounded-md mx-auto max-w-lg mt-8">
                <p className="text-xl font-semibold">Acceso denegado. Solo administradores pueden ver esta página.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 font-body">
            <h1 className="text-4xl font-heading font-bold text-dark-blue-gray mb-8 text-center">
                {editingCategory ? 'Editar Categoría' : 'Administrar Categorías'}
            </h1>

            {generalMessage.text && (
                <div className={`p-3 mb-4 rounded-md text-center ${
                    generalMessage.type === 'success' ? 'bg-success-green/20 text-success-green' : 'bg-red-100 text-red-700'
                }`}>
                    {generalMessage.text}
                </div>
            )}

            <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="categoryName" className="block text-medium-text-gray text-sm font-semibold mb-2">Nombre de la categoría</label>
                        <input
                            type="text"
                            id="categoryName"
                            name="name"
                            placeholder="Nombre de la categoría"
                            value={editingCategory ? editingCategory.name : newCategoryName}
                            onChange={(e) => {
                                if (editingCategory) {
                                    setEditingCategory({ ...editingCategory, name: e.target.value });
                                } else {
                                    setNewCategoryName(e.target.value);
                                }
                                setFormErrors(prev => ({ ...prev, name: undefined }));
                            }}
                            className={`w-full p-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                            required
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name[0]}</p>}
                    </div>
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-grow bg-primary-blue text-white font-bold py-3 px-4 rounded-lg text-lg
                                        hover:bg-opacity-80 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                            disabled={loading}
                        >
                            {loading ? (editingCategory ? 'Actualizando...' : 'Creando...') : (editingCategory ? 'Actualizar Categoría' : 'Crear Categoría')}
                        </button>
                        {editingCategory && (
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="bg-medium-text-gray text-white font-bold py-3 px-4 rounded-lg text-lg
                                        hover:bg-opacity-80 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-medium-text-gray focus:ring-offset-2"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <h2 className="text-3xl font-heading font-bold text-dark-blue-gray mb-6 text-center">Lista de Categorías</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="col-span-full text-center text-dark-blue-gray">Cargando categorías...</p>
                ) : categories.length === 0 ? (
                    <p className="col-span-full text-center text-medium-text-gray">No hay categorías en el sistema. ¡Crea la primera!</p>
                ) : (
                    categories.map((category) => (
                        <div key={category.id} className="bg-white p-6 rounded-lg shadow-md flex justify-between items-center">
                            <span className="text-xl font-semibold text-dark-blue-gray">{category.name}</span>
                            <div className="space-x-2">
                                <button
                                    onClick={() => startEdit(category)}
                                    className="bg-light-background text-dark-blue-gray font-semibold py-2 px-3 rounded-lg hover:bg-light-background/80 transition-colors duration-300"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CategoryAdmin;