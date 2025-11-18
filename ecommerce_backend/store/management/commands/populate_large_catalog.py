from django.core.management.base import BaseCommand
from django.utils import timezone
from store.models import Category, Product, Coupon
from decimal import Decimal
import random

class Command(BaseCommand):
    help = 'Poblar la base de datos con 90+ productos variados usando imágenes de Unsplash'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Iniciando población masiva de la base de datos...'))

        # Limpiar datos existentes
        self.stdout.write('Limpiando datos existentes...')
        Product.objects.all().delete()
        Category.objects.all().delete()
        Coupon.objects.all().delete()

        # Crear Categorías
        self.stdout.write('Creando categorías...')
        categories_data = [
            {'name': 'Electrónica', 'slug': 'electronica'},
            {'name': 'Ropa', 'slug': 'ropa'},
            {'name': 'Hogar', 'slug': 'hogar'},
            {'name': 'Deportes', 'slug': 'deportes'},
            {'name': 'Libros', 'slug': 'libros'},
            {'name': 'Juguetes', 'slug': 'juguetes'},
            {'name': 'Salud', 'slug': 'salud'},
            {'name': 'Alimentos', 'slug': 'alimentos'},
        ]

        categories = {}
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(**cat_data)
            categories[cat_data['slug']] = category
            self.stdout.write(f'  ✓ {category.name}')

        # Definir productos por categoría (90+ productos)
        products_data = {
            'electronica': [
                ('Laptop Gaming Pro 15"', 'Procesador Intel i7, 16GB RAM, RTX 3060, pantalla 144Hz', '2499.99', 15, 'photo-1603302576837-37561b2e2302'),
                ('Auriculares Bluetooth Premium', 'Cancelación de ruido, 30h batería, sonido Hi-Fi', '199.99', 50, 'photo-1505740420928-5e560c06d30e'),
                ('Smartphone Pro Max 256GB', 'Cámara 108MP, AMOLED 6.7", 5G, batería 5000mAh', '1299.99', 30, 'photo-1511707171634-5f897ff02aa9'),
                ('Tablet Pro 12.9"', 'Pantalla Retina, chip M2, Apple Pencil compatible', '899.99', 20, 'photo-1544244015-0df4b3ffc6b0'),
                ('Smartwatch GPS Deportivo', 'Monitor cardíaco, GPS, resistente agua 50m', '299.99', 40, 'photo-1523275335684-37898b6baf30'),
                ('Mouse Gaming RGB', 'DPI ajustable 16000, 8 botones programables', '79.99', 60, 'photo-1527814050087-3793815479db'),
                ('Teclado Mecánico RGB', 'Switches Cherry MX, iluminación customizable', '149.99', 45, 'photo-1587829741301-dc798b83add3'),
                ('Monitor 27" 4K', 'IPS, 144Hz, HDR, tiempo respuesta 1ms', '599.99', 25, 'photo-1527443224154-c4a3942d3acf'),
                ('Webcam 4K Ultra HD', 'Autofocus, micrófono dual, luz ajustable', '129.99', 35, 'photo-1588508065123-287b28e013da'),
                ('Cámara Web Streaming', 'Full HD 1080p, gran angular 90°, trípode incluido', '89.99', 50, 'photo-1526543379932-6dc8458e65ca'),
                ('Disco SSD Externo 1TB', 'Lectura 1000MB/s, USB-C, compacto y ligero', '179.99', 40, 'photo-1531492746076-161ca9bcad58'),
                ('Powerbank 30000mAh', 'Carga rápida 65W, 3 puertos USB, display LED', '69.99', 70, 'photo-1609091839311-d5365f9ff1c5'),
            ],
            'ropa': [
                ('Zapatillas Running Pro', 'Amortiguación avanzada, transpirables', '129.99', 60, 'photo-1542291026-7eec264c27ff'),
                ('Chaqueta Cuero Premium', 'Cuero genuino, forro suave, diseño clásico', '349.99', 25, 'photo-1551028719-00167b16eac5'),
                ('Vestido Verano Elegante', 'Tela ligera, corte favorecedor, varios colores', '89.99', 45, 'photo-1595777457583-95e059d581b8'),
                ('Reloj Análogo Clásico', 'Acero inoxidable, cuero genuino, resistente agua', '249.99', 35, 'photo-1524592094714-0f0654e20314'),
                ('Jeans Slim Fit Hombre', 'Mezclilla premium, fit moderno, lavado oscuro', '79.99', 55, 'photo-1542272454315-7f6fabf531a8'),
                ('Blusa Seda Natural', 'Seda 100%, elegante, perfecta para oficina', '99.99', 40, 'photo-1485968579580-b6d095142e6e'),
                ('Sudadera Con Capucha', 'Algodón orgánico, diseño urbano, muy cómoda', '59.99', 70, 'photo-1556821840-3a63f95609a7'),
                ('Falda Plisada Midi', 'Tela fluida, cintura elástica, ultra femenina', '69.99', 50, 'photo-1583496661160-fb5886a0aaaa'),
                ('Camisa Oxford Formal', 'Algodón egipcio, corte slim, no iron', '89.99', 45, 'photo-1602810318383-e386cc2a3ccf'),
                ('Shorts Deportivos', 'Tela quick-dry, bolsillos con cierre, reflectivos', '39.99', 80, 'photo-1591195853828-11db59a44f6b'),
                ('Bikini Dos Piezas', 'Protección UV, secado rápido, varios estampados', '49.99', 60, 'photo-1584827894949-e9c3f14d12c1'),
                ('Corbata Seda Italiana', 'Seda pura, diseños exclusivos, gift box', '59.99', 50, 'photo-1589756823695-278bc8b4faa0'),
            ],
            'hogar': [
                ('Aspiradora Robot Inteligente', 'Mapeo láser, succión 4000Pa, app control', '399.99', 20, 'photo-1558317374-067fb5f30001'),
                ('Sábanas Premium Queen', 'Algodón egipcio 600 hilos, ultra suaves', '149.99', 40, 'photo-1522771739844-6a9f6d5f14af'),
                ('Cafetera Espresso Automática', 'Molinillo integrado, 15 bares, bandeja extraíble', '599.99', 15, 'photo-1517668808822-9ebb02f2a0e6'),
                ('Set Plantas Decorativas', 'Pack 4 plantas fácil cuidado, macetas modernas', '79.99', 55, 'photo-1509937528035-ad76254b0356'),
                ('Lámpara LED Inteligente', 'WiFi, millones de colores, control por voz', '49.99', 70, 'photo-1513506003901-1e6a229e2d15'),
                ('Difusor Aromaterapia', 'Ultrasónico, 7 luces LED, temporizador', '39.99', 65, 'photo-1608571423902-eed4a5ad8108'),
                ('Juego Toallas Premium 6 Piezas', 'Algodón turco, super absorbentes, suaves', '89.99', 50, 'photo-1607195857688-93a745bfbd53'),
                ('Cortinas Blackout Térmicas', 'Aislantes, reducción ruido, fácil instalación', '69.99', 45, 'photo-1616486338812-3dadae4b4ace'),
                ('Organizador Closet 10 Niveles', 'Colgante, varios compartimientos, plegable', '29.99', 80, 'photo-1631679706909-1844bbd07221'),
                ('Almohada Memory Foam', 'Cervical ortopédica, funda bambú, anti-alergénica', '59.99', 60, 'photo-1586495777744-4413f21062fa'),
                ('Espejo Pared LED', 'Iluminación ajustable, anti-fog, 80x60cm', '199.99', 25, 'photo-1618220179428-22790b461013'),
                ('Set Utensilios Cocina Silicona', '12 piezas, antiadherentes, resistentes calor', '49.99', 70, 'photo-1556911220-bff31c812dba'),
            ],
            'deportes': [
                ('Bicicleta Montaña 29"', 'Suspensión, 21 velocidades, frenos disco', '699.99', 12, 'photo-1576435728678-68d0fbf94e91'),
                ('Mancuernas Ajustables 20kg', 'Ajuste rápido, agarre antideslizante', '179.99', 30, 'photo-1517836357463-d25dfeac3438'),
                ('Esterilla Yoga Premium', 'TPE ecológico, antideslizante, 6mm grosor', '49.99', 70, 'photo-1601925260368-ae2f83cf8b7f'),
                ('Cinta Correr Eléctrica', 'Motor 2HP, inclinación ajustable, plegable', '899.99', 10, 'photo-1576678927484-cc907957088c'),
                ('Balón Fútbol Profesional', 'Tamaño oficial, cuero sintético, FIFA approved', '39.99', 90, 'photo-1614632537423-1e6c2e7e0a68'),
                ('Raqueta Tenis Profesional', 'Grafito, peso balanceado, grip comfort', '149.99', 35, 'photo-1622163642998-1ea32b0bbc67'),
                ('Set Pesas Rusas Kettlebell', '3 pesos: 8kg, 12kg, 16kg, base incluida', '199.99', 25, 'photo-1517838277536-f5f99be501cd'),
                ('Cuerda Saltar Profesional', 'Rodamientos, contadores, ajustable', '19.99', 100, 'photo-1598289431755-4810b2245b8c'),
                ('Guantes Boxeo 14oz', 'Cuero sintético, relleno multi-capa', '69.99', 50, 'photo-1549719386-74dfcbf7dbed'),
                ('Tabla Paddle Surf Inflable', 'Completa con remo, bomba, mochila', '499.99', 15, 'photo-1559827260-dc66d52bef19'),
                ('Patineta Eléctrica', 'Hasta 25km/h, autonomía 20km, ruedas grandes', '599.99', 20, 'photo-1547447134-cd3f5c716030'),
                ('Bolsa Gimnasio Impermeable', 'Compartimiento zapatos, botella, gran capacidad', '49.99', 60, 'photo-1553062407-98eeb64c6a62'),
            ],
            'libros': [
                ('eReader Kindle Paperwhite', 'Pantalla 10", luz cálida, resistente agua', '199.99', 35, 'photo-1592496431122-2349e0fbc666'),
                ('Audífonos Podcast Studio', 'Respuesta plana, aislamiento acústico', '249.99', 25, 'photo-1484704849700-f032a568e944'),
                ('Lámpara Lectura LED Recargable', 'Luz cálida ajustable, clip universal', '29.99', 75, 'photo-1507003211169-0a1dd7228f2d'),
                ('Atril Libros Bambú', 'Plegable, ajustable, para libros y tablets', '24.99', 80, 'photo-1524995997946-a1c2e315a42f'),
                ('Marcapáginas Magnéticos Set', 'Pack 20 diseños, super delgados', '12.99', 120, 'photo-1512820790803-83ca734da794'),
                ('Biblioteca Pared Flotante', 'Invisible, hasta 15kg, fácil instalación', '39.99', 50, 'photo-1589998059171-988d887df646'),
                ('Luz Lectura Cuello Flexible', 'LED recargable, 3 niveles brillo, portátil', '19.99', 90, 'photo-1456513080510-7bf3a84b82f8'),
                ('Organizador Revistas Metal', 'Moderno, 3 niveles, acabado negro mate', '34.99', 60, 'photo-1481627834876-b7833e8f5570'),
                ('Audiolibros Suscripción 6 Meses', 'Acceso ilimitado, miles de títulos', '79.99', 200, 'photo-1589998059171-988d887df646'),
                ('Lupa Lectura LED', 'Aumento 3x, luz integrada, ergonómica', '29.99', 70, 'photo-1507842217343-583bb7270b66'),
            ],
            'juguetes': [
                ('Consola Portátil Gaming', 'OLED 7", 64GB, controles extraíbles', '449.99', 20, 'photo-1578303512597-81e6cc155b3e'),
                ('Set Construcción 1000 Piezas', 'Bloques compatibles, estimula creatividad', '79.99', 50, 'photo-1587654780291-39c9404d746b'),
                ('Drone Cámara 4K', 'Estabilización 3 ejes, GPS, alcance 2km', '599.99', 15, 'photo-1473968512647-3e447244af8f'),
                ('Muñeca Interactiva', 'Habla, canta, 100+ frases, ropa incluida', '89.99', 40, 'photo-1560582739-ae1c90975bad'),
                ('Carro Control Remoto 4x4', 'Escala 1:16, recargable, todo terreno', '69.99', 55, 'photo-1558618666-fcd25c85cd64'),
                ('Puzzle 3D Monumentos', 'Torre Eiffel, 500 piezas, LED incluido', '49.99', 60, 'photo-1611746872915-64382b5c76da'),
                ('Peluche Gigante Oso 150cm', 'Ultra suave, lavable, hipoalergénico', '129.99', 30, 'photo-1530325553241-4f6e7690cf36'),
                ('Set Cocinita Niños', 'Sonidos reales, luces, accesorios incluidos', '149.99', 25, 'photo-1587213811864-9e0b6ad7e0b2'),
                ('Slime DIY Kit', 'Hace 20+ slimes, colores, glitter, seguro', '34.99', 80, 'photo-1618241207393-72e9b78d8b08'),
                ('Patineta Infantil 3 Ruedas', 'LED en ruedas, ajustable altura, hasta 50kg', '59.99', 45, 'photo-1547447134-cd3f5c716030'),
                ('Microscopio Educativo', 'Aumento 1200x, set preparaciones, LED', '89.99', 35, 'photo-1532094349884-543bc11b234d'),
                ('Robot Programable', 'App control, aprende coding, sensores', '199.99', 20, 'photo-1563207153-f403bf289096'),
            ],
            'salud': [
                ('Kit Cuidado Facial Completo', 'Limpiador, tónico, suero, crema, natural', '129.99', 45, 'photo-1556228578-8c89e6adf883'),
                ('Secador Cabello Profesional', 'Motor iónico, 3 velocidades, bajo ruido', '189.99', 30, 'photo-1522338140262-f46f5913618a'),
                ('Báscula Inteligente Bluetooth', 'Mide peso, grasa, masa muscular, IMC', '69.99', 50, 'photo-1559056199-641a0ac8b55e'),
                ('Termómetro Digital Infrarrojo', 'Sin contacto, lectura 1 segundo, preciso', '39.99', 70, 'photo-1584515933487-779824d29309'),
                ('Oxímetro Pulso Dedo', 'Saturación oxígeno, frecuencia cardíaca, portátil', '29.99', 80, 'photo-1615461066841-6116e61058f4'),
                ('Masajeador Eléctrico Espalda', '8 nodos, calor, 3 velocidades, alivio inmediato', '79.99', 40, 'photo-1544161515-4ab6ce6db874'),
                ('Difusor Aceites Esenciales', 'Ultrasónico, 500ml, 7 luces, temporizador', '44.99', 60, 'photo-1608571423902-eed4a5ad8108'),
                ('Cepillo Dientes Eléctrico', 'Sónico 40000 vibraciones/min, 5 modos, recargable', '99.99', 50, 'photo-1607613009820-a29f7bb81c04'),
                ('Rizador Cabello Automático', 'Cerámica turmalina, temperatura ajustable', '119.99', 35, 'photo-1582095133179-bfd08e2fc6b3'),
                ('Plancha Cabello Profesional', 'Placas titanio, iónica, 230°C, digital', '149.99', 30, 'photo-1582003064554-74eefd1b6349'),
                ('Set Manicure Eléctrico', '11 cabezales, recargable, estuche lujo', '59.99', 55, 'photo-1610992015732-2449b76344bc'),
                ('Espejo Maquillaje LED 3X', 'Aumento triple, luz natural, táctil', '79.99', 45, 'photo-1605091234754-eb1b6e9c06e9'),
            ],
            'alimentos': [
                ('Set Cuchillos Profesionales 8 Piezas', 'Acero alemán, mango ergonómico, bloque madera', '249.99', 25, 'photo-1593618998160-e34014e67546'),
                ('Licuadora Alta Potencia 1500W', 'Vaso vidrio 2L, cuchillas titanio, 10 velocidades', '159.99', 35, 'photo-1570831739435-6601aa3fa4fb'),
                ('Botella Térmica 1L', 'Frío 24h, caliente 12h, acero, libre BPA', '39.99', 80, 'photo-1602143407151-7111542de6e8'),
                ('Freidora Aire 5L', 'Sin aceite, digital, 8 programas, fácil limpiar', '199.99', 30, 'photo-1585459895066-a0bb43f8f4c9'),
                ('Batidora Amasadora 1000W', 'Bowl 6L, 6 velocidades, varillas incluidas', '249.99', 20, 'photo-1578985545062-69928b1d9587'),
                ('Sartén Cerámica Antiadherente', '28cm, inducción, libre PFOA, mango cool touch', '49.99', 60, 'photo-1556909114-f6e7ad7d3136'),
                ('Olla Presión Eléctrica 6L', '14 programas, slow cooker, vaporera', '179.99', 25, 'photo-1585515320310-259814833f29'),
                ('Procesador Alimentos 12 en 1', 'Picar, rebanar, rallar, amasar, 750W', '149.99', 30, 'photo-1586142439133-1c3ff55e5eb5'),
                ('Tostadora 4 Rebanadas', 'Acero inoxidable, 7 niveles, bandeja migajas', '69.99', 50, 'photo-1599404165196-bc6c99c16a97'),
                ('Hervidor Eléctrico Vidrio', '1.7L, LED, apagado automático, libre BPA', '44.99', 55, 'photo-1563912098-d7c8b33de6ba'),
                ('Báscula Cocina Digital', 'Hasta 5kg, precisión 1g, pantalla LCD', '24.99', 90, 'photo-1623860857033-0f38f29e6ab4'),
                ('Molinillo Café Eléctrico', 'Muelas cónicas, 17 niveles molido, silencioso', '89.99', 40, 'photo-1610889556528-9a770e32642f'),
            ],
        }

        # Crear productos
        self.stdout.write('\nCreando productos...')
        product_count = 0
        for category_slug, products in products_data.items():
            for name, description, price, stock, unsplash_id in products:
                image_url = f'https://images.unsplash.com/{unsplash_id}?w=500'
                product, created = Product.objects.create(
                    name=name,
                    description=description,
                    price=Decimal(price),
                    stock=stock,
                    category=categories[category_slug],
                    image_url=image_url
                )
                product_count += 1
                self.stdout.write(f'  ✓ {product.name} ({category_slug}) - S/. {product.price}')

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
                'usage_limit': -1,
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

        self.stdout.write(self.style.SUCCESS(f'\n✓ Población MASIVA completada exitosamente!'))
        self.stdout.write(self.style.SUCCESS(f'  • {len(categories)} categorías creadas'))
        self.stdout.write(self.style.SUCCESS(f'  • {product_count} productos creados (¡más de 90!)'))
        self.stdout.write(self.style.SUCCESS(f'  • {coupon_count} cupones creados'))
        self.stdout.write(self.style.WARNING('\nPara ejecutar: python manage.py populate_large_catalog'))
