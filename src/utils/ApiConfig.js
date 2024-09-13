// lib/axiosInstance.js
import axios from 'axios';
import { baseUrl } from './config';

// Créez une instance Axios
const axiosInstance = axios.create({
  baseURL: `${baseUrl}`, // Remplacez par l'URL de votre API
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Ajouter un intercepteur de requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupérez le token du localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Ajoutez le token aux en-têtes de chaque requête
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Ajouter un intercepteur de réponses (facultatif)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Gérer les erreurs globalement
    return Promise.reject(error);
  }
);

export default axiosInstance;
