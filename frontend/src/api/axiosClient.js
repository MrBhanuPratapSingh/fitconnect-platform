import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8080', // API Gateway
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every outgoing request, if we have one
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is invalid/expired, log the user out automatically
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;