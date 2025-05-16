import React, { createContext, useState, useCallback, useEffect } from 'react';
import aiApi from '../api/aiApi';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  const { currentUser, hasDepartmentAccess } = useAuth();
  const { showNotification } = useNotification();
  
  const [assistantHistory, setAssistantHistory] = useState([]);
  const [latestThreats, setLatestThreats] = useState([]);
  const [securityRecommendations, setSecurityRecommendations] = useState([]);
  const [threatAnalytics, setThreatAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisInProgress, setAnalysisInProgress] = useState(false);
  const [accessibleDepartments, setAccessibleDepartments] = useState([]);

  // Загрузка последних угроз
  const loadLatestThreats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await aiApi.getLatestThreats();
      setLatestThreats(data);
    } catch (error) {
      console.error('Ошибка загрузки последних угроз:', error);
      showNotification('Не удалось загрузить последние угрозы', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Загрузка аналитических данных
  const loadThreatAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const data = await aiApi.getThreatAnalytics();
      setThreatAnalytics(data);
    } catch (error) {
      console.error('Ошибка загрузки аналитики угроз:', error);
      showNotification('Не удалось загрузить аналитические данные', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Загрузка рекомендаций по безопасности
  const loadSecurityRecommendations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await aiApi.getSecurityRecommendations();
      setSecurityRecommendations(data);
    } catch (error) {
      console.error('Ошибка загрузки рекомендаций:', error);
      showNotification('Не удалось загрузить рекомендации по безопасности', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  // Отправка запроса ИИ-ассистенту
  const askAssistant = useCallback(async (query, context = '') => {
    try {
      const response = await aiApi.askAssistant(query, context);
      
      // Добавляем запрос и ответ в историю
      const newHistoryItem = {
        id: Date.now().toString(),
        query,
        response: response.answer,
        timestamp: new Date().toISOString()
      };
      
      setAssistantHistory(prev => [...prev, newHistoryItem]);
      return response.answer;
    } catch (error) {
      console.error('Ошибка при запросе к ИИ-ассистенту:', error);
      showNotification('Не удалось получить ответ от ИИ-ассистента', 'error');
      throw error;
    }
  }, [showNotification]);

  // Анализ файла на наличие угроз
  const analyzeFile = useCallback(async (file) => {
    setAnalysisInProgress(true);
    try {
      const result = await aiApi.analyzeFile(file);
      showNotification('Анализ файла завершен', 'success');
      return result;
    } catch (error) {
      console.error('Ошибка анализа файла:', error);
      showNotification('Ошибка при анализе файла', 'error');
      throw error;
    } finally {
      setAnalysisInProgress(false);
    }
  }, [showNotification]);

  // Проверка доступа к данным отдела
  const checkDepartmentDataAccess = useCallback(async (departmentId) => {
    try {
      const { hasAccess } = await aiApi.checkDepartmentAccess(departmentId);
      return hasAccess;
    } catch (error) {
      console.error('Ошибка проверки доступа к данным отдела:', error);
      return false;
    }
  }, []);

  // Углубленный анализ угрозы
  const analyzeThreat = useCallback(async (threatId) => {
    try {
      return await aiApi.analyzeThreat(threatId);
    } catch (error) {
      console.error('Ошибка при анализе угрозы:', error);
      showNotification('Не удалось выполнить анализ угрозы', 'error');
      throw error;
    }
  }, [showNotification]);

  // Проверка доступа к отделам при загрузке компонента
  useEffect(() => {
    const checkDepartmentsAccess = async () => {
      if (!currentUser || !currentUser.departments) return;
      
      try {
        const accessibleDeps = [];
        for (const depId of currentUser.departments) {
          const hasAccess = await checkDepartmentDataAccess(depId);
          if (hasAccess) {
            accessibleDeps.push(depId);
          }
        }
        setAccessibleDepartments(accessibleDeps);
      } catch (error) {
        console.error('Ошибка проверки доступа к отделам:', error);
      }
    };
    
    checkDepartmentsAccess();
  }, [currentUser, checkDepartmentDataAccess]);

  // Начальная загрузка данных
  useEffect(() => {
    if (currentUser) {
      loadLatestThreats();
      loadSecurityRecommendations();
      loadThreatAnalytics();
    }
  }, [currentUser, loadLatestThreats, loadSecurityRecommendations, loadThreatAnalytics]);

  const value = {
    assistantHistory,
    latestThreats,
    securityRecommendations,
    threatAnalytics,
    loading,
    analysisInProgress,
    accessibleDepartments,
    askAssistant,
    analyzeFile,
    analyzeThreat,
    loadLatestThreats,
    loadThreatAnalytics,
    loadSecurityRecommendations,
    checkDepartmentDataAccess
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
};