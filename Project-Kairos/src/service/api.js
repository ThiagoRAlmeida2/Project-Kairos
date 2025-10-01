// api.js
import axios from 'axios';

// Base URL da API
const api = axios.create({
    baseURL: 'http://localhost:8081', // porta do seu Spring Boot
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar token JWT automaticamente
api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwtToken'); // ou onde você armazenar
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
