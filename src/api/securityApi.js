import apiClient from './axiosConfig';

export const securityApi = {
  // События безопасности
  getEvents: (params) => {
    return apiClient.get('/security/events/', { params });
  },
  
  getEvent: (eventId) => {
    return apiClient.get(`/security/events/${eventId}/`);
  },
  
  analyzeEvent: (eventId) => {
    return apiClient.post(`/security/events/${eventId}/analyze/`);
  },
  
  getEventStats: () => {
    return apiClient.get('/security/events/stats/');
  },
  
  // Разрешения доступа
  getPermissions: (params) => {
    return apiClient.get('/security/permissions/', { params });
  },
  
  verifyAccess: (accessRequest) => {
    return apiClient.post('/security/permissions/verify_access/', accessRequest);
  },
  
  // Запросы к AI
  getAIRequests: (params) => {
    return apiClient.get('/security/ai-requests/', { params });
  },
};