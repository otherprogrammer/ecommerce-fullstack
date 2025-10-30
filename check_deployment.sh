#!/bin/bash

echo "================================"
echo "Verificación de Archivos para Despliegue"
echo "================================"
echo ""

# Backend checks
echo "📦 BACKEND - Verificando archivos..."
cd ecommerce_backend

files=(
    "requirements.txt"
    "Procfile"
    "build.sh"
    "runtime.txt"
    "data.json"
    ".gitignore"
    "README.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - FALTA"
    fi
done

echo ""
echo "📄 Verificando settings.py..."
if grep -q "dj_database_url" ecommerce_backend/settings.py; then
    echo "✅ settings.py configurado para producción"
else
    echo "❌ settings.py no tiene configuración de producción"
fi

cd ..

# Frontend checks
echo ""
echo "🎨 FRONTEND - Verificando archivos..."
cd ecommerce_frontend

files=(
    ".env.example"
    ".gitignore"
    "README.md"
)

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file - FALTA"
    fi
done

echo ""
echo "📄 Verificando config.js..."
if grep -q "import.meta.env.VITE_API_BASE_URL" src/config.js; then
    echo "✅ config.js configurado para variables de entorno"
else
    echo "❌ config.js no usa variables de entorno"
fi

cd ..

echo ""
echo "================================"
echo "✨ Verificación completada"
echo "================================"
echo ""
echo "Próximos pasos:"
echo "1. Sube el código a GitHub"
echo "2. Sigue la guía en DEPLOYMENT_GUIDE.md"
echo ""
