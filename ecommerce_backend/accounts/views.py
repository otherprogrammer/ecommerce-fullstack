from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError as DjangoValidationError
import logging

from .serializers import RegisterSerializer, UserSerializer, MyTokenObtainPairSerializer
from .models import CustomUser

User = get_user_model()
logger = logging.getLogger(__name__)

# Vista para el Registro de Usuarios
class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)  # Explícitamente permitir a cualquiera

    def create(self, request, *args, **kwargs):
        # Validar que no se intente registrar como staff o superuser
        if request.data.get('is_staff') or request.data.get('is_superuser'):
            logger.warning(f"Intento de registro con privilegios elevados desde IP: {request.META.get('REMOTE_ADDR')}")
            return Response(
                {"error": "No se puede registrar usuarios con privilegios administrativos."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            logger.error(f"Error de validación en registro: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        headers = self.get_success_headers(serializer.data)
        
        logger.info(f"Nuevo usuario registrado: {user.username}")
        
        return Response(
            {
                "message": "Usuario registrado exitosamente.",
                "user": {
                    "username": user.username,
                    "email": user.email,
                    "id": user.id
                }
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )

# Vista para obtener Tokens JWT
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
    permission_classes = (AllowAny,)
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            logger.info(f"Login exitoso para usuario: {request.data.get('username')}")
        else:
            logger.warning(f"Intento de login fallido para: {request.data.get('username')}")
        return response

# Vista para obtener el perfil del usuario autenticado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Obtiene el perfil del usuario actualmente autenticado"""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# Vista para actualizar el perfil del usuario
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Actualiza el perfil del usuario autenticado"""
    user = request.user
    
    # Prevenir que usuarios comunes se conviertan en staff/superuser
    if 'is_staff' in request.data or 'is_superuser' in request.data:
        if not user.is_superuser:
            logger.warning(f"Usuario {user.username} intentó modificar privilegios")
            return Response(
                {"error": "No tiene permisos para modificar privilegios administrativos."},
                status=status.HTTP_403_FORBIDDEN
            )
    
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)