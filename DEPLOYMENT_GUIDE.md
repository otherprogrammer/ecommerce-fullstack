# Guía Completa de Despliegue - Ecommerce Full Stack

Esta guía te ayudará a desplegar tu aplicación de ecommerce completa en Render (backend) y Vercel (frontend).

## 📋 Requisitos Previos

- Cuenta en [GitHub](https://github.com)
- Cuenta en [Render](https://render.com)
- Cuenta en [Vercel](https://vercel.com)
- Git instalado localmente
- Node.js y Python instalados localmente

## 🚀 Parte 1: Preparar y Subir el Código a GitHub

### 1.1 Inicializar Git en Backend

```bash
cd ecommerce_backend
git init
git add .
git commit -m "Initial commit - Backend"
```

### 1.2 Inicializar Git en Frontend

```bash
cd ../ecommerce_frontend
git init
git add .
git commit -m "Initial commit - Frontend"
```

### 1.3 Crear Repositorios en GitHub

1. Ve a GitHub y crea dos repositorios:
   - `ecommerce-backend`
   - `ecommerce-frontend`

2. Sube el código:

**Backend:**
```bash
cd ecommerce_backend
git remote add origin https://github.com/tu-usuario/ecommerce-backend.git
git branch -M main
git push -u origin main
```

**Frontend:**
```bash
cd ecommerce_frontend
git remote add origin https://github.com/tu-usuario/ecommerce-frontend.git
git branch -M main
git push -u origin main
```

## 🗄️ Parte 2: Desplegar Backend en Render

### 2.1 Crear Base de Datos PostgreSQL

1. Inicia sesión en [Render](https://render.com)
2. Haz clic en **"New +"** → **"PostgreSQL"**
3. Configura:
   - **Name**: `ecommerce-db`
   - **Database**: `ecommerce_db`
   - **User**: (se genera automáticamente)
   - **Region**: Elige el más cercano
   - **PostgreSQL Version**: 16 (o la más reciente)
   - **Plan**: Free

4. Haz clic en **"Create Database"**

5. **Importante:** Copia las siguientes credenciales que aparecen:
   - **Internal Database URL** (la usaremos en el backend)
   - **External Database URL** (para conectarte desde tu PC si lo necesitas)

### 2.2 Crear Web Service para Backend

1. En Render, haz clic en **"New +"** → **"Web Service"**
2. Selecciona **"Build and deploy from a Git repository"**
3. Conecta tu cuenta de GitHub si no lo has hecho
4. Selecciona el repositorio **`ecommerce-backend`**
5. Configura el servicio:

   **Configuración Básica:**
   - **Name**: `ecommerce-backend` (o el nombre que prefieras)
   - **Region**: Same as database (mismo que la BD)
   - **Branch**: `main`
   - **Root Directory**: (déjalo vacío)
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn ecommerce_backend.wsgi:application`

   **Plan:**
   - Selecciona **Free**

6. **Variables de Entorno** (Haz clic en "Advanced" o "Environment"):

   Agrega las siguientes variables:

   ```
   DATABASE_URL=<pega aquí la Internal Database URL que copiaste>
   SECRET_KEY=<genera una clave secreta, por ejemplo: django-insecure-tu-clave-super-secreta-2024>
   DEBUG=False
   ALLOWED_HOSTS=.onrender.com
   CORS_ALLOW_ALL_ORIGINS=False
   CORS_ALLOWED_ORIGINS=http://localhost:5173
   PYTHON_VERSION=3.11.0
   ```

   **Nota:** Actualizaremos `CORS_ALLOWED_ORIGINS` después de desplegar el frontend.

7. Haz clic en **"Create Web Service"**

8. **Espera:** Render empezará a construir y desplegar tu backend. Esto puede tomar 5-10 minutos.

9. Una vez desplegado, verás una URL como: `https://ecommerce-backend-xxxx.onrender.com`

10. **Copia esta URL** - la necesitarás para el frontend.

### 2.3 Verificar el Backend

1. Abre en tu navegador: `https://tu-backend.onrender.com/api/`
2. Deberías ver la página de la API REST

## 💻 Parte 3: Desplegar Frontend en Vercel

### 3.1 Crear Proyecto en Vercel

1. Inicia sesión en [Vercel](https://vercel.com)
2. Haz clic en **"Add New..."** → **"Project"**
3. Importa el repositorio **`ecommerce-frontend`** desde GitHub
4. Configura el proyecto:

   **Project Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (déjalo como está)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Variables de Entorno:**

   Haz clic en **"Environment Variables"** y agrega:

   ```
   VITE_API_BASE_URL=https://tu-backend.onrender.com/api
   ```

   **Importante:** Reemplaza `tu-backend.onrender.com` con la URL real de tu backend de Render.

6. Haz clic en **"Deploy"**

7. **Espera:** Vercel construirá y desplegará tu frontend. Esto toma 1-3 minutos.

8. Una vez desplegado, verás una URL como: `https://tu-app.vercel.app`

### 3.2 Actualizar CORS en Backend

Ahora que tienes la URL del frontend, debes actualizar el backend:

1. Ve a Render → Tu servicio backend → **"Environment"**
2. Edita la variable `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS=https://tu-app.vercel.app
   ```
3. Guarda los cambios
4. Render redesplegará automáticamente el backend

## ✅ Parte 4: Verificación Final

1. **Abre tu frontend:** `https://tu-app.vercel.app`
2. **Prueba las siguientes funciones:**
   - Ver productos
   - Registrar un usuario
   - Iniciar sesión
   - Agregar productos al carrito
   - Ver el carrito

## 🔧 Solución de Problemas Comunes

### Backend no se conecta a la base de datos

- Verifica que `DATABASE_URL` esté correctamente configurada
- Asegúrate de usar la **Internal Database URL**
- Revisa los logs en Render: Settings → Logs

### Frontend no puede comunicarse con Backend

- Verifica que `VITE_API_BASE_URL` tenga la URL correcta del backend
- Asegúrate de que `CORS_ALLOWED_ORIGINS` incluya la URL del frontend
- Verifica en las herramientas de desarrollador del navegador (F12) → Network → ver errores CORS

### Los datos no aparecen en producción

Asegúrate de que el archivo `data.json` esté en el repositorio y que `build.sh` incluya:
```bash
python manage.py loaddata data.json
```

### Error 500 en el backend

- Revisa los logs en Render
- Verifica que todas las variables de entorno estén configuradas
- Asegúrate de que las migraciones se ejecutaron correctamente

## 📱 Extras: Configurar Dominio Personalizado (Opcional)

### En Vercel (Frontend):
1. Settings → Domains → Add Domain
2. Sigue las instrucciones para configurar tu dominio

### En Render (Backend):
1. Settings → Custom Domain
2. Sigue las instrucciones para configurar tu dominio
3. No olvides actualizar `ALLOWED_HOSTS` y `CORS_ALLOWED_ORIGINS`

## 🎉 ¡Listo!

Tu aplicación de ecommerce está ahora desplegada y funcionando en producción:

- **Frontend:** `https://tu-app.vercel.app`
- **Backend API:** `https://tu-backend.onrender.com/api`
- **Admin Panel:** `https://tu-backend.onrender.com/admin`

## 📝 Notas Importantes

1. **Plan Free de Render:**
   - El servicio se "duerme" después de 15 minutos de inactividad
   - La primera petición después de dormir puede tardar 30-60 segundos

2. **Base de Datos:**
   - El plan Free de PostgreSQL en Render tiene límite de 1GB
   - Los datos persisten incluso si el servicio se duerme

3. **Actualizaciones:**
   - Cada vez que hagas `git push` a main, se redesplegarán automáticamente
   - Vercel: push al frontend redespliega el frontend
   - Render: push al backend redespliega el backend

## 🔐 Seguridad

- Nunca subas archivos `.env` a GitHub
- Cambia `SECRET_KEY` en producción
- Mantén `DEBUG=False` en producción
- Usa HTTPS siempre (Render y Vercel lo proveen automáticamente)
