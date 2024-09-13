// lib/axiosInstance.js
import axios from 'axios';

// Créez une instance Axios
const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.3:1207', // Remplacez par l'URL de votre API
  headers: {
    'Content-Type': 'application/json',
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
