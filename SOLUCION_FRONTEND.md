# Guía Rápida: Solución Frontend No Conecta

## 🔴 PROBLEMA IDENTIFICADO

El frontend en Vercel no se ha actualizado con los últimos cambios. Está usando el commit inicial sin la configuración de la API.

## ✅ SOLUCIÓN INMEDIATA

### Paso 1: Verificar Variable de Entorno en Vercel

1. Ve a: https://vercel.com/mattias-projects-1f5ba3d6/ecommerce-front
2. Clic en **Settings** → **Environment Variables**
3. Busca `VITE_API_BASE_URL`
4. Si NO existe, agrégala:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://ecommerce-fullstack-y9bl.onrender.com/api`
   - Marca los 3 checkboxes: **Production**, **Preview**, **Development**
   - Clic en **Save**

### Paso 2: Forzar Redeploy

#### MÉTODO A (Recomendado - Desde Vercel):
1. Ve a **Deployments**
2. Haz clic en el deployment más reciente
3. Clic en los **3 puntos (...)** arriba a la derecha
4. Selecciona **"Redeploy"**
5. **IMPORTANTE:** Desmarca "Use existing Build Cache"
6. Clic en **"Redeploy"**

#### MÉTODO B (Desde Git):
Los cambios ya están en GitHub. Vercel debería detectarlos automáticamente.

Si no, ve a Vercel → Settings → Git → Haz clic en **"Redeploy"** al lado de la rama `master`.

### Paso 3: Verificar el Deploy

Espera 2-3 minutos y verifica:

1. **Build Logs:** Debe mostrar `VITE_API_BASE_URL` durante el build
2. **Prueba la URL:** https://ecommerce-front-xi-tan.vercel.app
3. **Verifica en Console del navegador:** Abre DevTools (F12) → Network → Debería hacer requests a `ecommerce-fullstack-y9bl.onrender.com`

## 🧪 PRUEBA RÁPIDA

Abre el navegador en la página del frontend y ejecuta en la consola (F12):

```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
```

**Debería mostrar:** `https://ecommerce-fullstack-y9bl.onrender.com/api`

Si muestra `undefined`, la variable de entorno NO está configurada.

## 📋 CHECKLIST

- [ ] Variable `VITE_API_BASE_URL` existe en Vercel Settings
- [ ] Variable tiene el valor correcto: `https://ecommerce-fullstack-y9bl.onrender.com/api`
- [ ] Variable está marcada para Production
- [ ] Redeploy ejecutado sin caché
- [ ] Nuevo deploy muestra "Ready" en verde
- [ ] Frontend carga productos

## 🆘 SI AÚN NO FUNCIONA

1. Verifica en Vercel → Build Logs que diga:
   ```
   ✓ built in XXXms
   ```

2. Verifica que NO haya errores de CORS:
   - Abre DevTools (F12) → Console
   - Debería hacer fetch a `/api/products/`
   - Si hay error CORS, el backend necesita agregar la URL de Vercel a CORS_ALLOWED_ORIGINS

3. Verifica el backend en Render:
   - Variables de entorno incluyen la URL de Vercel
   - `CORS_ALLOWED_ORIGINS=https://ecommerce-front-xi-tan.vercel.app`

## 💡 NOTA IMPORTANTE

Vite necesita que las variables de entorno:
1. Comiencen con `VITE_`
2. Se configuren ANTES del build
3. Se acceda vía `import.meta.env.VITE_NOMBRE`

No funcionará con variables normales como `process.env`.
