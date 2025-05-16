import { useContext } from 'react';
import { AIContext } from '../contexts/AIContext';

/**
 * Хук для работы с ИИ-ассистентом
 * @returns {Object} Методы и состояние для работы с ИИ-ассистентом
 */
export const useAI = () => {
  const context = useContext(AIContext);
  
  if (!context) {
    throw new Error('useAI должен использоваться внутри AIProvider');
  }
  
  return context;
};

export default useAI;