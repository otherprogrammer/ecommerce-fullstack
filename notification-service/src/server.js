/**
 * Notification Service - Microservicio de Notificaciones en Tiempo Real
 * 
 * Este servicio Node.js + Socket.io maneja:
 * - Notificaciones de órdenes en tiempo real
 * - Alertas de ofertas y promociones
 * - Actualizaciones de estado de pedidos
 * - Sistema de mensajería instantánea
 */

require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// Configuración
const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'tu-secreto-jwt-aqui';

// URLs permitidas para CORS
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://ecommerce-front-xi-tan.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

// Middleware
app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
}));
app.use(express.json());

// Socket.io con CORS
const io = new Server(httpServer, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ['GET', 'POST'],
        credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
});

// ============================================
// ALMACENAMIENTO EN MEMORIA (para demo)
// En producción usar Redis
// ============================================
const connectedUsers = new Map(); // userId -> socketId
const notifications = new Map(); // notificationId -> notification
const userNotifications = new Map(); // userId -> [notificationIds]

// ============================================
// TIPOS DE NOTIFICACIONES
// ============================================
const NotificationType = {
    ORDER_CREATED: 'ORDER_CREATED',
    ORDER_CONFIRMED: 'ORDER_CONFIRMED',
    ORDER_SHIPPED: 'ORDER_SHIPPED',
    ORDER_DELIVERED: 'ORDER_DELIVERED',
    ORDER_CANCELLED: 'ORDER_CANCELLED',
    PROMO_ALERT: 'PROMO_ALERT',
    PRICE_DROP: 'PRICE_DROP',
    STOCK_ALERT: 'STOCK_ALERT',
    WELCOME: 'WELCOME',
    SYSTEM: 'SYSTEM'
};

// ============================================
// UTILIDADES
// ============================================
function createNotification(type, title, message, data = {}, userId = null) {
    const notification = {
        id: uuidv4(),
        type,
        title,
        message,
        data,
        userId,
        read: false,
        createdAt: new Date().toISOString()
    };
    
    notifications.set(notification.id, notification);
    
    if (userId) {
        const userNotifs = userNotifications.get(userId) || [];
        userNotifs.push(notification.id);
        userNotifications.set(userId, userNotifs);
    }
    
    return notification;
}

function getNotificationIcon(type) {
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
}

// ============================================
// AUTENTICACIÓN DE SOCKET
// ============================================
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
        // Permitir conexión anónima para notificaciones públicas
        socket.userId = null;
        socket.isAuthenticated = false;
        return next();
    }
    
    try {
        // Verificar JWT (compatible con Django SimpleJWT)
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.userId = decoded.user_id || decoded.sub;
        socket.username = decoded.username;
        socket.isAuthenticated = true;
        next();
    } catch (err) {
        // Token inválido pero permitir conexión anónima
        socket.userId = null;
        socket.isAuthenticated = false;
        next();
    }
});

