import React, { useState, useEffect } from 'react';
import axiosInstance from '../services/axiosInstance'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 

const ProductDetalle = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const { addToCart } = useCart(); 
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); 

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError(null);
            try {
                // Usa axiosInstance y la ruta relativa
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
            alert(`${quantity} x ${product.name} añadido(s) al carrito!`);
            navigate('/carrito');
        } else if (quantity > product.stock) {
            alert('No hay suficiente stock disponible para la cantidad solicitada.');
        } else {
            alert('Por favor, ingresa una cantidad válida.');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64 bg-light-background">
                <p className="text-dark-blue-gray text-xl font-semibold">Cargando detalles del producto...</p>
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

    if (!product) {
        return (
            <div className="flex justify-center items-center h-64 bg-white p-8 rounded-lg shadow-md mx-auto max-w-lg mt-8 text-dark-blue-gray">
                <p className="text-xl font-semibold">Producto no encontrado.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 font-body">
            <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-xl overflow-hidden p-6 gap-8">
                {/* Columna de la Imagen */}
                <div className="md:w-1/2 flex justify-center items-center p-4">
                    <img
                        src={product.image_url || 'https://via.placeholder.com/600x400?text=No+Image'}
                        alt={product.name}
                        className="max-w-full h-auto rounded-lg shadow-md"
                    />
                </div>

                {/* Columna de la Información del Producto */}
                <div className="md:w-1/2 p-4 flex flex-col justify-center">
                    <h1 className="text-4xl font-heading font-bold text-dark-blue-gray mb-4">{product.name}</h1>
                    {product.category_name && (
                        <p className="text-medium-text-gray text-lg mb-2">Categoría: <span className="font-semibold">{product.category_name}</span></p>
                    )}
                    <p className="text-dark-blue-gray text-base mb-6 leading-relaxed">{product.description}</p>
                    <p className="text-primary-blue text-5xl font-bold mb-6">S/. {parseFloat(product.price).toFixed(2)}</p>
                    
                    <div className="mb-6">
                        <p className="text-medium-text-gray text-lg font-semibold">Stock disponible: <span className={product.stock > 0 ? "text-success-green" : "text-red-500"}>{product.stock}</span> unidades</p>
                    </div>

                    {product.stock > 0 ? (
                        <>
                            <div className="flex items-center mb-6 space-x-3">
                                <label htmlFor="quantity" className="text-dark-blue-gray text-lg font-semibold">Cantidad:</label>
                                <input
                                    type="number"
                                    id="quantity"
                                    min="1"
                                    max={product.stock}
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                    className="w-20 p-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary-blue"
                                />
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="bg-success-green text-white font-bold py-3 px-6 rounded-lg text-xl
                                        hover:bg-opacity-80 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-success-green focus:ring-offset-2"
                            >
                                Añadir al Carrito
                            </button>
                        </>
                    ) : (
                        <p className="text-red-500 text-2xl font-bold text-center mt-4">¡Producto sin stock!</p>
                    )}

                    <button
                        onClick={() => navigate('/productos')}
                        className="mt-6 text-primary-blue hover:underline self-start text-lg"
                    >
                        ← Volver a Productos
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetalle;