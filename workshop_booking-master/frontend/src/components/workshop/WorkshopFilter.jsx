import React from 'react';
import { Filter } from 'lucide-react';
import { STATUS_LABELS } from '../../utils/constants';

/**
 * WorkshopFilter — compact filter bar for workshop lists.
 * Supports status, type, and date range filtering.
 *
 * @param {object} filters - Current filter values
 * @param {function} onChange - Callback with updated filters
 * @param {Array} workshopTypes - Available workshop types for dropdown
 */
export default function WorkshopFilter({ filters, onChange, workshopTypes = [] }) {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  const inputClass =
    'h-10 px-3 rounded-lg border border-fossee-border bg-white text-sm focus:border-fossee-primary focus:outline-none transition-colors';

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-fossee-card rounded-xl border border-fossee-border shadow-card">
      <Filter size={16} className="text-fossee-muted flex-shrink-0" aria-hidden="true" />

      {/* Status filter */}
      <div>
        <label htmlFor="filter-status" className="sr-only">Filter by status</label>
        <select
          id="filter-status"
          value={filters.status ?? ''}
          onChange={(e) => handleChange('status', e.target.value)}
          className={inputClass}
        >
          <option value="">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([code, label]) => (
            <option key={code} value={code}>{label}</option>
          ))}
        </select>
      </div>

      {/* Type filter */}
      {workshopTypes.length > 0 && (
        <div>
          <label htmlFor="filter-type" className="sr-only">Filter by type</label>
          <select
            id="filter-type"
            value={filters.type ?? ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className={inputClass}
          >
            <option value="">All Types</option>
            {workshopTypes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Date range */}
      <div className="flex items-center gap-2">
        <label htmlFor="filter-from" className="sr-only">From date</label>
        <input
          id="filter-from"
          type="date"
          value={filters.from_date ?? ''}
          onChange={(e) => handleChange('from_date', e.target.value)}
          className={inputClass}
          placeholder="From"
        />
        <span className="text-fossee-muted text-sm">–</span>
        <label htmlFor="filter-to" className="sr-only">To date</label>
        <input
          id="filter-to"
          type="date"
          value={filters.to_date ?? ''}
          onChange={(e) => handleChange('to_date', e.target.value)}
          className={inputClass}
          placeholder="To"
        />
      </div>
    </div>
  );
}
