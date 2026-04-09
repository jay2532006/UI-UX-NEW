import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

/**
 * WorkshopStatusBadge component - non-color-reliant workshop status badge
 * Uses icons + text + color (not color alone) for accessibility
 * Status codes: 0=PENDING, 1=ACCEPTED, 2=REJECTED, 3=DELETED
 */
export default function WorkshopStatusBadge({ status }) {
  const statusMap = {
    0: { 
      label: 'Pending', 
      icon: Clock, 
      className: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      ariaLabel: 'Workshop status: pending approval'
    },
    1: { 
      label: 'Accepted', 
      icon: CheckCircle, 
      className: 'bg-green-100 text-green-800 border border-green-300',
      ariaLabel: 'Workshop status: accepted'
    },
    2: { 
      label: 'Rejected', 
      icon: XCircle, 
      className: 'bg-red-100 text-red-800 border border-red-300',
      ariaLabel: 'Workshop status: rejected'
    },
    3: { 
      label: 'Deleted', 
      icon: XCircle, 
      className: 'bg-gray-100 text-gray-800 border border-gray-300',
      ariaLabel: 'Workshop status: deleted'
    },
  };

  const statusInfo = statusMap[status] || { 
    label: 'Unknown', 
    icon: Clock, 
    className: 'bg-gray-100 text-gray-800 border border-gray-300',
    ariaLabel: 'Workshop status: unknown'
  };
  
  const Icon = statusInfo.icon;

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium ${statusInfo.className}`}
      role="status"
      aria-label={statusInfo.ariaLabel}
    >
      <Icon size={16} aria-hidden="true" className="flex-shrink-0" />
      {statusInfo.label}
    </span>
  );
}
