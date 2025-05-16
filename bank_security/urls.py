from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Заглушка для главной страницы
def home(request):
    return HttpResponse("<h1>Система анализа безопасности банка</h1><p>API сервера работает.</p>")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('api/security/', include('security_analyzer.urls')),
    path('api/auth/', include('authentication.urls')),
    path('api/files/', include('file_manager.urls')),
]