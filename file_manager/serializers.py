from rest_framework import serializers
from file_manager.models import BankFile, FileAccessLog
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    """Сериализатор для модели пользователя"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff']

class BankFileSerializer(serializers.ModelSerializer):
    """Сериализатор для модели файла"""
    owner = UserSerializer(read_only=True)
    file = serializers.FileField(write_only=True)
    
    class Meta:
        model = BankFile
        fields = ['id', 'name', 'file_type', 'sensitivity', 'file', 
                 'description', 'owner', 'uploaded_at', 'updated_at',
                 'path', 'size', 'content_type', 'checksum']
        read_only_fields = ['id', 'uploaded_at', 'updated_at', 'owner',
                           'size', 'path', 'content_type', 'checksum']

class FileAccessLogSerializer(serializers.ModelSerializer):
    """Сериализатор для модели лога доступа к файлу"""
    user = UserSerializer(read_only=True)
    file = BankFileSerializer(read_only=True)
    
    class Meta:
        model = FileAccessLog
        fields = '__all__'
        read_only_fields = ['id', 'timestamp']