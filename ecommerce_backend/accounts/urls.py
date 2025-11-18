from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, get_user_profile, update_user_profile

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('profile/', get_user_profile, name='user_profile'),
    path('profile/update/', update_user_profile, name='update_profile'),
]
