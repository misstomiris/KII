import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../hooks/useTheme';
import './Navbar.module.scss';

import { 
  Menu, 
  Bell, 
  Search, 
  Moon, 
  Sun, 
  ChevronDown,
  LogOut,
  User,
  Settings,
  AlertTriangle,
  X
} from 'lucide-react';

const Navbar = ({ user, toggleSidebar, isSidebarOpen, onLogout }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  const [searchValue, setSearchValue] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);
  
  // Пример уведомлений
  const notifications = [
    {
      id: 1,
      type: 'alert',
      title: 'Обнаружена новая угроза',
      message: 'Система обнаружила попытку несанкционированного доступа',
      time: '5 минут назад',
      read: false
    },
    {
      id: 2,
      type: 'warning',
      title: 'Высокая нагрузка на систему',
      message: 'Зафиксирована повышенная активность на сервере',
      time: '1 час назад',
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Обновление системы безопасности',
      message: 'Установлены новые обновления для системы',
      time: '3 часа назад',
      read: false
    },
    {
      id: 4,
      type: 'success',
      title: 'Сканирование завершено',
      message: 'Плановое сканирование системы успешно завершено',
      time: '5 часов назад',
      read: true
    }
  ];
  
  // Обработка клика вне меню для закрытия
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Обработка поиска
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      // Здесь должна быть логика поиска
      console.log('Поиск по запросу:', searchValue);
      // Можно перенаправить на страницу с результатами поиска
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
    }
  };
  
  // Обработка уведомлений
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (!notificationsOpen && unreadNotifications > 0) {
      // Помечаем все уведомления как прочитанные при открытии меню
      setUnreadNotifications(0);
    }
  };
  
  // Обработка профиля пользователя
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Переход к настройкам пользователя
  const goToSettings = () => {
    setUserMenuOpen(false);
    navigate('/settings');
  };
  
  // Отметка уведомления как прочитанное
  const markAsRead = (id) => {
    // Здесь должна быть логика обновления статуса уведомления
    console.log('Уведомление отмечено как прочитанное:', id);
  };
  
  // Удаление уведомления
  const removeNotification = (id) => {
    // Здесь должна быть логика удаления уведомления
    console.log('Уведомление удалено:', id);
  };
  
  return (
    <header className={`navbar ${theme}`}>
      <div className="navbar-left">
        <button className="toggle-sidebar" onClick={toggleSidebar}>
          <Menu size={20} />
        </button>
        
        <div className="navbar-brand">
          <img src="/logo.svg" alt="Логотип" className="brand-logo" />
          <h1 className="brand-name">Банк Защита</h1>
        </div>
      </div>
      
      <div className="navbar-center">
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="search-input"
            />
            {searchValue && (
              <button 
                type="button" 
                className="clear-search" 
                onClick={() => setSearchValue('')}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button type="submit" className="search-button">
            Поиск
          </button>
        </form>
      </div>
      
      <div className="navbar-right">
        <div className="navbar-actions">
          <div className="action-item notifications" ref={notificationsRef}>
            <button 
              className={`action-button ${unreadNotifications > 0 ? 'has-badge' : ''}`}
              onClick={toggleNotifications}
              data-count={unreadNotifications}
            >
              <Bell size={20} />
            </button>
            
            {notificationsOpen && (
              <div className="dropdown-menu notifications-menu">
                <div className="dropdown-header">
                  <h3>Уведомления</h3>
                  {unreadNotifications > 0 && (
                    <span className="unread-count">{unreadNotifications} новых</span>
                  )}
                </div>
                
                <div className="dropdown-body">
                  {notifications.length > 0 ? (
                    <div className="notifications-list">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id} 
                          className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
                        >
                          <div className="notification-icon">
                            {notification.type === 'alert' && <AlertTriangle size={18} />}
                            {notification.type === 'warning' && <AlertTriangle size={18} />}
                            {notification.type === 'info' && <Bell size={18} />}
                            {notification.type === 'success' && <Bell size={18} />}
                          </div>
                          
                          <div className="notification-content">
                            <div className="notification-title">{notification.title}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">{notification.time}</div>
                          </div>
                          
                          <div className="notification-actions">
                            {!notification.read && (
                              <button 
                                onClick={() => markAsRead(notification.id)}
                                className="mark-read-button"
                                title="Отметить как прочитанное"
                              >
                                <span className="dot"></span>
                              </button>
                            )}
                            <button 
                              onClick={() => removeNotification(notification.id)}
                              className="remove-button"
                              title="Удалить уведомление"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="no-notifications">
                      <p>Нет новых уведомлений</p>
                    </div>
                  )}
                </div>
                
                <div className="dropdown-footer">
                  <button className="view-all-button" onClick={() => navigate('/notifications')}>
                    Просмотреть все
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="action-item theme-toggle">
            <button className="action-button" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          
          <div className="action-item user-menu" ref={userMenuRef}>
            <button className="user-menu-button" onClick={toggleUserMenu}>
              <div className="user-avatar">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div className="user-info">
                <span className="user-name">{user?.full_name || user?.username}</span>
              </div>
              <ChevronDown size={16} className="user-menu-arrow" />
            </button>
            
            {userMenuOpen && (
              <div className="dropdown-menu user-dropdown">
                <div className="dropdown-header">
                  <div className="user-dropdown-info">
                    <div className="user-dropdown-name">{user?.full_name || user?.username}</div>
                    <div className="user-dropdown-email">{user?.email}</div>
                  </div>
                </div>
                
                <div className="dropdown-body">
                  <button className="dropdown-item" onClick={goToSettings}>
                    <User size={18} />
                    <span>Профиль</span>
                  </button>
                  <button className="dropdown-item" onClick={goToSettings}>
                    <Settings size={18} />
                    <span>Настройки</span>
                  </button>
                </div>
                
                <div className="dropdown-footer">
                  <button className="logout-button" onClick={onLogout}>
                    <LogOut size={18} />
                    <span>Выход из системы</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;