// @ts-nocheck
'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, ChevronDown } from 'lucide-react';

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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'high_commission':
      case 'negative_gp':
      case 'clawback':
        return AlertTriangle;
      case 'rep_termination':
        return XCircle;
      default:
        return AlertTriangle;
    }
  };

  const pendingCount = exceptions.filter(e => e.status === 'pending').length;
  const approvedCount = exceptions.filter(e => e.status === 'approved').length;

  return (
    <div className="p-3 sm:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Commission Exceptions</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Review & approve {exceptions.length} exceptions</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-medium uppercase">Total</div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mt-2">{exceptions.length}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-medium uppercase">Pending Action</div>
          <div className="text-2xl font-bold mt-2" style={{ color: '#f59e0b' }}>{pendingCount}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-medium uppercase">Approved</div>
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--semantic-paid)' }}>{approvedCount}</div>
        </div>
      </div>

      {/* Exceptions List - Card View */}
      <div className="space-y-3">
        {exceptions.map(exception => {
          const TypeIcon = getTypeIcon(exception.type);
          const isExpanded = exception.expanded;
          const isPending = exception.status === 'pending';

          return (
            <div
              key={exception.id}
              className="rounded-lg border overflow-hidden transition-all"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: isPending ? 'rgba(245, 158, 11, 0.3)' : 'var(--border-primary)' }}
            >
              <div
                onClick={() => toggleExpand(exception.id)}
                className="p-4 cursor-pointer transition-colors"
                style={{ backgroundColor: isPending ? 'rgba(245, 158, 11, 0.05)' : 'transparent' }}
              >
                <div className="flex items-start gap-4 justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: `${getTypeBadgeColor(exception.type).replace('bg-', '').split('-')[0] === 'var' ? '#f59e0b15' : '#f59e0b15'}` }}>
                      <TypeIcon size={20} style={{ color: exception.status === 'pending' ? '#f59e0b' : 'var(--text-tertiary)' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-sm font-bold text-[var(--text-primary)]">{exception.jobRep}</h3>
                        <span className={`px-2 py-1 text-sm font-semibold rounded text-white ${getTypeBadgeColor(exception.type)}`}>
                          {getTypeLabel(exception.type)}
                        </span>
                        {isPending && <span className="px-2 py-1 text-sm font-bold rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>Action Needed</span>}
                      </div>
                      <div className="text-sm text-[var(--text-secondary)] mb-2">{exception.reason}</div>
                      <div className="flex items-center gap-3 text-sm text-[var(--text-tertiary)]">
                        <span>{exception.date.toLocaleDateString()}</span>
                        <span className={exception.amount < 0 ? 'text-[var(--semantic-risk)]' : 'text-[var(--text-secondary)]'}>
                          {exception.amount < 0 ? '-' : '+'}${Math.abs(exception.amount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      {exception.status === 'pending' && <div className="text-sm font-bold px-2 py-1 rounded" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>Pending</div>}
                      {exception.status === 'approved' && <div className="text-sm font-bold px-2 py-1 rounded text-[var(--semantic-paid)]" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>✓ Approved</div>}
                      {exception.status === 'denied' && <div className="text-sm font-bold px-2 py-1 rounded text-[var(--semantic-risk)]" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>✕ Denied</div>}
                    </div>
                    <ChevronDown size={20} className="text-[var(--text-tertiary)]" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="border-t p-4 space-y-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Details</h4>
                    <p className="text-sm text-[var(--text-secondary)]">{exception.details}</p>
                  </div>

                  {isPending && (
                    <div className="flex flex-col sm:flex-row gap-2 pt-2">
                      <button
                        onClick={() => handleApprove(exception.id)}
                        className="flex-1 px-4 py-2 text-sm bg-[var(--semantic-paid)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeny(exception.id)}
                        className="flex-1 px-4 py-2 text-sm bg-[var(--semantic-risk)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold flex items-center justify-center gap-1.5"
                      >
                        <XCircle size={16} />
                        Deny
                      </button>
                    </div>
                  )}

                  {exception.status === 'approved' && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--semantic-paid)] px-3 py-2 rounded" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <CheckCircle size={16} />
                      Approved and processed
                    </div>
                  )}

                  {exception.status === 'denied' && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--semantic-risk)] px-3 py-2 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                      <XCircle size={16} />
                      Denied
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
