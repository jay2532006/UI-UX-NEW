import React, { useEffect, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import client from '../../api/client';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Toast from '../../components/ui/Toast';
import { Download } from 'lucide-react';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

export default function StatisticsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filters, setFilters] = useState({
    from_date: '',
    to_date: '',
    state: '',
    workshop_type: '',
  });

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.from_date) params.append('from_date', filters.from_date);
      if (filters.to_date) params.append('to_date', filters.to_date);
      if (filters.state) params.append('state', filters.state);
      if (filters.workshop_type) params.append('workshop_type', filters.workshop_type);

      const response = await client.get(`/stats/public/?${params.toString()}`);
      setStats(response.data);
    } catch {
      setToast({
        type: 'error',
        message: 'Failed to load statistics',
      });
    } finally {
      setLoading(false);
    }
  }, [filters.from_date, filters.to_date, filters.state, filters.workshop_type]);

  const handleDownloadCSV = () => {
    const params = new URLSearchParams();
    if (filters.from_date) params.append('from_date', filters.from_date);
    if (filters.to_date) params.append('to_date', filters.to_date);
    if (filters.state) params.append('state', filters.state);
    if (filters.workshop_type) params.append('workshop_type', filters.workshop_type);
    params.append('format', 'csv');

    window.location.href = `/api/stats/public/?${params.toString()}`;
  };

  return (
    <>
      <Helmet>
        <title>Workshop Statistics — FOSSEE | IIT Bombay</title>
        <meta
          name="description"
          content="View FOSSEE workshop statistics and data across India. Analyze workshop distribution by state, type, and time period."
        />
        <meta name="keywords" content="FOSSEE workshops, statistics, India, workshop data" />
      </Helmet>

      <div className="min-h-screen bg-fossee-light surface-grid p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="mt-4 rounded-2xl bg-white/85 border border-slate-200/70 shadow-sm p-5 md:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-fossee-orange">Analytical Overview</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">Workshop Statistics</h1>
          <p className="text-slate-600 text-sm mt-2">FOSSEE workshop data across India</p>
        </div>

        {/* Filters */}
        <Card className="space-y-4">
          <h3 className="font-bold tracking-tight text-slate-900">Filters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="from-date" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                id="from-date"
                type="date"
                value={filters.from_date}
                onChange={(e) => setFilters({ ...filters, from_date: e.target.value })}
                className="w-full h-[44px] px-3 rounded-lg border-2 border-slate-300 bg-white focus:border-fossee-blue focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="to-date" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                id="to-date"
                type="date"
                value={filters.to_date}
                onChange={(e) => setFilters({ ...filters, to_date: e.target.value })}
                className="w-full h-[44px] px-3 rounded-lg border-2 border-slate-300 bg-white focus:border-fossee-blue focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <select
                id="state"
                value={filters.state}
                onChange={(e) => setFilters({ ...filters, state: e.target.value })}
                className="w-full h-[44px] px-3 rounded-lg border-2 border-slate-300 bg-white focus:border-fossee-blue focus:outline-none"
              >
                <option value="">All States</option>
                {INDIAN_STATES.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
            {stats?.filters?.workshop_types && (
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Workshop Type
                </label>
                <select
                  id="type"
                  value={filters.workshop_type}
                  onChange={(e) => setFilters({ ...filters, workshop_type: e.target.value })}
                  className="w-full h-[44px] px-3 rounded-lg border-2 border-slate-300 bg-white focus:border-fossee-blue focus:outline-none"
                >
                  <option value="">All Types</option>
                  {stats.filters.workshop_types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </Card>

        {/* CSV Download Button */}
        <Button
          variant="primary"
          onClick={handleDownloadCSV}
          className="flex items-center justify-center gap-2 w-full md:w-auto"
        >
          <Download size={16} /> Download as CSV
        </Button>

        {/* Statistics Overview */}
        {loading ? (
          <Spinner />
        ) : stats ? (
          <>
            {/* Total Workshops Card */}
            <Card className="bg-gradient-to-r from-fossee-blue to-blue-900 text-white border-blue-950/30">
              <div className="text-center">
                <div className="text-4xl font-black tracking-tight">{stats.total_workshops}</div>
                <div className="text-sm mt-1 opacity-90">Total Workshops</div>
              </div>
            </Card>

            {/* By State */}
            {stats.ws_states && stats.ws_states.length > 0 && (
              <Card>
                <h3 className="font-bold tracking-tight text-slate-900 mb-4">Workshops by State (Top 10)</h3>
                <div className="space-y-2">
                  {stats.ws_states.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{item}</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-fossee-blue h-2 rounded-full"
                          style={{
                            width: `${(stats.ws_count[idx] / Math.max(...stats.ws_count)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-12 text-right">
                        {stats.ws_count[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* By Workshop Type */}
            {stats.ws_type && stats.ws_type.length > 0 && (
              <Card>
                <h3 className="font-bold tracking-tight text-slate-900 mb-4">Workshops by Type</h3>
                <div className="space-y-3">
                  {stats.ws_type.map((type, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{type}</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-fossee-orange h-2 rounded-full"
                          style={{
                            width: `${(stats.ws_type_count[idx] / Math.max(...stats.ws_type_count)) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-slate-700 w-12 text-right">
                        {stats.ws_type_count[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Workshops List */}
            {stats.workshops && stats.workshops.length > 0 && (
              <Card>
                <h3 className="font-bold tracking-tight text-slate-900 mb-4">Latest Workshops</h3>
                <div className="space-y-2">
                  {stats.workshops.map((w) => (
                    <div key={w.id} className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg text-sm">
                      <p className="font-semibold text-slate-900">{w.workshop_type?.name}</p>
                      <p className="text-xs text-slate-600">
                        {w.coordinator?.profile?.state} • {new Date(w.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <Card>No data available</Card>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
    </>
  );
}
