import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
    const { cart, clearCart, getTotalPrice } = useCart();
    const navigate = useNavigate();

    const [shippingAddress, setShippingAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card'); // Opciones: 'credit_card', 'paypal', 'bank_transfer'
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!shippingAddress.trim()) {
            setError('Por favor, ingresa tu dirección de envío.');
            setLoading(false);
            return;
        }

        if (cart.length === 0) {
            setError('Tu carrito está vacío. Añade productos antes de proceder.');
            setLoading(false);
            return;
        }

        try {
            // Aquí iría la lógica para enviar el pedido al backend
            // Esto implicaría hacer una petición POST a un endpoint /api/orders/
            // con los detalles del carrito, dirección de envío, método de pago, etc.
            // Para la demostración, simularemos una llamada a la API.

            console.log('Realizando pedido con:', {
                shippingAddress,
                paymentMethod,
                items: cart,
                total: getTotalPrice(),
            });

            await new Promise(resolve => setTimeout(resolve, 1500)); // Simular retraso de API

            setOrderConfirmed(true);
            clearCart(); // Limpiar el carrito después del pedido exitoso

        } catch (err) {
            console.error("Error al realizar el pedido:", err);
            setError('Error al procesar tu pedido. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (orderConfirmed) {
        return (
            <div className="container mx-auto px-4 py-16 text-center font-body min-h-[calc(100vh-80px)] flex flex-col justify-center items-center">
                <h1 className="text-5xl font-heading font-bold text-success-green mb-6">¡Pedido Realizado con Éxito! 🎉</h1>
                <p className="text-xl text-dark-blue-gray mb-8">Gracias por tu compra. Te enviaremos una confirmación a tu email.</p>
                <Link
                    to="/productos"
                    className="bg-primary-blue text-white font-bold py-3 px-8 rounded-lg text-lg
                               hover:bg-opacity-80 transition-colors duration-300 shadow-lg"
                >
                    Continuar Comprando
                </Link>
            </div>
        );
    }

    if (cart.length === 0 && !orderConfirmed) {
        return (
            <div className="container mx-auto px-4 py-16 text-center font-body min-h-[calc(100vh-80px)] flex flex-col justify-center items-center">
                <h1 className="text-4xl font-heading font-bold text-dark-blue-gray mb-4">Tu carrito está vacío</h1>
                <p className="text-lg text-medium-text-gray mb-8">No hay productos en tu carrito para procesar el pago.</p>
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
            <h1 className="text-4xl font-heading font-bold text-dark-blue-gray mb-8 text-center">Checkout</h1>
            
            <div className="bg-white p-8 rounded-lg shadow-xl mb-8">
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                    {/* Sección de Dirección de Envío */}
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-4">Dirección de Envío</h2>
                        <textarea
                            placeholder="Ingresa tu dirección completa (calle, número, ciudad, código postal)"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            rows="4"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                            required
                        ></textarea>
                    </div>

                    {/* Sección de Método de Pago */}
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-4">Método de Pago</h2>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue bg-white"
                        >
                            <option value="credit_card">Tarjeta de crédito</option>
                            <option value="paypal">PayPal</option>
                            <option value="bank_transfer">Transferencia bancaria</option>
                        </select>
                    </div>

                    {/* Resumen del Pedido */}
                    <div>
                        <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-4">Resumen de tu pedido</h2>
                        <div className="bg-light-background p-4 rounded-lg">
                            {cart.map(item => (
                                <div key={item.product.id} className="flex justify-between items-center mb-2">
                                    <span className="text-dark-blue-gray">{item.product.name} (x{item.quantity})</span>
                                    <span className="text-dark-blue-gray font-semibold">S/. {parseFloat(item.product.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <div className="border-t border-medium-text-gray pt-4 mt-4 flex justify-between items-center">
                                <span className="text-dark-blue-gray text-xl font-bold">Total:</span>
                                <span className="text-primary-blue text-2xl font-bold">S/. {getTotalPrice().toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-center mt-4 p-2 bg-red-100 rounded-md border border-red-200">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-success-green text-white font-bold py-3 px-6 rounded-lg text-lg
                                   hover:bg-opacity-80 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-success-green focus:ring-offset-2"
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Realizar compra'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;