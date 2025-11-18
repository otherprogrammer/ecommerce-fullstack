#!/usr/bin/env python
"""
Script para verificar la configuración del backend en producción
Ejecutar: python check_config.py
"""
import os
import sys
from pathlib import Path

# Agregar el directorio del proyecto al path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR / 'ecommerce_backend'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
import django
django.setup()

from django.conf import settings
from django.contrib.auth import get_user_model
from store.models import Product, Category, Coupon

def check_config():
    print("=" * 60)
    print("VERIFICACIÓN DE CONFIGURACIÓN - ECOMMERCE BACKEND")
    print("=" * 60)
    
    # 1. Debug Mode
    print(f"\n✓ DEBUG: {settings.DEBUG}")
    if settings.DEBUG:
        print("  ⚠️  ADVERTENCIA: DEBUG está en True. Cambiar a False en producción!")
    
    # 2. Allowed Hosts
    print(f"\n✓ ALLOWED_HOSTS: {settings.ALLOWED_HOSTS}")
    
    # 3. CORS
    print(f"\n✓ CORS_ALLOWED_ORIGINS: {settings.CORS_ALLOWED_ORIGINS}")
    if not settings.CORS_ALLOWED_ORIGINS:
        print("  ⚠️  ADVERTENCIA: No hay orígenes CORS configurados!")
    
    # 4. Database
    db_config = settings.DATABASES['default']
    print(f"\n✓ DATABASE ENGINE: {db_config['ENGINE']}")
    if 'postgresql' in db_config['ENGINE']:
        print("  ✓ Usando PostgreSQL")
    
    # 5. Secret Key
    if settings.SECRET_KEY.startswith('django-insecure'):
        print("\n  ⚠️  ADVERTENCIA: Usando SECRET_KEY por defecto. Cambiar en producción!")
    else:
        print("\n✓ SECRET_KEY configurada correctamente")
    
    # 6. JWT Config
    print(f"\n✓ ACCESS_TOKEN_LIFETIME: {settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME']}")
    print(f"✓ REFRESH_TOKEN_LIFETIME: {settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME']}")
    
    print("\n" + "=" * 60)
    print("VERIFICACIÓN DE BASE DE DATOS")
    print("=" * 60)
    
    # 7. Users
    User = get_user_model()
    user_count = User.objects.count()
    print(f"\n✓ Total Usuarios: {user_count}")
    admin_count = User.objects.filter(is_staff=True).count()
    print(f"✓ Usuarios Admin: {admin_count}")
    
    # 8. Products
    product_count = Product.objects.count()
    print(f"\n✓ Total Productos: {product_count}")
    if product_count < 90:
        print(f"  ⚠️  ADVERTENCIA: Solo hay {product_count} productos. Ejecutar populate_large_catalog")
    
    # 9. Categories
    category_count = Category.objects.count()
    print(f"✓ Total Categorías: {category_count}")
    for cat in Category.objects.all():
        prod_count = cat.products.count()
        print(f"  - {cat.name} ({cat.slug}): {prod_count} productos")
    
    # 10. Coupons
    coupon_count = Coupon.objects.count()
    print(f"\n✓ Total Cupones: {coupon_count}")
    active_coupons = Coupon.objects.filter(active=True).count()
    print(f"✓ Cupones Activos: {active_coupons}")
    
    print("\n" + "=" * 60)
    print("VERIFICACIÓN COMPLETADA")
    print("=" * 60)
    
    # Resumen
    warnings = []
    if settings.DEBUG:
        warnings.append("DEBUG=True en producción")
    if not settings.CORS_ALLOWED_ORIGINS:
        warnings.append("CORS no configurado")
    if product_count < 90:
        warnings.append(f"Solo {product_count} productos (esperados: 90+)")
    if settings.SECRET_KEY.startswith('django-insecure'):
        warnings.append("SECRET_KEY por defecto")
    
    if warnings:
        print("\n⚠️  ADVERTENCIAS:")
        for warning in warnings:
            print(f"  - {warning}")
    else:
        print("\n✓ ¡Todo configurado correctamente!")

if __name__ == '__main__':
    try:
        check_config()
    except Exception as e:
        print(f"\n❌ Error durante la verificación: {e}")
        import traceback
        traceback.print_exc()
