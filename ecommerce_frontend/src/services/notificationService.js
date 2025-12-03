/**
 * Servicio de Notificaciones en Tiempo Real
 * Conecta con el microservicio Node.js/Socket.io
 */

import { io } from 'socket.io-client';

// URL del servicio de notificaciones
const NOTIFICATION_SERVICE_URL = import.meta.env.VITE_NOTIFICATION_URL || 'http://localhost:3001';

class NotificationService {
    constructor() {
        this.socket = null;
        this.listeners = new Map();
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
    }

    /**
     * Conectar al servicio de notificaciones
     * @param {string} token - JWT token para autenticación
     */
    connect(token = null) {
        if (this.socket?.connected) {
            console.log('🔔 Ya conectado al servicio de notificaciones');
            return;
        }

        const authToken = token || localStorage.getItem('access_token');

        this.socket = io(NOTIFICATION_SERVICE_URL, {
            auth: {
                token: authToken
            },
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: this.maxReconnectAttempts,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            timeout: 20000
        });

        this.setupEventListeners();
    }

    /**
     * Configurar listeners de eventos de Socket.io
     */
    setupEventListeners() {
        // Conexión exitosa
        this.socket.on('connect', () => {
            console.log('🔔 Conectado al servicio de notificaciones');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.emit('connectionChange', { connected: true });
        });

        // Desconexión
        this.socket.on('disconnect', (reason) => {
            console.log('🔔 Desconectado del servicio:', reason);
            this.isConnected = false;
            this.emit('connectionChange', { connected: false, reason });
        });

        // Error de conexión
        this.socket.on('connect_error', (error) => {
            console.error('🔔 Error de conexión:', error.message);
            this.reconnectAttempts++;
            this.emit('connectionError', { error: error.message, attempts: this.reconnectAttempts });
        });

        // Nueva notificación
        this.socket.on('notification', (notification) => {
            console.log('🔔 Nueva notificación:', notification);
            this.emit('notification', notification);
        });

        // Notificaciones no leídas al conectar
        this.socket.on('unread_notifications', (notifications) => {
            console.log('🔔 Notificaciones no leídas:', notifications.length);
            this.emit('unreadNotifications', notifications);
        });

        // Notificación actualizada
        this.socket.on('notification_updated', (notification) => {
            this.emit('notificationUpdated', notification);
        });

        // Todas marcadas como leídas
        this.socket.on('all_notifications_read', () => {
            this.emit('allRead');
        });

        // Alerta de promoción
        this.socket.on('promo_alert', (promo) => {
            console.log('🏷️ Nueva promoción:', promo);
            this.emit('promoAlert', promo);
        });

        // Actualización de estado de orden
        this.socket.on('order_status_update', (update) => {
            console.log('📦 Actualización de orden:', update);
            this.emit('orderStatusUpdate', update);
        });
    }

    /**
     * Desconectar del servicio
     */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    /**
     * Marcar notificación como leída
     * @param {string} notificationId 
     */
    markAsRead(notificationId) {
        if (this.socket?.connected) {
            this.socket.emit('mark_read', notificationId);
        }
    }

    /**
     * Marcar todas las notificaciones como leídas
     */
    markAllAsRead() {
        if (this.socket?.connected) {
            this.socket.emit('mark_all_read');
        }
    }

    /**
     * Obtener historial de notificaciones
     * @returns {Promise<Array>}
     */
    getNotifications() {
        return new Promise((resolve) => {
            if (this.socket?.connected) {
                this.socket.emit('get_notifications', (notifications) => {
                    resolve(notifications);
                });
            } else {
                resolve([]);
            }
        });
    }

    /**
     * Suscribirse a actualizaciones de una orden
     * @param {string} orderId 
     */
    subscribeToOrder(orderId) {
        if (this.socket?.connected) {
            this.socket.emit('subscribe_order', orderId);
        }
    }

    /**
     * Agregar listener para un evento
     * @param {string} event 
     * @param {Function} callback 
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        // Retornar función para remover el listener
        return () => {
            this.listeners.get(event)?.delete(callback);
        };
    }

    /**
     * Remover listener
     * @param {string} event 
     * @param {Function} callback 
     */
    off(event, callback) {
        this.listeners.get(event)?.delete(callback);
    }

    /**
     * Emitir evento a los listeners locales
     * @param {string} event 
     * @param {any} data 
     */
    emit(event, data) {
        this.listeners.get(event)?.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error en listener de ${event}:`, error);
            }
        });
    }

    /**
     * Verificar si está conectado
     * @returns {boolean}
     */
    isActive() {
        return this.isConnected && this.socket?.connected;
    }
}

// Singleton
const notificationService = new NotificationService();

export default notificationService;
