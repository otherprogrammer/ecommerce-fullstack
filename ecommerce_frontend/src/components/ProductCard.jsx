import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock > 0) {
            addToCart(product, 1);
        }
    };

    return (
        <Link to={`/productos/${product.id}`} className="block group">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                {/* Image Container - Fixed Height */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                        src={product.image_url || 'https://via.placeholder.com/400x300?text=Sin+Imagen'}
                        alt={product.name}
                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen';
                        }}
                    />
                    {/* Stock Badge */}
                    {product.stock <= 5 && product.stock > 0 && (
                        <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            ¡Últimas {product.stock} unidades!
                        </span>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg">
                                Agotado
                            </span>
                        </div>
                    )}
                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-dark-blue-gray bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-primary-blue px-4 py-2 rounded-lg font-semibold text-sm">
                            Ver Detalles
                        </span>
                    </div>
                </div>

                {/* Content - Flex grow to fill remaining space */}
                <div className="p-5 flex flex-col flex-grow">
                    {/* Category */}
                    {product.category_name && (
                        <span className="text-xs font-medium text-primary-blue uppercase tracking-wide mb-2">
                            {product.category_name}
                        </span>
                    )}
                    
                    {/* Product Name - Fixed height with line clamp */}
                    <h3 className="text-lg font-heading font-semibold text-dark-blue-gray mb-2 line-clamp-2 min-h-[3.5rem]">
                        {product.name}
                    </h3>
                    
                    {/* Description preview */}
                    {product.description && (
                        <p className="text-sm text-medium-text-gray mb-3 line-clamp-2 flex-grow">
                            {product.description}
                        </p>
                    )}

                    {/* Price and Button - Always at bottom */}
                    <div className="mt-auto">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-primary-blue">
                                S/. {parseFloat(product.price).toFixed(2)}
                            </span>
                            {product.stock > 0 && (
                                <span className="text-xs text-success-green font-medium flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                                    </svg>
                                    En stock
                                </span>
                            )}
                        </div>
                        
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center justify-center space-x-2 ${
                                product.stock > 0
                                    ? 'bg-success-green text-white hover:bg-opacity-90 hover:shadow-lg active:scale-95'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            <span>{product.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
