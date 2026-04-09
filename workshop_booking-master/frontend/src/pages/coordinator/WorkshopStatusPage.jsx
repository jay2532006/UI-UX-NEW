import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useWorkshops } from '../../hooks/useWorkshops';
import PageWrapper from '../../components/layout/PageWrapper';
import WorkshopCard from '../../components/workshop/WorkshopCard';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { BookOpen } from 'lucide-react';

const FILTER_TABS = [
  { label: 'All', value: null },
  { label: 'Pending', value: 0 },
  { label: 'Accepted', value: 1 },
  { label: 'Rejected', value: 2 },
];

export default function WorkshopStatusPage() {
  const navigate = useNavigate();
  const { workshops, loading, fetchWorkshops } = useWorkshops();
  const [activeFilter, setActiveFilter] = useState(null);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);

  useEffect(() => {
    fetchWorkshops(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    // API already returns filtered results — just use them directly
    setFilteredWorkshops(workshops);
  }, [workshops]);

  return (
    <>
      <Helmet>
        <title>My Workshops — FOSSEE Workshop Booking</title>
        <meta name="description" content="View and manage all your proposed workshops. Filter by status to see pending, accepted, or rejected proposals." />
      </Helmet>
      <PageWrapper>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="mt-4">
          <h1 className="text-2xl font-semibold text-gray-900">My Workshops</h1>
          <p className="text-gray-600 text-sm mt-1">Track all your proposed workshops</p>

          {/* Action Button */}
          <Button
            variant="primary"
            onClick={() => navigate('/propose')}
            className="mt-4"
          >
            + Propose New Workshop
          </Button>
        </div>

        {/* Filter Tabs - Horizontal Scroll on Mobile */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:gap-3 md:overflow-x-visible">
          {FILTER_TABS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setActiveFilter(value)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                activeFilter === value
                  ? 'bg-fossee-blue text-white'
                  : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-fossee-blue'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Workshops List */}
        {loading ? (
          <Spinner />
        ) : filteredWorkshops.length === 0 ? (
          <EmptyState
            message={
              activeFilter === null
                ? 'No workshops yet'
                : `No ${FILTER_TABS.find((t) => t.value === activeFilter)?.label.toLowerCase()} workshops`
            }
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
            {filteredWorkshops.map((workshop) => (
              <WorkshopCard
                key={workshop.id}
                workshop={workshop}
                onTap={() => navigate(`/workshop/${workshop.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
    </>
  );
}