// ============================================
// EVENTOS DE SOCKET.IO
// ============================================
io.on('connection', (socket) => {
    console.log(`🔌 Nueva conexión: ${socket.id} | Usuario: ${socket.userId || 'anónimo'}`);
    
    // Registrar usuario conectado
    if (socket.userId) {
        connectedUsers.set(socket.userId, socket.id);
        socket.join(`user:${socket.userId}`);
        
        // Enviar notificación de bienvenida
        const welcomeNotif = createNotification(
            NotificationType.WELCOME,
            '¡Bienvenido de vuelta!',
            `Hola ${socket.username || 'usuario'}, tienes nuevas ofertas esperándote.`,
            {},
            socket.userId
        );
        socket.emit('notification', welcomeNotif);
        
        // Enviar notificaciones no leídas
        const unread = getUserUnreadNotifications(socket.userId);
        if (unread.length > 0) {
            socket.emit('unread_notifications', unread);
        }
    }
    
    // Unirse a sala pública para promociones
    socket.join('public');
    
    // ============================================
    // EVENTOS DEL CLIENTE
    // ============================================
    
    // Marcar notificación como leída
    socket.on('mark_read', (notificationId) => {
        const notif = notifications.get(notificationId);
        if (notif && notif.userId === socket.userId) {
            notif.read = true;
            notifications.set(notificationId, notif);
            socket.emit('notification_updated', notif);
        }
    });
    
    // Marcar todas como leídas
    socket.on('mark_all_read', () => {
        if (socket.userId) {
            const userNotifs = userNotifications.get(socket.userId) || [];
            userNotifs.forEach(id => {
                const notif = notifications.get(id);
                if (notif) {
                    notif.read = true;
                    notifications.set(id, notif);
                }
            });
            socket.emit('all_notifications_read');
        }
    });
    
    // Obtener historial de notificaciones
    socket.on('get_notifications', (callback) => {
        if (socket.userId) {
            const userNotifs = getUserNotifications(socket.userId);
            callback(userNotifs);
        } else {
            callback([]);
        }
    });
    
    // Suscribirse a actualizaciones de una orden específica
    socket.on('subscribe_order', (orderId) => {
        socket.join(`order:${orderId}`);
        console.log(`📋 Socket ${socket.id} suscrito a orden: ${orderId}`);
    });
    
    // Desconexión
    socket.on('disconnect', (reason) => {
        console.log(`🔌 Desconexión: ${socket.id} | Razón: ${reason}`);
        if (socket.userId) {
            connectedUsers.delete(socket.userId);
        }
    });
});

// ============================================
// FUNCIONES AUXILIARES
// ============================================
function getUserNotifications(userId) {
    const notifIds = userNotifications.get(userId) || [];
    return notifIds
        .map(id => notifications.get(id))
        .filter(Boolean)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 50); // Últimas 50
}

function getUserUnreadNotifications(userId) {
    return getUserNotifications(userId).filter(n => !n.read);
}

// ============================================
// API REST - ENDPOINTS
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'notification-service',
        connectedUsers: connectedUsers.size,
        totalNotifications: notifications.size,
        uptime: process.uptime()
    });
});

// Estadísticas
app.get('/api/stats', (req, res) => {
    res.json({
        connectedUsers: connectedUsers.size,
        totalNotifications: notifications.size,
        notificationsByType: getNotificationStats()
    });
});

function getNotificationStats() {
    const stats = {};
    for (const [, notif] of notifications) {
        stats[notif.type] = (stats[notif.type] || 0) + 1;
    }
    return stats;
}

// ============================================
// WEBHOOKS - Para integraciones con Django
// ============================================

// Webhook: Nueva orden creada
app.post('/webhook/order/created', (req, res) => {
    const { orderId, userId, total, items } = req.body;
    
    const notif = createNotification(
        NotificationType.ORDER_CREATED,
        '¡Pedido Creado!',
        `Tu pedido #${orderId} por S/. ${total} ha sido creado correctamente.`,
        { orderId, total, items },
        userId
    );
    
    // Enviar al usuario específico
    if (userId && connectedUsers.has(userId)) {
        io.to(`user:${userId}`).emit('notification', notif);
    }
    
    console.log(`📦 Orden creada: #${orderId} para usuario ${userId}`);
    res.json({ success: true, notificationId: notif.id });
});

// Webhook: Orden confirmada
app.post('/webhook/order/confirmed', (req, res) => {
    const { orderId, userId, estimatedDelivery } = req.body;
    
    const notif = createNotification(
        NotificationType.ORDER_CONFIRMED,
        '¡Pedido Confirmado!',
        `Tu pedido #${orderId} ha sido confirmado. Llegará aproximadamente el ${estimatedDelivery || 'pronto'}.`,
        { orderId, estimatedDelivery },
        userId
    );
    
    // Notificar al usuario y a la sala de la orden
    io.to(`user:${userId}`).to(`order:${orderId}`).emit('notification', notif);
    io.to(`order:${orderId}`).emit('order_status_update', { orderId, status: 'CONFIRMED' });
    
    res.json({ success: true, notificationId: notif.id });
});

