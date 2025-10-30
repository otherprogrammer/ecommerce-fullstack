from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action  # <--- ¡ESTA ES LA IMPORTACIÓN QUE SIEMPRE FALTA!
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from django.db.models import F
from django.utils import timezone 

from .models import Category, Product, Coupon # Asegúrate de que Coupon esté importado
from .serializers import CategorySerializer, ProductSerializer, CouponSerializer # Asegúrate de que CouponSerializer esté importado


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny] # Por defecto, permitir acceso a todos (GET)

    def get_permissions(self):
        """Asigna permisos para CategoryViewSet."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser] # Solo administradores pueden crear/editar/borrar
        return super().get_permissions()


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny] # Por defecto, permitir acceso a todos (GET)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug'] # Permite filtrar por category_slug
    search_fields = ['name', 'description', 'category__name'] # Permite buscar por nombre, descripción, nombre de categoría
    ordering_fields = ['name', 'price', 'created_at', 'stock'] # Permite ordenar por estos campos

    def get_permissions(self):
        """Asigna permisos para ProductViewSet."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser] # Solo administradores pueden crear/editar/borrar
        return super().get_permissions()



# VISTA para Cupones
class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer
    
    def get_permissions(self):
        """Asigna permisos basados en la acción para CouponViewSet."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAdminUser] # Solo administradores para CRUD de cupones
        elif self.action == 'apply_coupon':
            self.permission_classes = [AllowAny] # Cualquiera puede intentar aplicar un cupón (guest o logged-in)
        else: # Para acciones como 'list', 'retrieve' (GET)
            self.permission_classes = [IsAdminUser] # Los cupones solo los listan/ven admins, no usuarios comunes
        return super().get_permissions()

    @action(detail=False, methods=['post'])
    def apply_coupon(self, request):
        """
        Endpoint para aplicar un cupón al total del carrito.
        Requiere:
        - 'code': El código del cupón.
        - 'cart_total': El total actual del carrito.
        """
        code = request.data.get('code')
        cart_total_str = request.data.get('cart_total')

        if not code or cart_total_str is None:
            return Response({'detail': 'Código de cupón y total del carrito son requeridos.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart_total = float(cart_total_str) # Asegúrate de convertir a float
        except ValueError:
            return Response({'detail': 'El total del carrito debe ser un número válido.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            coupon = Coupon.objects.get(code__iexact=code) # __iexact para búsqueda insensible a mayúsculas/minúsculas
        except Coupon.DoesNotExist:
            return Response({'detail': 'Cupón inválido o no existe.'}, status=status.HTTP_404_NOT_FOUND)

        if not coupon.active:
            return Response({'detail': 'Cupón inactivo.'}, status=status.HTTP_400_BAD_REQUEST)

        now = timezone.now()
        if coupon.valid_from and now < coupon.valid_from:
            return Response({'detail': 'Este cupón aún no es válido.'}, status=status.HTTP_400_BAD_REQUEST)
        if coupon.valid_until and now > coupon.valid_until:
            return Response({'detail': 'Este cupón ha expirado.'}, status=status.HTTP_400_BAD_REQUEST)

        if cart_total < coupon.minimum_amount:
            return Response({'detail': f'El monto mínimo de compra para este cupón es S/.{coupon.minimum_amount}.'}, status=status.HTTP_400_BAD_REQUEST)

        if coupon.usage_limit != -1 and coupon.used_count >= coupon.usage_limit:
            return Response({'detail': 'Este cupón ha alcanzado su límite de usos.'}, status=status.HTTP_400_BAD_REQUEST)
        

        # Calcular el descuento
        discount_amount = 0
        if coupon.discount_type == 'percentage':
            discount_amount = (cart_total * float(coupon.discount_value)) / 100
        elif coupon.discount_type == 'fixed_amount':
            discount_amount = float(coupon.discount_value)
        
        # El descuento no puede ser mayor que el total del carrito
        discount_amount = min(discount_amount, cart_total)
        final_total = max(0, cart_total - discount_amount)

        return Response({
            'code': coupon.code,
            'discount_type': coupon.discount_type,
            'discount_value': float(coupon.discount_value),
            'discount_amount': float(discount_amount),
            'final_total': float(final_total),
            'message': 'Cupón aplicado exitosamente.'
        }, status=status.HTTP_200_OK)