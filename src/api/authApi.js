import apiClient from './axiosConfig';

export const authApi = {
  // Вход в систему
  login: (credentials) => {
    return apiClient.post('/auth/login/', credentials);
  },
  
  // Получение информации о пользователе
  getUserInfo: () => {
    return apiClient.get('/auth/user/');
  },
  
  // Обновление профиля пользователя
  updateProfile: (profileData) => {
    return apiClient.patch('/auth/user/', profileData);
  },
  
  // Смена пароля
  changePassword: (passwordData) => {
    return apiClient.post('/auth/change-password/', passwordData);
  },
  
  // Запрос на сброс пароля
  requestPasswordReset: (email) => {
    return apiClient.post('/auth/request-reset-password/', { email });
  },
  
  // Подтверждение сброса пароля
  confirmPasswordReset: (resetData) => {
    return apiClient.post('/auth/confirm-reset-password/', resetData);
  },
};