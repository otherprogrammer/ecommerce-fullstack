from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'user_type_badge', 'full_name', 'is_staff_badge', 'is_active_badge', 'date_joined')
    list_filter = ('is_staff', 'is_active', 'user_type', 'is_superuser', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-date_joined',)
    list_per_page = 25
    
    fieldsets = (
        ('Autenticación', {
            'fields': ('username', 'password')
        }),
        ('Información Personal', {
            'fields': ('first_name', 'last_name', 'email', 'phone_number', 'address', 'document_id')
        }),
        ('Tipo de Usuario', {
            'fields': ('user_type',),
            'description': 'Define el rol del usuario en el sistema'
        }),
        ('Permisos', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
            'classes': ('collapse',)
        }),
        ('Fechas Importantes', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('collapse',)
        }),
    )
    
    add_fieldsets = (
        ('Crear Usuario', {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2'),
        }),
        ('Información Adicional', {
            'fields': ('first_name', 'last_name', 'phone_number', 'address', 'document_id', 'user_type'),
        }),
        ('Permisos Iniciales', {
            'fields': ('is_staff', 'is_active'),
        }),
    )
    
    def user_type_badge(self, obj):
        colors = {
            'customer': '#28a745',
            'admin': '#dc3545',
            'delivery': '#ffc107',
        }
        labels = {
            'customer': 'Cliente',
            'admin': 'Admin',
            'delivery': 'Repartidor',
        }
        color = colors.get(obj.user_type, '#6c757d')
        label = labels.get(obj.user_type, obj.user_type)
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; font-weight: bold;">{}</span>',
            color, label
        )
    user_type_badge.short_description = 'Tipo'
    
    def full_name(self, obj):
        if obj.first_name or obj.last_name:
            return f"{obj.first_name} {obj.last_name}".strip()
        return '-'
    full_name.short_description = 'Nombre Completo'
    
    def is_staff_badge(self, obj):
        if obj.is_staff:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: #ccc;">✗</span>')
    is_staff_badge.short_description = 'Staff'
    
    def is_active_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green;">✓ Activo</span>')
        return format_html('<span style="color: red;">✗ Inactivo</span>')
    is_active_badge.short_description = 'Estado'
    
    def get_readonly_fields(self, request, obj=None):
        """Los superusers pueden editar todo, pero staff solo puede editar campos limitados"""
        if not request.user.is_superuser:
            return ('is_superuser', 'user_permissions', 'date_joined', 'last_login')
        return ('date_joined', 'last_login')
    
    def has_delete_permission(self, request, obj=None):
        """Solo superusers pueden eliminar usuarios"""
        if obj and obj.is_superuser and not request.user.is_superuser:
            return False
        return super().has_delete_permission(request, obj)
    
    def has_change_permission(self, request, obj=None):
        """Los usuarios staff no pueden modificar superusers"""
        if obj and obj.is_superuser and not request.user.is_superuser:
            return False
        return super().has_change_permission(request, obj)