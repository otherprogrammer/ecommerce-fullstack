#!/usr/bin/env python
"""
Script para generar diagrama ER de la base de datos usando Django Extensions

Instalación:
    pip install django-extensions pyparsing pydot

Uso:
    python generate_db_diagram.py

El diagrama se guardará como 'db_diagram.png' en el directorio actual.
"""

import os
import sys
import django

# Configurar Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from django.core.management import call_command

def generate_diagram():
    """
    Genera el diagrama ER de la base de datos
    """
    print("🎨 Generando diagrama de base de datos...")
    
    try:
        # Generar diagrama completo de todas las apps
        call_command(
            'graph_models',
            'accounts',
            'store',
            '--output', 'db_diagram.png',
            '--group-models',
            '--arrow-shape', 'normal',
            '--theme', 'django2018',
            '--exclude-models', 'Session,LogEntry,Permission,Group,ContentType',
            '--verbose-names',
        )
        print("✅ Diagrama generado exitosamente: db_diagram.png")
        
        # También generar versión PDF
        try:
            call_command(
                'graph_models',
                'accounts',
                'store',
                '--output', 'db_diagram.pdf',
                '--group-models',
                '--arrow-shape', 'normal',
                '--theme', 'django2018',
                '--exclude-models', 'Session,LogEntry,Permission,Group,ContentType',
                '--verbose-names',
            )
            print("✅ Diagrama PDF generado: db_diagram.pdf")
        except Exception as e:
            print(f"⚠️ No se pudo generar PDF: {e}")
        
        print("\n📊 Archivos generados:")
        print("   - db_diagram.png (imagen)")
        if os.path.exists('db_diagram.pdf'):
            print("   - db_diagram.pdf (vector)")
        
    except Exception as e:
        print(f"❌ Error al generar diagrama: {e}")
        print("\n💡 Asegúrate de haber instalado:")
        print("   pip install django-extensions pyparsing pydot")
        print("\nEn settings.py debe estar:")
        print("   INSTALLED_APPS = [..., 'django_extensions', ...]")
        return False
    
    return True

if __name__ == '__main__':
    success = generate_diagram()
    sys.exit(0 if success else 1)
