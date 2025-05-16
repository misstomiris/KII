import React from 'react';
import styles from './StatCard.module.scss';

// Иконки
import { 
  IconShield, 
  IconAlertCircle, 
  IconFileAnalytics, 
  IconLock,
  IconUser,
  IconServer,
  IconCloud,
  IconDatabase,
  IconChevronUp,
  IconChevronDown
} from '@tabler/icons-react';

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  trend, 
  color = 'primary', 
  onClick 
}) => {
  // Определение иконки компонента
  const getIcon = () => {
    switch (icon) {
      case 'shield':
        return <IconShield size={24} />;
      case 'alert':
        return <IconAlertCircle size={24} />;
      case 'file':
        return <IconFileAnalytics size={24} />;
      case 'security':
        return <IconLock size={24} />;
      case 'user':
        return <IconUser size={24} />;
      case 'server':
        return <IconServer size={24} />;
      case 'cloud':
        return <IconCloud size={24} />;
      case 'database':
        return <IconDatabase size={24} />;
      default:
        return <IconShield size={24} />;
    }
  };
  
  // Определение тренда (рост или падение)
  const getTrendIcon = () => {
    if (!trend) return null;
    
    const isPositive = trend.startsWith('+');
    const trendColor = isPositive ? styles.positive : styles.negative;
    const TrendIcon = isPositive ? IconChevronUp : IconChevronDown;
    
    return (
      <div className={`${styles.trend} ${trendColor}`}>
        <TrendIcon size={16} />
        <span>{trend}</span>
      </div>
    );
  };
  
  return (
    <div 
      className={`${styles.statCard} ${styles[color]} ${onClick ? styles.clickable : ''}`}
      onClick={onClick}
    >
      <div className={styles.iconWrapper}>
        {getIcon()}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.valueRow}>
          <p className={styles.value}>{value}</p>
          {getTrendIcon()}
        </div>
        {description && <p className={styles.description}>{description}</p>}
      </div>
    </div>
  );
};

export default StatCard;