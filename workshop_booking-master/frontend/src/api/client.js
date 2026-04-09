import axios from 'axios';

// Determine API base URL
// In production, use VITE_API_URL environment variable
// In development, use '/api' proxy (configured in vite.config.js)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Required for Django session cookies
});

/**
 * Get CSRF token from Django's cookie
 */
function getCsrfToken() {
  const name = 'csrftoken';
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
  }
  return null;
}

/**
 * Request interceptor: attach CSRF token to all mutating requests
 */
client.interceptors.request.use((config) => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
  }
  return config;
});

/**
 * Response interceptor: handle 401 without causing redirect loops.
 *
 * Problem with window.location.href redirect:
 *   - Public pages (e.g. /statistics) call the API and may get a 401 if not
 *     authenticated. Redirecting immediately would break public page access.
 *   - Pages inside ProtectedRoute already handle unauthenticated state via
 *     React Router <Navigate>, so no extra redirect is needed.
 *
 * Solution: Only redirect to /login on 401 if we are NOT already on an auth page
 * and NOT on a public page. The ProtectedRoute component handles auth checks properly.
 */
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const publicPaths = ['/login', '/register', '/statistics', '/api/'];
      const currentPath = window.location.pathname;
      const isPublicPage = publicPaths.some((p) => currentPath.startsWith(p));

      if (!isPublicPage) {
        // Use replace to avoid back-button loops
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default client;
