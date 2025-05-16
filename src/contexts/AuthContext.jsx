import React, { createContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { useNotification } from '../hooks/useNotification';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();

  // Проверка токена при первой загрузке
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await authApi.getUserInfo();
        setUser(response.data);
      } catch (err) {
        console.error('Error verifying token:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  // Вход в систему
  const login = async (credentials) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await authApi.login(credentials);
      const { token: accessToken, user: userData } = response.data;

      setUser(userData);
      setToken(accessToken);
      localStorage.setItem('token', accessToken);
      
      showNotification({
        type: 'success',
        title: 'Успешный вход',
        message: `Добро пожаловать, ${userData.first_name || userData.username}!`
      });
      
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'Произошла ошибка при входе';
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Неверное имя пользователя или пароль';
        } else if (err.response.data && err.response.data.error) {
          errorMessage = err.response.data.error;
        }
      }
      
      setError(errorMessage);
      showNotification({
        type: 'error',
        title: 'Ошибка входа',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Выход из системы
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    
    showNotification({
      type: 'info',
      title: 'Выход из системы',
      message: 'Вы успешно вышли из системы'
    });
  }, [showNotification]);

  // Обновление профиля
  const updateProfile = async (profileData) => {
    setError(null);
    setLoading(true);
    
    try {
      const response = await authApi.updateProfile(profileData);
      setUser({ ...user, ...response.data });
      
      showNotification({
        type: 'success',
        title: 'Профиль обновлен',
        message: 'Ваш профиль успешно обновлен'
      });
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Profile update error:', err);
      
      let errorMessage = 'Произошла ошибка при обновлении профиля';
      if (err.response && err.response.data) {
        errorMessage = Object.values(err.response.data).flat().join(', ');
      }
      
      setError(errorMessage);
      showNotification({
        type: 'error',
        title: 'Ошибка обновления',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Смена пароля
  const changePassword = async (passwordData) => {
    setError(null);
    setLoading(true);
    
    try {
      await authApi.changePassword(passwordData);
      
      showNotification({
        type: 'success',
        title: 'Пароль изменен',
        message: 'Ваш пароль был успешно изменен'
      });
      
      return { success: true };
    } catch (err) {
      console.error('Password change error:', err);
      
      let errorMessage = 'Произошла ошибка при смене пароля';
      if (err.response && err.response.data) {
        errorMessage = Object.values(err.response.data).flat().join(', ');
      }
      
      setError(errorMessage);
      showNotification({
        type: 'error',
        title: 'Ошибка смены пароля',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Запрос на сброс пароля
  const requestPasswordReset = async (email) => {
    setError(null);
    setLoading(true);
    
    try {
      await authApi.requestPasswordReset(email);
      
      showNotification({
        type: 'success',
        title: 'Запрос отправлен',
        message: 'Инструкции по сбросу пароля отправлены на вашу почту'
      });
      
      return { success: true };
    } catch (err) {
      console.error('Password reset request error:', err);
      
      let errorMessage = 'Произошла ошибка при запросе сброса пароля';
      if (err.response && err.response.data) {
        errorMessage = Object.values(err.response.data).flat().join(', ');
      }
      
      setError(errorMessage);
      showNotification({
        type: 'error',
        title: 'Ошибка запроса',
        message: errorMessage
      });
      
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    requestPasswordReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};