from rest_framework import serializers
from security_analyzer.models import SecurityEvent, AccessPermission, AIAnalysisRequest
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для модели пользователя"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']

class SecurityEventSerializer(serializers.ModelSerializer):
    """Сериализатор для модели события безопасности"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = SecurityEvent
        fields = '__all__'
        read_only_fields = ['id', 'timestamp', 'ai_analysis']

class AccessPermissionSerializer(serializers.ModelSerializer):
    """Сериализатор для модели разрешения доступа"""
    user = UserSerializer(read_only=True)
    granted_by = UserSerializer(read_only=True)
    
    class Meta:
        model = AccessPermission
        fields = '__all__'
        read_only_fields = ['granted_at', 'granted_by']

class AIAnalysisRequestSerializer(serializers.ModelSerializer):
    """Сериализатор для модели запроса к AI"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = AIAnalysisRequest
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'processing_time', 'tokens_used']