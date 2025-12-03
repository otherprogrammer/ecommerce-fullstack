# Notification Service - Microservicio de Notificaciones en Tiempo Real

Microservicio Node.js para manejo de notificaciones en tiempo real usando Socket.io.

## 🚀 Tecnologías

- **Node.js** v18+
- **Express** - Framework web
- **Socket.io** - WebSockets para comunicación en tiempo real
- **JWT** - Autenticación compatible con Django SimpleJWT
- **CORS** - Configurado para frontend React/Vercel

## 📦 Instalación

```bash
cd notification-service
npm install
```

## ⚙️ Configuración

Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env
```

Variables importantes:
- `PORT`: Puerto del servidor (default: 3001)
- `JWT_SECRET`: Debe coincidir con el secreto de Django
- `FRONTEND_URL`: URL del frontend para CORS

## 🏃 Ejecución

### Desarrollo
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📡 Endpoints REST

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/health` | Health check del servicio |
| GET | `/api/stats` | Estadísticas del servicio |
| POST | `/webhook/order/created` | Nueva orden creada |
| POST | `/webhook/order/confirmed` | Orden confirmada |
| POST | `/webhook/order/shipped` | Orden enviada |
| POST | `/webhook/order/delivered` | Orden entregada |
| POST | `/webhook/promo` | Promoción global |
| POST | `/webhook/stock-alert` | Alerta de stock |
| POST | `/api/send-notification` | Envío manual |

## 🔌 Eventos Socket.io

### Cliente → Servidor
- `mark_read` - Marcar notificación como leída
- `mark_all_read` - Marcar todas como leídas
- `get_notifications` - Obtener historial
- `subscribe_order` - Suscribirse a actualizaciones de orden

### Servidor → Cliente
- `notification` - Nueva notificación
- `unread_notifications` - Notificaciones no leídas
- `notification_updated` - Notificación actualizada
- `all_notifications_read` - Todas marcadas como leídas
- `promo_alert` - Alerta de promoción
- `order_status_update` - Actualización de estado de orden

## 🔗 Integración con Frontend React

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  auth: {
    token: localStorage.getItem('access_token')
  }
});

socket.on('notification', (notif) => {
  console.log('Nueva notificación:', notif);
});
```

## 📝 Ejemplo de Webhook

```bash
curl -X POST http://localhost:3001/webhook/order/created \
  -H "Content-Type: application/json" \
  -d '{"orderId": "123", "userId": "1", "total": 150.00}'
```

## 🏗️ Arquitectura

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│   Frontend  │────▶│  Notification    │◀────│   Django    │
│   (React)   │◀────│    Service       │     │   Backend   │
│             │     │  (Node/Socket)   │     │             │
└─────────────┘     └──────────────────┘     └─────────────┘
      │                     │                       │
      │    WebSocket        │     REST Webhooks     │
      └─────────────────────┼───────────────────────┘
```

## 📄 Licencia

MIT
