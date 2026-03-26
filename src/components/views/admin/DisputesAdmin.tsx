// @ts-nocheck
'use client';

import { useState } from 'react';
import { AlertCircle, Clock, CheckCircle, MessageSquare, Filter } from 'lucide-react';

interface Dispute {
  id: string;
  repName: string;
  dealName: string;
  reason: string;
  status: 'open' | 'in_review' | 'resolved';
  created: Date;
  assignedTo: string;
  messages: { author: string; timestamp: Date; text: string }[];
}

export default function DisputesAdmin() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);

  const disputes: Dispute[] = [
    {
      id: 'disp-001',
      repName: 'Sarah Johnson',
      dealName: 'Acme Corp Contract',
      reason: 'Commission calculation error - GP% mismatch',
      status: 'open',
      created: new Date('2026-03-22'),
      assignedTo: 'Unassigned',
      messages: [
        { author: 'Sarah Johnson', timestamp: new Date('2026-03-22T09:15:00'), text: 'I believe my commission was calculated incorrectly. The deal had 35% GP but I was paid at 28% rate.' },
        { author: 'Admin', timestamp: new Date('2026-03-22T14:30:00'), text: 'We are reviewing your calculation. Please provide the deal details.' }
      ]
    },
    {
      id: 'disp-002',
      repName: 'Mike Chen',
      dealName: 'TechFlow Systems',
      reason: 'Split credit dispute',
      status: 'in_review',
      created: new Date('2026-03-20'),
      assignedTo: 'Jennifer Lee',
      messages: [
        { author: 'Mike Chen', timestamp: new Date('2026-03-20T10:45:00'), text: 'I should receive full credit for this deal, not a 60/40 split.' },
        { author: 'Jennifer Lee', timestamp: new Date('2026-03-21T11:20:00'), text: 'Reviewing deal documentation and call recordings.' },
        { author: 'Jennifer Lee', timestamp: new Date('2026-03-22T09:00:00'), text: 'Need additional documentation from the customer.' }
      ]
    },
    {
      id: 'disp-003',
      repName: 'David Martinez',
      dealName: 'Global Industries',
      reason: 'Clawback applied incorrectly',
      status: 'resolved',
      created: new Date('2026-03-15'),
      assignedTo: 'Robert Kim',
      messages: [
        { author: 'David Martinez', timestamp: new Date('2026-03-15T13:20:00'), text: 'The deal is still performing well, why was clawback applied?' },
        { author: 'Robert Kim', timestamp: new Date('2026-03-16T10:00:00'), text: 'After review, clawback was applied in error. Reverting.' },
        { author: 'Robert Kim', timestamp: new Date('2026-03-17T15:45:00'), text: 'Correction processed. You should see adjustment in next payroll.' }
      ]
    },
    {
      id: 'disp-004',
      repName: 'Emily White',
      dealName: 'NextGen Solutions',
      reason: 'Territory assignment change',
      status: 'open',
      created: new Date('2026-03-23'),
      assignedTo: 'Unassigned',
      messages: [
        { author: 'Emily White', timestamp: new Date('2026-03-23T08:30:00'), text: 'Deal was in my territory. Why was it reassigned to another rep?' }
      ]
    },
    {
      id: 'disp-005',
      repName: 'Carlos Rodriguez',
      dealName: 'Premium Partners Inc',
      reason: 'Commission rate mismatch',
      status: 'in_review',
      created: new Date('2026-03-18'),
      assignedTo: 'Jennifer Lee',
      messages: [
        { author: 'Carlos Rodriguez', timestamp: new Date('2026-03-18T11:00:00'), text: 'My contract shows 8% rate but I was paid 6%.' },
        { author: 'Jennifer Lee', timestamp: new Date('2026-03-19T09:30:00'), text: 'Cross-checking your commission agreement.' }
      ]
    }
  ];

  const statusConfig = (status: string) => {
    const configs: Record<string, { color: string; icon: any; label: string }> = {
      'open': { color: '#f59e0b', icon: AlertCircle, label: 'Open' },
      'in_review': { color: 'var(--accent-blue)', icon: Clock, label: 'In Review' },
      'resolved': { color: 'var(--semantic-paid)', icon: CheckCircle, label: 'Resolved' }
    };
    return configs[status] || configs['open'];
  };

  const filteredDisputes = disputes.filter(d => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (filterBrand !== 'all') return false;
    if (filterDate !== 'all') return false;
    return true;
  });

  const openCount = disputes.filter(d => d.status === 'open').length;
  const inReviewCount = disputes.filter(d => d.status === 'in_review').length;
  const resolvedCount = disputes.filter(d => d.status === 'resolved').length;

  return (
    <div className="p-3 sm:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Disputes & Grievances</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{disputes.length} disputes total</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-medium uppercase">All Disputes</div>
          <div className="text-2xl font-bold text-[var(--text-primary)] mt-2">{disputes.length}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.05)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-medium uppercase">Open</div>
          <div className="text-2xl font-bold mt-2" style={{ color: '#f59e0b' }}>{openCount}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-medium uppercase">In Review</div>
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--accent-blue)' }}>{inReviewCount}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-medium uppercase">Resolved</div>
          <div className="text-2xl font-bold mt-2" style={{ color: 'var(--semantic-paid)' }}>{resolvedCount}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="rounded-lg border p-3 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
        <Filter size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_review">In Review</option>
          <option value="resolved">Resolved</option>
        </select>
        <select
          value={filterBrand}
          onChange={e => setFilterBrand(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <option value="all">All Brands</option>
          <option value="brand1">Brand A</option>
          <option value="brand2">Brand B</option>
        </select>
        <select
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="w-full sm:w-auto px-3 py-1.5 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
          style={{ borderColor: 'var(--border-primary)' }}
        >
          <option value="all">All Time</option>
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
          <option value="quarter">Last 90 Days</option>
        </select>
      </div>

      {/* Disputes List */}
      <div className="space-y-3">
        {filteredDisputes.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)]">No disputes found</div>
        ) : (
          filteredDisputes.map(dispute => {
            const config = statusConfig(dispute.status);
            const Icon = config.icon;
            return (
              <div
                key={dispute.id}
                onClick={() => setSelectedDispute(dispute)}
                className="rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${config.color}15` }}>
                    <Icon size={20} style={{ color: config.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="font-semibold text-[var(--text-primary)]">{dispute.dealName}</div>
                        <div className="text-sm text-[var(--text-secondary)] mt-0.5">{dispute.reason}</div>
                        <div className="flex items-center gap-3 mt-2 text-sm text-[var(--text-tertiary)]">
                          <span>Rep: {dispute.repName}</span>
                          <span>Assigned: {dispute.assignedTo}</span>
                          <span>{dispute.created.toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-sm font-semibold" style={{ backgroundColor: `${config.color}15`, color: config.color }}>
                          <Icon size={12} />
                          {config.label}
                        </div>
                        <div className="text-sm text-[var(--text-tertiary)] mt-2 flex items-center gap-1">
                          <MessageSquare size={12} />
                          {dispute.messages.length} messages
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Panel */}
      {selectedDispute && (
        <div className="rounded-lg border p-3 sm:p-6 fixed bottom-6 right-6 w-96 max-h-[70vh] overflow-y-auto" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <button
            onClick={() => setSelectedDispute(null)}
            className="absolute top-4 right-4 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
          >
            ×
          </button>

          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">{selectedDispute.dealName}</h3>

          <div className="space-y-4">
            <div>
              <div className="text-sm font-semibold text-[var(--text-secondary)] mb-1">REP</div>
              <div className="text-sm text-[var(--text-primary)]">{selectedDispute.repName}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text-secondary)] mb-1">REASON</div>
              <div className="text-sm text-[var(--text-primary)]">{selectedDispute.reason}</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text-secondary)] mb-1">STATUS</div>
              {(() => {
                const cfg = statusConfig(selectedDispute.status);
                const Icon = cfg.icon;
                return (
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold" style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
                    <Icon size={12} />
                    {cfg.label}
                  </div>
                );
              })()}
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text-secondary)] mb-1">ASSIGNED TO</div>
              <div className="text-sm text-[var(--text-primary)]">{selectedDispute.assignedTo}</div>
            </div>

            {/* Messages */}
            <div className="border-t pt-4" style={{ borderColor: 'var(--border-primary)' }}>
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Messages</h4>
              <div className="space-y-3">
                {selectedDispute.messages.map((msg, idx) => (
                  <div key={idx} className="text-sm rounded-lg p-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="font-semibold text-[var(--text-primary)]">{msg.author}</div>
                    <div className="text-[var(--text-tertiary)] text-sm mt-0.5">
                      {msg.timestamp.toLocaleDateString()} {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-[var(--text-secondary)] mt-1">{msg.text}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
