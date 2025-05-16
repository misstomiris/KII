import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useAI } from '../../hooks/useAI';
import securityApi from '../../api/securityApi';
import ThreatSummary from '../../components/dashboard/ThreatSummary';
import SecurityScore from '../../components/dashboard/SecurityScore';
import RecentAlerts from '../../components/dashboard/RecentAlerts';
import ThreatMap from '../../components/dashboard/ThreatMap';
import StatCard from '../../components/common/StatCard/StatCard';
import AlertCard from '../../components/common/AlertCard/AlertCard';
import './DashboardPage.module.scss';

import { 
  Shield, 
  AlertTriangle, 
  Activity, 
  FileText, 
  Server, 
  Users,
  Clock
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, userRole } = useAuth();
  const { latestThreats, securityRecommendations, loading: aiLoading } = useAI();
  
  const [securitySummary, setSecuritySummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    threatCount: 0,
    criticalAlerts: 0,
    securityScore: 0,
    reportCount: 0
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const summary = await securityApi.getSecuritySummary();
        setSecuritySummary(summary);
        
        setStats({
          threatCount: summary.total_threats || 0,
          criticalAlerts: summary.critical_alerts || 0,
          securityScore: summary.security_score || 0,
          reportCount: summary.report_count || 0
        });
      } catch (error) {
        console.error('Ошибка загрузки данных дашборда:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Определяем приоритетные угрозы
  const priorityThreats = latestThreats
    .filter(threat => threat.severity === 'critical' || threat.severity === 'high')
    .slice(0, 3);

  // Обрабатываем клик по карточке безопасности
  const handleSecurityCardClick = (type) => {
    switch (type) {
      case 'threats':
        navigate('/security/threats');
        break;
      case 'alerts':
        navigate('/security/alerts');
        break;
      case 'reports':
        navigate('/security/reports');
        break;
      default:
        navigate('/security');
    }
  };

  // Проверяем доступ к настройкам безопасности
  const canAccessSecuritySettings = userRole === 'admin' || userRole === 'security_analyst';

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Панель мониторинга безопасности</h1>
        <p className="dashboard-welcome">
          Здравствуйте, {currentUser?.full_name || currentUser?.username}! 
          <span className="dashboard-date">{new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>
      </div>

      {loading || aiLoading ? (
        <div className="dashboard-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка данных безопасности...</p>
        </div>
      ) : (
        <>
          <div className="stats-container">
            <StatCard 
              title="Обнаруженные угрозы" 
              value={stats.threatCount} 
              icon={<Shield />}
              trend={securitySummary?.threat_trend || 0}
              onClick={() => handleSecurityCardClick('threats')}
            />
            <StatCard 
              title="Критические предупреждения" 
              value={stats.criticalAlerts} 
              icon={<AlertTriangle />}
              trend={securitySummary?.alerts_trend || 0}
              isNegative={true}
              onClick={() => handleSecurityCardClick('alerts')}
            />
            <StatCard 
              title="Рейтинг безопасности" 
              value={`${stats.securityScore}%`} 
              icon={<Activity />}
              trend={securitySummary?.score_trend || 0}
              onClick={() => navigate('/security')}
            />
            <StatCard 
              title="Отчеты безопасности" 
              value={stats.reportCount} 
              icon={<FileText />}
              trend={0}
              onClick={() => handleSecurityCardClick('reports')}
            />
          </div>

          <div className="dashboard-main">
            <div className="dashboard-column">
              <SecurityScore score={stats.securityScore} details={securitySummary?.score_details || []} />
              
              <div className="recent-activity-card">
                <div className="card-header">
                  <h3><Clock size={18} /> Последняя активность</h3>
                </div>
                <div className="activity-list">
                  {securitySummary?.recent_activities?.map((activity, index) => (
                    <div key={index} className="activity-item">
                      <div className={`activity-icon ${activity.type}`}>
                        <i className={`icon-${activity.type}`}></i>
                      </div>
                      <div className="activity-content">
                        <p className="activity-text">{activity.description}</p>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dashboard-column">
              <div className="threat-map-wrapper">
                <ThreatMap threatData={securitySummary?.threat_map_data || []} />
              </div>
              
              <div className="threats-container">
                <div className="card-header with-action">
                  <h3><AlertTriangle size={18} /> Приоритетные угрозы</h3>
                  <button className="view-all-btn" onClick={() => navigate('/security/threats')}>
                    Все угрозы
                  </button>
                </div>
                <div className="threat-cards">
                  {priorityThreats.map((threat) => (
                    <AlertCard
                      key={threat.id}
                      title={threat.name}
                      description={threat.description}
                      severity={threat.severity}
                      time={threat.detected_at}
                      icon={<AlertTriangle />}
                      onClick={() => navigate(`/security/threats/${threat.id}`)}
                    />
                  ))}
                  {priorityThreats.length === 0 && (
                    <div className="no-data-message">
                      <p>Приоритетные угрозы отсутствуют</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="dashboard-column">
              <div className="recommendations-card">
                <div className="card-header">
                  <h3><Shield size={18} /> Рекомендации ИИ-ассистента</h3>
                </div>
                <div className="recommendations-list">
                  {securityRecommendations.slice(0, 5).map((rec, index) => (
                    <div key={index} className="recommendation-item">
                      <div className={`recommendation-priority ${rec.priority}`}>
                        {rec.priority}
                      </div>
                      <p className="recommendation-text">{rec.text}</p>
                      <button 
                        className="action-btn"
                        onClick={() => navigate('/ai-assistant', { state: { recommendation: rec } })}
                      >
                        Подробнее
                      </button>
                    </div>
                  ))}
                  {securityRecommendations.length === 0 && (
                    <div className="no-data-message">
                      <p>Рекомендации отсутствуют</p>
                    </div>
                  )}
                </div>
                <div className="card-footer">
                  <button className="ai-assistant-btn" onClick={() => navigate('/ai-assistant')}>
                    Открыть ИИ-ассистент
                  </button>
                </div>
              </div>

              <div className="system-health-card">
                <div className="card-header">
                  <h3><Server size={18} /> Состояние системы</h3>
                </div>
                <div className="system-metrics">
                  {securitySummary?.system_health?.map((metric, index) => (
                    <div key={index} className="metric">
                      <div className="metric-name">{metric.name}</div>
                      <div className="metric-value-bar">
                        <div 
                          className={`metric-value ${metric.status}`} 
                          style={{ width: `${metric.value}%` }}
                        >
                          {metric.value}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {canAccessSecuritySettings && (
                <div className="quick-actions-card">
                  <div className="card-header">
                    <h3><Users size={18} /> Быстрые действия</h3>
                  </div>
                  <div className="quick-actions">
                    <button 
                      className="action-button scan"
                      onClick={() => navigate('/security', { state: { action: 'scan' } })}
                    >
                      Запустить сканирование
                    </button>
                    <button 
                      className="action-button report"
                      onClick={() => navigate('/security/reports', { state: { action: 'new' } })}
                    >
                      Создать отчет
                    </button>
                    <button 
                      className="action-button analyze"
                      onClick={() => navigate('/ai-assistant', { state: { action: 'analyze' } })}
                    >
                      Анализ ИИ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;