/* eslint-disable */
import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useWorkshops } from '../../hooks/useWorkshops';
import PageWrapper from '../../components/layout/PageWrapper';
import StatCard from '../../components/stats/StatCard';
import Button from '../../components/ui/Button';
import WorkshopList from '../../components/workshop/WorkshopList';
import { daysUntil, formatDate } from '../../utils/formatDate';
import { STATUS_CODES } from '../../utils/constants';

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workshops, loading, fetchWorkshops } = useWorkshops();

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  const stats = useMemo(() => ({
    total: workshops.length,
    pending: workshops.filter((w) => w.status === STATUS_CODES.PENDING).length,
    accepted: workshops.filter((w) => w.status === STATUS_CODES.ACCEPTED).length,
  }), [workshops]);

  // Find upcoming workshop (accepted, within 14 days)
  const upcomingWorkshop = useMemo(() => {
    return workshops.find((w) => {
      if (w.status !== STATUS_CODES.ACCEPTED) return false;
      const days = daysUntil(w.date);
      return days >= 0 && days <= 14;
    });
  }, [workshops]);

  return (
    <>
      <Helmet>
        <title>Dashboard — FOSSEE Workshop Booking</title>
        <meta name="description" content="Manage your workshop proposals, track status, and coordinate with instructors." />
      </Helmet>
      <PageWrapper>
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6">
          {/* Welcome banner */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-fossee-card border border-fossee-border shadow-card p-5 md:p-6"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-fossee-accent">Dashboard</p>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-fossee-dark mt-1">
              Hello, {user?.first_name || 'Coordinator'} 👋
            </h1>
            <p className="text-fossee-muted text-sm mt-1">Welcome to the FOSSEE Workshop Booking Portal</p>
          </motion.div>

          {/* Upcoming workshop countdown banner */}
          {upcomingWorkshop && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 p-4 md:p-5 flex items-start gap-3"
            >
              <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-amber-900 text-sm">
                  Upcoming Workshop in {daysUntil(upcomingWorkshop.date)} day(s)
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  {upcomingWorkshop.workshop_type?.name} — {formatDate(upcomingWorkshop.date)}
                </p>
              </div>
            </motion.div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-5">
            <StatCard label="My Workshops" value={stats.total} color="text-fossee-primary" bgColor="bg-white" />
            <StatCard label="Pending" value={stats.pending} color="text-amber-600" bgColor="bg-amber-50/50" />
            <StatCard label="Accepted" value={stats.accepted} color="text-fossee-secondary" bgColor="bg-green-50/50" />
          </div>

          {/* Propose CTA */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="rounded-2xl bg-gradient-to-r from-fossee-primary to-blue-800 text-white p-5 md:p-6 cursor-pointer shadow-card"
            onClick={() => navigate('/propose')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') navigate('/propose'); }}
          >
            <div className="flex items-center gap-3">
              <PlusCircle size={24} />
              <div>
                <h2 className="text-lg font-bold">Propose a Workshop</h2>
                <p className="text-sm text-white/80 mt-0.5">Browse workshop types and propose a new session</p>
              </div>
            </div>
          </motion.div>

          {/* Workshops */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold tracking-tight text-fossee-dark">Recent Workshops</h2>
              {workshops.length > 5 && (
                <Button variant="ghost" onClick={() => navigate('/my-workshops')}>
                  View All
                </Button>
              )}
            </div>
            <WorkshopList
              workshops={workshops.slice(0, 5)}
              loading={loading}
              onTapWorkshop={(w) => navigate(`/workshop/${w.id}`)}
              emptyMessage="No workshops proposed yet"
              emptyAction={
                <Button variant="primary" onClick={() => navigate('/propose')}>
                  Propose Your First Workshop
                </Button>
              }
            />
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
