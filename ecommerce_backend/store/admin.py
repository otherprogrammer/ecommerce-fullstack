from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Product, Coupon

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'product_count')
    search_fields = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    ordering = ('name',)
    
    def product_count(self, obj):
        count = obj.products.count()
        return format_html('<span style="color: #28a745; font-weight: bold;">{}</span>', count)
    product_count.short_description = 'Productos'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price_display', 'stock_status', 'image_preview', 'created_at')
    list_filter = ('category', 'created_at', 'stock')
    search_fields = ('name', 'description', 'category__name')
    readonly_fields = ('created_at', 'updated_at', 'image_preview')
    ordering = ('-created_at',)
    list_per_page = 25
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('name', 'category', 'description')
        }),
        ('Precio e Inventario', {
            'fields': ('price', 'stock')
        }),
        ('Imagen', {
            'fields': ('image_url', 'image_preview')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def price_display(self, obj):
        return format_html('<span style="color: #007bff; font-weight: bold;">S/. {:.2f}</span>', obj.price)
    price_display.short_description = 'Precio'
    
    def stock_status(self, obj):
        if obj.stock == 0:
            color = 'red'
            status = 'Agotado'
        elif obj.stock < 10:
            color = 'orange'
            status = f'Bajo ({obj.stock})'
        else:
            color = 'green'
            status = f'Disponible ({obj.stock})'
        return format_html('<span style="color: {}; font-weight: bold;">{}</span>', color, status)
    stock_status.short_description = 'Stock'
    
    def image_preview(self, obj):
        if obj.image_url:
            return format_html('<img src="{}" width="100" height="100" style="object-fit: cover; border-radius: 8px;" />', obj.image_url)
        return '-'
    image_preview.short_description = 'Vista Previa'

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_display', 'active_status', 'usage_progress', 'minimum_display', 'validity_period')
    list_filter = ('active', 'discount_type', 'created_at')
    search_fields = ('code',)
    readonly_fields = ('used_count', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    list_per_page = 25
    
    fieldsets = (
        ('Información del Cupón', {
            'fields': ('code', 'discount_type', 'discount_value', 'active')
        }),
        ('Restricciones', {
            'fields': ('minimum_amount', 'valid_from', 'valid_until')
        }),
        ('Límites de Uso', {
            'fields': ('usage_limit', 'used_count')
        }),
        ('Fechas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def discount_display(self, obj):
        if obj.discount_type == 'percentage':
            return format_html('<span style="color: #dc3545; font-weight: bold;">{}%</span>', obj.discount_value)
        else:
            return format_html('<span style="color: #dc3545; font-weight: bold;">S/. {:.2f}</span>', obj.discount_value)
    discount_display.short_description = 'Descuento'
    
    def active_status(self, obj):
        if obj.active:
            return format_html('<span style="color: green; font-weight: bold;">✓ Activo</span>')
        return format_html('<span style="color: red; font-weight: bold;">✗ Inactivo</span>')
    active_status.short_description = 'Estado'
    
    def usage_progress(self, obj):
        if obj.usage_limit == -1:
            return format_html('<span style="color: #007bff;">{} usos (Ilimitado)</span>', obj.used_count)
        if obj.usage_limit == 0:
            return format_html('<span style="color: red;">Sin límite configurado</span>')
        percentage = (obj.used_count / obj.usage_limit * 100)
        color = 'green' if percentage < 70 else 'orange' if percentage < 90 else 'red'
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}/{} ({:.0f}%)</span>',
            color, obj.used_count, obj.usage_limit, percentage
        )
    usage_progress.short_description = 'Progreso de Uso'
    
    def minimum_display(self, obj):
        if obj.minimum_amount > 0:
            return format_html('<span style="color: #28a745;">S/. {:.2f}</span>', obj.minimum_amount)
        return format_html('<span style="color: #6c757d;">Sin mínimo</span>')
    minimum_display.short_description = 'Compra Mínima'
    
    def validity_period(self, obj):
        from django.utils import timezone
        now = timezone.now()
        
        # Si no tiene fechas, es permanente
        if not obj.valid_from and not obj.valid_until:
            return format_html('<span style="color: #007bff;">Permanente</span>')
        
        # Si tiene fecha de inicio pero no ha empezado
        if obj.valid_from and now < obj.valid_from:
            return format_html('<span style="color: orange;">Inicia: {}</span>', obj.valid_from.strftime('%d/%m/%Y'))
        
        # Si tiene fecha de fin y ya expiró
        if obj.valid_until and now > obj.valid_until:
            return format_html('<span style="color: red;">Expiró: {}</span>', obj.valid_until.strftime('%d/%m/%Y'))
        
        # Si está dentro del periodo válido
        if obj.valid_until:
            return format_html('<span style="color: green;">Válido hasta: {}</span>', obj.valid_until.strftime('%d/%m/%Y'))
        
        return format_html('<span style="color: green;">Vigente</span>')
    validity_period.short_description = 'Vigencia'

# Personalizar el sitio de administración
admin.site.site_header = "Ecommerce - Panel de Administración"
admin.site.site_title = "Admin Ecommerce"
admin.site.index_title = "Bienvenido al Panel de Administración"