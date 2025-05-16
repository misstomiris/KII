import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAI } from '../../hooks/useAI';
import './SecurityRecommendations.module.scss';

import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Filter, 
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const SecurityRecommendations = ({ recommendations, loading }) => {
  const navigate = useNavigate();
  const { loadSecurityRecommendations } = useAI();
  
  const [activeFilters, setActiveFilters] = useState([]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [feedbackGiven, setFeedbackGiven] = useState({});
  
  // Доступные категории для фильтрации
  const categories = [
    { id: 'authentication', name: 'Аутентификация' },
    { id: 'encryption', name: 'Шифрование' },
    { id: 'access-control', name: 'Контроль доступа' },
    { id: 'network', name: 'Сеть' },
    { id: 'data-protection', name: 'Защита данных' },
    { id: 'api-security', name: 'Безопасность API' }
  ];
  
  // Доступные приоритеты для фильтрации
  const priorities = [
    { id: 'critical', name: 'Критический' },
    { id: 'high', name: 'Высокий' },
    { id: 'medium', name: 'Средний' },
    { id: 'low', name: 'Низкий' }
  ];
  
  // Обработка изменения фильтра
  const handleFilterChange = (filterId) => {
    setActiveFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(f => f !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };
  
  // Обработка раскрытия/скрытия элемента
  const toggleExpand = (itemId) => {
    setExpandedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  // Обработка отправки обратной связи
  const handleFeedback = (itemId, isPositive) => {
    setFeedbackGiven(prev => ({
      ...prev,
      [itemId]: isPositive ? 'positive' : 'negative'
    }));
    
    // Здесь можно добавить отправку обратной связи на бэкенд
  };
  
  // Фильтрация рекомендаций
  const filteredRecommendations = recommendations.filter(rec => {
    if (activeFilters.length === 0) return true;
    
    return activeFilters.includes(rec.category) || activeFilters.includes(rec.priority);
  });
  
  return (
    <div className="security-recommendations">
      <div className="recommendations-header">
        <h2>Рекомендации по безопасности</h2>
        <p className="recommendations-subtitle">
          ИИ-ассистент анализирует системы и выдает рекомендации по улучшению безопасности
        </p>
        
        <div className="recommendations-filters">
          <div className="filter-groups">
            <div className="filter-group">
              <div className="filter-group-title">
                <Filter size={16} />
                Категории
              </div>
              <div className="filter-options">
                {categories.map(category => (
                  <label key={category.id} className="filter-option">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(category.id)}
                      onChange={() => handleFilterChange(category.id)}
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="filter-group">
              <div className="filter-group-title">
                <AlertTriangle size={16} />
                Приоритет
              </div>
              <div className="filter-options">
                {priorities.map(priority => (
                  <label key={priority.id} className="filter-option">
                    <input
                      type="checkbox"
                      checked={activeFilters.includes(priority.id)}
                      onChange={() => handleFilterChange(priority.id)}
                    />
                    <span className={`priority-name ${priority.id}`}>{priority.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <button className="refresh-button" onClick={loadSecurityRecommendations} disabled={loading}>
            {loading ? (
              <>
                <RefreshCw size={16} className="spin-icon" />
                Обновление...
              </>
            ) : (
              <>
                <RefreshCw size={16} />
                Обновить рекомендации
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="recommendations-content">
        {loading ? (
          <div className="recommendations-loading">
            <RefreshCw size={32} className="spin-icon" />
            <p>Загрузка рекомендаций...</p>
          </div>
        ) : filteredRecommendations.length > 0 ? (
          <div className="recommendations-list">
            {filteredRecommendations.map((rec) => {
              const isExpanded = expandedItems.includes(rec.id);
              
              return (
                <div key={rec.id} className={`recommendation-item ${rec.priority}`}>
                  <div className="recommendation-header" onClick={() => toggleExpand(rec.id)}>
                    <div className="recommendation-icon-container">
                      <div className={`recommendation-icon ${rec.priority}`}>
                        {rec.priority === 'critical' || rec.priority === 'high' ? (
                          <AlertTriangle size={18} />
                        ) : (
                          <Shield size={18} />
                        )}
                      </div>
                    </div>
                    
                    <div className="recommendation-main">
                      <h3 className="recommendation-title">{rec.title}</h3>
                      <div className="recommendation-meta">
                        <span className={`recommendation-priority ${rec.priority}`}>
                          {rec.priority === 'critical' ? 'Критический' :
                           rec.priority === 'high' ? 'Высокий' :
                           rec.priority === 'medium' ? 'Средний' : 'Низкий'}
                        </span>
                        <span className="recommendation-category">{
                          categories.find(c => c.id === rec.category)?.name || rec.category
                        }</span>
                        {rec.effort && (
                          <span className="recommendation-effort">
                            Сложность: {rec.effort === 'low' ? 'Низкая' :
                                      rec.effort === 'medium' ? 'Средняя' : 'Высокая'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="recommendation-expand">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="recommendation-details">
                      <div className="recommendation-description">
                        <p>{rec.description}</p>
                      </div>
                      
                      {rec.implementation && (
                        <div className="recommendation-implementation">
                          <h4>Реализация</h4>
                          <div className="implementation-steps">
                            {rec.implementation.map((step, index) => (
                              <div key={index} className="implementation-step">
                                <div className="step-number">{index + 1}</div>
                                <div className="step-content">
                                  <p>{step}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {rec.code && (
                        <div className="recommendation-code">
                          <h4>Пример кода</h4>
                          <pre className="code-block">
                            {rec.code}
                          </pre>
                        </div>
                      )}
                      
                      {rec.references && rec.references.length > 0 && (
                        <div className="recommendation-references">
                          <h4>Дополнительные материалы</h4>
                          <ul className="reference-links">
                            {rec.references.map((ref, index) => (
                              <li key={index}>
                                <a href={ref.url} target="_blank" rel="noopener noreferrer">
                                  {ref.title} <ExternalLink size={14} />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      <div className="recommendation-actions">
                        <div className="feedback-buttons">
                          <span className="feedback-label">Полезна рекомендация?</span>
                          <div className="feedback-options">
                            <button 
                              className={`feedback-button positive ${feedbackGiven[rec.id] === 'positive' ? 'active' : ''}`}
                              onClick={() => handleFeedback(rec.id, true)}
                              disabled={feedbackGiven[rec.id] !== undefined}
                            >
                              <ThumbsUp size={16} />
                              Да
                            </button>
                            <button 
                              className={`feedback-button negative ${feedbackGiven[rec.id] === 'negative' ? 'active' : ''}`}
                              onClick={() => handleFeedback(rec.id, false)}
                              disabled={feedbackGiven[rec.id] !== undefined}
                            >
                              <ThumbsDown size={16} />
                              Нет
                            </button>
                          </div>
                        </div>
                        
                        <button 
                          className="ai-chat-button"
                          onClick={() => navigate('/ai-assistant', { 
                            state: { query: `Расскажи подробнее о рекомендации: "${rec.title}"` } 
                          })}
                        >
                          Обсудить с ИИ-ассистентом
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="no-recommendations">
            <Shield size={48} />
            <h3>Рекомендации не найдены</h3>
            <p>
              {activeFilters.length > 0 
                ? 'Попробуйте изменить фильтры или обновить список рекомендаций.' 
                : 'В данный момент ИИ-ассистент не обнаружил рекомендаций по безопасности.'}
            </p>
            <button 
              className="refresh-button"
              onClick={loadSecurityRecommendations}
              disabled={loading}
            >
              <RefreshCw size={16} />
              Обновить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityRecommendations;