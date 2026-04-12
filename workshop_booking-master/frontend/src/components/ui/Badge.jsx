import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

/**
 * Badge component — status indicators with icon + text + color.
 * Never relies on color alone (WCAG accessible).
 *
 * @param {'pending'|'accepted'|'rejected'|'success'|'error'|'warning'|'info'|'default'} variant
 * @param {string} children - badge text
 */
export default function Badge({ variant = 'default', children, className = '' }) {
  const config = {
    pending: {
      style: 'bg-amber-100 text-amber-800 border border-amber-200',
      Icon: Clock,
      pulse: true,
    },
    accepted: {
      style: 'bg-green-100 text-green-800 border border-green-200',
      Icon: CheckCircle,
    },
    rejected: {
      style: 'bg-red-100 text-red-800 border border-red-200',
      Icon: XCircle,
    },
    success: {
      style: 'bg-green-100 text-green-800 border border-green-200',
      Icon: CheckCircle,
    },
    error: {
      style: 'bg-red-100 text-red-800 border border-red-200',
      Icon: AlertCircle,
    },
    warning: {
      style: 'bg-amber-100 text-amber-800 border border-amber-200',
      Icon: AlertCircle,
    },
    info: {
      style: 'bg-blue-100 text-blue-800 border border-blue-200',
      Icon: Info,
    },
    default: {
      style: 'bg-gray-100 text-gray-800 border border-gray-200',
      Icon: null,
    },
  };

  const { style, Icon, pulse } = config[variant] || config.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${style} ${className}`}
      role="status"
    >
      {pulse && (
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600" />
        </span>
      )}
      {Icon && !pulse && <Icon size={14} aria-hidden="true" className="flex-shrink-0" />}
      {children}
    </span>
  );
}

