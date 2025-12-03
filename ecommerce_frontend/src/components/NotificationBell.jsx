/**
 * NotificationBell - Componente de campana de notificaciones
 * Muestra badge con contador y dropdown con lista de notificaciones
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
    const {
        notifications,
        unreadCount,
        isConnected,
        markAsRead,
        markAllAsRead,
        getNotificationIcon
    } = useNotifications();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Formatear fecha relativa
    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora mismo';
        if (diffMins < 60) return `Hace ${diffMins} min`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return date.toLocaleDateString();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón de campana */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Notificaciones"
            >
                {/* Icono de campana */}
                <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                </svg>

                {/* Badge de contador */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}

                {/* Indicador de conexión */}
                <span 
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                        isConnected ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                    title={isConnected ? 'Conectado' : 'Desconectado'}
                />
            </button>

            {/* Dropdown de notificaciones */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-fadeIn">
                    {/* Header */}
                    <div className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🔔</span>
                            <h3 className="font-semibold">Notificaciones</h3>
                            {unreadCount > 0 && (
                                <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
                                    {unreadCount} nuevas
                                </span>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-white/80 hover:text-white underline"
                            >
                                Marcar todas
                            </button>
                        )}
                    </div>

                    {/* Lista de notificaciones */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-12 text-center text-gray-500">
                                <div className="text-4xl mb-2">📭</div>
                                <p>No tienes notificaciones</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {notifications.map((notif) => (
                                    <li
                                        key={notif.id}
                                        onClick={() => !notif.read && markAsRead(notif.id)}
                                        className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                                            !notif.read ? 'bg-indigo-50/50' : ''
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icono */}
                                            <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-xl">
                                                {getNotificationIcon(notif.type)}
                                            </div>
                                            
                                            {/* Contenido */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-sm font-medium truncate ${
                                                        !notif.read ? 'text-indigo-900' : 'text-gray-900'
                                                    }`}>
                                                        {notif.title}
                                                    </p>
                                                    {!notif.read && (
                                                        <span className="flex-shrink-0 w-2 h-2 mt-1.5 bg-indigo-500 rounded-full" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {notif.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {formatTimeAgo(notif.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-center">
                            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                Ver todas las notificaciones
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
