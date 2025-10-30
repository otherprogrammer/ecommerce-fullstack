# ecommerce_backend/accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin # Importar UserAdmin base
from .models import CustomUser

# Primero, define un formulario personalizado para tu CustomUser
# Esto es opcional, pero si tienes muchos campos personalizados, es útil
# from django.contrib.auth.forms import UserCreationForm, UserChangeForm

# class CustomUserCreationForm(UserCreationForm):
#     class Meta(UserCreationForm.Meta):
#         model = CustomUser
#         fields = ('username', 'email', 'phone_number', 'address', 'document_id', 'user_type') # Añade todos tus campos personalizados aquí

# class CustomUserChangeForm(UserChangeForm):
#     class Meta(UserChangeForm.Meta):
#         model = CustomUser
#         fields = ('username', 'email', 'phone_number', 'address', 'document_id', 'user_type') # Añade todos tus campos personalizados aquí

# Registra tu CustomUser en el admin usando UserAdmin o una subclase
@admin.register(CustomUser)
class CustomUserAdmin(BaseUserAdmin): # Hereda de BaseUserAdmin
    # Si no usas CustomUserCreationForm/CustomUserChangeForm, el default funciona bien.
    # add_form = CustomUserCreationForm
    # form = CustomUserChangeForm

    # Estos campos definen cómo se ven los usuarios en el listado del admin
    list_display = ('username', 'email', 'user_type', 'is_staff', 'is_active')
    list_filter = ('is_staff', 'is_active', 'user_type')

    # Estos campos definen cómo se ve el formulario de edición de un usuario
    fieldsets = (
        (None, {'fields': ('username', 'password')}), # Mantener 'password' aquí es CRÍTICO para el hasheo
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'address', 'document_id', 'user_type')}), # Tus campos personalizados
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    # Campos que se muestran cuando añades un nuevo usuario
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'phone_number', 'address', 'document_id', 'user_type', 'password', 'password2'),
        }),
    )
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)