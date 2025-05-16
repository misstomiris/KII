import React, { useState } from 'react';
import { FileText, Folder, Upload, Download, Trash2, Filter, Search, Grid, List } from 'lucide-react';
import './FileManager.module.scss';

const FileManager = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  // Пример данных файлов (обычно это будет загружаться с API)
  const dummyFiles = [
    {
      id: '1',
      name: 'Отчет о безопасности Q1 2025.pdf',
      type: 'pdf',
      size: '2.4 MB',
      lastModified: '2025-03-15',
      owner: 'Администратор'
    },
    {
      id: '2',
      name: 'Анализ угроз.xlsx',
      type: 'xlsx',
      size: '1.8 MB',
      lastModified: '2025-04-02',
      owner: 'Аналитик безопасности'
    },
    {
      id: '3',
      name: 'Инструкции по защите данных.docx',
      type: 'docx',
      size: '756 KB',
      lastModified: '2025-04-10',
      owner: 'Администратор'
    },
    {
      id: '4',
      name: 'Журнал событий.log',
      type: 'log',
      size: '5.2 MB',
      lastModified: '2025-04-28',
      owner: 'Система'
    },
    {
      id: '5',
      name: 'Конфигурация брандмауэра.json',
      type: 'json',
      size: '128 KB',
      lastModified: '2025-04-25',
      owner: 'Администратор'
    }
  ];
  
  // Фильтрация файлов по поисковому запросу
  const filteredFiles = dummyFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.owner.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Обработка выбора файла
  const toggleFileSelection = (fileId) => {
    setSelectedFiles(prevSelected => {
      if (prevSelected.includes(fileId)) {
        return prevSelected.filter(id => id !== fileId);
      } else {
        return [...prevSelected, fileId];
      }
    });
  };
  
  // Обработка загрузки файла
  const handleFileUpload = (e) => {
    // Логика загрузки файла (обычно отправка на API)
    console.log('Файлы для загрузки:', e.target.files);
  };
  
  // Получение иконки в зависимости от типа файла
  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
      case 'docx':
      case 'doc':
      case 'txt':
      case 'rtf':
        return <FileText size={24} />;
      case 'xlsx':
      case 'xls':
      case 'csv':
        return <FileText size={24} />;
      case 'log':
      case 'json':
      case 'xml':
        return <FileText size={24} />;
      default:
        return <FileText size={24} />;
    }
  };
  
  return (
    <div className="file-manager">
      <div className="file-manager-header">
        <h1>Файлы и отчеты</h1>
        <p className="subtitle">Управление документами и отчетами по безопасности</p>
        
        <div className="file-actions">
          <div className="search-container">
            <div className="search-input-container">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Поиск файлов..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="file-toolbar">
            <div className="view-toggle">
              <button
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Вид сеткой"
              >
                <Grid size={18} />
              </button>
              <button
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="Вид списком"
              >
                <List size={18} />
              </button>
            </div>
            
            <div className="action-buttons">
              <label className="action-button upload">
                <Upload size={18} />
                <span>Загрузить</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
              
              <button 
                className="action-button download"
                disabled={selectedFiles.length === 0}
                title="Скачать выбранные файлы"
              >
                <Download size={18} />
                <span>Скачать</span>
              </button>
              
              <button 
                className="action-button delete"
                disabled={selectedFiles.length === 0}
                title="Удалить выбранные файлы"
              >
                <Trash2 size={18} />
                <span>Удалить</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="files-container">
        {viewMode === 'grid' ? (
          <div className="files-grid">
            {filteredFiles.map(file => (
              <div 
                key={file.id} 
                className={`file-card ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="file-icon">
                  {getFileIcon(file.type)}
                </div>
                <div className="file-info">
                  <div className="file-name" title={file.name}>{file.name}</div>
                  <div className="file-details">
                    <span className="file-size">{file.size}</span>
                    <span className="file-date">{file.lastModified}</span>
                  </div>
                  <div className="file-owner">{file.owner}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="files-list">
            <div className="list-header">
              <div className="header-item file-name-header">Имя файла</div>
              <div className="header-item file-type-header">Тип</div>
              <div className="header-item file-size-header">Размер</div>
              <div className="header-item file-date-header">Дата изменения</div>
              <div className="header-item file-owner-header">Владелец</div>
            </div>
            
            {filteredFiles.map(file => (
              <div 
                key={file.id} 
                className={`list-item ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                onClick={() => toggleFileSelection(file.id)}
              >
                <div className="item-cell file-name-cell">
                  <div className="file-icon-small">
                    {getFileIcon(file.type)}
                  </div>
                  <span>{file.name}</span>
                </div>
                <div className="item-cell file-type-cell">
                  {file.type.toUpperCase()}
                </div>
                <div className="item-cell file-size-cell">
                  {file.size}
                </div>
                <div className="item-cell file-date-cell">
                  {file.lastModified}
                </div>
                <div className="item-cell file-owner-cell">
                  {file.owner}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {filteredFiles.length === 0 && (
          <div className="no-files">
            <FileText size={48} />
            <p>Файлы не найдены</p>
            {searchQuery && (
              <p className="search-hint">
                По запросу "{searchQuery}" ничего не найдено. Попробуйте изменить запрос.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileManager;