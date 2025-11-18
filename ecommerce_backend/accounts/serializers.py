from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import re

CustomUser = get_user_model()

# Serializador de Registro
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    email = serializers.EmailField(required=True)
    username = serializers.CharField(required=True)

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2', 'phone_number', 'address')
        extra_kwargs = {
            'password': {'write_only': True},
            'phone_number': {'required': False},
            'address': {'required': False}
        }

    def validate_username(self, value):
        """Validar que el username solo contenga caracteres alfanuméricos y guiones bajos"""
        if not re.match(r'^[\w.@+-]+$', value):
            raise serializers.ValidationError(
                "El nombre de usuario solo puede contener letras, números y @/./+/-/_ caracteres."
            )
        if len(value) < 3:
            raise serializers.ValidationError("El nombre de usuario debe tener al menos 3 caracteres.")
        if len(value) > 150:
            raise serializers.ValidationError("El nombre de usuario no puede exceder 150 caracteres.")
        return value

    def validate_email(self, value):
        """Validar que el email no esté ya registrado"""
        if CustomUser.objects.filter(email=value.lower()).exists():
            raise serializers.ValidationError("Este correo electrónico ya está registrado.")
        return value.lower()

    def validate_phone_number(self, value):
        """Validar formato de teléfono si se proporciona"""
        if value:
            # Eliminar espacios y guiones
            cleaned = re.sub(r'[\s\-()]', '', value)
            if not re.match(r'^\+?1?\d{9,15}$', cleaned):
                raise serializers.ValidationError(
                    "Número de teléfono inválido. Debe contener entre 9 y 15 dígitos."
                )
        return value

    def validate(self, data):
        """Validación global"""
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        
        # Validar que el password no contenga el username ni el email
        username = data.get('username', '').lower()
        email = data.get('email', '').lower()
        password = data.get('password', '').lower()
        
        if username in password:
            raise serializers.ValidationError(
                {"password": "La contraseña no puede contener el nombre de usuario."}
            )
        if email.split('@')[0] in password:
            raise serializers.ValidationError(
                {"password": "La contraseña no puede contener partes del correo electrónico."}
            )
        
        return data

    def create(self, validated_data):
        """Crear usuario con las validaciones aplicadas"""
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            user_type='customer',  # Por defecto, todos son customers
            is_active=True,  # Los usuarios se activan inmediatamente
        )
        return user

# Serializador de Usuario
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'address', 'document_id', 'user_type',
            'is_active', 'is_staff', 'date_joined'
        )
        read_only_fields = ('id', 'is_active', 'is_staff', 'user_type', 'date_joined')

    def validate_email(self, value):
        """Validar email único al actualizar"""
        user = self.instance
        if user and CustomUser.objects.filter(email=value.lower()).exclude(pk=user.pk).exists():
            raise serializers.ValidationError("Este correo electrónico ya está en uso.")
        return value.lower()

# Serializador para JWT personalizado
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        """Validar credenciales y agregar información adicional"""
        data = super().validate(attrs)
        
        # Verificar que el usuario esté activo
        if not self.user.is_active:
            raise serializers.ValidationError("Esta cuenta ha sido desactivada.")
        
        # Agregar información del usuario al response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'is_staff': self.user.is_staff,
            'is_superuser': self.user.is_superuser,
            'user_type': self.user.user_type,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
        }
        
        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Agregar claims personalizados al token
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser
        token['user_type'] = user.user_type

        return token