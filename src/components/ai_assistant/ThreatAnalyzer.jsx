import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAI } from '../../hooks/useAI';
import { useAuth } from '../../hooks/useAuth';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ThreatAnalyzer.module.scss';

import { 
  AlertTriangle, 
  Shield, 
  Lock, 
  FileText, 
  ArrowRight,
  ExternalLink,
  Download,
  RefreshCw
} from 'lucide-react';

const ThreatAnalyzer = ({ analysisResult, isAnalyzing }) => {
  const navigate = useNavigate();
  const { askAssistant } = useAI();
  const { hasPermission } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [aiExplanation, setAiExplanation] = useState('');
  const [isLoadingExplanation, setIsLoadingExplanation] = useState(false);
  const [threatTimeData, setThreatTimeData] = useState([]);
  
  // Сгенерировать данные для графика (обычно приходят с бэкенда)
  useEffect(() => {
    if (analysisResult) {
      // Пример генерации временных данных для графика
      const timeData = [];
      const now = new Date();
      
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        timeData.push({
          date: date.toISOString().split('T')[0],
          threats: Math.floor(Math.random() * 10) + (analysisResult.threatLevel === 'high' ? 15 : analysisResult.threatLevel === 'medium' ? 8 : 2)
        });
      }
      
      setThreatTimeData(timeData);
    }
  }, [analysisResult]);
  
  // Запрос объяснения от ИИ-ассистента
  const requestAIExplanation = async () => {
    if (!analysisResult) return;
    
    setIsLoadingExplanation(true);
    
    try {
      const query = `Проанализируй следующую угрозу и дай подробное объяснение: ${analysisResult.name}. 
        Тип угрозы: ${analysisResult.type}. 
        Уровень опасности: ${analysisResult.threatLevel}. 
        Потенциальные последствия: ${analysisResult.potentialImpact}. 
        Объясни простым языком, в чем заключается угроза и как можно защититься от нее.`;
      
      const explanation = await askAssistant(query);
      setAiExplanation(explanation);
    } catch (error) {
      console.error('Ошибка при запросе объяснения:', error);
      setAiExplanation('Не удалось получить объяснение от ИИ-ассистента. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoadingExplanation(false);
    }
  };
  
  // Генерация индикатора уровня угрозы
  const renderThreatLevelIndicator = (level) => {
    const levels = {
      critical: { color: 'var(--threat-critical)', label: 'Критический' },
      high: { color: 'var(--threat-high)', label: 'Высокий' },
      medium: { color: 'var(--threat-medium)', label: 'Средний' },
      low: { color: 'var(--threat-low)', label: 'Низкий' },
      info: { color: 'var(--threat-info)', label: 'Информационный' }
    };
    
    const threatInfo = levels[level] || levels.info;
    
    return (
      <div className="threat-level-indicator">
        <div className="indicator-label">{threatInfo.label}</div>
        <div className="indicator-bar">
          <div 
            className="indicator-value" 
            style={{ 
              width: level === 'critical' ? '100%' : 
                     level === 'high' ? '75%' : 
                     level === 'medium' ? '50%' : 
                     level === 'low' ? '25%' : '10%',
              backgroundColor: threatInfo.color
            }}
          ></div>
        </div>
      </div>
    );
  };
  
  if (isAnalyzing) {
    return (
      <div className="threat-analyzer analyzing">
        <div className="analyzer-loading">
          <RefreshCw size={40} className="spin-icon" />
          <h3>Анализ файла...</h3>
          <p>Пожалуйста, подождите. ИИ-ассистент анализирует загруженный файл на наличие угроз.</p>
        </div>
      </div>
    );
  }
  
  if (!analysisResult) {
    return (
      <div className="threat-analyzer empty-state">
        <div className="empty-state-content">
          <div className="icon-container">
            <Shield size={48} />
          </div>
          <h3>Анализатор киберугроз</h3>
          <p>Загрузите файл для анализа, чтобы получить детальную информацию о потенциальных угрозах.</p>
          <div className="file-types">
            <div className="file-type-badge">LOG</div>
            <div className="file-type-badge">TXT</div>
            <div className="file-type-badge">CSV</div>
            <div className="file-type-badge">JSON</div>
            <div className="file-type-badge">XML</div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="threat-analyzer">
      <div className="analyzer-header">
        <div className="threat-title">
          <h2>{analysisResult.name}</h2>
          <div className={`threat-badge ${analysisResult.threatLevel}`}>
            {renderThreatLevelIndicator(analysisResult.threatLevel)}
          </div>
        </div>
        
        <div className="analyzer-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Обзор
          </button>
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Детали
          </button>
          <button 
            className={`tab-button ${activeTab === 'mitigation' ? 'active' : ''}`}
            onClick={() => setActiveTab('mitigation')}
          >
            Меры защиты
          </button>
          <button 
            className={`tab-button ${activeTab === 'explanation' ? 'active' : ''}`}
            onClick={() => { 
              setActiveTab('explanation');
              if (!aiExplanation) {
                requestAIExplanation();
              }
            }}
          >
            ИИ-объяснение
          </button>
        </div>
      </div>
      
      <div className="analyzer-content">
        {activeTab === 'overview' && (
          <div className="tab-content overview-tab">
            <div className="overview-grid">
              <div className="overview-card threat-summary">
                <div className="card-header">
                  <h3><AlertTriangle size={18} /> Сводка угрозы</h3>
                </div>
                <div className="card-content">
                  <div className="summary-item">
                    <div className="summary-label">Тип угрозы</div>
                    <div className="summary-value">{analysisResult.type}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Уровень опасности</div>
                    <div className="summary-value">{
                      analysisResult.threatLevel === 'critical' ? 'Критический' :
                      analysisResult.threatLevel === 'high' ? 'Высокий' :
                      analysisResult.threatLevel === 'medium' ? 'Средний' :
                      analysisResult.threatLevel === 'low' ? 'Низкий' : 'Информационный'
                    }</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Обнаружено</div>
                    <div className="summary-value">{analysisResult.detectedAt || new Date().toLocaleString()}</div>
                  </div>
                  <div className="summary-item">
                    <div className="summary-label">Статус</div>
                    <div className="summary-value">{analysisResult.status || 'Активная'}</div>
                  </div>
                </div>
              </div>
              
              <div className="overview-card potential-impact">
                <div className="card-header">
                  <h3><Lock size={18} /> Потенциальное воздействие</h3>
                </div>
                <div className="card-content">
                  <p className="impact-description">
                    {analysisResult.potentialImpact}
                  </p>
                  
                  <div className="impact-categories">
                    {analysisResult.impactCategories?.map((category, index) => (
                      <div key={index} className="impact-category">
                        <div className="category-name">{category.name}</div>
                        <div className="category-bar">
                          <div 
                            className="category-value"
                            style={{ width: `${category.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="overview-chart-container">
              <div className="chart-header">
                <h3>Динамика обнаружения угроз</h3>
              </div>
              <div className="chart-content">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={threatTimeData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="threats" 
                      stroke="#1e88e5" 
                      activeDot={{ r: 8 }} 
                      name="Количество угроз"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="action-buttons">
              <button className="action-button report">
                <FileText size={16} />
                Создать отчет
              </button>
              <button className="action-button download">
                <Download size={16} />
                Скачать результаты
              </button>
              <button className="action-button view-more" onClick={() => setActiveTab('details')}>
                <ArrowRight size={16} />
                Подробнее
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'details' && (
          <div className="tab-content details-tab">
            <div className="details-section">
              <h3>Подробная информация</h3>
              <div className="details-content">
                <p className="details-description">
                  {analysisResult.description}
                </p>
                
                <div className="details-table">
                  <div className="table-header">
                    <div className="header-cell">Параметр</div>
                    <div className="header-cell">Значение</div>
                  </div>
                  {analysisResult.details?.map((detail, index) => (
                    <div key={index} className="table-row">
                      <div className="row-cell">{detail.name}</div>
                      <div className="row-cell">{detail.value}</div>
                    </div>
                  ))}
                </div>
                
                <div className="source-references">
                  <h4>Источники и ссылки</h4>
                  <ul className="reference-list">
                    {analysisResult.references?.map((ref, index) => (
                      <li key={index} className="reference-item">
                        <a href={ref.url} target="_blank" rel="noopener noreferrer">
                          {ref.title} <ExternalLink size={14} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                
                {analysisResult.technicalDetails && (
                  <div className="technical-details">
                    <h4>Технические детали</h4>
                    <pre className="technical-code">
                      {analysisResult.technicalDetails}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'mitigation' && (
          <div className="tab-content mitigation-tab">
            <div className="mitigation-section">
              <h3>Рекомендуемые меры защиты</h3>
              <div className="mitigation-content">
                <p className="mitigation-description">
                  {analysisResult.mitigationOverview}
                </p>
                
                <div className="mitigation-steps">
                  {analysisResult.mitigationSteps?.map((step, index) => (
                    <div key={index} className="mitigation-step">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-content">
                        <h4 className="step-title">{step.title}</h4>
                        <p className="step-description">{step.description}</p>
                        {step.code && (
                          <pre className="step-code">{step.code}</pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {analysisResult.additionalMeasures && (
                  <div className="additional-measures">
                    <h4>Дополнительные меры</h4>
                    <ul className="measures-list">
                      {analysisResult.additionalMeasures.map((measure, index) => (
                        <li key={index} className="measure-item">{measure}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'explanation' && (
          <div className="tab-content explanation-tab">
            <div className="explanation-section">
              <h3>Объяснение от ИИ-ассистента</h3>
              
              {isLoadingExplanation ? (
                <div className="explanation-loading">
                  <RefreshCw size={24} className="spin-icon" />
                  <p>Получение объяснения от ИИ-ассистента...</p>
                </div>
              ) : (
                <div className="explanation-content">
                  {aiExplanation ? (
                    <div className="ai-explanation">
                      <div className="explanation-icon">
                        <Shield size={24} />
                      </div>
                      <div className="explanation-text">
                        {aiExplanation.split('\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="no-explanation">
                      <p>Нажмите кнопку ниже, чтобы получить объяснение от ИИ-ассистента.</p>
                      <button className="request-button" onClick={requestAIExplanation}>
                        Запросить объяснение
                      </button>
                    </div>
                  )}
                </div>
              )}
              
              <div className="explanation-footer">
                <button className="chat-button" onClick={() => navigate('/ai-assistant', { state: { query: `Расскажи подробнее об угрозе типа ${analysisResult.type}` }})}>
                  Задать вопрос ИИ-ассистенту
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThreatAnalyzer;