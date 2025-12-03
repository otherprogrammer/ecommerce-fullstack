/**
 * NotificationContext - Contexto de React para notificaciones en tiempo real
 * Provee acceso global al estado de notificaciones en la aplicación
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService from '../services/notificationService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications debe usarse dentro de NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);
    const [latestPromo, setLatestPromo] = useState(null);
    const [showPromoModal, setShowPromoModal] = useState(false);

    // Conectar cuando hay usuario autenticado
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        
        // Conectar al servicio (con o sin autenticación)
        notificationService.connect(token);

        // Listeners
        const unsubscribeConnection = notificationService.on('connectionChange', ({ connected }) => {
            setIsConnected(connected);
        });

        const unsubscribeNotification = notificationService.on('notification', (notif) => {
            setNotifications(prev => [notif, ...prev].slice(0, 50)); // Mantener últimas 50
            if (!notif.read) {
                setUnreadCount(prev => prev + 1);
            }
        });

        const unsubscribeUnread = notificationService.on('unreadNotifications', (notifs) => {
            setNotifications(prev => [...notifs, ...prev]);
            setUnreadCount(notifs.filter(n => !n.read).length);
        });

        const unsubscribeUpdated = notificationService.on('notificationUpdated', (notif) => {
            setNotifications(prev => 
                prev.map(n => n.id === notif.id ? notif : n)
            );
            if (notif.read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        });

        const unsubscribeAllRead = notificationService.on('allRead', () => {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        });

        const unsubscribePromo = notificationService.on('promoAlert', (promo) => {
            setLatestPromo(promo);
            setShowPromoModal(true);
            // También agregar a notificaciones
            setNotifications(prev => [promo, ...prev].slice(0, 50));
        });

        // Cargar notificaciones existentes
        notificationService.getNotifications().then(notifs => {
            if (notifs.length > 0) {
                setNotifications(notifs);
                setUnreadCount(notifs.filter(n => !n.read).length);
            }
        });

        // Cleanup
        return () => {
            unsubscribeConnection();
            unsubscribeNotification();
            unsubscribeUnread();
            unsubscribeUpdated();
            unsubscribeAllRead();
            unsubscribePromo();
            notificationService.disconnect();
        };
    }, [user]);

    // Marcar como leída
    const markAsRead = useCallback((notificationId) => {
        notificationService.markAsRead(notificationId);
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    }, []);

    // Marcar todas como leídas
    const markAllAsRead = useCallback(() => {
        notificationService.markAllAsRead();
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
    }, []);

    // Suscribirse a orden
    const subscribeToOrder = useCallback((orderId) => {
        notificationService.subscribeToOrder(orderId);
    }, []);

    // Cerrar modal de promo
    const closePromoModal = useCallback(() => {
        setShowPromoModal(false);
    }, []);

    // Obtener icono por tipo
    const getNotificationIcon = (type) => {
        const icons = {
            ORDER_CREATED: '🛒',
            ORDER_CONFIRMED: '✅',
            ORDER_SHIPPED: '📦',
            ORDER_DELIVERED: '🎉',
            ORDER_CANCELLED: '❌',
            PROMO_ALERT: '🏷️',
            PRICE_DROP: '💰',
            STOCK_ALERT: '📢',
            WELCOME: '👋',
            SYSTEM: 'ℹ️'
        };
        return icons[type] || '🔔';
    };

    const value = {
        notifications,
        unreadCount,
        isConnected,
        latestPromo,
        showPromoModal,
        markAsRead,
        markAllAsRead,
        subscribeToOrder,
        closePromoModal,
        getNotificationIcon
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;
