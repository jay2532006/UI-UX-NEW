import React, { useEffect, useState } from 'react';
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
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0 });

  useEffect(() => {
    const loadWorkshops = async () => {
      await fetchWorkshops();
    };
    loadWorkshops();
  }, []);

  // Calculate stats
  useEffect(() => {
    if (workshops.length > 0) {
      const pending = workshops.filter((w) => w.status === 0).length;
      const accepted = workshops.filter((w) => w.status === 1).length;
      setStats({
        total: workshops.length,
        pending,
        accepted,
      });
    }
  }, [workshops]);

  return (
    <>
      <Helmet>
        <title>Dashboard — FOSSEE Workshop Booking</title>
        <meta name="description" content="View your workshop proposals, manage pending requests, and track workshop statistics. Coordinate with instructors and manage workshop dates." />
      </Helmet>
      <PageWrapper>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Greeting */}
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            Hello, {user?.first_name || 'Coordinator'} 👋
          </h1>
          <p className="text-gray-600 text-sm mt-1">Welcome to FOSSEE Workshop Booking</p>
        </div>

        {/* Summary Cards - Horizontal Scroll on Mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-4 md:overflow-x-visible">
          {/* Total Workshops */}
          <Card className="min-w-[120px] md:min-w-0 flex-shrink-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-fossee-blue">{stats.total}</div>
              <div className="text-sm text-gray-600 mt-1">My Workshops</div>
            </div>
          </Card>

          {/* Pending Workshops */}
          <Card className="min-w-[120px] md:min-w-0 flex-shrink-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-sm text-gray-600 mt-1">Pending</div>
            </div>
          </Card>

          {/* Accepted Workshops */}
          <Card className="min-w-[120px] md:min-w-0 flex-shrink-0">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.accepted}</div>
              <div className="text-sm text-gray-600 mt-1">Accepted</div>
            </div>
          </Card>
        </div>

        {/* Propose CTA Card */}
        <Card
          className="bg-fossee-blue text-white cursor-pointer hover:opacity-90 transition-opacity"
          title="Propose a Workshop"
          subtitle="Browse workshop types and propose a new session"
          onClick={() => navigate('/propose')}
        >
          <Button variant="ghost" className="text-white mt-2 w-fit">
            Start Proposing →
          </Button>
        </Card>

        {/* Recent Workshops */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Recent Workshops</h2>
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
