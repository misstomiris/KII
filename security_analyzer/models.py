"""
Модели для системы анализа безопасности
"""
from django.db import models
from django.contrib.auth.models import User
import uuid

class SecurityEvent(models.Model):
    """Модель события безопасности"""
    EVENT_TYPES = (
        ('LOGIN_ATTEMPT', 'Попытка входа'),
        ('ACCESS_VIOLATION', 'Нарушение доступа'),
        ('FILE_ACCESS', 'Доступ к файлу'),
        ('CONFIGURATION_CHANGE', 'Изменение конфигурации'),
        ('SYSTEM_ALERT', 'Системное предупреждение'),
        ('SUSPICIOUS_ACTIVITY', 'Подозрительная активность'),
    )
    
    SEVERITY_LEVELS = (
        ('LOW', 'Низкий'),
        ('MEDIUM', 'Средний'),
        ('HIGH', 'Высокий'),
        ('CRITICAL', 'Критический'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    event_type = models.CharField(max_length=50, choices=EVENT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS, default='LOW')
    description = models.TextField()
    source_ip = models.GenericIPAddressField(null=True, blank=True)
    target_resource = models.CharField(max_length=255)
    timestamp = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    additional_data = models.JSONField(null=True, blank=True)
    ai_analysis = models.TextField(null=True, blank=True)
    is_resolved = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.event_type} - {self.severity} - {self.timestamp}"
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['event_type']),
            models.Index(fields=['severity']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['source_ip']),
        ]

class AccessPermission(models.Model):
    """Модель для хранения разрешений доступа"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='permissions')
    resource = models.CharField(max_length=255)
    permission_type = models.CharField(max_length=50)
    granted_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='granted_permissions')
    granted_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ('user', 'resource', 'permission_type')
        indexes = [
            models.Index(fields=['user', 'resource']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.resource} - {self.permission_type}"

class AIAnalysisRequest(models.Model):
    """Модель для хранения запросов к ИИ и ответов"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    query = models.TextField()
    response = models.TextField(null=True, blank=True)
    security_event = models.ForeignKey(SecurityEvent, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    processing_time = models.FloatField(null=True, blank=True)
    tokens_used = models.IntegerField(null=True, blank=True)
    
    def __str__(self):
        return f"AI Request: {self.id} - {self.created_at}"
    
    class Meta:
        ordering = ['-created_at']