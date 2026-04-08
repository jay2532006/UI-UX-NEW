import { useState, useCallback } from 'react';
import client from '../api/client';

/**
 * Hook to fetch and manage workshops data
 */
export const useWorkshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchWorkshops = useCallback(async (status = null, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/workshops/?page=' + page;
      if (status !== null) {
        url += '&status=' + status;
      }
      const response = await client.get(url);
      setWorkshops(response.data.results);
      setPagination({
        count: response.data.count,
        next: response.data.next,
        previous: response.data.previous,
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch workshops');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWorkshopDetail = useCallback(async (workshopId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.get(`/workshops/${workshopId}/`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch workshop');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createWorkshop = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await client.post('/workshops/', data);
      return { success: true, data: response.data };
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create workshop');
      return { success: false, error: err.response?.data };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    workshops,
    loading,
    error,
    pagination,
    fetchWorkshops,
    getWorkshopDetail,
    createWorkshop,
  };
};
