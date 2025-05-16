"""
Представления для управления файлами
"""
import os
import logging
import hashlib
from django.db import models
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse
from django.utils import timezone
from ipware import get_client_ip
from wsgiref.util import FileWrapper
from file_manager.models import BankFile, FileAccessLog
from file_manager.serializers import BankFileSerializer, FileAccessLogSerializer

logger = logging.getLogger('file_manager')

class BankFileViewSet(viewsets.ModelViewSet):
    """ViewSet для работы с файлами"""
    queryset = BankFile.objects.all()
    serializer_class = BankFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    # ... остальной код ...


class FileAccessLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet для просмотра логов доступа к файлам"""
    queryset = FileAccessLog.objects.all()
    serializer_class = FileAccessLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Ограничение выборки только логами текущего пользователя"""
        # Администраторы видят все логи
        if self.request.user.is_staff:
            return FileAccessLog.objects.all()
        
        # Обычные пользователи видят только свои логи
        return FileAccessLog.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Получение статистики по доступу к файлам"""
        # Получаем выборку логов
        queryset = self.get_queryset()
        
        # Статистика по типам действий
        actions = queryset.values('action').annotate(
            count=models.Count('id')
        )
        
        # Статистика по статусам
        statuses = queryset.values('status').annotate(
            count=models.Count('id')
        )
        
        return Response({
            'actions': actions,
            'statuses': statuses,
        })