import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import './NotFoundPage.module.scss';

const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-icon">
          <Shield size={64} />
        </div>
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Страница не найдена</h2>
        <p className="not-found-message">
          Запрашиваемая страница не существует или была удалена.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="action-button home">
            <Home size={20} />
            На главную
          </Link>
          <button onClick={() => window.history.back()} className="action-button back">
            <ArrowLeft size={20} />
            Вернуться назад
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;