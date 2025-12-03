/**
 * PromoModal - Modal para mostrar promociones en tiempo real
 * Se muestra automáticamente cuando llega una nueva promoción
 */

import React from 'react';
import { useNotifications } from '../context/NotificationContext';

const PromoModal = () => {
    const { latestPromo, showPromoModal, closePromoModal } = useNotifications();

    if (!showPromoModal || !latestPromo) return null;

    const { title, message, data } = latestPromo;
    const { discount, code, expiresAt } = data || {};

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
            {/* Overlay */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={closePromoModal}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform animate-slideUp">
                {/* Header con gradiente */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 px-6 py-8 text-white text-center">
                    <div className="text-5xl mb-3">🎉</div>
                    <h2 className="text-2xl font-bold mb-1">{title}</h2>
                    <p className="text-white/90">{message}</p>
                </div>

                {/* Contenido */}
                <div className="p-6">
                    {discount && (
                        <div className="text-center mb-4">
                            <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-4xl font-bold px-6 py-3 rounded-xl shadow-lg">
                                {discount}% OFF
                            </div>
                        </div>
                    )}

                    {code && (
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 text-center mb-2">
                                Usa este código en tu compra:
                            </p>
                            <div className="bg-gray-100 border-2 border-dashed border-indigo-300 rounded-lg p-3 text-center">
                                <code className="text-2xl font-bold text-indigo-600 tracking-wider">
                                    {code}
                                </code>
                            </div>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(code);
                                }}
                                className="w-full mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                            >
                                📋 Copiar código
                            </button>
                        </div>
                    )}

                    {expiresAt && (
                        <p className="text-xs text-gray-500 text-center mb-4">
                            ⏰ Válido hasta: {new Date(expiresAt).toLocaleDateString()}
                        </p>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3">
                        <button
                            onClick={closePromoModal}
                            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Más tarde
                        </button>
                        <button
                            onClick={() => {
                                closePromoModal();
                                window.location.href = '/productos';
                            }}
                            className="flex-1 px-4 py-2 text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            ¡Comprar ahora!
                        </button>
                    </div>
                </div>

                {/* Botón cerrar */}
                <button
                    onClick={closePromoModal}
                    className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                >
                    ✕
                </button>

                {/* Confetti decorativo */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                    <div className="absolute top-4 left-4 text-2xl animate-bounce">🎊</div>
                    <div className="absolute top-8 right-8 text-xl animate-bounce delay-100">✨</div>
                    <div className="absolute bottom-20 left-8 text-xl animate-bounce delay-200">🎁</div>
                    <div className="absolute bottom-24 right-12 text-2xl animate-bounce delay-300">🎈</div>
                </div>
            </div>
        </div>
    );
};

export default PromoModal;
