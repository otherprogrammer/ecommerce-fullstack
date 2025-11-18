from django.core.management.base import BaseCommand
from django.utils import timezone
from store.models import Category, Product, Coupon
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Poblar la base de datos con productos de ejemplo usando imágenes de Unsplash'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Iniciando población de la base de datos...'))

        # Limpiar datos existentes (opcional)
        self.stdout.write('Limpiando datos existentes...')
        Product.objects.all().delete()
        Category.objects.all().delete()
        Coupon.objects.all().delete()

        # Crear Categorías
        self.stdout.write('Creando categorías...')
        categories_data = [
            {'name': 'Electrónica', 'slug': 'electronica'},
            {'name': 'Ropa y Moda', 'slug': 'ropa-moda'},
            {'name': 'Hogar y Jardín', 'slug': 'hogar-jardin'},
            {'name': 'Deportes y Fitness', 'slug': 'deportes-fitness'},
            {'name': 'Libros y Medios', 'slug': 'libros-medios'},
            {'name': 'Juguetes y Juegos', 'slug': 'juguetes-juegos'},
            {'name': 'Salud y Belleza', 'slug': 'salud-belleza'},
            {'name': 'Alimentos y Bebidas', 'slug': 'alimentos-bebidas'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(**cat_data)
            categories[cat_data['slug']] = category
            self.stdout.write(f'  ✓ {category.name}')

        # Crear Productos por categoría
        self.stdout.write('\nCreando productos...')
        
        products_data = [
            # Electrónica
            {
                'category': 'electronica',
                'name': 'Laptop Gaming Pro 15"',
                'description': 'Potente laptop gaming con procesador Intel i7, 16GB RAM, RTX 3060, pantalla 144Hz. Perfecta para gaming y trabajo profesional.',
                'price': Decimal('2499.99'),
                'stock': 15,
                'image_url': 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500'
            },
            {
                'category': 'electronica',
                'name': 'Auriculares Bluetooth Premium',
                'description': 'Cancelación de ruido activa, 30 horas de batería, sonido Hi-Fi, micrófono integrado. Comodidad todo el día.',
                'price': Decimal('199.99'),
                'stock': 50,
                'image_url': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
            },
            {
                'category': 'electronica',
                'name': 'Smartphone Pro Max 256GB',
                'description': 'Cámara triple 108MP, pantalla AMOLED 6.7", 5G, batería 5000mAh. El mejor smartphone del año.',
                'price': Decimal('1299.99'),
                'stock': 30,
                'image_url': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
            },
            {
                'category': 'electronica',
                'name': 'Tablet Pro 12.9" WiFi',
                'description': 'Perfecta para creativos y profesionales. Pantalla Retina, Apple Pencil compatible, chip M2.',
                'price': Decimal('899.99'),
                'stock': 20,
                'image_url': 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500'
            },
            {
                'category': 'electronica',
                'name': 'Smartwatch Deportivo GPS',
                'description': 'Monitor de frecuencia cardíaca, GPS integrado, resistente al agua 50m, batería 7 días.',
                'price': Decimal('299.99'),
                'stock': 40,
                'image_url': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'
            },

            # Ropa y Moda
            {
                'category': 'ropa-moda',
                'name': 'Zapatillas Deportivas Running',
                'description': 'Tecnología de amortiguación avanzada, transpirables, diseño ergonómico. Perfectas para corredores.',
                'price': Decimal('129.99'),
                'stock': 60,
                'image_url': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
            },
            {
                'category': 'ropa-moda',
                'name': 'Chaqueta de Cuero Premium',
                'description': 'Cuero genuino, forro interior suave, diseño clásico atemporal. Disponible en negro y marrón.',
                'price': Decimal('349.99'),
                'stock': 25,
                'image_url': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'
            },
            {
                'category': 'ropa-moda',
                'name': 'Vestido de Verano Elegante',
                'description': 'Tela ligera y fresca, corte favorecedor, perfecto para ocasiones especiales y uso diario.',
                'price': Decimal('89.99'),
                'stock': 45,
                'image_url': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'
            },
            {
                'category': 'ropa-moda',
                'name': 'Reloj Análogo Clásico',
                'description': 'Caja de acero inoxidable, correa de cuero genuino, resistente al agua 50m. Elegancia atemporal.',
                'price': Decimal('249.99'),
                'stock': 35,
                'image_url': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=500'
            },

            # Hogar y Jardín
            {
                'category': 'hogar-jardin',
                'name': 'Aspiradora Robot Inteligente',
                'description': 'Mapeo láser, succión potente 4000Pa, app control, recarga automática. Tu casa siempre limpia.',
                'price': Decimal('399.99'),
                'stock': 20,
                'image_url': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500'
            },
            {
                'category': 'hogar-jardin',
                'name': 'Juego de Sábanas Premium Queen',
                'description': 'Algodón egipcio 600 hilos, ultra suaves, hipoalergénicas. Incluye funda de almohada.',
                'price': Decimal('149.99'),
                'stock': 40,
                'image_url': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500'
            },
            {
                'category': 'hogar-jardin',
                'name': 'Cafetera Espresso Automática',
                'description': 'Molinillo integrado, 15 bares de presión, bandeja de goteo extraíble. Café perfecto en casa.',
                'price': Decimal('599.99'),
                'stock': 15,
                'image_url': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500'
            },
            {
                'category': 'hogar-jardin',
                'name': 'Set de Plantas Decorativas Interior',
                'description': 'Pack de 4 plantas de fácil cuidado con macetas modernas. Purifica el aire y decora tu espacio.',
                'price': Decimal('79.99'),
                'stock': 55,
                'image_url': 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=500'
            },

            # Deportes y Fitness
            {
                'category': 'deportes-fitness',
                'name': 'Bicicleta de Montaña 29"',
                'description': 'Suspensión delantera, 21 velocidades, frenos de disco, cuadro de aluminio. Aventura garantizada.',
                'price': Decimal('699.99'),
                'stock': 12,
                'image_url': 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=500'
            },
            {
                'category': 'deportes-fitness',
                'name': 'Mancuernas Ajustables Set 20kg',
                'description': 'Sistema de ajuste rápido, agarre antideslizante, compactas. Entrena en casa profesionalmente.',
                'price': Decimal('179.99'),
                'stock': 30,
                'image_url': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500'
            },
            {
                'category': 'deportes-fitness',
                'name': 'Esterilla de Yoga Premium',
                'description': 'Material ecológico TPE, antideslizante, 6mm grosor, incluye correa de transporte.',
                'price': Decimal('49.99'),
                'stock': 70,
                'image_url': 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500'
            },

            # Libros y Medios
            {
                'category': 'libros-medios',
                'name': 'eReader Kindle 10" Paperwhite',
                'description': 'Pantalla antirreflejo, luz cálida ajustable, resistente al agua, batería semanas. Miles de libros.',
                'price': Decimal('199.99'),
                'stock': 35,
                'image_url': 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500'
            },
            {
                'category': 'libros-medios',
                'name': 'Audífonos para Podcast Studio',
                'description': 'Respuesta de frecuencia plana, aislamiento acústico, cable desmontable. Para productores.',
                'price': Decimal('249.99'),
                'stock': 25,
                'image_url': 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
            },

            # Juguetes y Juegos
            {
                'category': 'juguetes-juegos',
                'name': 'Consola de Videojuegos Portátil',
                'description': 'Pantalla OLED 7", 64GB almacenamiento, controles Joy-Con extraíbles. Diversión en cualquier lugar.',
                'price': Decimal('449.99'),
                'stock': 20,
                'image_url': 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500'
            },
            {
                'category': 'juguetes-juegos',
                'name': 'Set de Construcción Creativo 1000 Piezas',
                'description': 'Bloques de construcción compatibles, estimula creatividad, para niños 6+. Horas de diversión.',
                'price': Decimal('79.99'),
                'stock': 50,
                'image_url': 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500'
            },
            {
                'category': 'juguetes-juegos',
                'name': 'Drone con Cámara 4K',
                'description': 'Estabilización 3 ejes, alcance 2km, GPS, retorno automático. Captura momentos épicos.',
                'price': Decimal('599.99'),
                'stock': 15,
                'image_url': 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500'
            },

            # Salud y Belleza
            {
                'category': 'salud-belleza',
                'name': 'Kit de Cuidado Facial Completo',
                'description': 'Limpiador, tónico, suero, crema hidratante. Piel radiante en 30 días. Ingredientes naturales.',
                'price': Decimal('129.99'),
                'stock': 45,
                'image_url': 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500'
            },
            {
                'category': 'salud-belleza',
                'name': 'Secador de Cabello Profesional',
                'description': 'Motor iónico, 3 velocidades, boquilla concentradora, tecnología de bajo ruido. Salon quality.',
                'price': Decimal('189.99'),
                'stock': 30,
                'image_url': 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=500'
            },
            {
                'category': 'salud-belleza',
                'name': 'Báscula Inteligente Bluetooth',
                'description': 'Mide peso, grasa corporal, masa muscular, IMC. App conectada, seguimiento de progreso.',
                'price': Decimal('69.99'),
                'stock': 50,
                'image_url': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500'
            },

            # Alimentos y Bebidas
            {
                'category': 'alimentos-bebidas',
                'name': 'Set de Cuchillos Profesionales 8 Piezas',
                'description': 'Acero inoxidable alemán, mango ergonómico, incluye afilador y bloque de madera.',
                'price': Decimal('249.99'),
                'stock': 25,
                'image_url': 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=500'
            },
            {
                'category': 'alimentos-bebidas',
                'name': 'Licuadora de Alta Potencia 1500W',
                'description': 'Vaso de vidrio 2L, cuchillas de titanio, 10 velocidades, función pulso. Smoothies perfectos.',
                'price': Decimal('159.99'),
                'stock': 35,
                'image_url': 'https://images.unsplash.com/photo-1570831739435-6601aa3fa4fb?w=500'
            },
            {
                'category': 'alimentos-bebidas',
                'name': 'Botella Térmica Premium 1L',
                'description': 'Mantiene frío 24h / caliente 12h, acero inoxidable, libre de BPA, diseño minimalista.',
                'price': Decimal('39.99'),
                'stock': 80,
                'image_url': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500'
            },
        ]

        product_count = 0
        for product_data in products_data:
            category_slug = product_data.pop('category')
            product_data['category'] = categories[category_slug]
            
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            product_count += 1
            self.stdout.write(f'  ✓ {product.name} - ${product.price}')

        # Crear Cupones
        self.stdout.write('\nCreando cupones de descuento...')
        coupons_data = [
            {
                'code': 'WELCOME10',
                'discount_type': 'percentage',
                'discount_value': Decimal('10.00'),
                'active': True,
                'minimum_amount': Decimal('50.00'),
                'usage_limit': 100,
                'used_count': 0,
            },
            {
                'code': 'SAVE50',
                'discount_type': 'fixed_amount',
                'discount_value': Decimal('50.00'),
                'active': True,
                'minimum_amount': Decimal('200.00'),
                'usage_limit': 50,
                'used_count': 0,
            },
            {
                'code': 'MEGA25',
                'discount_type': 'percentage',
                'discount_value': Decimal('25.00'),
                'active': True,
                'minimum_amount': Decimal('300.00'),
                'usage_limit': 30,
                'used_count': 0,
            },
            {
                'code': 'FREESHIP',
                'discount_type': 'fixed_amount',
                'discount_value': Decimal('15.00'),
                'active': True,
                'minimum_amount': Decimal('75.00'),
                'usage_limit': -1,  # Ilimitado
                'used_count': 0,
            },
        ]

        coupon_count = 0
        for coupon_data in coupons_data:
            coupon, created = Coupon.objects.get_or_create(
                code=coupon_data['code'],
                defaults=coupon_data
            )
            coupon_count += 1
            discount_text = f"{coupon.discount_value}%" if coupon.discount_type == 'percentage' else f"S/.{coupon.discount_value}"
            self.stdout.write(f'  ✓ {coupon.code} - {discount_text} descuento')

        self.stdout.write(self.style.SUCCESS(f'\n✓ Población completada exitosamente!'))
        self.stdout.write(self.style.SUCCESS(f'  • {len(categories)} categorías creadas'))
        self.stdout.write(self.style.SUCCESS(f'  • {product_count} productos creados'))
        self.stdout.write(self.style.SUCCESS(f'  • {coupon_count} cupones creados'))
        self.stdout.write(self.style.WARNING('\nPara ejecutar: python manage.py populate_products'))
