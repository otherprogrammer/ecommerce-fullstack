from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password

# Importa el serializador de Simple JWT
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

CustomUser = get_user_model() # Obtener tu modelo de usuario personalizado

# --- Serializador de Registro ---
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True) # Para confirmar contraseña

    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'password', 'password2') # Asegúrate que password2 esté aquí
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return data

    def create(self, validated_data):
        # Eliminar password2 antes de crear el usuario
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# --- Serializador de Usuario (para mostrar datos del usuario) ---
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser # Usa CustomUser aquí
        fields = ('id', 'username', 'email', 'first_name', 'phone', 'address', 'dni', 'birth_date', 'is_active', 'is_staff')
        read_only_fields = ('id', 'is_active', 'is_staff')


# --- NUEVO Serializador para JWT (MyTokenObtainPairSerializer) ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Añadir información adicional al payload del token
        token['username'] = user.username
        token['email'] = user.email
        token['is_staff'] = user.is_staff # Campo crucial para el frontend
        # Puedes añadir más campos si los necesitas en el frontend
        # token['first_name'] = user.first_name

        return token