"""
Модели для управления файлами
"""
from django.db import models
from django.contrib.auth.models import User
import uuid
import os

def file_upload_path(instance, filename):
    """Функция для определения пути загрузки файла"""
    # Создаём путь на основе ID пользователя и текущей даты
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('uploads', str(instance.owner.id), filename)

class BankFile(models.Model):
    """Модель для хранения информации о файлах"""
    FILE_TYPES = (
        ('DOCUMENT', 'Документ'),
        ('REPORT', 'Отчёт'),
        ('LOG', 'Лог'),
        ('CONFIGURATION', 'Конфигурация'),
        ('DATABASE', 'База данных'),
        ('BACKUP', 'Резервная копия'),
        ('OTHER', 'Другое'),
    )
    
    SENSITIVITY_LEVELS = (
        ('PUBLIC', 'Публичный'),
        ('INTERNAL', 'Внутренний'),
        ('CONFIDENTIAL', 'Конфиденциальный'),
        ('RESTRICTED', 'Ограниченный доступ'),
        ('SECRET', 'Секретный'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)
    sensitivity = models.CharField(max_length=20, choices=SENSITIVITY_LEVELS, default='INTERNAL')
    file = models.FileField(upload_to=file_upload_path)
    description = models.TextField(blank=True, null=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_files')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    path = models.CharField(max_length=500)
    size = models.BigIntegerField()  # размер в байтах
    content_type = models.CharField(max_length=100)
    checksum = models.CharField(max_length=64)  # SHA-256 хеш файла
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-uploaded_at']
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['file_type']),
            models.Index(fields=['sensitivity']),
            models.Index(fields=['owner']),
        ]

class FileAccessLog(models.Model):
    """Модель для логирования доступа к файлам"""
    ACTION_TYPES = (
        ('VIEW', 'Просмотр'),
        ('DOWNLOAD', 'Скачивание'),
        ('UPLOAD', 'Загрузка'),
        ('UPDATE', 'Обновление'),
        ('DELETE', 'Удаление'),
        ('PERMISSION_CHANGE', 'Изменение разрешений'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    file = models.ForeignKey(BankFile, on_delete=models.CASCADE, related_name='access_logs')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    status = models.CharField(max_length=20)  # SUCCESS, DENIED, ERROR
    details = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.action} - {self.file.name}"
    
    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['file']),
            models.Index(fields=['user']),
            models.Index(fields=['action']),
            models.Index(fields=['timestamp']),
            models.Index(fields=['status']),
        ]