from django.urls import path, include
from rest_framework.routers import DefaultRouter
from security_analyzer import views

router = DefaultRouter()
# Здесь будут добавлены маршруты по мере готовности viewsets
# router.register(r'events', views.SecurityEventViewSet)
# router.register(r'permissions', views.AccessPermissionViewSet)
# router.register(r'ai-requests', views.AIAnalysisRequestViewSet)

urlpatterns = [
    path('', include(router.urls)),
]