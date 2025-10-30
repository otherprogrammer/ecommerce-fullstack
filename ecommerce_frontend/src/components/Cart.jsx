import React, { useState } from 'react';
import { useCart } from '../context/CartContext'; 
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance'; // Para la petición del cupón

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0); // Para guardar el descuento aplicado por el cupón
    const [couponMessage, setCouponMessage] = useState({ type: '', text: '' }); // Mensajes de éxito/error del cupón
    const [appliedCoupon, setAppliedCoupon] = useState(null); // Guarda el objeto de cupón aplicado

    // Calcula el total del carrito antes del descuento del cupón
    const subtotal = getTotalPrice(); 
    const finalTotal = subtotal - couponDiscount;

    const handleApplyCoupon = async () => {
        setCouponMessage({ type: '', text: '' });
        setCouponDiscount(0); // Reinicia el descuento antes de aplicar uno nuevo
        setAppliedCoupon(null);

        if (!couponCode.trim()) {
            setCouponMessage({ type: 'error', text: 'Por favor, ingresa un código de cupón.' });
            return;
        }

        try {
            const response = await axiosInstance.post('/coupons/apply_coupon/', {
                code: couponCode,
                cart_total: parseFloat(subtotal.toFixed(2)), // Enviar el subtotal actual del carrito
            });

            // Si el cupón es válido, guarda el descuento
            setCouponDiscount(response.data.discount_amount);
            setAppliedCoupon(response.data.code); // O puedes guardar el objeto completo response.data
            setCouponMessage({ type: 'success', text: response.data.message });

        } catch (error) {
            console.error("Error applying coupon:", error.response?.data || error);
            setCouponDiscount(0);
            setAppliedCoupon(null);
            setCouponMessage({ type: 'error', text: error.response?.data?.detail || 'Error al aplicar el cupón.' });
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setCouponDiscount(0);
        setCouponMessage({ type: '', text: '' });
        setAppliedCoupon(null);
    };

    const handleCheckout = () => {
        // Por ahora, simplemente navegamos. El Checkout simula la compra.
        navigate('/checkout');
    };

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8 text-center font-body min-h-[calc(100vh-80px)] flex flex-col justify-center items-center">
                <h1 className="text-4xl font-heading font-bold text-dark-blue-gray mb-4">Tu Carrito Está Vacío</h1>
                <p className="text-lg text-medium-text-gray mb-8">Parece que no has añadido nada todavía. ¡Explora nuestros productos!</p>
                <Link
                    to="/productos"
                    className="bg-primary-blue text-white font-bold py-3 px-8 rounded-lg text-lg
                                hover:bg-opacity-80 transition-colors duration-300 shadow-lg"
                >
                    Ver Productos
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 font-body">
            <h1 className="text-4xl font-heading font-bold text-dark-blue-gray mb-8 text-center">Tu Carrito</h1>
            
            <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
                {cart.map(item => (
                    <div key={item.product.id} className="flex items-center p-4 border-b last:border-b-0 border-light-background">
                        <img
                            src={item.product.image_url || 'https://via.placeholder.com/100x100?text=No+Image'}
                            alt={item.product.name}
                            className="w-24 h-24 object-cover object-center rounded-lg mr-4"
                        />
                        <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-dark-blue-gray line-clamp-2">{item.product.name}</h2>
                            <p className="text-medium-text-gray text-base">Precio: S/. {parseFloat(item.product.price).toFixed(2)}</p>
                            <p className="text-medium-text-gray text-base">Subtotal: S/. {parseFloat(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-center ml-4">
                            <div className="flex items-center space-x-2 mb-2">
                                <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    className="bg-light-background text-dark-blue-gray px-3 py-1 rounded-full hover:bg-light-background/80 disabled:opacity-50 transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-lg font-bold">{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    disabled={item.quantity >= item.product.stock}
                                    className="bg-light-background text-dark-blue-gray px-3 py-1 rounded-full hover:bg-light-background/80 disabled:opacity-50 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => removeFromCart(item.product.id)}
                                className="text-red-500 hover:underline text-sm"
                            >
                                Eliminar del carrito
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sección para aplicar cupón */}
            <div className="bg-white p-6 rounded-lg shadow-xl mb-8">
                <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-4">Aplicar Cupón</h2>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Ingresa código de cupón"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                        disabled={appliedCoupon} // Deshabilitar si ya hay un cupón aplicado
                    />
                    {!appliedCoupon ? (
                        <button
                            onClick={handleApplyCoupon}
                            className="bg-primary-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-colors duration-300"
                        >
                            Aplicar
                        </button>
                    ) : (
                        <button
                            onClick={handleRemoveCoupon}
                            className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors duration-300"
                        >
                            Remover
                        </button>
                    )}
                </div>
                {couponMessage.text && (
                    <p className={`mt-2 text-sm ${couponMessage.type === 'success' ? 'text-success-green' : 'text-red-500'}`}>
                        {couponMessage.text}
                    </p>
                )}
                {appliedCoupon && (
                    <p className="mt-2 text-sm text-dark-blue-gray">
                        Cupón aplicado: <span className="font-bold">{appliedCoupon}</span> (-S/. {couponDiscount.toFixed(2)})
                    </p>
                )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-xl text-right">
                <h2 className="text-3xl font-heading font-bold text-dark-blue-gray mb-2">Subtotal: S/. {subtotal.toFixed(2)}</h2>
                {couponDiscount > 0 && (
                    <h2 className="text-2xl font-heading font-bold text-success-green mb-2">Descuento: -S/. {couponDiscount.toFixed(2)}</h2>
                )}
                <h2 className="text-4xl font-heading font-bold text-primary-blue mb-4">Total: S/. {finalTotal.toFixed(2)}</h2>
                <button
                    onClick={handleCheckout}
                    className="bg-success-green text-white font-bold py-3 px-8 rounded-lg text-lg
                                hover:bg-opacity-80 transition-colors duration-300 shadow-md"
                >
                    Proceder al pago
                </button>
            </div>
        </div>
    );
};

export default Cart;