import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,   // JWT — no cookies
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (!refresh) { 
        if (!['/login', '/register', '/'].includes(window.location.pathname)) {
            window.location.href = '/login'; 
        }
        return Promise.reject(error); 
      }
      try {
        const { data } = await axios.post(`${BASE_URL}/api/auth/refresh/`, { refresh });
        localStorage.setItem('access_token', data.access);
        original.headers.Authorization = `Bearer ${data.access}`;
        return client(original);
      } catch {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (!['/login', '/register', '/'].includes(window.location.pathname)) {
            window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    // 403 — show toast if ToastContext is accessible
    if (error.response?.status === 403) {
      console.warn('403 Forbidden:', error.config.url);
    }
    return Promise.reject(error);
  }
);

export default client;
