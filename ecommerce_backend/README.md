# Ecommerce Backend - Django REST API

Backend para la aplicación de ecommerce construido con Django y Django REST Framework.

## Despliegue en Render

### 1. Preparación del Repositorio

1. Sube este código a GitHub
2. Asegúrate de que todos los archivos estén incluidos:
   - `requirements.txt`
   - `Procfile`
   - `build.sh`
   - `runtime.txt`

### 2. Crear Servicio Web en Render

1. Ve a [Render](https://render.com) y crea una cuenta
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name**: `ecommerce-backend` (o el nombre que prefieras)
   - **Environment**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn ecommerce_backend.wsgi:application`

### 3. Crear Base de Datos PostgreSQL en Render

1. En el dashboard de Render, haz clic en "New +" y selecciona "PostgreSQL"
2. Configura la base de datos:
   - **Name**: `ecommerce-db`
   - **Database**: `ecommerce_db`
   - **User**: Lo genera automáticamente
   - Selecciona el plan Free

3. Copia la "Internal Database URL" que aparece después de crear la base de datos

### 4. Configurar Variables de Entorno

En la configuración de tu Web Service en Render, agrega estas variables de entorno:

```
DATABASE_URL=<pega aquí la Internal Database URL de tu PostgreSQL>
SECRET_KEY=<genera una clave secreta segura>
DEBUG=False
ALLOWED_HOSTS=.onrender.com
CORS_ALLOWED_ORIGINS=https://tu-frontend.vercel.app,https://tu-frontend.netlify.app
RENDER_EXTERNAL_HOSTNAME=tu-app.onrender.com
```

### 5. Migrar Datos de Desarrollo a Producción

Para migrar tus datos locales (usuarios, productos) a la base de datos de Render:

1. Exporta los datos locales:
```bash
python manage.py dumpdata --natural-foreign --natural-primary -e contenttypes -e auth.Permission --indent 4 > data.json
```

2. Sube el archivo `data.json` a tu repositorio

3. Modifica `build.sh` para cargar los datos:
```bash
#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py loaddata data.json
```

4. Haz push de los cambios y Render reconstruirá automáticamente

### 6. Verificación

Una vez desplegado, tu API estará disponible en:
```
https://tu-app.onrender.com/api/
```

Endpoints principales:
- `/api/accounts/register/` - Registro de usuarios
- `/api/accounts/login/` - Login
- `/api/products/` - Lista de productos
- `/api/categories/` - Categorías

## Desarrollo Local

1. Crea un entorno virtual:
```bash
python -m venv env
source env/bin/activate  # En Windows: .\env\Scripts\activate
```

2. Instala dependencias:
```bash
pip install -r requirements.txt
```

3. Configura variables de entorno (copia `.env.example` a `.env`)

4. Ejecuta migraciones:
```bash
python manage.py migrate
```

5. Crea un superusuario:
```bash
python manage.py createsuperuser
```

6. Ejecuta el servidor:
```bash
python manage.py runserver
```
