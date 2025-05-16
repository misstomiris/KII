import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const ThemeProvider = ({ children }) => {
  // Получаем тему из localStorage или используем системные настройки
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      return savedTheme;
    }
    
    // Проверяем системные настройки
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return THEMES.DARK;
    }
    
    return THEMES.LIGHT;
  };
  
  const [theme, setTheme] = useState(getInitialTheme);
  
  // Обновляем localStorage при изменении темы
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Слушаем изменения системных настроек
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const savedTheme = localStorage.getItem('theme');
      // Обновляем тему только если пользователь не выбрал ее вручную
      if (!savedTheme) {
        setTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Переключение темы
  const toggleTheme = () => {
    setTheme(prevTheme => 
      prevTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    );
  };
  
  // Установка конкретной темы
  const setThemeMode = (mode) => {
    if (Object.values(THEMES).includes(mode)) {
      setTheme(mode);
    }
  };
  
  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        toggleTheme, 
        setTheme: setThemeMode,
        themes: THEMES,
        isDark: theme === THEMES.DARK,
        isLight: theme === THEMES.LIGHT,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};