import React, { createContext, useState, useCallback } from 'react';
import styles from './NotificationContext.module.scss';

// Типы уведомлений
const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Иконки для типов уведомлений
const getNotificationIcon = (type) => {
  switch (type) {
    case NOTIFICATION_TYPES.SUCCESS:
      return '✓';
    case NOTIFICATION_TYPES.ERROR:
      return '✕';
    case NOTIFICATION_TYPES.WARNING:
      return '⚠';
    case NOTIFICATION_TYPES.INFO:
      return 'ℹ';
    default:
      return 'ℹ';
  }
};

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  // Добавление нового уведомления
  const showNotification = useCallback(({ type = 'info', title, message, duration = 5000 }) => {
    const id = Date.now();
    
    // Добавляем новое уведомление
    setNotifications(prev => [
      ...prev, 
      { id, type, title, message, duration }
    ]);
    
    // Автоматически удаляем уведомление после указанной длительности
    if (duration !== Infinity) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  }, []);

  // Удаление уведомления по ID
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Очистка всех уведомлений
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Компонент уведомления
  const Notification = ({ id, type, title, message }) => {
    return (
      <div className={`${styles.notification} ${styles[type]}`}>
        <div className={styles.icon}>{getNotificationIcon(type)}</div>
        <div className={styles.content}>
          {title && <h4>{title}</h4>}
          <p>{message}</p>
        </div>
        <button 
          className={styles.closeButton} 
          onClick={() => removeNotification(id)}
          aria-label="Закрыть уведомление"
        >
          ×
        </button>
      </div>
    );
  };

  // Контейнер для уведомлений
  const NotificationsContainer = () => {
    if (notifications.length === 0) return null;
    
    return (
      <div className={styles.notificationsContainer}>
        {notifications.map(notification => (
          <Notification 
            key={notification.id} 
            {...notification} 
          />
        ))}
      </div>
    );
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        showNotification, 
        removeNotification, 
        clearAllNotifications,
        notificationTypes: NOTIFICATION_TYPES
      }}
    >
      {children}
      <NotificationsContainer />
    </NotificationContext.Provider>
  );
};