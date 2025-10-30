from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, CouponViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet) # Renombrado para consistencia
router.register(r'categories', CategoryViewSet) # Renombrado para consistencia
router.register(r'coupons', CouponViewSet)

urlpatterns = [
    path('', include(router.urls)),
]