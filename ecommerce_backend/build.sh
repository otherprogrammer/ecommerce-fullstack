#!/usr/bin/env bash
# Script de build para Render
# exit on error
set -o errexit

echo "📦 Instalando dependencias..."
pip install -r requirements.txt

echo "🗂️  Recolectando archivos estáticos..."
python manage.py collectstatic --no-input

echo "🔄 Ejecutando migraciones..."
python manage.py migrate

echo "👥 Creando usuarios (admin y demo)..."
python manage.py create_users

echo "🛍️  Poblando base de datos con productos..."
python manage.py populate_products

echo "✅ Build completado exitosamente!"
