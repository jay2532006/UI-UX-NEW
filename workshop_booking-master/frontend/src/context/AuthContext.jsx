import React, { createContext, useState, useEffect } from 'react';
import client from '../api/client';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize auth state on app load
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await client.get('/auth/me/');
        const profile = response.data.user;
        
        setUser({
          id: profile.id,
          email: profile.email,
          first_name: profile.first_name,
          last_name: profile.last_name,
          full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
          profile: profile,
          role: profile.is_instructor ? 'instructor' : 'coordinator',
        });
        setIsAuthenticated(true);
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login function
   */
  const login = async (username, password) => {
    try {
      const response = await client.post('/auth/login/', { email: username, password });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      const profile = response.data.user;
      const userRole = profile.is_instructor ? 'instructor' : 'coordinator';
      
      setUser({
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        profile: profile,
        role: userRole,
      });
      setIsAuthenticated(true);
      return { success: true, role: userRole };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.errors?.non_field_errors?.[0] || 'Login failed',
      };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsAuthenticated(false);
    // Hard refresh to clear any cached axio contexts
    window.location.href = '/login';
    return { success: true };
  };

  /**
   * Register function
   */
  const register = async (userData) => {
    try {
      // Backend serializers explicitly expect 'phone', not 'phone_number'
      const payload = {
        ...userData,
        phone: userData.phone_number
      };
      const response = await client.post('/auth/register/', payload);
      return { success: true, message: response.data?.message };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.errors 
          ? Object.values(err.response.data.errors).flat().join(' | ')
          : 'Registration failed. Check your inputs.',
      };
    }
  };

  /**
   * Google signin function
   */
  const loginWithGoogle = async (credential) => {
    try {
      const response = await client.post('/auth/google/', { id_token: credential });
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      const profile = response.data.user;
      const userRole = profile.is_instructor ? 'instructor' : 'coordinator';
      
      setUser({
        id: profile.id,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        full_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email,
        profile: profile,
        role: userRole,
      });
      setIsAuthenticated(true);
      return { success: true, role: userRole };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.errors || 'Google login failed',
      };
    }
  };

  const role = user?.role || null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        role,
        login,
        loginWithGoogle,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
