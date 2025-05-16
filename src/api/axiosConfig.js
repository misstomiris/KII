import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена авторизации
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Если ошибка 401 и не на странице входа
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      // Очищаем токен
      localStorage.removeItem('token');
      // Перенаправляем на страницу входа
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;