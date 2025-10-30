import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance'; 
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductAdmin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        image_url: '',
        category: '',
    });
    const [editingProduct, setEditingProduct] = useState(null);
    const [formErrors, setFormErrors] = useState({});
    const [generalMessage, setGeneralMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user || !user.is_staff) {
            navigate('/');
            return;
        }
        fetchProducts();
        fetchCategories();
    }, [user, navigate]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            // Usa axiosInstance y la ruta relativa. Headers ya los pone el interceptor.
            const response = await axiosInstance.get('/products/'); 
            setProducts(response.data);
        } catch (err) {
            setGeneralMessage({ type: 'error', text: 'Error al cargar productos.' });
            console.error("Error fetching products:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            // Usa axiosInstance y la ruta relativa. Headers ya los pone el interceptor.
            const response = await axiosInstance.get('/categories/'); 
            setCategories(response.data);
        } catch (err) {
            setGeneralMessage({ type: 'error', text: 'Error al cargar categorías.' });
            console.error("Error fetching categories:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editingProduct) {
            setEditingProduct({ ...editingProduct, [name]: value });
        } else {
            setNewProduct({ ...newProduct, [name]: value });
        }
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormErrors({});
        setGeneralMessage({ type: '', text: '' });

        const productData = editingProduct || newProduct;
        const currentErrors = {};
        if (!productData.name) currentErrors.name = ["El nombre es obligatorio."];
        if (!productData.price || isNaN(productData.price) || parseFloat(productData.price) <= 0) currentErrors.price = ["El precio debe ser un número positivo."];
        if (!productData.stock || isNaN(productData.stock) || parseInt(productData.stock) < 0) currentErrors.stock = ["El stock debe ser un número entero no negativo."];
        if (!productData.category) currentErrors.category = ["La categoría es obligatoria."];
        
        if (Object.keys(currentErrors).length > 0) {
            setFormErrors(currentErrors);
            setLoading(false);
            return;
        }

        try {
            if (editingProduct) {
                // Usa axiosInstance y la ruta relativa. Headers ya los pone el interceptor.
                await axiosInstance.put(`/products/${editingProduct.id}/`, productData); 
                setGeneralMessage({ type: 'success', text: 'Producto actualizado exitosamente.' });
                setEditingProduct(null);
            } else {
                // Usa axiosInstance y la ruta relativa. Headers ya los pone el interceptor.
                await axiosInstance.post('/products/', productData); 
                setGeneralMessage({ type: 'success', text: 'Producto creado exitosamente.' });
                setNewProduct({ name: '', description: '', price: '', stock: '', image_url: '', category: '' });
            }
            fetchProducts();
        } catch (err) {
            console.error("Error saving product:", err.response?.data || err);
            if (err.response?.data) {
                setFormErrors(err.response.data);
                setGeneralMessage({ type: 'error', text: 'Errores en el formulario. Revisa los campos.' });
            } else {
                setGeneralMessage({ type: 'error', text: 'Error de red o desconocido al guardar producto.' });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            setLoading(true);
            setGeneralMessage({ type: '', text: '' });
            try {
                // Usa axiosInstance y la ruta relativa. Headers ya los pone el interceptor.
                await axiosInstance.delete(`/products/${productId}/`); 
                setGeneralMessage({ type: 'success', text: 'Producto eliminado exitosamente.' });
                fetchProducts();
            } catch (err) {
                setGeneralMessage({ type: 'error', text: 'Error al eliminar el producto.' });
                console.error("Error deleting product:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    const startEdit = (product) => {
        setEditingProduct({ ...product, category: product.category.id || product.category });
        setFormErrors({});
        setGeneralMessage({ type: '', text: '' });
    };

    const cancelEdit = () => {
        setEditingProduct(null);
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
                {editingProduct ? 'Editar Producto' : 'Administrar Productos'}
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
                        <label htmlFor="name" className="block text-medium-text-gray text-sm font-semibold mb-2">Nombre del producto</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Nombre del producto"
                            value={editingProduct ? editingProduct.name : newProduct.name}
                            onChange={handleChange}
                            className={`w-full p-3 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                            required
                        />
                        {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name[0]}</p>}
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-medium-text-gray text-sm font-semibold mb-2">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Descripción del producto"
                            value={editingProduct ? editingProduct.description : newProduct.description}
                            onChange={handleChange}
                            rows="4"
                            className={`w-full p-3 border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                        ></textarea>
                        {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description[0]}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="price" className="block text-medium-text-gray text-sm font-semibold mb-2">Precio</label>
                            <input
                                type="number"
                                id="price"
                                name="price"
                                placeholder="Precio"
                                value={editingProduct ? editingProduct.price : newProduct.price}
                                onChange={handleChange}
                                className={`w-full p-3 border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                                required
                                step="0.01"
                            />
                            {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price[0]}</p>}
                        </div>
                        <div>
                            <label htmlFor="stock" className="block text-medium-text-gray text-sm font-semibold mb-2">Stock</label>
                            <input
                                type="number"
                                id="stock"
                                name="stock"
                                placeholder="Stock"
                                value={editingProduct ? editingProduct.stock : newProduct.stock}
                                onChange={handleChange}
                                className={`w-full p-3 border ${formErrors.stock ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                                required
                            />
                            {formErrors.stock && <p className="text-red-500 text-sm mt-1">{formErrors.stock[0]}</p>}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="image_url" className="block text-medium-text-gray text-sm font-semibold mb-2">URL de la imagen</label>
                        <input
                            type="url"
                            id="image_url"
                            name="image_url"
                            placeholder="Ej: https://ejemplo.com/imagen.jpg"
                            value={editingProduct ? editingProduct.image_url : newProduct.image_url}
                            onChange={handleChange}
                            className={`w-full p-3 border ${formErrors.image_url ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue`}
                        />
                        {formErrors.image_url && <p className="text-red-500 text-sm mt-1">{formErrors.image_url[0]}</p>}
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-medium-text-gray text-sm font-semibold mb-2">Seleccionar categoría</label>
                        <select
                            id="category"
                            name="category"
                            value={editingProduct ? editingProduct.category : newProduct.category}
                            onChange={handleChange}
                            className={`w-full p-3 border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white`}
                            required
                        >
                            <option value="">-- Selecciona una categoría --</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                        {formErrors.category && <p className="text-red-500 text-sm mt-1">{formErrors.category[0]}</p>}
                    </div>

                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className="flex-grow bg-primary-blue text-white font-bold py-3 px-4 rounded-lg text-lg
                                        hover:bg-opacity-80 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-blue focus:ring-offset-2"
                            disabled={loading}
                        >
                            {loading ? (editingProduct ? 'Actualizando...' : 'Creando...') : (editingProduct ? 'Actualizar Producto' : 'Crear Producto')}
                        </button>
                        {editingProduct && (
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

            <h2 className="text-3xl font-heading font-bold text-dark-blue-gray mb-6 text-center">Lista de Productos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    <p className="col-span-full text-center text-dark-blue-gray">Cargando productos...</p>
                ) : products.length === 0 ? (
                    <p className="col-span-full text-center text-medium-text-gray">No hay productos en el sistema. ¡Crea el primero!</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <img
                                src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                                alt={product.name}
                                className="w-full h-48 object-cover object-center"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-heading font-semibold text-dark-blue-gray mb-1 line-clamp-2">{product.name}</h3>
                                {product.category_name && (
                                    <p className="text-medium-text-gray text-sm mb-2">{product.category_name}</p>
                                )}
                                <p className="text-primary-blue text-xl font-bold mb-3">S/. {parseFloat(product.price).toFixed(2)}</p>
                                <p className="text-medium-text-gray text-sm mb-4">Stock: {product.stock}</p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => startEdit(product)}
                                        className="flex-grow bg-light-background text-dark-blue-gray font-semibold py-2 px-3 rounded-lg hover:bg-light-background/80 transition-colors duration-300"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="flex-grow bg-red-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ProductAdmin;