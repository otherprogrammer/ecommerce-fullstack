import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
    const { cart, clearCart, getTotalPrice } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    
    // Get coupon info from Cart if passed
    const couponDiscount = location.state?.couponDiscount || 0;
    const appliedCoupon = location.state?.appliedCoupon || null;

    const [formData, setFormData] = useState({
        fullName: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : '',
        email: user?.email || '',
        phone: user?.phone_number || '',
        address: user?.address || '',
        city: '',
        postalCode: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [orderConfirmed, setOrderConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review

    const subtotal = getTotalPrice();
    const shipping = subtotal >= 100 ? 0 : 15;
    const finalTotal = subtotal - couponDiscount + shipping;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validateStep1 = () => {
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.postalCode.trim()) {
            setError('Por favor, completa todos los campos de envío.');
            return false;
        }
        setError('');
        return true;
    };

    const validateStep2 = () => {
        if (paymentMethod === 'credit_card') {
            if (!formData.cardNumber.trim() || !formData.cardName.trim() || !formData.expiryDate.trim() || !formData.cvv.trim()) {
                setError('Por favor, completa todos los datos de la tarjeta.');
                return false;
            }
        }
        setError('');
        return true;
    };

    const nextStep = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
        } else if (step === 2 && validateStep2()) {
            setStep(3);
        }
    };

    const prevStep = () => {
        setError('');
        setStep(step - 1);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (cart.length === 0) {
            setError('Tu carrito está vacío.');
            setLoading(false);
            return;
        }

        try {
            console.log('Realizando pedido:', {
                shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}`,
                paymentMethod,
                items: cart,
                total: finalTotal,
                couponApplied: appliedCoupon,
            });

            await new Promise(resolve => setTimeout(resolve, 2000));

            setOrderConfirmed(true);
            clearCart();

        } catch (err) {
            console.error("Error al realizar el pedido:", err);
            setError('Error al procesar tu pedido. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    if (orderConfirmed) {
        return (
            <div className="min-h-screen bg-light-background flex items-center justify-center px-4">
                <div className="max-w-lg w-full text-center animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                        <div className="w-20 h-20 mx-auto mb-6 bg-success-green rounded-full flex items-center justify-center animate-pulse">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-heading font-bold text-dark-blue-gray mb-4">¡Pedido Confirmado!</h1>
                        <p className="text-medium-text-gray mb-2">Gracias por tu compra, {formData.fullName.split(' ')[0]}.</p>
                        <p className="text-medium-text-gray mb-6">Te enviaremos un email de confirmación a {formData.email}</p>
                        
                        <div className="bg-light-background rounded-xl p-4 mb-6">
                            <p className="text-sm text-medium-text-gray">Número de pedido</p>
                            <p className="text-2xl font-bold text-primary-blue">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/productos"
                                className="flex-1 bg-primary-blue text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
                            >
                                Seguir Comprando
                            </Link>
                            <Link
                                to="/perfil"
                                className="flex-1 border-2 border-dark-blue-gray text-dark-blue-gray font-bold py-3 px-6 rounded-xl hover:bg-dark-blue-gray hover:text-white transition-all"
                            >
                                Ver Mis Pedidos
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-light-background flex items-center justify-center px-4">
                <div className="text-center max-w-md">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-dark-blue-gray mb-4">Carrito Vacío</h1>
                    <p className="text-medium-text-gray mb-8">No hay productos para procesar.</p>
                    <Link
                        to="/productos"
                        className="inline-flex items-center bg-primary-blue text-white font-bold py-4 px-8 rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
                    >
                        Ver Productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-background py-8">
            <div className="container mx-auto px-4">
                {/* Progress Steps */}
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="flex items-center justify-center">
                        {[
                            { num: 1, label: 'Envío' },
                            { num: 2, label: 'Pago' },
                            { num: 3, label: 'Confirmar' }
                        ].map((s, idx) => (
                            <React.Fragment key={s.num}>
                                <div className="flex flex-col items-center">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                                        step >= s.num 
                                            ? 'bg-primary-blue text-white' 
                                            : 'bg-gray-200 text-gray-500'
                                    }`}>
                                        {step > s.num ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                            </svg>
                                        ) : s.num}
                                    </div>
                                    <span className={`text-sm mt-2 font-medium ${step >= s.num ? 'text-primary-blue' : 'text-gray-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {idx < 2 && (
                                    <div className={`w-20 md:w-32 h-1 mx-2 rounded ${step > s.num ? 'bg-primary-blue' : 'bg-gray-200'}`}/>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                    {/* Form Section */}
                    <div className="lg:w-2/3">
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                            {/* Step 1: Shipping */}
                            {step === 1 && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-6 flex items-center">
                                        <svg className="w-6 h-6 mr-3 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                        Información de Envío
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-dark-blue-gray mb-2">Nombre Completo</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="Juan Pérez"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-dark-blue-gray mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="juan@email.com"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-dark-blue-gray mb-2">Teléfono</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="+51 999 888 777"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-dark-blue-gray mb-2">Dirección</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="Av. Principal 123, Dpto 4B"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-dark-blue-gray mb-2">Ciudad</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="Lima"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-dark-blue-gray mb-2">Código Postal</label>
                                            <input
                                                type="text"
                                                name="postalCode"
                                                value={formData.postalCode}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                placeholder="15001"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Payment */}
                            {step === 2 && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-6 flex items-center">
                                        <svg className="w-6 h-6 mr-3 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                                        </svg>
                                        Método de Pago
                                    </h2>
                                    
                                    {/* Payment Method Selection */}
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        {[
                                            { id: 'credit_card', label: 'Tarjeta', icon: '💳' },
                                            { id: 'paypal', label: 'PayPal', icon: '🅿️' },
                                            { id: 'bank_transfer', label: 'Transferencia', icon: '🏦' },
                                        ].map(method => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-4 border-2 rounded-xl text-center transition-all ${
                                                    paymentMethod === method.id 
                                                        ? 'border-primary-blue bg-primary-blue/5' 
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <span className="text-2xl block mb-1">{method.icon}</span>
                                                <span className={`text-sm font-medium ${paymentMethod === method.id ? 'text-primary-blue' : 'text-medium-text-gray'}`}>
                                                    {method.label}
                                                </span>
                                            </button>
                                        ))}
                                    </div>

                                    {paymentMethod === 'credit_card' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-dark-blue-gray mb-2">Número de Tarjeta</label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                    placeholder="1234 5678 9012 3456"
                                                    maxLength="19"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-dark-blue-gray mb-2">Nombre en la Tarjeta</label>
                                                <input
                                                    type="text"
                                                    name="cardName"
                                                    value={formData.cardName}
                                                    onChange={handleInputChange}
                                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                    placeholder="JUAN PEREZ"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-dark-blue-gray mb-2">Vencimiento</label>
                                                    <input
                                                        type="text"
                                                        name="expiryDate"
                                                        value={formData.expiryDate}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                        placeholder="MM/AA"
                                                        maxLength="5"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-dark-blue-gray mb-2">CVV</label>
                                                    <input
                                                        type="text"
                                                        name="cvv"
                                                        value={formData.cvv}
                                                        onChange={handleInputChange}
                                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all"
                                                        placeholder="123"
                                                        maxLength="4"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'paypal' && (
                                        <div className="bg-blue-50 p-6 rounded-xl text-center">
                                            <p className="text-blue-800 font-medium">Serás redirigido a PayPal para completar el pago.</p>
                                        </div>
                                    )}

                                    {paymentMethod === 'bank_transfer' && (
                                        <div className="bg-gray-50 p-6 rounded-xl">
                                            <p className="text-dark-blue-gray font-medium mb-2">Datos para transferencia:</p>
                                            <p className="text-medium-text-gray text-sm">Banco: BCP</p>
                                            <p className="text-medium-text-gray text-sm">Cuenta: 123-456-789-0-12</p>
                                            <p className="text-medium-text-gray text-sm">CCI: 00212345678901234567</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 3: Review */}
                            {step === 3 && (
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-heading font-bold text-dark-blue-gray mb-6 flex items-center">
                                        <svg className="w-6 h-6 mr-3 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                                        </svg>
                                        Confirmar Pedido
                                    </h2>
                                    
                                    {/* Shipping Summary */}
                                    <div className="bg-light-background rounded-xl p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-dark-blue-gray">Dirección de Envío</h3>
                                            <button onClick={() => setStep(1)} className="text-primary-blue text-sm hover:underline">Editar</button>
                                        </div>
                                        <p className="text-medium-text-gray">{formData.fullName}</p>
                                        <p className="text-medium-text-gray">{formData.address}</p>
                                        <p className="text-medium-text-gray">{formData.city}, {formData.postalCode}</p>
                                        <p className="text-medium-text-gray">{formData.phone}</p>
                                    </div>

                                    {/* Payment Summary */}
                                    <div className="bg-light-background rounded-xl p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-semibold text-dark-blue-gray">Método de Pago</h3>
                                            <button onClick={() => setStep(2)} className="text-primary-blue text-sm hover:underline">Editar</button>
                                        </div>
                                        <p className="text-medium-text-gray">
                                            {paymentMethod === 'credit_card' && `Tarjeta terminada en ${formData.cardNumber.slice(-4) || '****'}`}
                                            {paymentMethod === 'paypal' && 'PayPal'}
                                            {paymentMethod === 'bank_transfer' && 'Transferencia Bancaria'}
                                        </p>
                                    </div>

                                    {/* Products */}
                                    <div className="bg-light-background rounded-xl p-4">
                                        <h3 className="font-semibold text-dark-blue-gray mb-3">Productos ({cart.length})</h3>
                                        <div className="space-y-3 max-h-48 overflow-y-auto">
                                            {cart.map(item => (
                                                <div key={item.product.id} className="flex items-center gap-3">
                                                    <img 
                                                        src={item.product.image_url || 'https://via.placeholder.com/50'} 
                                                        alt={item.product.name}
                                                        className="w-12 h-12 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-grow">
                                                        <p className="text-dark-blue-gray font-medium text-sm line-clamp-1">{item.product.name}</p>
                                                        <p className="text-medium-text-gray text-xs">Cantidad: {item.quantity}</p>
                                                    </div>
                                                    <span className="text-dark-blue-gray font-semibold">
                                                        S/. {(item.product.price * item.quantity).toFixed(2)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center text-red-600">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    {error}
                                </div>
                            )}

                            {/* Navigation Buttons */}
                            <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                                {step > 1 ? (
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex items-center text-medium-text-gray hover:text-dark-blue-gray font-semibold transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                        </svg>
                                        Atrás
                                    </button>
                                ) : (
                                    <Link to="/carrito" className="flex items-center text-medium-text-gray hover:text-dark-blue-gray font-semibold transition-colors">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
                                        </svg>
                                        Volver al Carrito
                                    </Link>
                                )}
                                
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex items-center bg-primary-blue text-white font-bold py-3 px-6 rounded-xl hover:bg-opacity-90 transition-all"
                                    >
                                        Continuar
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                                        </svg>
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        onClick={handlePlaceOrder}
                                        disabled={loading}
                                        className="flex items-center bg-success-green text-white font-bold py-3 px-8 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                Confirmar Pedido
                                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                                                </svg>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-xl font-heading font-bold text-dark-blue-gray mb-6">Resumen del Pedido</h2>
                            
                            {/* Items */}
                            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
                                {cart.map(item => (
                                    <div key={item.product.id} className="flex gap-3">
                                        <img 
                                            src={item.product.image_url || 'https://via.placeholder.com/60'} 
                                            alt={item.product.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <div className="flex-grow">
                                            <p className="text-dark-blue-gray font-medium text-sm line-clamp-2">{item.product.name}</p>
                                            <p className="text-medium-text-gray text-xs">x{item.quantity}</p>
                                        </div>
                                        <span className="text-dark-blue-gray font-semibold text-sm">
                                            S/. {(item.product.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-100 pt-4 space-y-3">
                                <div className="flex justify-between text-medium-text-gray">
                                    <span>Subtotal</span>
                                    <span>S/. {subtotal.toFixed(2)}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-success-green">
                                        <span>Descuento ({appliedCoupon})</span>
                                        <span>-S/. {couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-medium-text-gray">
                                    <span>Envío</span>
                                    <span className={shipping === 0 ? 'text-success-green font-medium' : ''}>
                                        {shipping === 0 ? 'GRATIS' : `S/. ${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-3 border-t border-gray-100">
                                    <span className="text-xl font-bold text-dark-blue-gray">Total</span>
                                    <span className="text-2xl font-bold text-primary-blue">S/. {finalTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Security */}
                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-center space-x-2 text-xs text-medium-text-gray">
                                <svg className="w-4 h-4 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                                </svg>
                                <span>Transacción 100% Segura</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;