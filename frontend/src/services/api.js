import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const uploadDocument = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return axios.post(`${API_URL}/upload/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getDocuments = () => {
    return axios.get(`${API_URL}/documents/`);
};

export const deleteDocument = (id) => {
    return axios.delete(`${API_URL}/documents/${id}`);
};

export const getDownloadUrl = (id) => {
    return `${API_URL}/documents/${id}/download`;
};
