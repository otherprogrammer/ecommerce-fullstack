# Configuración de Variables de Entorno en Render

## Backend (Django en Render)

Ve a tu servicio en Render → **Environment** y agrega estas variables:

```bash
# Base de datos (Render lo configura automáticamente)
DATABASE_URL=<postgresql://...>  # Auto-configurado por Render

# Secret Key de Django
SECRET_KEY=tu-secret-key-super-segura-aqui

# Debug (IMPORTANTE: debe ser False en producción)
DEBUG=False

# Allowed Hosts
ALLOWED_HOSTS=localhost,127.0.0.1,ecommerce-fullstack-y9bl.onrender.com

# CORS - URLs permitidas para el frontend
CORS_ALLOWED_ORIGINS=https://ecommerce-front-xi-tan.vercel.app,http://localhost:5173

# Render hostname (Render lo configura automáticamente)
RENDER_EXTERNAL_HOSTNAME=ecommerce-fullstack-y9bl.onrender.com
```

## Frontend (React en Vercel)

Ve a tu proyecto en Vercel → **Settings** → **Environment Variables** y agrega:

```bash
# URL del backend (incluyendo /api)
VITE_API_BASE_URL=https://ecommerce-fullstack-y9bl.onrender.com/api
```

## Pasos Después de Configurar

### En Render:
1. Guarda las variables de entorno
2. Render redesplegará automáticamente
3. Verifica que el despliegue sea exitoso en la pestaña **Logs**

### En Vercel:
1. Guarda las variables de entorno
2. Ve a **Deployments** → **Redeploy** (menú de tres puntos)
3. Selecciona "Redeploy with existing Build Cache"
4. Espera a que termine el despliegue

## Verificación

### Backend:
- Ve a: `https://ecommerce-fullstack-y9bl.onrender.com/admin`
- Deberías ver el panel de admin de Django
- Login: `admin` / `Admin123!@#`

### Frontend:
- Ve a: `https://ecommerce-front-xi-tan.vercel.app`
- Deberías ver la página de inicio
- Verifica que los productos carguen correctamente

### Conectividad:
- Abre DevTools (F12) → Console
- No deberían aparecer errores CORS
- Las peticiones a `/api/products/` deben funcionar

## Problemas Comunes

### Error CORS
**Síntoma**: "CORS policy: No 'Access-Control-Allow-Origin' header"
**Solución**: Verifica que `CORS_ALLOWED_ORIGINS` en Render incluya la URL exacta de Vercel

### Frontend no conecta con backend
**Síntoma**: Productos no cargan, error de red
**Solución**: 
1. Verifica que `VITE_API_BASE_URL` en Vercel sea correcta
2. Asegúrate de que incluye `/api` al final
3. Redespliega en Vercel después de cambiar variables

### 500 Internal Server Error
**Síntoma**: Errores 500 en el backend
**Solución**:
1. Ve a Render → Logs → Events
2. Busca el error específico
3. Puede ser problema de base de datos o migraciones

### Registro/Login no funciona
**Síntoma**: No se crean usuarios o no se puede hacer login
**Solución**:
1. Verifica CORS esté configurado correctamente
2. Revisa Console en DevTools para ver el error específico
3. Verifica que el backend esté respondiendo en `/api/token/`

## Comandos Útiles en Render Shell

```bash
# Ver productos en base de datos
python manage.py shell -c "from store.models import Product; print(f'Total: {Product.objects.count()}')"

# Crear superusuario
python manage.py createsuperuser

# Ejecutar migraciones
python manage.py migrate

# Poblar productos (96 productos)
python manage.py populate_large_catalog
```

## URLs de Producción

- **Frontend**: https://ecommerce-front-xi-tan.vercel.app
- **Backend API**: https://ecommerce-fullstack-y9bl.onrender.com/api
- **Backend Admin**: https://ecommerce-fullstack-y9bl.onrender.com/admin
- **GitHub Repo**: https://github.com/otherprogrammer/ecommerce-fullstack
