@echo off
REM Script para Windows - Generar diagrama de base de datos

echo ========================================
echo Generador de Diagrama de Base de Datos
echo ========================================
echo.

REM Verificar si está en el entorno virtual
python --version
echo.

echo Instalando dependencias necesarias...
pip install django-extensions pyparsing pydot
echo.

echo Generando diagrama...
python manage.py graph_models accounts store -o db_diagram.png --group-models --arrow-shape normal --exclude-models "Session,LogEntry,Permission,Group,ContentType"
echo.

if exist db_diagram.png (
    echo ========================================
    echo [OK] Diagrama generado: db_diagram.png
    echo ========================================
    start db_diagram.png
) else (
    echo ========================================
    echo [ERROR] No se pudo generar el diagrama
    echo ========================================
    echo.
    echo Verifica que django-extensions este en INSTALLED_APPS
    echo en ecommerce_backend/settings.py
)

pause
