import { useState, useCallback } from 'react';
import client from '../api/client';

/**
 * Hook to fetch and manage statistics data
 */
export const useStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublicStats = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.from_date) params.append('from_date', filters.from_date);
      if (filters.to_date) params.append('to_date', filters.to_date);
      if (filters.state) params.append('state', filters.state);
      if (filters.workshop_type) params.append('workshop_type', filters.workshop_type);

      const url = '/stats/public/?' + params.toString();
      const response = await client.get(url);
      setStats(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch statistics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTeamStats = useCallback(async (teamId = null) => {
    setLoading(true);
    setError(null);
    try {
      const url = teamId ? `/stats/team/${teamId}/` : '/stats/team/';
      const response = await client.get(url);
      setStats(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch team stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    loading,
    error,
    fetchPublicStats,
    fetchTeamStats,
  };
};
