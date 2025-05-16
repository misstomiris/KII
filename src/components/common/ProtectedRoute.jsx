import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingScreen from './LoadingScreen/LoadingScreen';

/**
 * Компонент для защиты роутов, требующих аутентификации
 * @param {Object} props - Свойства компонента
 * @param {boolean} props.isAuthenticated - Флаг аутентификации
 * @param {string} [props.redirectPath='/login'] - Путь для перенаправления неаутентифицированных пользователей
 * @returns {React.ReactElement} Защищенный роут
 */
const ProtectedRoute = ({ isAuthenticated, redirectPath = '/login' }) => {
  const { loading } = useAuth();
  
  // Показываем экран загрузки, пока проверяется аутентификация
  if (loading) {
    return <LoadingScreen />;
  }
  
  // Если пользователь не аутентифицирован, перенаправляем на указанный путь
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }
  
  // Если пользователь аутентифицирован, отображаем дочерние роуты
  return <Outlet />;
};

export default ProtectedRoute;