import axios from 'axios';

// Fallback to localhost if env variable is not set
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log to check if API_URL is loaded correctly (remove in production)
console.log('API_URL:', API_URL);

export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getDocuments = () => {
  return axios.get(`${API_URL}/documents`);
};

export const deleteDocument = (id) => {
  return axios.delete(`${API_URL}/documents/${id}`);
};

export const getDownloadUrl = (id) => {
  return `${API_URL}/documents/${id}/download`;
};