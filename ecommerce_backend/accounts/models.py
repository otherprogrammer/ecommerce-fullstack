from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
        ('customer', 'Cliente'),
        ('admin', 'Administrador'),
        ('delivery', 'Repartidor'),
    )

    email = models.EmailField(unique=True)
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    document_id = models.CharField(max_length=20, blank=True, null=True)
    user_type = models.CharField(max_length=20, choices=USER_TYPE_CHOICES, default='customer')

    def __str__(self):
        return self.username