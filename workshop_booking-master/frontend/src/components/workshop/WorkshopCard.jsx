import React from 'react';
import Card from '../ui/Card';
import WorkshopStatusBadge from './WorkshopStatusBadge';

/**
 * WorkshopCard component - displays workshop info in a card
 * @param {Object} workshop - workshop data
 * @param {function} onTap - callback when card is tapped
 */
export default function WorkshopCard({ workshop, onTap }) {
  const statusMap = {
    0: 'PENDING',
    1: 'ACCEPTED',
    2: 'REJECTED',
    3: 'DELETED',
  };

  const status = statusMap[workshop.status] || 'UNKNOWN';

  return (
    <Card
      title={workshop.workshop_type?.name || 'Workshop'}
      subtitle={`${new Date(workshop.date).toLocaleDateString()} • ${workshop.coordinator?.first_name || 'Coordinator'}`}
      onClick={onTap}
    >
      <div className="flex items-center gap-2 mt-3">
        <WorkshopStatusBadge status={workshop.status} />
        {workshop.instructor && (
          <span className="text-xs text-gray-600">
            Instructor: {workshop.instructor?.first_name}
          </span>
        )}
      </div>
    </Card>
  );
}
