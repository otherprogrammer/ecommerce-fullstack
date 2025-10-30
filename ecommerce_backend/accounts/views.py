from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView # Necesario para RegisterView si no usas generics.CreateAPIView directamente
from rest_framework_simplejwt.views import TokenObtainPairView # <-- Asegúrate que esta línea esté presente

from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, UserSerializer, MyTokenObtainPairSerializer
from .models import CustomUser

User = get_user_model()

# 1. Vista para el Registro de Usuarios
class RegisterView(generics.CreateAPIView): # Usamos generics.CreateAPIView para simplificar
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = () # Permitir a cualquiera registrarse

    # El método create ya tiene raise_exception=True, lo cual es bueno.
    # El problema es que tu frontend no está capturando ese 'exception' bien.
    # Vamos a forzar una respuesta más explícita por si acaso.
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True) # Si hay errores, lanzará una excepción
        except Exception as e: # Capturamos cualquier excepción de validación
            print("Validation error:", serializer.errors) # <-- Esto imprimirá el detalle en tu terminal Django
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"message": "Usuario registrado exitosamente.", "user": serializer.data},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

# 2. Vista para obtener Tokens JWT (usando tu serializador personalizado)
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer