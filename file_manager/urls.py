from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.http import JsonResponse

# Временная заглушка для проверки
def files_status(request):
    return JsonResponse({"message": "Сервис файлов доступен"})

router = DefaultRouter()
# Здесь будут добавлены маршруты по мере готовности viewsets
# router.register(r'bank-files', views.BankFileViewSet)
# router.register(r'access-logs', views.FileAccessLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('status/', files_status, name='files_status'),
]