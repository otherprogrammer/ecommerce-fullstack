# 🚀 Pruebas de Carga con Locust

## Instalación

```bash
pip install locust
```

## Ejecutar Pruebas

### Opción 1: Interfaz Web (Recomendado)

```bash
locust -f locustfile.py --host=https://ecommerce-fullstack-y9bl.onrender.com
```

Luego abre en tu navegador: **http://localhost:8089**

### Opción 2: Modo Headless (Sin interfaz)

```bash
locust -f locustfile.py --host=https://ecommerce-fullstack-y9bl.onrender.com --users 100 --spawn-rate 10 --run-time 5m --headless
```

## Configuración Recomendada

### Para empezar (Prueba ligera)
- **Users:** 10
- **Spawn rate:** 2 (2 usuarios por segundo)
- **Duration:** 2 minutos

### Prueba media
- **Users:** 50
- **Spawn rate:** 5
- **Duration:** 5 minutos

### Prueba intensiva
- **Users:** 100-200
- **Spawn rate:** 10
- **Duration:** 10 minutos

### Estrés máximo (¡Cuidado!)
- **Users:** 500+
- **Spawn rate:** 20
- **Duration:** 5 minutos

## ¿Qué simula cada clase?

### 👤 EcommerceUser (80% del tráfico)
Usuarios normales que:
- ✅ Navegan productos
- ✅ Buscan por categoría
- ✅ Ven detalles
- ✅ Se registran
- ✅ Hacen login
- ✅ Agregan al carrito
- ✅ Aplican cupones
- ✅ Crean órdenes

### 👨‍💼 AdminUser (20% del tráfico)
Administradores que:
- ✅ Gestionan productos
- ✅ Ven cupones
- ✅ Crean productos nuevos

### 🌐 BrowserUser (30% del tráfico)
Usuarios navegando el frontend (Vercel):
- ✅ Página principal
- ✅ Productos
- ✅ Carrito
- ✅ Login/Register

## Métricas Importantes

### 🟢 Bueno
- **Response time (median):** < 500ms
- **Response time (95%):** < 1000ms
- **Failures:** < 1%
- **Requests/sec:** Alto y estable

### 🟡 Aceptable
- **Response time (median):** 500-1000ms
- **Response time (95%):** 1000-2000ms
- **Failures:** 1-5%

### 🔴 Problemas
- **Response time (median):** > 1000ms
- **Response time (95%):** > 2000ms
- **Failures:** > 5%

## Interpretación de Resultados

### Si el backend (Render) falla:
- Error 500/502/503
- Tiempos de respuesta muy altos (>5s)
- **Solución:** Render free tier tiene límites, considera upgrade

### Si el frontend (Vercel) es lento:
- Cargas de página lentas
- **Solución:** Optimizar bundle de React

### Cuello de botella en base de datos:
- Tiempos altos solo en endpoints de productos/órdenes
- **Solución:** Índices en PostgreSQL, cacheo

## Endpoints Probados

### Backend (API)
- `GET /api/products/` - Lista productos
- `GET /api/products/{id}/` - Detalle producto
- `GET /api/categories/` - Categorías
- `GET /api/coupons/` - Cupones
- `POST /api/accounts/register/` - Registro
- `POST /api/accounts/token/` - Login
- `GET /api/accounts/profile/` - Perfil
- `POST /api/coupons/apply_coupon/` - Aplicar cupón
- `POST /api/orders/` - Crear orden

### Frontend (Vercel)
- `/` - Home
- `/productos` - Productos
- `/carrito` - Carrito
- `/login` - Login
- `/register` - Registro

## Consejos

1. **Empieza con pocos usuarios** (10-20) para ver el comportamiento base
2. **Incrementa gradualmente** para encontrar el límite
3. **Observa los logs de Render** para ver errores del servidor
4. **Detén la prueba** si ves muchos errores 500 (no queremos tumbar producción)
5. **Prueba en horarios de bajo tráfico** para no afectar usuarios reales

## Comandos Útiles

```bash
# Prueba rápida (2 min, 20 usuarios)
locust -f locustfile.py --host=https://ecommerce-fullstack-y9bl.onrender.com --users 20 --spawn-rate 2 --run-time 2m

# Prueba media (5 min, 50 usuarios)
locust -f locustfile.py --host=https://ecommerce-fullstack-y9bl.onrender.com --users 50 --spawn-rate 5 --run-time 5m --headless

# Estrés (10 min, 100 usuarios)
locust -f locustfile.py --host=https://ecommerce-fullstack-y9bl.onrender.com --users 100 --spawn-rate 10 --run-time 10m --headless

# Solo backend API
locust -f locustfile.py --host=https://ecommerce-fullstack-y9bl.onrender.com

# Solo frontend
locust -f locustfile.py --host=https://ecommerce-front-xi-tan.vercel.app
```

## Resultados Esperados (Render Free Tier)

- **Usuarios concurrentes:** ~50-100
- **Requests/segundo:** ~10-50 rps
- **Response time:** 200-800ms (normal)
- **Límite antes de errores:** ~100-150 usuarios simultáneos

**Nota:** Render free tier duerme después de inactividad y tiene recursos limitados.
