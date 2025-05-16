"""
Представления для системы анализа безопасности
"""
import logging
import json
from django.db import models
from django.utils import timezone
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from ipware import get_client_ip
from security_analyzer.models import SecurityEvent, AccessPermission, AIAnalysisRequest
from security_analyzer.serializers import SecurityEventSerializer, AccessPermissionSerializer, AIAnalysisRequestSerializer
from security_analyzer.ai_services import OpenAIService

logger = logging.getLogger('security_analyzer')
ai_service = OpenAIService()

class SecurityEventViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с событиями безопасности"""
    queryset = SecurityEvent.objects.all()
    serializer_class = SecurityEventSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """Обработка создания нового события безопасности"""
        # Получаем IP пользователя
        client_ip, _ = get_client_ip(self.request)
        
        # Создаем событие
        event = serializer.save(
            source_ip=client_ip,
            user=self.request.user
        )
        
        # Анализируем событие с помощью AI
        if event.severity in ['HIGH', 'CRITICAL']:
            ai_service.analyze_security_event(event)
    
    @action(detail=True, methods=['post'])
    def analyze(self, request, pk=None):
        """Действие для анализа события с помощью AI"""
        event = self.get_object()
        analysis_result = ai_service.analyze_security_event(event)
        
        return Response({
            'event_id': event.id,
            'analysis_result': analysis_result
        })
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Получение статистики по событиям безопасности"""
        # Статистика по типам событий
        event_types = SecurityEvent.objects.values('event_type').annotate(
            count=models.Count('id')
        )
        
        # Статистика по уровням важности
        severity_levels = SecurityEvent.objects.values('severity').annotate(
            count=models.Count('id')
        )
        
        # Статистика по времени (за последнюю неделю по дням)
        now = timezone.now()
        week_ago = now - timezone.timedelta(days=7)
        events_by_day = SecurityEvent.objects.filter(
            timestamp__gte=week_ago
        ).extra(
            select={'day': "DATE(timestamp)"}
        ).values('day').annotate(
            count=models.Count('id')
        )
        
        return Response({
            'event_types': event_types,
            'severity_levels': severity_levels,
            'events_by_day': events_by_day
        })


class AccessPermissionViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с разрешениями доступа"""
    queryset = AccessPermission.objects.all()
    serializer_class = AccessPermissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        """Обработка создания нового разрешения"""
        # Сохраняем информацию о том, кто выдал разрешение
        serializer.save(granted_by=self.request.user)


class AIAnalysisRequestViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра запросов к AI"""
    queryset = AIAnalysisRequest.objects.all()
    serializer_class = AIAnalysisRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Ограничение выборки только запросами текущего пользователя"""
        # Администраторы видят все запросы
        if self.request.user.is_staff:
            return AIAnalysisRequest.objects.all()
        
        # Обычные пользователи видят только свои запросы
        return AIAnalysisRequest.objects.filter(user=self.request.user)