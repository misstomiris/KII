import React, { createContext, useState, useEffect } from 'react';
import { aiApi } from '../api/aiApi';
import { useNotification } from '../hooks/useNotification';

export const AIContext = createContext();

export const AIProvider = ({ children }) => {
  // Состояния
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiPreferences, setAIPreferences] = useState({
    responseMode: 'balanced', // balanced, detailed, concise
    showSourcesInResponse: true,
    autoAnalyze: true,
  });
  
  const { showNotification } = useNotification();
  
  // Загрузка настроек из localStorage
  useEffect(() => {
    const savedPreferences = localStorage.getItem('aiPreferences');
    if (savedPreferences) {
      try {
        setAIPreferences(JSON.parse(savedPreferences));
      } catch (error) {
        console.error('Error parsing AI preferences:', error);
      }
    }
  }, []);
  
  // Сохранение настроек в localStorage
  useEffect(() => {
    localStorage.setItem('aiPreferences', JSON.stringify(aiPreferences));
  }, [aiPreferences]);
  
  // Отправка сообщения ИИ-ассистенту
  const sendMessage = async (message) => {
    try {
      setIsLoading(true);
      
      // Добавляем сообщение пользователя в историю
      const userMessage = {
        id: Date.now(),
        sender: 'user',
        content: message,
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, userMessage]);
      
      // Отправляем запрос к API
      const response = await aiApi.sendMessage({
        message,
        preferences: aiPreferences,
      });
      
      // Добавляем ответ ассистента в историю
      const assistantMessage = {
        id: Date.now() + 1,
        sender: 'assistant',
        content: response.data.message,
        sources: response.data.sources || [],
        suggestedActions: response.data.suggested_actions || [],
        timestamp: new Date(),
      };
      
      setChatHistory(prev => [...prev, assistantMessage]);
      
      return assistantMessage;
    } catch (error) {
      console.error('Error sending message to AI:', error);
      
      showNotification({
        type: 'error',
        title: 'Ошибка отправки сообщения',
        message: 'Не удалось отправить сообщение ИИ-ассистенту. Пожалуйста, попробуйте снова.',
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Анализ события безопасности
  const analyzeSecurityEvent = async (eventData) => {
    try {
      setIsLoading(true);
      const response = await aiApi.analyzeSecurityEvent(eventData);
      return response.data;
    } catch (error) {
      console.error('Error analyzing security event:', error);
      
      showNotification({
        type: 'error',
        title: 'Ошибка анализа',
        message: 'Не удалось выполнить анализ события безопасности.',
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Поиск файлов с помощью ИИ
  const searchFilesWithAI = async (query) => {
    try {
      setIsLoading(true);
      const response = await aiApi.searchFilesWithAI(query);
      return response.data;
    } catch (error) {
      console.error('Error searching files with AI:', error);
      
      showNotification({
        type: 'error',
        title: 'Ошибка поиска',
        message: 'Не удалось выполнить поиск файлов с помощью ИИ.',
      });
      
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Очистка истории чата
  const clearChatHistory = () => {
    setChatHistory([]);
  };
  
  // Обновление настроек ИИ
  const updatePreferences = (newPreferences) => {
    setAIPreferences(prev => ({
      ...prev,
      ...newPreferences,
    }));
    
    showNotification({
      type: 'success',
      title: 'Настройки обновлены',
      message: 'Настройки ИИ-ассистента успешно обновлены.',
    });
  };
  
  return (
    <AIContext.Provider
      value={{
        chatHistory,
        isLoading,
        aiPreferences,
        sendMessage,
        analyzeSecurityEvent,
        searchFilesWithAI,
        clearChatHistory,
        updatePreferences,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};