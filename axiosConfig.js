// src/axiosConfig.js
import axios from 'axios';

// Crear una instancia de Axios
const axiosInstance = axios.create({
  baseURL: 'https://www.crossfitquitoapi.com/api', // Cambia esto a tu baseUR
  //baseURL: 'http://localhost:3000/api',

});

// Interceptor para agregar el token a cada solicitud
axiosInstance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token'); // Obtén el token del local storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default axiosInstance;
