'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Exception {
  id: string;
  date: Date;
  type: 'high_commission' | 'negative_gp' | 'clawback' | 'rep_termination';
  jobRep: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'denied';
  expanded?: boolean;
  details?: string;
}

export default function Exceptions() {
  const [exceptions, setExceptions] = useState<Exception[]>([
    {
      id: 'exc-001',
      date: new Date('2026-03-24'),
      type: 'high_commission',
      jobRep: 'Sarah Johnson - Enterprise Deal',
      amount: 45000,
      reason: 'Commission exceeds 25% of deal value',
      status: 'pending',
      details: 'Deal valued at $180K resulted in $45K commission due to bonus structure. Verify deal validity and customer relationship.'
    },
    {
      id: 'exc-002',
      date: new Date('2026-03-23'),
      type: 'negative_gp',
      jobRep: 'Mike Chen - Product Bundle',
      amount: -12500,
      reason: 'Negative GP% on bundled products',
      status: 'pending',
      details: 'Bundle pricing resulted in -5% margin. Review bundle configuration and cost basis.'
    },
    {
      id: 'exc-003',
      date: new Date('2026-03-22'),
      type: 'clawback',
      jobRep: 'David Martinez - Tech Systems',
      amount: 8750,
      reason: 'Customer cancellation within 90 days',
      status: 'approved',
      details: 'Customer cancelled 45 days post-sale. Clawback applied per contract terms.'
    },
    {
      id: 'exc-004',
      date: new Date('2026-03-20'),
      type: 'rep_termination',
      jobRep: 'Jennifer Lee - Q1 Outstanding Deals',
      amount: 22000,
      reason: 'Rep termination - deal reconciliation',
      status: 'approved',
      details: 'Rep terminated 3/15/2026. Final commission reconciliation for open deals.'
    },
    {
      id: 'exc-005',
      date: new Date('2026-03-19'),
      type: 'high_commission',
      jobRep: 'Carlos Rodriguez - Corp Upgrade',
      amount: 38000,
      reason: 'Commission exceeds 25% of deal value',
      status: 'denied',
      details: 'Deal is legitimate per compliance review. Denial reason: within approved parameters.'
    },
    {
      id: 'exc-006',
      date: new Date('2026-03-18'),
      type: 'negative_gp',
      jobRep: 'Emily White - Loss Leader',
      amount: -5200,
      reason: 'Loss leader promotion - below cost',
      status: 'approved',
      details: 'Strategic loss leader promotion. Approved by management for customer acquisition.'
    }
  ]);

  const toggleExpand = (id: string) => {
    setExceptions(prev => prev.map(exc =>
      exc.id === id ? { ...exc, expanded: !exc.expanded } : exc
    ));
  };

  const handleApprove = (id: string) => {
    setExceptions(prev => prev.map(exc =>
      exc.id === id ? { ...exc, status: 'approved' } : exc
    ));
  };

  const handleDeny = (id: string) => {
    setExceptions(prev => prev.map(exc =>
      exc.id === id ? { ...exc, status: 'denied' } : exc
    ));
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'high_commission':
        return 'bg-[var(--color-badge-amber)] text-white';
      case 'negative_gp':
        return 'bg-[var(--color-error)] text-white';
      case 'clawback':
        return 'bg-[var(--color-error)] text-white';
      case 'rep_termination':
        return 'bg-[var(--color-badge-purple)] text-white';
      default:
        return 'bg-[var(--color-badge-gray)] text-white';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'high_commission':
        return 'High Commission';
      case 'negative_gp':
        return 'Negative GP';
      case 'clawback':
        return 'Clawback';
      case 'rep_termination':
        return 'Rep Termination';
      default:
        return 'Other';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-[var(--color-warning)]';
      case 'approved':
        return 'text-[var(--color-success)]';
      case 'denied':
        return 'text-[var(--color-error)]';
      default:
        return 'text-[var(--color-text-secondary)]';
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[var(--color-warning-bg)]';
      case 'approved':
        return 'bg-[var(--color-success-bg)]';
      case 'denied':
        return 'bg-[var(--color-error-bg)]';
      default:
        return 'bg-[var(--color-bg-secondary)]';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Commission Exceptions</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Review and approve commission exceptions across all reps</p>
      </div>

      <div className="space-y-3">
        {exceptions.map(exception => (
          <div key={exception.id} className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg overflow-hidden">
            {/* Collapsed Row */}
            <div
              onClick={() => toggleExpand(exception.id)}
              className="p-4 cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors"
            >
              <div className="grid grid-cols-6 gap-4 items-center">
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Date</div>
                  <div className="text-sm font-medium text-[var(--color-text-primary)]">{exception.date.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Type</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeBadgeColor(exception.type)}`}>
                    {getTypeLabel(exception.type)}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Job/Rep</div>
                  <div className="text-sm text-[var(--color-text-primary)]">{exception.jobRep}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Amount</div>
                  <div className={`text-sm font-semibold ${exception.amount < 0 ? 'text-[var(--color-error)]' : 'text-[var(--color-text-primary)]'}`}>
                    {exception.amount < 0 ? '-' : '+'}${Math.abs(exception.amount).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Reason</div>
                  <div className="text-sm text-[var(--color-text-secondary)] truncate">{exception.reason}</div>
                </div>
                <div className="flex items-end justify-between">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${getStatusBgColor(exception.status)} ${getStatusColor(exception.status)}`}>
                    {exception.status.charAt(0).toUpperCase() + exception.status.slice(1)}
                  </span>
                  <span className="text-lg text-[var(--color-text-tertiary)]">
                    {exception.expanded ? '−' : '+'}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {exception.expanded && (
              <div className="border-t border-[var(--color-border)] p-4 bg-[var(--color-bg-secondary)] space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Details</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">{exception.details}</p>
                </div>

                {exception.status === 'pending' && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleApprove(exception.id)}
                      className="px-4 py-2 text-sm bg-[var(--color-success)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDeny(exception.id)}
                      className="px-4 py-2 text-sm bg-[var(--color-error)] text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                      Deny
                    </button>
                  </div>
                )}

                {exception.status === 'approved' && (
                  <div className="flex items-center gap-2 text-sm text-[var(--color-success)] bg-[var(--color-success-bg)] px-3 py-2 rounded">
                    <span>✓</span>
                    <span>This exception has been approved</span>
                  </div>
                )}

                {exception.status === 'denied' && (
                  <div className="flex items-center gap-2 text-sm text-[var(--color-error)] bg-[var(--color-error-bg)] px-3 py-2 rounded">
                    <span>✕</span>
                    <span>This exception has been denied</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
