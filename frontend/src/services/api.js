// src/services/api.js
import axios from 'axios';

// Configure the base URL FastAPI backend connection
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',  
});

// export const getPollutants = async () => {
//   try {
//     const response = await api.get('/pollutants');
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching pollutants:", error);
//     throw error;
//   }
// };

// export const predictHealthRisk = async (data) => {
//   try {
//     const response = await api.post('/predict', data);
//     return response.data;
//   } catch (error) {
//     console.error("Error predicting health risk:", error);
//     throw error;
//   }
// };

export default api;
