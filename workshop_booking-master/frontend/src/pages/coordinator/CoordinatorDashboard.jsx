import React, { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWorkshops } from '../../hooks/useWorkshops';
import PageWrapper from '../../components/layout/PageWrapper';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import WorkshopCard from '../../components/workshop/WorkshopCard';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

export default function CoordinatorDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workshops, loading, fetchWorkshops } = useWorkshops();

  useEffect(() => {
    const loadWorkshops = async () => {
      await fetchWorkshops();
    };
    loadWorkshops();
  }, [fetchWorkshops]);

  // Calculate stats using useMemo to avoid setState in effect
  const stats = useMemo(() => ({
    total: workshops.length,
    pending: workshops.filter((w) => w.status === 0).length,
    accepted: workshops.filter((w) => w.status === 1).length,
  }), [workshops]);

  return (
    <>
      <Helmet>
        <title>Dashboard — FOSSEE Workshop Booking</title>
        <meta name="description" content="View your workshop proposals, manage pending requests, and track workshop statistics. Coordinate with instructors and manage workshop dates." />
      </Helmet>
      <PageWrapper>
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-7">
        {/* Greeting */}
        <div className="mt-4 rounded-2xl bg-white/85 border border-slate-200/70 shadow-sm p-5 md:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-fossee-orange">Dashboard Overview</p>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mt-1">
            Hello, {user?.first_name || 'Coordinator'} 👋
          </h1>
          <p className="text-slate-600 text-sm mt-2">Welcome to FOSSEE Workshop Booking</p>
        </div>

        {/* Summary Cards - Horizontal Scroll on Mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-x-visible">
          {/* Total Workshops */}
          <Card className="min-w-[150px] md:min-w-0 flex-shrink-0 bg-white">
            <div className="text-center">
              <div className="text-4xl font-black text-fossee-blue tracking-tight">{stats.total}</div>
              <div className="text-sm font-medium text-slate-600 mt-1">My Workshops</div>
            </div>
          </Card>

          {/* Pending Workshops */}
          <Card className="min-w-[150px] md:min-w-0 flex-shrink-0 bg-amber-50/70 border-amber-200/60">
            <div className="text-center">
              <div className="text-4xl font-black text-amber-700 tracking-tight">{stats.pending}</div>
              <div className="text-sm font-medium text-amber-900/80 mt-1">Pending</div>
            </div>
          </Card>

          {/* Accepted Workshops */}
          <Card className="min-w-[150px] md:min-w-0 flex-shrink-0 bg-emerald-50/70 border-emerald-200/60">
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-700 tracking-tight">{stats.accepted}</div>
              <div className="text-sm font-medium text-emerald-900/80 mt-1">Accepted</div>
            </div>
          </Card>
        </div>

        {/* Propose CTA Card */}
        <Card
          className="bg-gradient-to-r from-fossee-blue to-blue-900 text-white cursor-pointer hover:brightness-110 transition-all border-blue-950/30"
          title="Propose a Workshop"
          subtitle="Browse workshop types and propose a new session"
          onClick={() => navigate('/propose')}
        >
          <Button variant="ghost" className="text-white mt-2 w-fit hover:bg-white/15">
            Start Proposing →
          </Button>
        </Card>

        {/* Recent Workshops */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">Recent Workshops</h2>
            {workshops.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => navigate('/my-workshops')}
              >
                View All
              </Button>
            )}
          </div>

          {loading ? (
            <Spinner />
          ) : workshops.length === 0 ? (
            <EmptyState
              message="No workshops proposed yet"
              Icon={BookOpen}
              action={
                <Button
                  variant="primary"
                  onClick={() => navigate('/propose')}
                >
                  Propose Your First Workshop
                </Button>
              }
            />
          ) : (
            <div className="space-y-3">
              {workshops.slice(0, 5).map((workshop) => (
                <WorkshopCard
                  key={workshop.id}
                  workshop={workshop}
                  onTap={() => navigate(`/workshop/${workshop.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
    </>
  );
}
