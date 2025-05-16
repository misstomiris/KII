import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useTheme } from '../../../hooks/useTheme';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import styles from './Layout.module.scss';

// Анимация для страниц
import { AnimatePresence, motion } from 'framer-motion';

const Layout = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  
  // Состояние для мобильного меню
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Закрываем сайдбар при изменении маршрута на мобильных устройствах
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);
  
  // Обработчик для переключения сайдбара
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Получение страницы из маршрута для анимации
  const getPageName = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path;
  };
  
  // Анимация для переходов между страницами
  const pageVariants = {
    initial: {
      opacity: 0,
      x: 20
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: {
        duration: 0.2,
        ease: 'easeInOut'
      }
    }
  };
  
  return (
    <div className={`${styles.layout} ${styles[theme]}`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className={styles.mainContent}>
        <Navbar 
          toggleSidebar={toggleSidebar} 
          sidebarOpen={sidebarOpen}
          user={user}
        />
        
        <main className={styles.content}>
          <AnimatePresence mode="wait">
            <motion.div
              key={getPageName()}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className={styles.pageContent}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Layout;