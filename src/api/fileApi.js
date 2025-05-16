import apiClient from './axiosConfig';

export const fileApi = {
  // Работа с файлами
  getFiles: (params) => {
    return apiClient.get('/files/bank-files/', { params });
  },
  
  getFile: (fileId) => {
    return apiClient.get(`/files/bank-files/${fileId}/`);
  },
  
  uploadFile: (fileData) => {
    const formData = new FormData();
    
    // Добавление файла
    formData.append('file', fileData.file);
    
    // Добавление остальных полей
    formData.append('name', fileData.name);
    formData.append('file_type', fileData.file_type);
    formData.append('sensitivity', fileData.sensitivity);
    
    if (fileData.description) {
      formData.append('description', fileData.description);
    }
    
    return apiClient.post('/files/bank-files/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },
  
  downloadFile: (fileId) => {
    return apiClient.get(`/files/bank-files/${fileId}/download/`, {
      responseType: 'blob'
    });
  },
  
  searchFiles: (query) => {
    return apiClient.post('/files/bank-files/search/', { query });
  },
  
  // Логи доступа к файлам
  getAccessLogs: (params) => {
    return apiClient.get('/files/access-logs/', { params });
  },
};