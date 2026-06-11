import axios from 'axios';

/**
 * Axios instance pre-configured with the base API URL.
 * An interceptor automatically attaches the JWT token from localStorage
 * to every outgoing request's Authorization header.
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Request interceptor — attach JWT token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
