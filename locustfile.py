"""
Pruebas de carga para Ecommerce con Locust
Simula usuarios navegando, registrándose, comprando productos, etc.

Uso:
    locust -f locustfile.py --host=https://ecommerce-fullstack-y9bl.onrender.com
    
Luego abre http://localhost:8089 en tu navegador
"""

from locust import HttpUser, task, between
import random
import json


class EcommerceUser(HttpUser):
    """
    Simula un usuario real del ecommerce que navega, busca productos,
    agrega al carrito y hace checkout.
    """
    
    # Tiempo de espera entre tareas (simula tiempo de lectura/decisión del usuario)
    wait_time = between(1, 3)
    
    def on_start(self):
        """Se ejecuta cuando un usuario virtual inicia su sesión"""
        self.token = None
        self.user_id = None
        self.username = None
        self.cart = []
        
    @task(10)  # Peso 10 - muy común
    def view_home(self):
        """Ver página de inicio"""
        self.client.get("/")
        
    @task(15)  # Peso 15 - la acción más común
    def browse_products(self):
        """Navegar productos con paginación"""
        page = random.randint(1, 5)
        with self.client.get(
            f"/api/products/?page={page}",
            catch_response=True,
            name="/api/products/"
        ) as response:
            if response.status_code == 200:
                data = response.json()
                # Guardar productos para usar en otras tareas
                if 'results' in data and len(data['results']) > 0:
                    self.cart = data['results'][:3]  # Guardar algunos productos
                response.success()
            else:
                response.failure(f"Failed with status {response.status_code}")
    
    @task(8)
    def browse_by_category(self):
        """Filtrar productos por categoría"""
        categories = ['electronica', 'ropa-moda', 'hogar-jardin', 'salud-belleza', 
                     'alimentos-bebidas', 'deportes-fitness', 'juguetes-juegos', 'libros-medios']
        category = random.choice(categories)
        self.client.get(f"/api/products/?category={category}", name="/api/products/?category=[category]")
    
    @task(5)
    def search_products(self):
        """Buscar productos"""
        search_terms = ['laptop', 'camisa', 'silla', 'crema', 'arroz', 'pelota', 'juguete', 'libro']
        term = random.choice(search_terms)
        self.client.get(f"/api/products/?search={term}", name="/api/products/?search=[term]")
    
    @task(6)
    def view_product_detail(self):
        """Ver detalles de un producto específico"""
        if self.cart:
            product = random.choice(self.cart)
            product_id = product.get('id')
            if product_id:
                self.client.get(f"/api/products/{product_id}/")
    
    @task(100)  # Peso 100 - prioridad máxima para alcanzar 10k registros
    def register_user(self):
        """Registrar nuevo usuario - prueba de 10k POST requests"""
        # Usar timestamp + random para evitar duplicados
        import time
        random_num = random.randint(10000, 99999)
        timestamp = int(time.time() * 1000)  # Milisegundos
        unique_id = f"{timestamp}_{random_num}"
        
        user_data = {
            "username": f"locust_user_{unique_id}",
            "email": f"locust_{unique_id}@test.com",
            "password": "Test1234",
            "password2": "Test1234",  # Confirmación de contraseña requerida
            "first_name": "Locust",
            "last_name": "Test",
            "phone": f"999{random_num}",
            "address": "Calle Test 123",
            "document_id": f"DNI{unique_id}"
        }
        
        with self.client.post(
            "/api/accounts/register/",
            json=user_data,
            catch_response=True
        ) as response:
            if response.status_code == 201:
                # Auto-login después de registro
                self.username = user_data['username']
                self.login(user_data['username'], user_data['password'])
                response.success()
            elif response.status_code == 400:
                # Usuario ya existe, es normal en pruebas
                response.success()
            else:
                response.failure(f"Registration failed with {response.status_code}")
    
    @task(4)
    def login_existing_user(self):
        """Login con usuario de prueba"""
        # Usuarios de prueba que ya existen
        test_users = [
            {"username": "usuario_demo", "password": "Demo123!@#"},
            {"username": "admin", "password": "Admin123!@#"}
        ]
        user = random.choice(test_users)
        self.login(user['username'], user['password'])
    
    def login(self, username, password):
        """Método auxiliar para hacer login"""
        with self.client.post(
            "/api/accounts/token/",
            json={"username": username, "password": password},
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('access')
                self.username = username
                response.success()
            else:
                response.failure(f"Login failed with {response.status_code}")
    
    @task(2)
    def view_profile(self):
        """Ver perfil de usuario (requiere auth)"""
        if self.token:
            headers = {"Authorization": f"Bearer {self.token}"}
            self.client.get("/api/accounts/profile/", headers=headers)
    
    @task(2)
    def list_coupons(self):
        """Ver cupones disponibles"""
        self.client.get("/api/coupons/")
    
    @task(1)
    def apply_coupon(self):
        """Intentar aplicar un cupón"""
        coupons = ['WELCOME10', 'SAVE50', 'MEGA25', 'FREESHIP']
        coupon_code = random.choice(coupons)
        cart_total = random.uniform(50, 500)
        
        self.client.post(
            "/api/coupons/apply_coupon/",
            json={"code": coupon_code, "cart_total": cart_total},
            name="/api/coupons/apply_coupon/"
        )
    
    @task(3)
    def view_categories(self):
        """Ver categorías"""
        self.client.get("/api/categories/")
    
    @task(1)
    def create_order(self):
        """Crear una orden (checkout simulado)"""
        if self.token and self.cart:
            order_data = {
                "items": [
                    {
                        "product_id": product.get('id'),
                        "quantity": random.randint(1, 3),
                        "price": product.get('price', 10.00)
                    }
                    for product in self.cart[:2]  # 2 productos
                ],
                "total": sum(p.get('price', 10.00) * random.randint(1, 3) for p in self.cart[:2]),
                "shipping_address": "Calle Test 123"
            }
            
            headers = {"Authorization": f"Bearer {self.token}"}
            self.client.post(
                "/api/orders/",
                json=order_data,
                headers=headers,
                catch_response=True,
                name="/api/orders/"
            )


class AdminUser(HttpUser):
    """
    Simula administradores accediendo al panel de admin
    """
    
    wait_time = between(2, 5)
    weight = 2  # Solo 2 de cada 10 usuarios serán admins
    
    def on_start(self):
        """Login como admin"""
        self.token = None
        self.login_admin()
    
    def login_admin(self):
        """Login con credenciales de admin"""
        with self.client.post(
            "/api/accounts/token/",
            json={"username": "admin", "password": "Admin123!@#"},
            catch_response=True
        ) as response:
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('access')
                response.success()
    
    @task(5)
    def view_all_products_admin(self):
        """Ver productos (admin)"""
        if self.token:
            headers = {"Authorization": f"Bearer {self.token}"}
            self.client.get("/api/products/", headers=headers)
    
    @task(3)
    def view_coupons_admin(self):
        """Ver cupones (admin)"""
        if self.token:
            headers = {"Authorization": f"Bearer {self.token}"}
            self.client.get("/api/coupons/", headers=headers)
    
    @task(2)
    def view_categories_admin(self):
        """Ver categorías (admin)"""
        if self.token:
            headers = {"Authorization": f"Bearer {self.token}"}
            self.client.get("/api/categories/", headers=headers)
    
    @task(1)
    def create_product(self):
        """Crear producto nuevo"""
        if self.token:
            headers = {"Authorization": f"Bearer {self.token}"}
            random_num = random.randint(1000, 9999)
            product_data = {
                "name": f"Producto Test {random_num}",
                "description": "Producto creado en prueba de carga",
                "price": random.uniform(10, 500),
                "stock": random.randint(10, 100),
                "category": random.randint(1, 8),
                "image_url": "https://via.placeholder.com/400"
            }
            
            self.client.post(
                "/api/products/",
                json=product_data,
                headers=headers,
                catch_response=True
            )


class BrowserUser(HttpUser):
    """
    Simula usuarios navegando el frontend (Vercel)
    """
    
    host = "https://ecommerce-front-xi-tan.vercel.app"
    wait_time = between(2, 5)
    weight = 3  # 3 de cada 10 usuarios navegan el frontend
    
    @task(10)
    def view_frontend_home(self):
        """Ver página principal del frontend"""
        self.client.get("/")
    
    @task(5)
    def view_products_page(self):
        """Ver página de productos"""
        self.client.get("/productos")
    
    @task(3)
    def view_cart_page(self):
        """Ver carrito"""
        self.client.get("/carrito")
    
    @task(2)
    def view_login_page(self):
        """Ver página de login"""
        self.client.get("/login")
    
    @task(1)
    def view_register_page(self):
        """Ver página de registro"""
        self.client.get("/register")
