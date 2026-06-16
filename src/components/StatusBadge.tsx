import React from 'react';

type Variant = 'success' | 'warning' | 'danger' | 'neutral' | 'primary';

const STATUS_VARIANT: Record<string, Variant> = {
  Active: 'success',
  Approved: 'success',
  Completed: 'success',
  'On Time': 'success',
  Pending: 'warning',
  'On Leave': 'warning',
  Scheduled: 'primary',
  'In Progress': 'primary',
  Rejected: 'danger',
  Cancelled: 'danger',
  Terminated: 'danger',
  'Under Maintenance': 'warning',
  Retired: 'neutral',
};

export default function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANT[status] || 'neutral';
  return <span className={`badge badge-${variant}`}>{status}</span>;
}
