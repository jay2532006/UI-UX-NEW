import React from 'react';
import Card from '../ui/Card';
import WorkshopStatusBadge from './WorkshopStatusBadge';
import { CalendarDays, Building2, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';

/**
 * WorkshopCard — rich card displaying workshop info with status badge.
 * Shows: type name, date, coordinator/institute, duration, status.
 *
 * @param {Object} workshop - Workshop data object
 * @param {function} onTap - Callback when card is tapped
 */
export default function WorkshopCard({ workshop, onTap }) {
  const typeName = workshop.workshop_type?.name || workshop.workshop_type_detail?.name || 'Workshop';
  const coordinatorName = workshop.coordinator?.first_name || workshop.coordinator_name || 'Coordinator';
  const institute = workshop.coordinator?.profile?.institute || '';
  const duration = workshop.workshop_type?.duration || workshop.workshop_type_detail?.duration || '';

  return (
    <Card onClick={onTap}>
      {/* Header row: title + status badge */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-base tracking-tight text-fossee-dark truncate">
            {typeName}
          </h3>
        </div>
        <WorkshopStatusBadge status={workshop.status} />
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-fossee-muted">
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={14} className="text-fossee-primary" aria-hidden="true" />
          {formatDate(workshop.date)}
        </span>
        {coordinatorName && (
          <span className="inline-flex items-center gap-1">
            <Building2 size={14} className="text-fossee-primary" aria-hidden="true" />
            {coordinatorName}
            {institute && <span className="text-xs text-fossee-muted/70">· {institute}</span>}
          </span>
        )}
        {duration && (
          <span className="inline-flex items-center gap-1">
            <Clock size={14} className="text-fossee-accent" aria-hidden="true" />
            {duration}
          </span>
        )}
      </div>

      {/* Instructor tag if assigned */}
      {workshop.instructor && (
        <div className="mt-2">
          <span className="text-xs text-fossee-secondary bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            Instructor: {workshop.instructor?.first_name || workshop.instructor_name}
          </span>
        </div>
      )}
    </Card>
  );
}

