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
    list_display = ('name', 'category', 'price', 'stock', 'created_at')
    list_filter = ('category', 'created_at', 'stock')
    search_fields = ('name', 'description', 'category__name')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    list_per_page = 25

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ('code', 'discount_type', 'discount_value', 'active', 'used_count', 'usage_limit')
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

# Personalizar el sitio de administración
admin.site.site_header = "Ecommerce - Panel de Administración"
admin.site.site_title = "Admin Ecommerce"
admin.site.index_title = "Bienvenido al Panel de Administración"