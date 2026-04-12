import React from 'react';
import WorkshopCard from './WorkshopCard';
import Skeleton from '../ui/Skeleton';
import EmptyState from '../ui/EmptyState';
import { BookOpen } from 'lucide-react';

/**
 * WorkshopList — filterable, paginated workshop list with skeleton loading.
 *
 * @param {Array} workshops - Array of workshop objects
 * @param {boolean} loading - Whether data is loading
 * @param {function} onTapWorkshop - Callback when a card is tapped
 * @param {string} emptyMessage - Message when no workshops
 * @param {React.ReactNode} emptyAction - CTA button for empty state
 */
export default function WorkshopList({
  workshops = [],
  loading = false,
  onTapWorkshop,
  emptyMessage = 'No workshops found',
  emptyAction,
}) {
  if (loading) {
    return (
      <div className="space-y-3" aria-label="Loading workshops">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} variant="workshop-card" />
        ))}
      </div>
    );
  }

  if (workshops.length === 0) {
    return (
      <EmptyState
        message={emptyMessage}
        Icon={BookOpen}
        action={emptyAction}
      />
    );
  }

  return (
    <div className="space-y-3">
      {workshops.map((workshop) => (
        <WorkshopCard
          key={workshop.id}
          workshop={workshop}
          onTap={() => onTapWorkshop?.(workshop)}
        />
      ))}
    </div>
  );
}