// Webhook: Orden enviada
app.post('/webhook/order/shipped', (req, res) => {
    const { orderId, userId, trackingNumber, carrier } = req.body;
    
    const notif = createNotification(
        NotificationType.ORDER_SHIPPED,
        '¡Tu pedido está en camino!',
        `Tu pedido #${orderId} ha sido enviado con ${carrier || 'el transportista'}. Número de seguimiento: ${trackingNumber || 'N/A'}`,
        { orderId, trackingNumber, carrier },
        userId
    );
    
    io.to(`user:${userId}`).to(`order:${orderId}`).emit('notification', notif);
    io.to(`order:${orderId}`).emit('order_status_update', { orderId, status: 'SHIPPED', trackingNumber });
    
    res.json({ success: true, notificationId: notif.id });
});

// Webhook: Orden entregada
app.post('/webhook/order/delivered', (req, res) => {
    const { orderId, userId } = req.body;
    
    const notif = createNotification(
        NotificationType.ORDER_DELIVERED,
        '¡Pedido Entregado!',
        `Tu pedido #${orderId} ha sido entregado. ¡Esperamos que lo disfrutes!`,
        { orderId },
        userId
    );
    
    io.to(`user:${userId}`).to(`order:${orderId}`).emit('notification', notif);
    io.to(`order:${orderId}`).emit('order_status_update', { orderId, status: 'DELIVERED' });
    
    res.json({ success: true, notificationId: notif.id });
});

// Webhook: Promoción global
app.post('/webhook/promo', (req, res) => {
    const { title, message, discount, code, expiresAt } = req.body;
    
    const notif = createNotification(
        NotificationType.PROMO_ALERT,
        title || '🏷️ ¡Nueva Promoción!',
        message || `¡Aprovecha ${discount}% de descuento con el código ${code}!`,
        { discount, code, expiresAt }
    );
    
    // Enviar a todos los usuarios conectados
    io.to('public').emit('promo_alert', notif);
    
    console.log(`🏷️ Promoción enviada a ${connectedUsers.size} usuarios`);
    res.json({ success: true, notificationId: notif.id, sentTo: connectedUsers.size });
});

// Webhook: Alerta de stock
app.post('/webhook/stock-alert', (req, res) => {
    const { productId, productName, userId } = req.body;
    
    const notif = createNotification(
        NotificationType.STOCK_ALERT,
        '¡Producto disponible!',
        `El producto "${productName}" que estabas esperando ya está disponible.`,
        { productId, productName },
        userId
    );
    
    if (userId && connectedUsers.has(userId)) {
        io.to(`user:${userId}`).emit('notification', notif);
    }
    
    res.json({ success: true, notificationId: notif.id });
});

// Endpoint para enviar notificación manual (para testing)
app.post('/api/send-notification', (req, res) => {
    const { type, title, message, userId, data } = req.body;
    
    const notif = createNotification(
        type || NotificationType.SYSTEM,
        title || 'Notificación',
        message || '',
        data || {},
        userId
    );
    
    if (userId) {
        io.to(`user:${userId}`).emit('notification', notif);
    } else {
        io.to('public').emit('notification', notif);
    }
    
    res.json({ success: true, notification: notif });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
httpServer.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🔔 NOTIFICATION SERVICE - E-COMMERCE                     ║
║                                                            ║
║   Server running on: http://localhost:${PORT}               ║
║   Socket.io ready for connections                          ║
║                                                            ║
║   Endpoints:                                               ║
║   - GET  /health              - Health check               ║
║   - GET  /api/stats           - Service statistics         ║
║   - POST /webhook/order/*     - Order webhooks             ║
║   - POST /webhook/promo       - Promotion broadcasts       ║
║   - POST /api/send-notification - Manual notifications     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});

module.exports = { app, io, httpServer };
