import React from 'react';
import Badge from '../ui/Badge';

/**
 * WorkshopStatusBadge component - color-coded workshop status badge
 * Status codes: 0=PENDING, 1=ACCEPTED, 2=REJECTED, 3=DELETED
 */
export default function WorkshopStatusBadge({ status }) {
  const statusMap = {
    0: { label: 'PENDING', variant: 'warning' },
    1: { label: 'ACCEPTED', variant: 'success' },
    2: { label: 'REJECTED', variant: 'error' },
    3: { label: 'DELETED', variant: 'default' },
  };

  const statusInfo = statusMap[status] || { label: 'UNKNOWN', variant: 'default' };

  return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
}
