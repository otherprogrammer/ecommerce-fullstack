import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance'; 
import { Link, useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config'; 


const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams(location.search);
                const categorySlug = params.get('category');
                
                // Construye la URL relativa a la base URL ya configurada en axiosInstance
                let url = '/products/'; 
                if (categorySlug) {
                    // Django filtro usa category__slug, no solo category
                    url += `?category__slug=${categorySlug}`;
                }

                // Usa axiosInstance en lugar de axios
                // No necesitas pasar headers de autorización aquí; el interceptor lo hace automáticamente
                const response = await axiosInstance.get(url); 
                
                // Django REST Framework devuelve resultados paginados
                // Si hay paginación, los productos están en response.data.results
                // Si no hay paginación, están directamente en response.data
                const productsData = response.data.results || response.data;
                setProducts(Array.isArray(productsData) ? productsData : []);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError('No se pudieron cargar los productos. Inténtalo de nuevo más tarde.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-light-background">
                <p className="text-dark-blue-gray text-xl font-semibold">Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-64 bg-red-100 border border-red-300 text-red-700 p-4 rounded-md mx-auto max-w-lg mt-8">
                <p>{error}</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-64 bg-white p-8 rounded-lg shadow-md mx-auto max-w-lg mt-8 text-dark-blue-gray">
                <p className="text-xl font-semibold mb-4">¡No hay productos disponibles!</p>
                {/* Puedes mantener este enlace o añadir lógica para mostrarlo solo si el usuario es staff */}
                <Link to="/productos/admin" className="text-primary-blue hover:underline">
                    ¿Eres administrador? Agrega algunos productos.
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-heading font-bold text-dark-blue-gray mb-8 text-center">Nuestros Productos</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <Link to={`/productos/${product.id}`} key={product.id} className="block">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                            <img
                                src={product.image_url || 'https://via.placeholder.com/400x300?text=No+Image'}
                                alt={product.name}
                                className="w-full h-48 object-cover object-center"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-heading font-semibold text-dark-blue-gray mb-2 line-clamp-2">{product.name}</h2>
                                {product.category_name && (
                                    <p className="text-medium-text-gray text-sm mb-2">{product.category_name}</p>
                                )}
                                <p className="text-primary-blue text-2xl font-bold mb-3">S/. {parseFloat(product.price).toFixed(2)}</p>
                                {/* Este botón de "Añadir al carrito" en la lista de productos
                                    debería usar la función real de tu CartContext para añadir al carrito,
                                    no un simple alert. Si ya tienes CartContext, asegúrate de importarlo y usarlo aquí.
                                    Por ahora, lo dejo como estaba para no introducir otro cambio.
                                */}
                                <button
                                    onClick={(e) => { e.preventDefault(); alert(`Añadir ${product.name} al carrito`); }}
                                    className="w-full bg-success-green text-white py-2 rounded-lg font-semibold hover:bg-opacity-80 transition-colors duration-300"
                                >
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ProductList;