# Ecommerce Frontend - React Application

Frontend de la aplicación de ecommerce construido con React, Vite y Tailwind CSS.

## Despliegue en Vercel (Recomendado)

### 1. Preparación

1. Sube el código a GitHub
2. Asegúrate de que el backend esté desplegado en Render primero

### 2. Desplegar en Vercel

1. Ve a [Vercel](https://vercel.com) y crea una cuenta
2. Haz clic en "New Project"
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (o la ruta donde está el frontend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Configurar Variables de Entorno

En la configuración del proyecto en Vercel, agrega esta variable de entorno:

```
VITE_API_BASE_URL=https://tu-backend.onrender.com/api
```

### 4. Desplegar

Haz clic en "Deploy" y espera a que se complete el despliegue.

## Desarrollo Local

### Instalación

1. Instala dependencias:
```bash
npm install
```

2. Crea archivo `.env` (copia de `.env.example`):
```bash
cp .env.example .env
```

### Scripts Disponibles

### `npm run dev`

Ejecuta la aplicación en modo desarrollo usando Vite.\
Abre [http://localhost:5173](http://localhost:5173) para verla en tu navegador.

La página se recargará automáticamente cuando hagas cambios.

### `npm run build`

Genera una versión optimizada para producción en la carpeta `dist`.\
Los archivos están minificados y listos para desplegar.

### `npm run preview`

Previsualiza la versión de producción localmente después de hacer el build.

## Configuración del Backend

Después de desplegar el frontend, actualiza las variables de entorno del backend en Render:

```
CORS_ALLOWED_ORIGINS=https://tu-app.vercel.app,https://tu-app.netlify.app
```

## Características

- ✅ Autenticación de usuarios (JWT)
- ✅ Gestión de productos
- ✅ Carrito de compras
- ✅ Checkout
- ✅ Panel de administración
- ✅ Responsive design con Tailwind CSS

## Tecnologías Utilizadas

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Context API para state management

## Estructura del Proyecto

```
src/
├── components/     # Componentes React
├── context/        # Context API (Auth, Cart)
├── services/       # Servicios API (axios)
├── config.js       # Configuración (URLs, etc)
└── App.jsx         # Componente principal
```
