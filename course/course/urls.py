from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from courseapp.views import login_user

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('courseapp.urls')),
    path('api/login/', login_user, name='login_user'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Получение токена
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Обновление токена
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),  # Проверка токена
]

