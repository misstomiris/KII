import React, { createContext, useState, useCallback, useEffect } from 'react';
import authApi from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Проверка состояния аутентификации при загрузке
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setLoading(false);
        return;
      }

      const userData = await authApi.getCurrentUser();
      setCurrentUser(userData);
      setUserRole(userData.role);
      setUserPermissions(userData.permissions || []);
      setIsAuthenticated(true);
      
      // Загрузка доступных отделов
      const departmentsData = await authApi.getDepartments();
      setDepartments(departmentsData);
    } catch (error) {
      console.error('Ошибка проверки аутентификации:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  }, []);

  // Вход в систему
  const login = useCallback(async (username, password) => {
    setLoading(true);
    setAuthError(null);
    
    try {
      const { user, access_token, refresh_token } = await authApi.login(username, password);
      
      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      
      setCurrentUser(user);
      setUserRole(user.role);
      setUserPermissions(user.permissions || []);
      setIsAuthenticated(true);
      
      // Загрузка доступных отделов
      const departmentsData = await authApi.getDepartments();
      setDepartments(departmentsData);
      
      return user;
    } catch (error) {
      console.error('Ошибка входа:', error);
      setAuthError(error.message || 'Ошибка входа в систему');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Выход из системы
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setCurrentUser(null);
      setUserRole(null);
      setUserPermissions([]);
      setIsAuthenticated(false);
    }
  }, []);

  // Проверка доступа пользователя к ресурсу
  const checkAccess = useCallback(async (resourceType, resourceId) => {
    try {
      const response = await authApi.checkAccess(resourceType, resourceId);
      return response.hasAccess;
    } catch (error) {
      console.error('Ошибка проверки доступа:', error);
      return false;
    }
  }, []);

  // Проверка наличия разрешения у пользователя
  const hasPermission = useCallback((permission) => {
    return userPermissions.includes(permission);
  }, [userPermissions]);

  // Проверка доступа к отделу
  const hasDepartmentAccess = useCallback((departmentId) => {
    if (userRole === 'admin') return true;
    if (!currentUser || !currentUser.departments) return false;
    return currentUser.departments.includes(departmentId);
  }, [currentUser, userRole]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const value = {
    currentUser,
    userRole,
    departments,
    isAuthenticated,
    loading,
    authError,
    login,
    logout,
    checkAuth,
    checkAccess,
    hasPermission,
    hasDepartmentAccess
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;