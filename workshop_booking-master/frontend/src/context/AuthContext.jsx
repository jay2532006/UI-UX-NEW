import React, { createContext, useState, useEffect } from 'react';
import client from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize auth state on app load
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const response = await client.get('/auth/me/');
        const userData = response.data;
        
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
          first_name: userData.first_name,
          last_name: userData.last_name,
          full_name: `${userData.first_name} ${userData.last_name}`.trim(),
          profile: userData.profile,
          role: userData.profile?.position || 'coordinator', // 'coordinator' or 'instructor'
        });
        setIsAuthenticated(true);
      } catch (error) {
        // User not authenticated (401 or network error)
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
      const response = await client.post('/auth/login/', { username, password });
      const userData = response.data;
      
      setUser({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        full_name: `${userData.first_name} ${userData.last_name}`.trim(),
        profile: userData.profile,
        role: userData.profile?.position || 'coordinator',
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await client.post('/auth/logout/');
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  };

  /**
   * Register function
   */
  const register = async (userData) => {
    try {
      const response = await client.post('/auth/register/', userData);
      return { success: true, message: response.data?.detail };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed',
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
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
