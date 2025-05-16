import React from 'react';
import './LoadingScreen.module.scss';

/**
 * Компонент экрана загрузки
 * @returns {React.ReactElement} Экран загрузки
 */
const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img src="/logo.svg" alt="Логотип" className="loading-logo" />
        <h1 className="loading-title">Банк Защита</h1>
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-center"></div>
        </div>
        <p className="loading-text">Загрузка системы безопасности...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;