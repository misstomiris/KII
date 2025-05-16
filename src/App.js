import React from 'react';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <img src="/logo.svg" alt="Лого" />
          <h1>Система анализа киберугроз</h1>
        </div>
        <div className="user-info">
          <span className="user-name">Администратор</span>
          <div className="user-avatar">A</div>
        </div>
      </header>
      
      <div className="main-container">
        <aside className="sidebar">
          <nav>
            <ul>
              <li className="nav-item active">
                <i className="icon dashboard-icon"></i>
                <span>Панель управления</span>
              </li>
              <li className="nav-item">
                <i className="icon security-icon"></i>
                <span>События безопасности</span>
              </li>
              <li className="nav-item">
                <i className="icon files-icon"></i>
                <span>Файловый менеджер</span>
              </li>
              <li className="nav-item">
                <i className="icon ai-icon"></i>
                <span>ИИ-ассистент</span>
              </li>
              <li className="nav-item">
                <i className="icon settings-icon"></i>
                <span>Настройки</span>
              </li>
            </ul>
          </nav>
        </aside>
        
        <main className="content">
          <div className="dashboard">
            <div className="dashboard-header">
              <h2>Панель управления</h2>
              <div className="date-info">Воскресенье, 11 мая 2025</div>
            </div>
            
            <div className="stats-cards">
              <div className="stat-card">
                <div className="icon-wrapper blue">
                  <i className="icon shield-icon"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-title">События безопасности</div>
                  <div className="stat-value">127</div>
                  <div className="stat-trend positive">+5% за неделю</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="icon-wrapper red">
                  <i className="icon alert-icon"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-title">Критические события</div>
                  <div className="stat-value">3</div>
                  <div className="stat-trend negative">-2% за неделю</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="icon-wrapper green">
                  <i className="icon file-icon"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-title">Файлы</div>
                  <div className="stat-value">427</div>
                  <div className="stat-trend positive">+12% за неделю</div>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="icon-wrapper purple">
                  <i className="icon security-level-icon"></i>
                </div>
                <div className="stat-info">
                  <div className="stat-title">Уровень безопасности</div>
                  <div className="stat-value">87%</div>
                  <div className="stat-description">Высокий</div>
                </div>
              </div>
            </div>
            
            <div className="dashboard-grid">
              <div className="grid-item threats-map">
                <h3>Карта угроз</h3>
                <div className="map-container">
                  <div className="placeholder-map">
                    Интерактивная карта угроз (в разработке)
                  </div>
                </div>
              </div>
              
              <div className="grid-item recent-events">
                <h3>Последние события</h3>
                <ul className="events-list">
                  <li className="event-item">
                    <div className="event-icon warning"></div>
                    <div className="event-info">
                      <div className="event-title">Попытка входа</div>
                      <div className="event-description">Неудачная попытка входа для пользователя admin</div>
                      <div className="event-time">2 часа назад</div>
                    </div>
                  </li>
                  <li className="event-item">
                    <div className="event-icon error"></div>
                    <div className="event-info">
                      <div className="event-title">Нарушение доступа</div>
                      <div className="event-description">Попытка доступа к секретным файлам</div>
                      <div className="event-time">5 часов назад</div>
                    </div>
                  </li>
                  <li className="event-item">
                    <div className="event-icon info"></div>
                    <div className="event-info">
                      <div className="event-title">Файловая активность</div>
                      <div className="event-description">Загружено 15 новых файлов</div>
                      <div className="event-time">Вчера, 18:30</div>
                    </div>
                  </li>
                </ul>
                <button className="view-all-button">Все события</button>
              </div>
              
              <div className="grid-item ai-assistant">
                <h3>ИИ-ассистент</h3>
                <div className="ai-container">
                  <div className="ai-message">
                    <div className="ai-avatar">ИИ</div>
                    <div className="message-bubble">
                      Здравствуйте! Я ваш ИИ-ассистент по безопасности. Чем я могу вам помочь сегодня?
                    </div>
                  </div>
                  <div className="ai-input-container">
                    <input type="text" placeholder="Напишите ваш запрос..." className="ai-input" />
                    <button className="ai-send-button">Отправить</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;