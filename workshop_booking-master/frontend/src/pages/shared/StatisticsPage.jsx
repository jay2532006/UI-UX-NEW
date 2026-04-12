/* eslint-disable */
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/stats/StatCard';
import StatsMap from '../../components/stats/StatsMap';
import WorkshopTypeChart from '../../components/stats/WorkshopTypeChart';
import Skeleton from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import client from '../../api/client';

export default function StatisticsPage() {
  const { addToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      const state = searchParams.get('state');
      const type = searchParams.get('type');
      if (state) params.state = state;
      if (type) params.type = type;
      const res = await client.get('/statistics/public/', { params });
      setData(res.data);
    } catch {
      addToast('error', 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, [searchParams, addToast]);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  // Derive state counts for map
  const stateData = useMemo(() => {
    if (!data?.ws_states) return {};
    const counts = {};
    data.ws_states.forEach((s) => {
      const name = s.state || s.name;
      counts[name] = (counts[name] || 0) + (s.count || s.total || 1);
    });
    return counts;
  }, [data]);

  // Derive type counts for chart
  const typeData = useMemo(() => {
    if (!data?.ws_types) return [];
    return data.ws_types.map((t) => ({
      name: t.name || t.type,
      count: t.count || t.total || 0,
    }));
  }, [data]);

  // Handle filter from chart click
  const handleTypeFilter = (entry) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('type', entry.name);
      return next;
    });
  };

  // CSV download
  const handleDownloadCSV = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
    window.location.href = `${baseUrl}/statistics/csv/`;
  };

  return (
    <>
      <Helmet>
        <title>Workshop Statistics — FOSSEE</title>
        <meta name="description" content="Explore FOSSEE workshop statistics across India. View workshop distribution by state and type." />
        <meta property="og:title" content="Workshop Statistics — FOSSEE" />
        {/* Structured data */}
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'DataCatalog',
          name: 'FOSSEE Workshop Statistics',
          description: 'Workshop booking statistics from the FOSSEE portal',
          provider: {
            '@type': 'Organization',
            name: 'FOSSEE, IIT Bombay',
          },
        })}</script>
      </Helmet>
      <PageWrapper>
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-fossee-dark">
                  Workshop Statistics
                </h1>
                <p className="text-fossee-muted text-sm mt-1">Public workshop data across India</p>
              </div>
              <Button variant="secondary" onClick={handleDownloadCSV} disabled={!data?.total_workshops}>
                <Download size={16} className="mr-1" /> Export CSV
              </Button>
            </div>
          </motion.div>

          {/* Active filters */}
          {(searchParams.get('state') || searchParams.get('type')) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-fossee-muted">Filters:</span>
              {searchParams.get('state') && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full border border-blue-200">
                  State: {searchParams.get('state')}
                  <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('state'); setSearchParams(p); }} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              {searchParams.get('type') && (
                <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full border border-amber-200">
                  Type: {searchParams.get('type')}
                  <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete('type'); setSearchParams(p); }} className="ml-1 hover:text-amber-900">×</button>
                </span>
              )}
              <button onClick={() => setSearchParams({})} className="text-xs text-red-600 hover:underline ml-2">Clear All</button>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Skeleton variant="card" />
                <Skeleton variant="card" />
                <Skeleton variant="card" />
              </div>
              <Skeleton className="h-[360px]" />
            </div>
          ) : (
            <>
              {/* Summary stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total Workshops" value={data?.total_workshops || 0} color="text-fossee-primary" bgColor="bg-white" />
                <StatCard label="States Covered" value={data?.ws_states?.length || 0} color="text-fossee-secondary" bgColor="bg-white" />
                <StatCard label="Workshop Types" value={data?.ws_types?.length || 0} color="text-fossee-accent" bgColor="bg-white" />
                <StatCard label="Instructors" value={data?.total_instructors || 0} color="text-purple-600" bgColor="bg-white" />
              </div>

              {/* Map + Chart grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <StatsMap stateData={stateData} />
                <WorkshopTypeChart data={typeData} onSegmentClick={handleTypeFilter} />
              </div>
            </>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
