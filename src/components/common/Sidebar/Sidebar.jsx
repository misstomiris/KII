import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import './Sidebar.module.scss';

import { 
  LayoutDashboard, 
  Shield, 
  FileText, 
  Settings, 
  Users, 
  LogOut,
  X,
  AlertTriangle,
  Cpu,
  FileCode,
  GanttChart
} from 'lucide-react';

const Sidebar = ({ isOpen, isMobile, onClose, currentPath }) => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  
  // Определение прав доступа для отдельных разделов
  const canViewUserManagement = userRole === 'admin';
  const canViewAccessControl = userRole === 'admin';
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
    }
  };
  
  // Проверка активности пункта меню
  const isActive = (path) => {
    if (path === '/dashboard' && currentPath === '/') {
      return true;
    }
    return currentPath.startsWith(path);
  };
  
  // Группы пунктов меню
  const mainMenuItems = [
    {
      path: '/dashboard',
      label: 'Панель мониторинга',
      icon: <LayoutDashboard size={20} />,
      access: true
    },
    {
      path: '/security',
      label: 'Безопасность',
      icon: <Shield size={20} />,
      access: true
    },
    {
      path: '/security/threats',
      label: 'Анализ угроз',
      icon: <AlertTriangle size={20} />,
      access: true
    },
    {
      path: '/ai-assistant',
      label: 'ИИ-ассистент',
      icon: <Cpu size={20} />,
      access: true
    },
    {
      path: '/files',
      label: 'Файлы и отчеты',
      icon: <FileText size={20} />,
      access: true
    }
  ];
  
  const adminMenuItems = [
    {
      path: '/users',
      label: 'Управление пользователями',
      icon: <Users size={20} />,
      access: canViewUserManagement
    },
    {
      path: '/access-control',
      label: 'Контроль доступа',
      icon: <GanttChart size={20} />,
      access: canViewAccessControl
    }
  ];
  
  const userMenuItems = [
    {
      path: '/settings',
      label: 'Настройки',
      icon: <Settings size={20} />,
      access: true
    }
  ];
  
  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {isMobile && (
        <button className="close-sidebar" onClick={onClose}>
          <X size={24} />
        </button>
      )}
      
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          <img src="/logo.svg" alt="Логотип" />
          <h1>Банк Защита</h1>
        </Link>
      </div>
      
      <div className="sidebar-user">
        <div className="user-avatar">
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.username} />
          ) : (
            <div className="avatar-placeholder">
              {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
        </div>
        <div className="user-info">
          <div className="user-name">{currentUser?.full_name || currentUser?.username}</div>
          <div className="user-role">{
            userRole === 'admin' ? 'Администратор' :
            userRole === 'security_analyst' ? 'Аналитик безопасности' :
            userRole === 'manager' ? 'Менеджер' : 'Пользователь'
          }</div>
        </div>
      </div>
      
      <nav className="sidebar-navigation">
        <div className="nav-section">
          <div className="section-title">Основное</div>
          <ul className="nav-list">
            {mainMenuItems.map((item, index) => (
              item.access && (
                <li key={index} className={isActive(item.path) ? 'active' : ''}>
                  <Link to={item.path} onClick={isMobile ? onClose : undefined}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            ))}
          </ul>
        </div>
        
        {(canViewUserManagement || canViewAccessControl) && (
          <div className="nav-section">
            <div className="section-title">Администрирование</div>
            <ul className="nav-list">
              {adminMenuItems.map((item, index) => (
                item.access && (
                  <li key={index} className={isActive(item.path) ? 'active' : ''}>
                    <Link to={item.path} onClick={isMobile ? onClose : undefined}>
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              ))}
            </ul>
          </div>
        )}
        
        <div className="nav-section">
          <div className="section-title">Пользователь</div>
          <ul className="nav-list">
            {userMenuItems.map((item, index) => (
              item.access && (
                <li key={index} className={isActive(item.path) ? 'active' : ''}>
                  <Link to={item.path} onClick={isMobile ? onClose : undefined}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            ))}
            <li>
              <button className="logout-button" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Выход</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
      
      <div className="sidebar-footer">
        <div className="version-info">Версия 1.0.0</div>
        <div className="copyright">&copy; 2025 Банк Защита</div>
      </div>
    </div>
  );
};

export default Sidebar;