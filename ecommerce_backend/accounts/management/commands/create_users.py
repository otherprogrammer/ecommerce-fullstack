from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

class Command(BaseCommand):
    help = 'Crear superusuario admin y usuarios de prueba'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        
        # Credenciales del superusuario
        admin_username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        admin_email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@ecommerce.com')
        admin_password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'Admin123!@#')
        
        # Crear superusuario si no existe
        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=admin_password
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Superusuario "{admin_username}" creado exitosamente'))
            self.stdout.write(self.style.WARNING(f'  Email: {admin_email}'))
            self.stdout.write(self.style.WARNING(f'  Password: {admin_password}'))
        else:
            # Actualizar la contraseña si el usuario ya existe
            admin_user = User.objects.get(username=admin_username)
            admin_user.set_password(admin_password)
            admin_user.is_superuser = True
            admin_user.is_staff = True
            admin_user.email = admin_email
            admin_user.save()
            self.stdout.write(self.style.SUCCESS(f'✓ Superusuario "{admin_username}" actualizado'))
        
        # Crear usuario de prueba normal
        test_username = 'usuario_demo'
        test_email = 'demo@ecommerce.com'
        test_password = 'Demo123!@#'
        
        if not User.objects.filter(username=test_username).exists():
            User.objects.create_user(
                username=test_username,
                email=test_email,
                password=test_password,
                first_name='Usuario',
                last_name='Demo',
                phone_number='+51987654321',
                address='Av. Demo 123, Lima, Perú',
                user_type='customer'
            )
            self.stdout.write(self.style.SUCCESS(f'✓ Usuario demo "{test_username}" creado exitosamente'))
            self.stdout.write(self.style.WARNING(f'  Email: {test_email}'))
            self.stdout.write(self.style.WARNING(f'  Password: {test_password}'))
        else:
            demo_user = User.objects.get(username=test_username)
            demo_user.set_password(test_password)
            demo_user.email = test_email
            demo_user.save()
            self.stdout.write(self.style.SUCCESS(f'✓ Usuario demo "{test_username}" actualizado'))
        
        self.stdout.write(self.style.SUCCESS('\n=== CREDENCIALES CREADAS ==='))
        self.stdout.write(self.style.SUCCESS('\n🔐 SUPERUSUARIO (Admin):'))
        self.stdout.write(f'   Username: {admin_username}')
        self.stdout.write(f'   Password: {admin_password}')
        self.stdout.write(f'   Email: {admin_email}')
        
        self.stdout.write(self.style.SUCCESS('\n👤 USUARIO NORMAL (Demo):'))
        self.stdout.write(f'   Username: {test_username}')
        self.stdout.write(f'   Password: {test_password}')
        self.stdout.write(f'   Email: {test_email}')
        
        self.stdout.write(self.style.SUCCESS('\n✓ Configuración de usuarios completada'))
