import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';
import styles from './DashboardPage.module.scss';

// Компоненты
import StatCard from '../../components/common/StatCard/StatCard';
import AlertCard from '../../components/common/AlertCard/AlertCard';
import ThreatMap from '../../components/security/ThreatMap/ThreatMap';
import LatestEvents from '../../components/security/EventList/LatestEvents';
import LatestFiles from '../../components/files/FileExplorer/LatestFiles';

// API и хуки
import { securityApi } from '../../api/securityApi';
import { fileApi } from '../../api/fileApi';
import { useAuth } from '../../hooks/useAuth';

// Регистрация компонентов ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Состояния данных
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    events: { total: 0, critical: 0, high: 0, medium: 0, low: 0 },
    files: { total: 0, recent: 0 },
    security: { threatLevel: 'Низкий', score: 78 }
  });
  const [eventData, setEventData] = useState([]);
  const [fileData, setFileData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  
  // Загрузка данных
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Получение статистики событий
        const eventsStatsResponse = await securityApi.getEventStats();
        
        // Получение последних событий
        const latestEventsResponse = await securityApi.getEvents({ 
          limit: 5, 
          sort: '-timestamp' 
        });
        
        // Получение последних файлов
        const latestFilesResponse = await fileApi.getFiles({
          limit: 5,
          sort: '-uploaded_at'
        });
        
        // Получение активных предупреждений
        const alertsResponse = await securityApi.getEvents({
          severity: ['HIGH', 'CRITICAL'],
          is_resolved: false,
          limit: 3
        });
        
        // Обновление состояний
        setStats({
          events: {
            total: eventsStatsResponse.data.total || 0,
            critical: eventsStatsResponse.data.severity_counts?.CRITICAL || 0,
            high: eventsStatsResponse.data.severity_counts?.HIGH || 0,
            medium: eventsStatsResponse.data.severity_counts?.MEDIUM || 0,
            low: eventsStatsResponse.data.severity_counts?.LOW || 0
          },
          files: {
            total: latestFilesResponse.data.count || 0,
            recent: latestFilesResponse.data.recent_count || 0
          },
          security: calculateSecurityScore(eventsStatsResponse.data)
        });
        
        setEventData(latestEventsResponse.data.results || []);
        setFileData(latestFilesResponse.data.results || []);
        setAlerts(alertsResponse.data.results || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
    
    // Обновление данных каждые 5 минут
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Вычисление показателя безопасности
  const calculateSecurityScore = (data) => {
    // Пример расчета: более сложная логика будет в реальном приложении
    const criticalWeight = 10;
    const highWeight = 5;
    const mediumWeight = 2;
    
    const criticalCount = data.severity_counts?.CRITICAL || 0;
    const highCount = data.severity_counts?.HIGH || 0;
    const mediumCount = data.severity_counts?.MEDIUM || 0;
    
    const totalEvents = data.total || 1; // Избегаем деления на ноль
    
    const weightedIssues = (criticalCount * criticalWeight + 
                            highCount * highWeight + 
                            mediumCount * mediumWeight);
    
    // Инвертированная шкала: 100 - (процент проблем * 100)
    const score = Math.max(0, Math.min(100, 100 - (weightedIssues / totalEvents) * 10));
    
    // Определение уровня угрозы на основе счета
    let threatLevel = 'Низкий';
    if (score < 40) threatLevel = 'Критический';
    else if (score < 60) threatLevel = 'Высокий';
    else if (score < 80) threatLevel = 'Средний';
    
    return {
      threatLevel,
      score: Math.round(score)
    };
  };
  
  // Подготовка данных для графиков
  const prepareChartData = () => {
    // Данные для графика событий по типам
    const eventTypeData = {
      labels: ['Попытки входа', 'Нарушения доступа', 'Доступ к файлам', 'Системные предупреждения'],
      datasets: [{
        label: 'События безопасности по типам',
        data: [
          stats.events.total * 0.4, // Примерное распределение для демонстрации
          stats.events.total * 0.3,
          stats.events.total * 0.2,
          stats.events.total * 0.1
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 206, 86, 0.7)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)'
        ],
        borderWidth: 1
      }]
    };
    
    // Данные для графика серьезности событий
    const severityData = {
      labels: ['Критические', 'Высокие', 'Средние', 'Низкие'],
      datasets: [{
        label: 'События по уровню важности',
        data: [
          stats.events.critical,
          stats.events.high,
          stats.events.medium,
          stats.events.low
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        hoverOffset: 4
      }]
    };
    
    // Данные для графика активности по времени (имитация)
    const today = new Date();
    const labels = Array(7).fill().map((_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' });
    }).reverse();
    
    const activityData = {
      labels,
      datasets: [
        {
          label: 'События безопасности',
          data: [12, 19, 8, 15, 6, 13, 10].map(n => n * (Math.random() * 0.5 + 0.75)),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          tension: 0.4
        },
        {
          label: 'Файловая активность',
          data: [7, 11, 5, 8, 3, 9, 4].map(n => n * (Math.random() * 0.5 + 0.75)),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.4
        }
      ]
    };
    
    return {
      eventTypeData,
      severityData,
      activityData
    };
  };
  
  const { eventTypeData, severityData, activityData } = prepareChartData();
  
  // Обработчики навигации
  const navigateToEvents = () => navigate('/security');
  const navigateToFiles = () => navigate('/files');
  const navigateToAI = () => navigate('/ai');
  
  // Функция получения цвета счета безопасности
  const getScoreColor = (score) => {
    if (score >= 80) return '#43a047'; // Зеленый
    if (score >= 60) return '#ffa000'; // Желтый
    if (score >= 40) return '#f57c00'; // Оранжевый
    return '#e53935'; // Красный
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка данных панели управления...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.dashboard}>
      <header className={styles.dashboardHeader}>
        <h1>Панель управления</h1>
        <div className={styles.userGreeting}>
          <p>Добро пожаловать, <span>{user?.first_name || user?.username}</span></p>
          <p className={styles.currentDate}>
            {new Date().toLocaleDateString('ru-RU', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </header>
      
      <section className={styles.statsCards}>
        <StatCard 
          title="События безопасности"
          value={stats.events.total}
          icon="shield"
          trend="+5%"
          onClick={navigateToEvents}
        />
        <StatCard 
          title="Критические события"
          value={stats.events.critical}
          icon="alert"
          trend="-2%"
          color="danger"
          onClick={navigateToEvents}
        />
        <StatCard 
          title="Файлы"
          value={stats.files.total}
          icon="file"
          trend="+12%"
          onClick={navigateToFiles}
        />
        <StatCard 
          title="Уровень безопасности"
          value={`${stats.security.score}%`}
          description={stats.security.threatLevel}
          icon="security"
          color={getScoreColor(stats.security.score)}
          onClick={navigateToAI}
        />
      </section>
      
      {alerts.length > 0 && (
        <section className={styles.alerts}>
          <h2>Активные предупреждения</h2>
          <div className={styles.alertsContainer}>
            {alerts.map(alert => (
              <AlertCard 
                key={alert.id}
                title={`${alert.event_type} - ${alert.severity}`}
                description={alert.description}
                time={new Date(alert.timestamp).toLocaleString()}
                severity={alert.severity.toLowerCase()}
                onClick={() => navigate(`/security/events/${alert.id}`)}
              />
            ))}
          </div>
        </section>
      )}
      
      <div className={styles.dashboardGrid}>
        <section className={styles.securityScore}>
          <h2>Показатель безопасности</h2>
          <div className={styles.scoreContainer}>
            <div 
              className={styles.scoreCircle} 
              style={{ 
                '--score-value': `${stats.security.score}%`,
                '--score-color': getScoreColor(stats.security.score)
              }}
            >
              <span className={styles.scoreValue}>{stats.security.score}</span>
            </div>
            <div className={styles.scoreDetails}>
              <h3>Уровень угрозы: {stats.security.threatLevel}</h3>
              <p>Основано на анализе {stats.events.total} событий безопасности.</p>
              <button 
                className={styles.viewDetailsButton}
                onClick={() => navigate('/ai/analysis')}
              >
                Подробный анализ
              </button>
            </div>
          </div>
        </section>
        
        <section className={styles.threatMapSection}>
          <h2>Карта угроз</h2>
          <div className={styles.mapContainer}>
            <ThreatMap />
          </div>
        </section>
        
        <section className={styles.eventStats}>
          <h2>Распределение событий</h2>
          <div className={styles.chartContainer}>
            <Bar 
              data={eventTypeData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'События по типам'
                  }
                }
              }}
            />
          </div>
        </section>
        
        <section className={styles.severityChart}>
          <h2>Серьезность событий</h2>
          <div className={styles.chartContainer}>
            <Pie 
              data={severityData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  },
                  title: {
                    display: true,
                    text: 'Распределение по важности'
                  }
                }
              }}
            />
          </div>
        </section>
        
        <section className={styles.activityTimeline}>
          <h2>Активность за неделю</h2>
          <div className={styles.chartContainer}>
            <Line 
              data={activityData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'События и файловая активность'
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </section>
        
        <section className={styles.recentEvents}>
          <h2>Последние события</h2>
          <LatestEvents events={eventData} />
          <button 
            className={styles.viewAllButton}
            onClick={navigateToEvents}
          >
            Все события
          </button>
        </section>
        
        <section className={styles.recentFiles}>
          <h2>Последние файлы</h2>
          <LatestFiles files={fileData} />
          <button 
            className={styles.viewAllButton}
            onClick={navigateToFiles}
          >
            Все файлы
          </button>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;