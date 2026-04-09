import React from 'react';
import Card from '../ui/Card';
import WorkshopStatusBadge from './WorkshopStatusBadge';

/**
 * WorkshopCard component - displays workshop info in a card
 * @param {Object} workshop - workshop data
 * @param {function} onTap - callback when card is tapped
 */
export default function WorkshopCard({ workshop, onTap }) {

  return (
    <Card
      title={workshop.workshop_type?.name || 'Workshop'}
      subtitle={`${new Date(workshop.date).toLocaleDateString()} • ${workshop.coordinator?.first_name || 'Coordinator'}`}
      onClick={onTap}
      className="bg-white"
    >
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <WorkshopStatusBadge status={workshop.status} />
        {workshop.instructor && (
          <span className="text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-full">
            Instructor: {workshop.instructor?.first_name}
          </span>
        )}
      </div>
    </Card>
  );
}
