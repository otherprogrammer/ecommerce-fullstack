import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; 
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponMessage, setCouponMessage] = useState({ type: '', text: '' });
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [loadingCoupon, setLoadingCoupon] = useState(false);
    const [removingItem, setRemovingItem] = useState(null);

    const subtotal = getTotalPrice(); 
    const shipping = subtotal >= 100 ? 0 : 15;
    const finalTotal = subtotal - couponDiscount + shipping;

    const handleApplyCoupon = async () => {
        setCouponMessage({ type: '', text: '' });
        setCouponDiscount(0);
        setAppliedCoupon(null);

        if (!couponCode.trim()) {
            setCouponMessage({ type: 'error', text: 'Por favor, ingresa un código de cupón.' });
            return;
        }

        setLoadingCoupon(true);
        try {
            const response = await axiosInstance.post('/coupons/apply_coupon/', {
                code: couponCode,
                cart_total: parseFloat(subtotal.toFixed(2)),
            });

            setCouponDiscount(response.data.discount_amount);
            setAppliedCoupon(response.data.code);
            setCouponMessage({ type: 'success', text: response.data.message });

        } catch (error) {
            console.error("Error applying coupon:", error.response?.data || error);
            setCouponDiscount(0);
            setAppliedCoupon(null);
            setCouponMessage({ type: 'error', text: error.response?.data?.detail || 'Error al aplicar el cupón.' });
        } finally {
            setLoadingCoupon(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setCouponDiscount(0);
        setCouponMessage({ type: '', text: '' });
        setAppliedCoupon(null);
    };

    const handleRemoveItem = (productId) => {
        setRemovingItem(productId);
        setTimeout(() => {
            removeFromCart(productId);
            setRemovingItem(null);
        }, 300);
    };

    const handleCheckout = () => {
        navigate('/checkout', { state: { couponDiscount, appliedCoupon } });
    };

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-light-background flex items-center justify-center px-4">
                <div className="text-center max-w-md animate-fade-in">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-dark-blue-gray mb-3">Tu Carrito Está Vacío</h1>
                    <p className="text-medium-text-gray mb-8">Parece que no has añadido nada todavía. ¡Descubre nuestros increíbles productos!</p>
                    <Link
                        to="/productos"
                        className="inline-flex items-center bg-primary-blue text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                        </svg>
                        Explorar Productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-background py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-heading font-bold text-dark-blue-gray mb-2">Tu Carrito</h1>
                    <p className="text-medium-text-gray">{cart.length} {cart.length === 1 ? 'producto' : 'productos'} en tu carrito</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {/* Table header - hidden on mobile */}
                            <div className="hidden md:grid md:grid-cols-12 bg-gray-50 px-6 py-4 text-sm font-semibold text-medium-text-gray uppercase tracking-wide">
                                <div className="col-span-6">Producto</div>
                                <div className="col-span-2 text-center">Precio</div>
                                <div className="col-span-2 text-center">Cantidad</div>
                                <div className="col-span-2 text-right">Subtotal</div>
                            </div>

                            {/* Cart items */}
                            <div className="divide-y divide-gray-100">
                                {cart.map(item => (
                                    <div 
                                        key={item.product.id} 
                                        className={`p-4 md:p-6 transition-all duration-300 ${
                                            removingItem === item.product.id ? 'opacity-0 transform -translate-x-full' : 'opacity-100'
                                        }`}
                                    >
                                        <div className="md:grid md:grid-cols-12 md:gap-4 md:items-center">
                                            {/* Product info */}
                                            <div className="col-span-6 flex items-center mb-4 md:mb-0">
                                                <Link to={`/productos/${item.product.id}`} className="shrink-0">
                                                    <img
                                                        src={item.product.image_url || 'https://via.placeholder.com/100x100?text=No+Image'}
                                                        alt={item.product.name}
                                                        className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                                    />
                                                </Link>
                                                <div className="ml-4 flex-grow">
                                                    <Link to={`/productos/${item.product.id}`}>
                                                        <h2 className="text-lg font-semibold text-dark-blue-gray hover:text-primary-blue transition-colors line-clamp-2">
                                                            {item.product.name}
                                                        </h2>
                                                    </Link>
                                                    {item.product.category_name && (
                                                        <p className="text-sm text-medium-text-gray mt-1">{item.product.category_name}</p>
                                                    )}
                                                    <button
                                                        onClick={() => handleRemoveItem(item.product.id)}
                                                        className="mt-2 inline-flex items-center text-sm text-red-500 hover:text-red-600 transition-colors md:hidden"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                        </svg>
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="col-span-2 text-center hidden md:block">
                                                <span className="text-dark-blue-gray font-medium">
                                                    S/. {parseFloat(item.product.price).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Quantity */}
                                            <div className="col-span-2 flex justify-center md:justify-center mb-4 md:mb-0">
                                                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"/>
                                                        </svg>
                                                    </button>
                                                    <span className="w-12 text-center font-semibold text-dark-blue-gray">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        disabled={item.quantity >= item.product.stock}
                                                        className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtotal */}
                                            <div className="col-span-2 flex items-center justify-between md:justify-end">
                                                <span className="md:hidden text-medium-text-gray">Subtotal:</span>
                                                <span className="text-lg font-bold text-primary-blue">
                                                    S/. {parseFloat(item.product.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Remove button - desktop */}
                                            <button
                                                onClick={() => handleRemoveItem(item.product.id)}
                                                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                style={{ position: 'relative', right: 'auto', top: 'auto', transform: 'none' }}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Continue shopping */}
                        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between">
                            <Link
                                to="/productos"
                                className="inline-flex items-center justify-center text-primary-blue hover:text-dark-blue-gray font-semibold transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                                </svg>
                                Continuar Comprando
                            </Link>
                            <button
                                onClick={() => {
                                    if (window.confirm('¿Estás seguro de vaciar el carrito?')) {
                                        clearCart();
                                    }
                                }}
                                className="inline-flex items-center justify-center text-red-500 hover:text-red-600 font-semibold transition-colors"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                </svg>
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-6">Resumen del Pedido</h2>

                            {/* Coupon section */}
                            <div className="mb-6 pb-6 border-b border-gray-100">
                                <label className="block text-sm font-semibold text-dark-blue-gray mb-2">
                                    Código de Cupón
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ingresa tu código"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        className="flex-grow p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                        disabled={appliedCoupon || loadingCoupon}
                                    />
                                    {!appliedCoupon ? (
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={loadingCoupon}
                                            className="px-4 py-3 bg-dark-blue-gray text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
                                        >
                                            {loadingCoupon ? (
                                                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                </svg>
                                            ) : 'Aplicar'}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                {couponMessage.text && (
                                    <div className={`mt-3 p-3 rounded-lg text-sm ${
                                        couponMessage.type === 'success' 
                                            ? 'bg-green-50 text-success-green' 
                                            : 'bg-red-50 text-red-500'
                                    }`}>
                                        <div className="flex items-center">
                                            {couponMessage.type === 'success' ? (
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                            )}
                                            {couponMessage.text}
                                        </div>
                                    </div>
                                )}
                                {appliedCoupon && (
                                    <div className="mt-3 flex items-center justify-between bg-primary-blue/10 p-3 rounded-lg">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-primary-blue mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                                            </svg>
                                            <span className="font-bold text-primary-blue">{appliedCoupon}</span>
                                        </div>
                                        <span className="text-success-green font-semibold">-S/. {couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>

                            {/* Price breakdown */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-medium-text-gray">
                                    <span>Subtotal ({cart.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                                    <span>S/. {subtotal.toFixed(2)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-success-green">
                                        <span>Descuento</span>
                                        <span>-S/. {couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-medium-text-gray">
                                    <span>Envío</span>
                                    <span className={shipping === 0 ? 'text-success-green font-medium' : ''}>
                                        {shipping === 0 ? 'GRATIS' : `S/. ${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <div className="bg-primary-blue/10 p-3 rounded-lg text-sm text-primary-blue">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            Añade S/. {(100 - subtotal).toFixed(2)} más para envío gratis
                                        </div>
                                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary-blue rounded-full transition-all duration-500"
                                                style={{ width: `${Math.min(100, (subtotal / 100) * 100)}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-heading font-bold text-dark-blue-gray">Total</span>
                                    <span className="text-3xl font-heading font-bold text-primary-blue">
                                        S/. {finalTotal.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            {/* Checkout button */}
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-success-green text-white font-bold py-4 px-6 rounded-xl text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                            >
                                Proceder al Pago
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
                                </svg>
                            </button>

                            {/* Security badges */}
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-center space-x-4 text-xs text-medium-text-gray">
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                        </svg>
                                        Pago Seguro
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-4 h-4 mr-1 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                        </svg>
                                        SSL Encriptado
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;