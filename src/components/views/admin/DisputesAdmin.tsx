'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

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

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-[var(--color-badge-amber)]';
      case 'in_review':
        return 'bg-[var(--color-badge-blue)]';
      case 'resolved':
        return 'bg-[var(--color-success-bg)]';
      default:
        return 'bg-[var(--color-badge-gray)]';
    }
  };

  const filteredDisputes = disputes.filter(d => {
    if (filterStatus !== 'all' && d.status !== filterStatus) return false;
    if (filterBrand !== 'all') return false; // Mock brand filter
    if (filterDate !== 'all') return false; // Mock date filter
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Disputes & Grievances</h1>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_review">In Review</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Brand</label>
            <select
              value={filterBrand}
              onChange={e => setFilterBrand(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm"
            >
              <option value="all">All Brands</option>
              <option value="brand1">Brand A</option>
              <option value="brand2">Brand B</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Date Range</label>
            <select
              value={filterDate}
              onChange={e => setFilterDate(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] text-sm"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Disputes Table */}
        <div className="col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Rep</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Deal</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Reason</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredDisputes.map(dispute => (
                  <tr
                    key={dispute.id}
                    onClick={() => setSelectedDispute(dispute)}
                    className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">{dispute.repName}</td>
                    <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">{dispute.dealName}</td>
                    <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">{dispute.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded text-white ${statusBadgeColor(dispute.status)}`}>
                        {dispute.status === 'in_review' ? 'In Review' : dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">{dispute.created.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispute Details */}
        <div className="col-span-1">
          {selectedDispute ? (
            <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Dispute Details</h3>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Rep</div>
                  <div className="text-sm text-[var(--color-text-primary)]">{selectedDispute.repName}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Deal</div>
                  <div className="text-sm text-[var(--color-text-primary)]">{selectedDispute.dealName}</div>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Status</div>
                  <span className={`px-2 py-1 text-xs font-medium rounded text-white ${statusBadgeColor(selectedDispute.status)}`}>
                    {selectedDispute.status === 'in_review' ? 'In Review' : selectedDispute.status.charAt(0).toUpperCase() + selectedDispute.status.slice(1)}
                  </span>
                </div>
                <div>
                  <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Assigned To</div>
                  <div className="text-sm text-[var(--color-text-primary)]">{selectedDispute.assignedTo}</div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Message Thread</h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedDispute.messages.map((msg, idx) => (
                    <div key={idx} className="bg-[var(--color-bg-secondary)] p-3 rounded text-xs">
                      <div className="font-medium text-[var(--color-text-primary)] mb-1">{msg.author}</div>
                      <div className="text-[var(--color-text-secondary)] text-xs mb-1">
                        {msg.timestamp.toLocaleDateString()} {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-[var(--color-text-primary)]">{msg.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6 text-center">
              <div className="text-[var(--color-text-secondary)]">Select a dispute to view details</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
