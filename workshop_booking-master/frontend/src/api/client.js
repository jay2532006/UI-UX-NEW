import axios from 'axios';

// Determine API base URL
// In production, use VITE_API_URL environment variable
// In development, use '/api' proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
});

/**
 * Get CSRF token from cookies
 */
function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + '=') {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

/**
 * Request interceptor: attach CSRF token to all mutating requests
 */
client.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  return config;
});

/**
 * Response interceptor: redirect to login on 401
 */
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default client;
