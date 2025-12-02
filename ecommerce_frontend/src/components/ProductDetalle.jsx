import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance'; 
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LoadingSpinner from './LoadingSpinner';

const ProductDetalle = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { addToCart } = useCart(); 
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosInstance.get(`/products/${id}/`); 
                setProduct(response.data);
            } catch (err) {
                console.error("Error fetching product details:", err);
                setError('No se pudo cargar el detalle del producto.');
                if (err.response && err.response.status === 404) {
                    navigate('/productos');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, navigate]);

    const handleAddToCart = () => {
        if (product && quantity > 0 && quantity <= product.stock) {
            addToCart(product, quantity);
            setAddedToCart(true);
            setTimeout(() => setAddedToCart(false), 2000);
        } else if (quantity > product.stock) {
            alert('No hay suficiente stock disponible para la cantidad solicitada.');
        } else {
            alert('Por favor, ingresa una cantidad válida.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-light-background">
                <LoadingSpinner size="large" text="Cargando producto..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center px-4">
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-lg max-w-lg w-full text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                    </svg>
                    <p className="text-lg font-semibold mb-4">{error}</p>
                    <Link to="/productos" className="text-primary-blue hover:underline">
                        Volver a productos
                    </Link>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <p className="text-xl font-semibold text-dark-blue-gray">Producto no encontrado</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-background py-8">
            {/* Breadcrumb */}
            <div className="container mx-auto px-4 mb-6">
                <nav className="flex items-center space-x-2 text-sm text-medium-text-gray">
                    <Link to="/" className="hover:text-primary-blue transition-colors">Inicio</Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    <Link to="/productos" className="hover:text-primary-blue transition-colors">Productos</Link>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    <span className="text-dark-blue-gray font-medium truncate max-w-[200px]">{product.name}</span>
                </nav>
            </div>

            <div className="container mx-auto px-4">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Image Section */}
                        <div className="lg:w-1/2 p-6 lg:p-8">
                            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                                <img
                                    src={product.image_url || 'https://via.placeholder.com/600x600?text=Sin+Imagen'}
                                    alt={product.name}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/600x600?text=Sin+Imagen';
                                    }}
                                />
                                {product.stock <= 5 && product.stock > 0 && (
                                    <span className="absolute top-4 left-4 bg-yellow-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                                        ¡Últimas {product.stock} unidades!
                                    </span>
                                )}
                                {product.stock === 0 && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white text-lg font-bold px-6 py-3 rounded-lg">
                                            Agotado
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col">
                            {/* Category */}
                            {product.category_name && (
                                <Link 
                                    to={`/productos?category=${product.category_slug || ''}`}
                                    className="inline-flex items-center text-sm font-medium text-primary-blue hover:text-dark-blue-gray transition-colors mb-4"
                                >
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                    </svg>
                                    {product.category_name}
                                </Link>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-dark-blue-gray mb-4">
                                {product.name}
                            </h1>

                            {/* Rating placeholder */}
                            <div className="flex items-center mb-4">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                    ))}
                                </div>
                                <span className="ml-2 text-medium-text-gray text-sm">(Sin reseñas aún)</span>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-primary-blue">
                                    S/. {parseFloat(product.price).toFixed(2)}
                                </span>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-dark-blue-gray mb-2">Descripción</h3>
                                <p className="text-medium-text-gray leading-relaxed">
                                    {product.description || 'Sin descripción disponible para este producto.'}
                                </p>
                            </div>

                            {/* Stock */}
                            <div className="flex items-center mb-6">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    product.stock > 10 
                                        ? 'bg-green-100 text-green-800' 
                                        : product.stock > 0 
                                            ? 'bg-yellow-100 text-yellow-800' 
                                            : 'bg-red-100 text-red-800'
                                }`}>
                                    <span className={`w-2 h-2 rounded-full mr-2 ${
                                        product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}></span>
                                    {product.stock > 0 ? `${product.stock} unidades disponibles` : 'Sin stock'}
                                </span>
                            </div>

                            {/* Add to cart section */}
                            {product.stock > 0 ? (
                                <div className="space-y-4 mt-auto">
                                    {/* Quantity selector */}
                                    <div className="flex items-center space-x-4">
                                        <span className="text-dark-blue-gray font-semibold">Cantidad:</span>
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                                                </svg>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.stock}
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                                className="w-16 text-center py-2 border-x border-gray-300 focus:outline-none"
                                            />
                                            <button
                                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button
                                            onClick={handleAddToCart}
                                            disabled={addedToCart}
                                            className={`flex-1 flex items-center justify-center py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                                                addedToCart 
                                                    ? 'bg-success-green text-white' 
                                                    : 'bg-success-green text-white hover:bg-opacity-90 hover:shadow-lg active:scale-95'
                                            }`}
                                        >
                                            {addedToCart ? (
                                                <>
                                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                                    </svg>
                                                    ¡Añadido!
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                                                    </svg>
                                                    Añadir al Carrito
                                                </>
                                            )}
                                        </button>
                                        
                                        <Link
                                            to="/carrito"
                                            className="flex-1 flex items-center justify-center py-4 px-6 border-2 border-primary-blue text-primary-blue rounded-xl font-bold text-lg hover:bg-primary-blue hover:text-white transition-all duration-300"
                                        >
                                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                                            </svg>
                                            Ver Carrito
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-auto">
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                                        <svg className="w-12 h-12 mx-auto mb-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                                        </svg>
                                        <p className="text-red-600 font-bold text-xl">Producto sin stock</p>
                                        <p className="text-red-500 text-sm mt-2">Vuelve pronto para ver si hay disponibilidad</p>
                                    </div>
                                </div>
                            )}

                            {/* Shipping info */}
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center text-sm text-medium-text-gray">
                                        <svg className="w-5 h-5 mr-2 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                        </svg>
                                        Envío gratis +S/.100
                                    </div>
                                    <div className="flex items-center text-sm text-medium-text-gray">
                                        <svg className="w-5 h-5 mr-2 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                        </svg>
                                        Garantía 30 días
                                    </div>
                                    <div className="flex items-center text-sm text-medium-text-gray">
                                        <svg className="w-5 h-5 mr-2 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                        </svg>
                                        Pago seguro
                                    </div>
                                    <div className="flex items-center text-sm text-medium-text-gray">
                                        <svg className="w-5 h-5 mr-2 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                        </svg>
                                        Devolución gratis
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back button */}
                <div className="mt-8">
                    <button
                        onClick={() => navigate('/productos')}
                        className="inline-flex items-center text-primary-blue hover:text-dark-blue-gray font-semibold transition-colors duration-300"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                        </svg>
                        Volver a Productos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetalle;