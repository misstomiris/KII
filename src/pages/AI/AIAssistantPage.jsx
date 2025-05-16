import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AIAssistantPage.module.scss';
import { useAuth } from '../../hooks/useAuth';
import { aiApi } from '../../api/aiApi';
import { securityApi } from '../../api/securityApi';
import { fileApi } from '../../api/fileApi';

// Иконки
import { 
  IconSend, 
  IconMicrophone, 
  IconFileUpload, 
  IconSearch,
  IconUserCircle,
  IconRobot,
  IconInfoCircle,
  IconArrowRight,
  IconX,
  IconLoader
} from '@tabler/icons-react';

const AIAssistantPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Состояния
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'assistant', 
      content: 'Здравствуйте! Я ваш ИИ-ассистент по безопасности. Чем я могу вам помочь сегодня?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isMicActive, setIsMicActive] = useState
}