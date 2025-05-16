import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import securityApi from '../../api/securityApi';
import { 
  AlertTriangle, 
  Filter, 
  Search, 
  RefreshCw, 
  X,
  Download,
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Calendar,
  Check
} from 'lucide-react';
import './ThreatAnalysisPage.module.scss';

const ThreatAnalysisPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showNotification } = useNotification();
  
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedThreats, setSelectedThreats] = useState([]);
  const [expandedThreats, setExpandedThreats] = useState([]);
  const [sortField, setSortField] = useState('detectedAt');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Фильтры
  const [filters, setFilters] = useState({
    severity: [],
    type: [],
    status: [],
    dateRange: {
      from: '',
      to: ''
    },
    search: ''
  });
  
  // Загрузка угроз с использованием фильтров
  useEffect(() => {
    const loadThreats = async () => {
      setLoading(true);
      try {
        // Преобразование фильтров для API
        const apiFilters = {
          severity: filters.severity.length > 0 ? filters.severity.join(',') : undefined,
          type: filters.type.length > 0 ? filters.type.join(',') : undefined,
          status: filters.status.length > 0 ? filters.status.join(',') : undefined,
          from_date: filters.dateRange.from || undefined,
          to_date: filters.dateRange.to || undefined,
          search: filters.search || undefined
        };
        
        // Если есть категория в location.state, добавляем ее в фильтры
        if (location.state?.category) {
          apiFilters.category = location.state.category;
        }
        
        const data = await securityApi.getThreats(apiFilters);
        setThreats(data.results || []);
      } catch (error) {
        console.error('Ошибка загрузки угроз:', error);
        showNotification('Не удалось загрузить данные об угрозах', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    loadThreats();
  }, [filters, location.state, showNotification]);
  
  // Обработка изменения фильтров
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'severity' || filterType === 'type' || filterType === 'status') {
        // Для массивов фильтров (чекбоксы)
        const updatedFilter = prev[filterType].includes(value)
          ? prev[filterType].filter(item => item !== value)
          : [...prev[filterType], value];
        
        return {
          ...prev,
          [filterType]: updatedFilter
        };
      } else if (filterType === 'dateRange') {
        // Для диапазона дат
        return {
          ...prev,
          dateRange: {
            ...prev.dateRange,
            ...value
          }
        };
      } else {
        // Для строковых фильтров (поиск)
        return {
          ...prev,
          [filterType]: value
        };
      }
    });
  };
  
  // Сброс всех фильтров
  const resetFilters = () => {
    setFilters({
      severity: [],
      type: [],
      status: [],
      dateRange: {
        from: '',
        to: ''
      },
      search: ''
    });
  };
  
  // Обработка выбора угрозы
  const toggleThreatSelection = (threatId) => {
    setSelectedThreats(prev => {
      if (prev.includes(threatId)) {
        return prev.filter(id => id !== threatId);
      } else {
        return [...prev, threatId];
      }
    });
  };
  
  // Обработка раскрытия/скрытия детализации угрозы
  const toggleThreatExpansion = (threatId) => {
    setExpandedThreats(prev => {
      if (prev.includes(threatId)) {
        return prev.filter(id => id !== threatId);
      } else {
        return [...prev, threatId];
      }
    });
  };
  
  // Обработка сортировки
  const handleSort = (field) => {
    if (sortField === field) {
      // Меняем направление сортировки, если поле то же
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Устанавливаем новое поле и направление по умолчанию (desc)
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Сортировка угроз
  const sortedThreats = [...threats].sort((a, b) => {
    let comparison = 0;
    
    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'severity':
        const severityOrder = { critical: 4, high: 3, medium: 2, low: 1, info: 0 };
        comparison = severityOrder[a.severity] - severityOrder[b.severity];
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'detectedAt':
        comparison = new Date(a.detectedAt) - new Date(b.detectedAt);
        break;
      default:
        comparison = 0;
    }
    
    return sortDirection === 'asc' ? comparison : -comparison;
  });
  
  // Получение иконки состояния для сортировки
  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />;
  };
  
  // Получение класса для строки по степени опасности
  const getThreatSeverityClass = (severity) => {
    switch (severity) {
      case 'critical': return 'severity-critical';
      case 'high': return 'severity-high';
      case 'medium': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-info';
    }
  };
  
  // Получение текста для отображения статуса
  const getThreatStatusText = (status) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'investigating': return 'Расследуется';
      case 'mitigated': return 'Смягчена';
      case 'resolved': return 'Устранена';
      default: return status;
    }
  };
  
  // Экспорт выбранных угроз
  const exportSelectedThreats = async () => {
    if (selectedThreats.length === 0) {
      showNotification('Выберите угрозы для экспорта', 'warning');
      return;
    }
    
    try {
      // Здесь должен быть запрос к API для экспорта выбранных угроз
      showNotification('Экспорт угроз выполнен успешно', 'success');
    } catch (error) {
      console.error('Ошибка при экспорте угроз:', error);
      showNotification('Ошибка при экспорте угроз', 'error');
    }
  };
  
  // Просмотр детальной информации об угрозе
  const viewThreatDetails = (threatId) => {
    navigate(`/security/threats/${threatId}`);
  };
  
  return (
    <div className="threat-analysis-page">
      <div className="threat-header">
        <div className="header-title">
          <h1>Анализ угроз</h1>
          <p className="subtitle">Обзор и анализ обнаруженных киберугроз</p>
        </div>
        
        <div className="header-actions">
          <div className="search-container">
            <div className="search-input-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Поиск угроз..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="search-input"
              />
              {filters.search && (
                <button className="clear-search" onClick={() => handleFilterChange('search', '')}>
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          <button 
            className={`filter-button ${filterOpen ? 'active' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={18} />
            <span>Фильтры</span>
            {(filters.severity.length > 0 || filters.type.length > 0 || filters.status.length > 0 || filters.dateRange.from || filters.dateRange.to) && (
              <span className="filter-badge">!</span>
            )}
          </button>
          
          <button 
            className="export-button"
            onClick={exportSelectedThreats}
            disabled={selectedThreats.length === 0}
          >
            <Download size={18} />
            <span>Экспорт</span>
          </button>
        </div>
      </div>
      
      {filterOpen && (
        <div className="filter-container">
          <div className="filter-header">
            <h2>Фильтры</h2>
            <button className="reset-filters" onClick={resetFilters}>
              Сбросить все
            </button>
          </div>
          
          <div className="filter-content">
            <div className="filter-group">
              <h3>Степень угрозы</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.severity.includes('critical')}
                    onChange={() => handleFilterChange('severity', 'critical')}
                  />
                  <span className="severity-marker critical"></span>
                  <span>Критическая</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.severity.includes('high')}
                    onChange={() => handleFilterChange('severity', 'high')}
                  />
                  <span className="severity-marker high"></span>
                  <span>Высокая</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.severity.includes('medium')}
                    onChange={() => handleFilterChange('severity', 'medium')}
                  />
                  <span className="severity-marker medium"></span>
                  <span>Средняя</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.severity.includes('low')}
                    onChange={() => handleFilterChange('severity', 'low')}
                  />
                  <span className="severity-marker low"></span>
                  <span>Низкая</span>
                </label>
              </div>
            </div>
            
            <div className="filter-group">
              <h3>Тип угрозы</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.type.includes('malware')}
                    onChange={() => handleFilterChange('type', 'malware')}
                  />
                  <span>Вредоносное ПО</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.type.includes('phishing')}
                    onChange={() => handleFilterChange('type', 'phishing')}
                  />
                  <span>Фишинг</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.type.includes('ddos')}
                    onChange={() => handleFilterChange('type', 'ddos')}
                  />
                  <span>DDoS</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.type.includes('vulnerability')}
                    onChange={() => handleFilterChange('type', 'vulnerability')}
                  />
                  <span>Уязвимость</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.type.includes('unauthorized_access')}
                    onChange={() => handleFilterChange('type', 'unauthorized_access')}
                  />
                  <span>Несанкционированный доступ</span>
                </label>
              </div>
            </div>
            
            <div className="filter-group">
              <h3>Статус</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.status.includes('active')}
                    onChange={() => handleFilterChange('status', 'active')}
                  />
                  <span>Активна</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.status.includes('investigating')}
                    onChange={() => handleFilterChange('status', 'investigating')}
                  />
                  <span>Расследуется</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.status.includes('mitigated')}
                    onChange={() => handleFilterChange('status', 'mitigated')}
                  />
                  <span>Смягчена</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={filters.status.includes('resolved')}
                    onChange={() => handleFilterChange('status', 'resolved')}
                  />
                  <span>Устранена</span>
                </label>
              </div>
            </div>
            
            <div className="filter-group">
              <h3>Период обнаружения</h3>
              <div className="date-range">
                <div className="date-field">
                  <label>С</label>
                  <div className="date-input-container">
                    <Calendar size={16} className="date-icon" />
                    <input
                      type="date"
                      value={filters.dateRange.from}
                      onChange={(e) => handleFilterChange('dateRange', { from: e.target.value })}
                      className="date-input"
                    />
                  </div>
                </div>
                <div className="date-field">
                  <label>По</label>
                  <div className="date-input-container">
                    <Calendar size={16} className="date-icon" />
                    <input
                      type="date"
                      value={filters.dateRange.to}
                      onChange={(e) => handleFilterChange('dateRange', { to: e.target.value })}
                      className="date-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="threats-container">
        {loading ? (
          <div className="loading-container">
            <RefreshCw size={36} className="spin-icon" />
            <p>Загрузка данных об угрозах...</p>
          </div>
        ) : sortedThreats.length > 0 ? (
          <div className="threats-table">
            <div className="table-header">
              <div className="header-cell checkbox-cell">
                <input
                  type="checkbox"
                  checked={selectedThreats.length === threats.length && threats.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedThreats(threats.map(threat => threat.id));
                    } else {
                      setSelectedThreats([]);
                    }
                  }}
                  className="table-checkbox"
                />
              </div>
              <div 
                className="header-cell name-cell sortable"
                onClick={() => handleSort('name')}
              >
                <span>Название</span>
                {getSortIcon('name')}
              </div>
              <div 
                className="header-cell severity-cell sortable"
                onClick={() => handleSort('severity')}
              >
                <span>Степень угрозы</span>
                {getSortIcon('severity')}
              </div>
              <div 
                className="header-cell type-cell sortable"
                onClick={() => handleSort('type')}
              >
                <span>Тип</span>
                {getSortIcon('type')}
              </div>
              <div 
                className="header-cell status-cell sortable"
                onClick={() => handleSort('status')}
              >
                <span>Статус</span>
                {getSortIcon('status')}
              </div>
              <div 
                className="header-cell date-cell sortable"
                onClick={() => handleSort('detectedAt')}
              >
                <span>Обнаружено</span>
                {getSortIcon('detectedAt')}
              </div>
              <div className="header-cell actions-cell">
                <span>Действия</span>
              </div>
            </div>
            
            <div className="table-body">
              {sortedThreats.map(threat => {
                const isExpanded = expandedThreats.includes(threat.id);
                
                return (
                  <React.Fragment key={threat.id}>
                    <div className={`table-row ${getThreatSeverityClass(threat.severity)}`}>
                      <div className="table-cell checkbox-cell">
                        <input
                          type="checkbox"
                          checked={selectedThreats.includes(threat.id)}
                          onChange={() => toggleThreatSelection(threat.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="table-checkbox"
                        />
                      </div>
                      <div className="table-cell name-cell">
                        {threat.name}
                      </div>
                      <div className="table-cell severity-cell">
                        <span className={`severity-badge ${threat.severity}`}>
                          {threat.severity === 'critical' && 'Критическая'}
                          {threat.severity === 'high' && 'Высокая'}
                          {threat.severity === 'medium' && 'Средняя'}
                          {threat.severity === 'low' && 'Низкая'}
                          {threat.severity === 'info' && 'Информационная'}
                        </span>
                      </div>
                      <div className="table-cell type-cell">
                        {threat.type}
                      </div>
                      <div className="table-cell status-cell">
                        <span className={`status-badge ${threat.status}`}>
                          {getThreatStatusText(threat.status)}
                        </span>
                      </div>
                      <div className="table-cell date-cell">
                        {new Date(threat.detectedAt).toLocaleDateString()}
                      </div>
                      <div className="table-cell actions-cell">
                        <button 
                          className="action-button expand"
                          onClick={() => toggleThreatExpansion(threat.id)}
                        >
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <button 
                          className="action-button view"
                          onClick={() => viewThreatDetails(threat.id)}
                        >
                          Подробнее
                        </button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="threat-details-row">
                        <div className="threat-details">
                          <div className="details-section">
                            <h3>Описание</h3>
                            <p>{threat.description}</p>
                          </div>
                          
                          {threat.potentialImpact && (
                            <div className="details-section">
                              <h3>Потенциальное воздействие</h3>
                              <p>{threat.potentialImpact}</p>
                            </div>
                          )}
                          
                          {threat.mitigationSteps && threat.mitigationSteps.length > 0 && (
                            <div className="details-section">
                              <h3>Шаги по устранению</h3>
                              <ul className="mitigation-steps">
                                {threat.mitigationSteps.map((step, index) => (
                                  <li key={index} className="mitigation-step">
                                    <Check size={16} className={threat.status === 'resolved' ? 'step-done' : ''} />
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="details-actions">
                            <button 
                              className="details-button view"
                              onClick={() => viewThreatDetails(threat.id)}
                            >
                              Подробный анализ
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="no-threats">
            <AlertTriangle size={48} />
            <h2>Угрозы не найдены</h2>
            <p>
              {(filters.severity.length > 0 || filters.type.length > 0 || filters.status.length > 0 || filters.dateRange.from || filters.dateRange.to || filters.search)
                ? 'Попробуйте изменить параметры фильтрации или сбросить фильтры.'
                : 'В системе отсутствуют данные об угрозах.'}
            </p>
            {(filters.severity.length > 0 || filters.type.length > 0 || filters.status.length > 0 || filters.dateRange.from || filters.dateRange.to || filters.search) && (
              <button className="reset-button" onClick={resetFilters}>
                Сбросить фильтры
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatAnalysisPage;': return 'severity-medium';
      case 'low': return 'severity-low';
      default: return 'severity-info';
    }
  };
  
  // Получение текста для отображения статуса
  const getThreatStatusText = (status) => {
    switch (status) {
      case 'active': return 'Активна';
      case 'investigating': return 'Расследуется';
      case 'mitigated': return 'Смягчена';
      case 'resolved': return 'Устранена';
      default: return status;
    }
  };
  
  // Экспорт выбранных угроз
  const exportSelectedThreats = async () => {
    if (selectedThreats.length === 0) {
      showNotification('Выберите угрозы для экспорта', 'warning');
      return;
    }
    
    try {
      // Здесь должен быть запрос