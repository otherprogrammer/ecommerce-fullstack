# 🔴 PROBLEMA CRÍTICO RESUELTO: Duplicación de /api/ en URLs

## 🚨 El Problema

**Síntoma:** Pantalla blanca al hacer clic en "Productos", sin errores 404 ni redirecciones.

**Causa Raíz:** Duplicación de `/api/` en las URLs de las peticiones.

---

## 🔍 Análisis del Error

### Configuración Incorrecta (ANTES)

**Variable de Entorno en Vercel:**
```
VITE_API_BASE_URL=https://ecommerce-fullstack-y9bl.onrender.com/api/
```

**Código en auth.js:**
```javascript
const API_URL_LOGIN_JWT = `${API_BASE_URL}/api/token/`;
const API_URL_REGISTER = `${API_BASE_URL}/api/accounts/register/`;
```

**URL Final Generada (INCORRECTA):**
```
https://ecommerce-fullstack-y9bl.onrender.com/api/api/token/
https://ecommerce-fullstack-y9bl.onrender.com/api/api/accounts/register/
https://ecommerce-fullstack-y9bl.onrender.com/api/api/products/
```

❌ **Resultado:** 404 Not Found (ruta no existe en Django)

---

## ✅ Solución Implementada

### Estrategia Elegida

**Variable de entorno INCLUYE `/api/`** → **Código NO debe agregar `/api/` de nuevo**

### Configuración Correcta (DESPUÉS)

**Variable de Entorno en Vercel (SIN CAMBIOS):**
```
VITE_API_BASE_URL=https://ecommerce-fullstack-y9bl.onrender.com/api
```
✅ Mantener el `/api` al final

**Código en auth.js (CORREGIDO):**
```javascript
const API_URL_LOGIN_JWT = `${API_BASE_URL}/token/`;
const API_URL_REGISTER = `${API_BASE_URL}/accounts/register/`;
const API_URL_REFRESH_JWT = `${API_BASE_URL}/token/refresh/`;
```

**URL Final Generada (CORRECTA):**
```
https://ecommerce-fullstack-y9bl.onrender.com/api/token/
https://ecommerce-fullstack-y9bl.onrender.com/api/accounts/register/
https://ecommerce-fullstack-y9bl.onrender.com/api/products/
```

✅ **Resultado:** Rutas correctas que coinciden con Django URLconf

---

## 📝 Archivos Modificados

### 1. `ecommerce_frontend/src/services/auth.js`

**ANTES:**
```javascript
const API_URL_REGISTER = `${API_BASE_URL}/api/accounts/register/`;
const API_URL_LOGIN_JWT = `${API_BASE_URL}/api/token/`;
const API_URL_REFRESH_JWT = `${API_BASE_URL}/api/token/refresh/`;
```

**DESPUÉS:**
```javascript
const API_URL_REGISTER = `${API_BASE_URL}/accounts/register/`;
const API_URL_LOGIN_JWT = `${API_BASE_URL}/token/`;
const API_URL_REFRESH_JWT = `${API_BASE_URL}/token/refresh/`;
```

### 2. `ecommerce_frontend/src/config.js`

**ANTES:**
```javascript
// En desarrollo usa localhost, en producción usa la variable de entorno
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
```

**DESPUÉS:**
```javascript
// IMPORTANTE: La URL debe incluir /api al final
// Ejemplo: https://ecommerce-fullstack-y9bl.onrender.com/api
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
```

### 3. `ecommerce_frontend/src/services/axiosInstance.js`

**ANTES:**
```javascript
if (error.response.status === 401 && !originalRequest._retry && 
    !(originalRequest.url.includes('/api/token/') || originalRequest.url.includes('/api/token/refresh/'))) {
```

**DESPUÉS:**
```javascript
if (error.response.status === 401 && !originalRequest._retry && 
    !(originalRequest.url.includes('/token/') || originalRequest.url.includes('/token/refresh/'))) {
```

---

## 🧪 Verificación de URLs

### URLs Esperadas por Django Backend

```python
# ecommerce_backend/ecommerce_backend/urls.py
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include('accounts.urls')),
    path('api/', include('store.urls')),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
]
```

### URLs Generadas por Frontend (Ahora Correctas)

| Funcionalidad | URL Frontend | Coincide con Backend |
|---------------|-------------|----------------------|
| Login | `/api/token/` | ✅ Sí |
| Registro | `/api/accounts/register/` | ✅ Sí |
| Refresh Token | `/api/token/refresh/` | ✅ Sí |
| Listar Productos | `/api/products/` | ✅ Sí |
| Detalle Producto | `/api/products/:id/` | ✅ Sí |
| Listar Categorías | `/api/categories/` | ✅ Sí |
| Aplicar Cupón | `/api/coupons/apply_coupon/` | ✅ Sí |

---

## 🎯 Regla de Oro

**Una sola fuente de verdad para `/api/`:**

### ✅ Opción A (Elegida)
- Variable de entorno: `https://backend.com/api` (CON /api)
- Código: `${API_BASE_URL}/token/` (SIN /api)
- Resultado: `https://backend.com/api/token/` ✅

### ❌ Opción B (No recomendada)
- Variable de entorno: `https://backend.com` (SIN /api)
- Código: `${API_BASE_URL}/api/token/` (CON /api)
- Resultado: `https://backend.com/api/token/` ✅

**Ambas funcionan, pero la Opción A es mejor porque:**
1. La variable de entorno es más explícita sobre la ruta de la API
2. El código es más simple (menos `/api/` repetidos)
3. Menos probabilidad de errores al agregar nuevos endpoints

---

## 🔍 Cómo Detectar Este Error

### Síntomas
1. ✅ Variable de entorno configurada correctamente en Vercel
2. ❌ Pantalla blanca al navegar a rutas (sin error 404 visible)
3. ❌ Login/Registro no funcionan
4. ❌ Productos no cargan

### Debugging
1. Abrir **DevTools → Network**
2. Intentar navegar a `/productos`
3. Buscar peticiones con `/api/api/` en la URL
4. Si ves duplicación, el problema es este

### Ejemplo de Error en Network Tab
```
Request URL: https://ecommerce-fullstack-y9bl.onrender.com/api/api/products/
Status Code: 404 Not Found
```

---

## 📋 Checklist de Verificación

- [x] Variable `VITE_API_BASE_URL` en Vercel incluye `/api`
- [x] `auth.js` NO agrega `/api/` extra
- [x] `config.js` tiene comentario explicativo
- [x] `axiosInstance.js` busca `/token/` sin `/api/`
- [x] `ProductList.jsx` usa rutas relativas sin `/api/`
- [x] Todas las peticiones funcionan correctamente

---

## 🚀 Resultado

**ANTES:** 404 en todas las peticiones
```
GET /api/api/products/ → 404
POST /api/api/token/ → 404
```

**DESPUÉS:** 200 OK en todas las peticiones
```
GET /api/products/ → 200 OK
POST /api/token/ → 200 OK
```

---

## 📚 Lección Aprendida

**No duplicar prefijos de ruta:**
- Si la variable de entorno tiene `/api`, el código no debe agregarlo
- Si el código agrega `/api`, la variable no debe tenerlo
- Documentar claramente cuál estrategia se usa en el proyecto

**Usar comentarios en código:**
```javascript
// IMPORTANTE: API_BASE_URL ya incluye /api
// No agregues /api de nuevo en las rutas
const API_URL_LOGIN = `${API_BASE_URL}/token/`; // ✅
const API_URL_LOGIN = `${API_BASE_URL}/api/token/`; // ❌
```

---

**Fecha de Solución:** 18 de Noviembre, 2025  
**Impacto:** CRÍTICO - Bloqueaba todas las funcionalidades  
**Estado:** ✅ RESUELTO
