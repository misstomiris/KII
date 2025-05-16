import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { useTheme } from '../../hooks/useTheme';
import './LoginPage.module.scss';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password);
      showNotification('Вход выполнен успешно', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Неверный логин или пароль');
      showNotification('Ошибка входа в систему', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`login-page ${theme}`}>
      <div className="login-container">
        <div className="login-logo-container">
          <img src="/logo.svg" alt="Банковская система защиты" className="login-logo" />
          <h1 className="login-title">Система анализа киберугроз</h1>
          <p className="login-subtitle">Банковская информационная безопасность</p>
        </div>
        
        <div className="login-form-container">
          <div className="login-form-header">
            <h2>Вход в систему</h2>
            <p>Введите учетные данные для входа</p>
          </div>
          
          {error && <div className="login-error-message">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Имя пользователя</label>
              <div className="input-with-icon">
                <i className="icon icon-user"></i>
                <input
                  type="text"
                  id="username"
                  placeholder="Введите имя пользователя"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <div className="input-with-icon">
                <i className="icon icon-lock"></i>
                <input
                  type="password"
                  id="password"
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />
              </div>
            </div>
            
            <div className="form-group">
              <button
                type="submit"
                className={`login-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Выполняется вход...' : 'Войти в систему'}
              </button>
            </div>
          </form>
          
          <div className="login-footer">
            <p>© 2025 Банковская система безопасности</p>
            <p>Все права защищены</p>
          </div>
        </div>
      </div>
      
      <div className="login-background">
        <div className="cyber-elements">
          <div className="cyber-grid"></div>
          <div className="cyber-particles"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;