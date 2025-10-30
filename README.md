# 🛍️ Ecommerce Full Stack - Django + React

Aplicación de ecommerce completa con backend en Django REST Framework y frontend en React con Vite.

## 📁 Estructura del Proyecto

```
Proyecto Final/
├── ecommerce_backend/      # Backend Django REST API
│   ├── accounts/           # App de autenticación
│   ├── store/              # App de productos y tienda
│   ├── ecommerce_backend/  # Configuración principal
│   ├── requirements.txt    # Dependencias Python
│   ├── Procfile           # Configuración Render
│   ├── build.sh           # Script de build
│   └── data.json          # Datos iniciales (usuarios, productos)
│
├── ecommerce_frontend/     # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── context/       # Context API
│   │   ├── services/      # Servicios API
│   │   └── config.js      # Configuración
│   └── dist/              # Build de producción
│
├── DEPLOYMENT_GUIDE.md    # Guía completa de despliegue
└── check_deployment.ps1   # Script de verificación
```

## 🚀 Despliegue en Producción

### Opción 1: Guía Rápida

1. **Verifica que todo esté listo:**
   ```powershell
   .\check_deployment.ps1
   ```

2. **Sigue la guía completa:**
   - Abre [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
   - Sigue los pasos para desplegar en Render (backend) y Vercel (frontend)

### Opción 2: Resumen Rápido

**Backend (Render):**
1. Crea una base de datos PostgreSQL en Render
2. Crea un Web Service conectado a GitHub
3. Configura variables de entorno
4. Despliega automáticamente

**Frontend (Vercel):**
1. Importa repositorio desde GitHub
2. Configura como proyecto Vite
3. Agrega variable `VITE_API_BASE_URL`
4. Despliega automáticamente

## 💻 Desarrollo Local

### Backend

```bash
cd ecommerce_backend
python -m venv env
.\env\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

El backend estará en: `http://localhost:8000`

### Frontend

```bash
cd ecommerce_frontend
npm install
npm run dev
```

El frontend estará en: `http://localhost:5173`

## ✨ Características

### Backend (Django REST API)
- ✅ Autenticación JWT
- ✅ Gestión de usuarios (registro, login, perfil)
- ✅ CRUD de productos
- ✅ CRUD de categorías
- ✅ Sistema de carritos
- ✅ Órdenes de compra
- ✅ Panel de administración
- ✅ Filtrado y búsqueda de productos
- ✅ Sistema de cupones de descuento

### Frontend (React + Vite)
- ✅ Interfaz responsive con Tailwind CSS
- ✅ Autenticación de usuarios
- ✅ Catálogo de productos con filtros
- ✅ Carrito de compras persistente
- ✅ Proceso de checkout
- ✅ Perfil de usuario
- ✅ Panel de administración
- ✅ Navegación con React Router

## 🛠️ Tecnologías

### Backend
- Django 5.2
- Django REST Framework
- PostgreSQL
- JWT Authentication
- CORS Headers
- Gunicorn (producción)
- WhiteNoise (archivos estáticos)

### Frontend
- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Axios
- Context API

## 📦 Datos Iniciales

El proyecto incluye datos de ejemplo en `ecommerce_backend/data.json`:
- Usuarios de prueba
- Productos con imágenes
- Categorías
- Configuraciones iniciales

Para cargar los datos:
```bash
python manage.py loaddata data.json
```

## 🔐 Seguridad

- ✅ SECRET_KEY configurada por variables de entorno
- ✅ DEBUG desactivado en producción
- ✅ CORS configurado correctamente
- ✅ HTTPS en producción (Render/Vercel)
- ✅ Tokens JWT con expiración
- ✅ Validación de datos en backend

## 📝 Variables de Entorno

### Backend (.env)
```
DEBUG=False
SECRET_KEY=tu-clave-secreta
DATABASE_URL=postgresql://...
ALLOWED_HOSTS=.onrender.com
CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app
```

### Frontend (.env)
```
VITE_API_BASE_URL=https://tu-backend.onrender.com/api
```

## 🤝 Contribución

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 📞 Soporte

Si tienes problemas con el despliegue:
1. Revisa [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
2. Verifica los logs en Render/Vercel
3. Consulta la sección de "Solución de Problemas" en la guía

---

**Desarrollado con ❤️ usando Django y React**
