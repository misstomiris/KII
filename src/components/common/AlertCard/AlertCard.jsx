import React from 'react';
import styles from './AlertCard.module.scss';

// Иконки
import { 
  IconAlertTriangle, 
  IconAlertCircle, 
  IconInfoCircle,
  IconClockHour4
} from '@tabler/icons-react';

const AlertCard = ({ 
  title, 
  description, 
  time, 
  severity = 'medium', // low, medium, high, critical
  onClick 
}) => {
  // Определение иконки и класса на основе важности
  const getAlertIcon = () => {
    switch (severity) {
      case 'critical':
        return <IconAlertCircle size={24} />;
      case 'high':
        return <IconAlertTriangle size={24} />;
      case 'medium':
        return <IconAlertTriangle size={24} />;
      case 'low':
        return <IconInfoCircle size={24} />;
      default:
        return <IconInfoCircle size={24} />;
    }
  };
  
  return (
    <div 
      className={`${styles.alertCard} ${styles[severity]} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <div className={styles.iconWrapper}>
        {getAlertIcon()}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        
        {time && (
          <div className={styles.timeInfo}>
            <IconClockHour4 size={14} />
            <span>{time}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertCard;