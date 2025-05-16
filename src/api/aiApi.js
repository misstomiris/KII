import apiClient from './axiosConfig';

export const aiApi = {
  // Анализ с помощью ИИ
  analyzeSecurityEvent: (eventData) => {
    return apiClient.post('/security/events/analyze/', eventData);
  },
  
  // Чат с ИИ-ассистентом
  sendMessage: (message) => {
    return apiClient.post('/ai/chat/', { message });
  },
  
  // Поиск файлов с ИИ
  searchFilesWithAI: (query) => {
    return apiClient.post('/files/bank-files/search/', { query });
  },
  
  // Проверка доступа с помощью ИИ
  verifyAccessWithAI: (accessData) => {
    return apiClient.post('/security/permissions/verify_access/', accessData);
  },
};