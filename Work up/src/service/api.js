// api.js
import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token'); 
        
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;