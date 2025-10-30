from rest_framework import serializers
from .models import Product, Category, Coupon

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug'] # Incluye el nuevo campo 'slug'

class ProductSerializer(serializers.ModelSerializer):
    # 'category_name' es un campo de solo lectura que obtiene el nombre de la categoría
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    # Asegúrate de que 'category' sea writable si quieres que el frontend envíe el ID de la categoría
    # PrimaryKeyRelatedField ya está bien para esto.

    class Meta:
        model = Product
        # Asegúrate de que todos los campos que quieres enviar/recibir estén aquí
        fields = ['id', 'name', 'description', 'price', 'stock', 'category', 'image_url', 'category_name', 'created_at', 'updated_at']
        read_only_fields = ('created_at', 'updated_at', 'category_name') # Campos que solo se muestran, no se editan
        # Puedes añadir extra_kwargs para control más fino, por ejemplo:
        # extra_kwargs = {
        #     'category': {'write_only': True} # Para que el frontend solo envíe el ID de la categoría
        # }

    # El método update personalizado que tenías no es estrictamente necesario si solo actualiza el stock
    # y otros campos. ModelSerializer.update() ya maneja esto por defecto.
    # Si tuvieras lógica de negocio compleja para el stock, lo dejarías.
    # def update(self, instance, validated_data):
    #     if 'stock' in validated_data:
    #         instance.stock = validated_data['stock']
    #     return super().update(instance, validated_data)

class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = '__all__'