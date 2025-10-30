from django.db import models
from django.utils.text import slugify # Importar para el slug

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True) # Campo para URLs amigables

    class Meta:
        verbose_name_plural = "Categories" # Para que en el admin aparezca "Categories"
        ordering = ['name'] # Ordenar alfabéticamente por nombre

    def save(self, *args, **kwargs):
        if not self.slug: # Generar el slug automáticamente si no se provee
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    name = models.CharField(max_length=200) # Renombrado de 'nombre'
    description = models.TextField(blank=True) # Renombrado de 'descripcion', ahora opcional
    price = models.DecimalField(max_digits=10, decimal_places=2) # Renombrado de 'precio'
    stock = models.IntegerField(default=0) # Renombrado de 'stock', con valor por defecto
    image_url = models.URLField(blank=True, null=True) # Renombrado de 'imagen', ahora puede ser null

    created_at = models.DateTimeField(auto_now_add=True) # Fecha de creación automática
    updated_at = models.DateTimeField(auto_now=True)   # Fecha de última actualización automática

    class Meta:
        ordering = ['-created_at'] # Ordenar por fecha de creación descendente (los más nuevos primero)

    def __str__(self):
        return self.name
    
class Coupon(models.Model):
    DISCOUNT_TYPE_CHOICES = [
        ('percentage', 'Porcentaje'),
        ('fixed_amount', 'Monto Fijo'),
    ]

    code = models.CharField(max_length=50, unique=True, help_text="Código único del cupón")
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPE_CHOICES, default='percentage')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2, help_text="Valor del descuento (ej. 10 para 10% o S/.10)")
    
    active = models.BooleanField(default=True, help_text="Indica si el cupón está activo y puede ser usado")
    valid_from = models.DateTimeField(null=True, blank=True, help_text="Fecha y hora de inicio de validez")
    valid_until = models.DateTimeField(null=True, blank=True, help_text="Fecha y hora de fin de validez")
    
    minimum_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0, help_text="Monto mínimo de compra para aplicar el cupón")
    usage_limit = models.IntegerField(default=-1, help_text="-1 para usos ilimitados, de lo contrario, el número máximo de veces que puede ser usado")
    used_count = models.IntegerField(default=0, help_text="Número de veces que el cupón ha sido usado")
    
    # Esto requeriría un ForeingKey al modelo CustomUser si cada cupón es para un solo usuario
    # O un ManyToMany si es para varios usuarios específicos.
    # Por ahora, un limit por usuario general es más sencillo.
    # user_limit = models.IntegerField(default=1, help_text="Número de veces que un usuario individual puede usar el cupón. -1 para ilimitado")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.code

    class Meta:
        verbose_name = "Cupón"
        verbose_name_plural = "Cupones"
        ordering = ['-created_at']