from django.contrib import admin
from .models import Category, Product, Coupon # Importa Coupon

# Register your models here.

admin.site.register(Category)
admin.site.register(Product)
admin.site.register(Coupon)