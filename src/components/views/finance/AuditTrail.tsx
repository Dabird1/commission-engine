'use client';

import { useState } from 'react';
import { auditEntries } from '@/data/sample-data';
import { cn } from '@/lib/utils';

interface AuditTimelineEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
  details?: {
    inputs?: string[];
    rulesApplied?: string[];
    output?: string;
  };
  expanded?: boolean;
}

export default function AuditTrail() {
  const [dateFrom, setDateFrom] = useState('2025-09-01');
  const [dateTo, setDateTo] = useState('2026-03-25');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [userFilter, setUserFilter] = useState('');
  const [actionType, setActionType] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Mock timeline data with detailed entries
  const timelineData: AuditTimelineEntry[] = [
    {
      id: 'audit-1',
      timestamp: '2025-05-22T10:30:00Z',
      user: 'Aaron Bagurdes',
      action: 'Deal Created',
      description: 'Bill Peters Roofing ($82,000)',
      details: {
        inputs: [
          'Customer: Bill Peters',
          'Job Type: Roofing',
          'FCV: $82,000',
          'GP%: 45.2%',
          'Brand: Apex Roofing',
        ],
        rulesApplied: [
          'Tiered commission rate applied: 45%+ GP = 10%',
          'Front/back split: 50/50',
          'Payment trigger: Final payment',
        ],
        output: 'Total Commission: $8,200 | Front: $4,100 | Back: $4,100',
      },
    },
    {
      id: 'audit-2',
      timestamp: '2025-09-01T14:15:00Z',
      user: 'Jay Teresi',
      action: 'Adjustment Applied',
      description: 'Jim Cardo Roofing: FCV reduced 14K → 12K',
      details: {
        inputs: [
          'Deal ID: deal-1',
          'Adjustment Type: Change Order',
          'Original FCV: $14,000',
          'New FCV: $12,000',
          'Reason: Scope reduction',
        ],
        rulesApplied: [
          'Commission rate: 9% (tiered based on GP)',
          'Recalculated commission: $1,080',
          'Original commission: $1,260',
        ],
        output: 'Adjustment: -$180 | New Total: $1,080',
      },
    },
    {
      id: 'audit-3',
      timestamp: '2025-12-01T08:00:00Z',
      user: 'System',
      action: 'Payment Processed',
      description: 'Front-end commission paid (Bekki & Ryan Kaminski)',
      details: {
        inputs: [
          'Deal ID: deal-20',
          'Commission Type: Front-end',
          'Amount: $1,350',
          'Payment Method: ACH',
        ],
        rulesApplied: [
          'Payment trigger: Job complete',
          'Front-end eligibility verified',
          'Tax withholding applied',
        ],
        output: 'Payment ID: PAY-2025-12-001 | Status: Processed',
      },
    },
    {
      id: 'audit-4',
      timestamp: '2025-10-16T11:45:00Z',
      user: 'Sarah HR',
      action: 'Exception Reviewed',
      description: 'Maria Santos Clawback approved',
      details: {
        inputs: [
          'Exception ID: exc-3',
          'Type: Clawback',
          'Reason: Deal reversal',
          'Original Commission: $2,100',
        ],
        rulesApplied: [
          'Clawback policy applied',
          'Manager approval required: YES',
          'Payroll impact: Negative',
        ],
        output: 'Clawback Amount: $2,100 | Status: Applied',
      },
    },
    {
      id: 'audit-5',
      timestamp: '2025-07-10T09:20:00Z',
      user: 'Jay Teresi',
      action: 'Deal Status Updated',
      description: 'Eric & Candice Lee Windows → in_progress',
      details: {
        inputs: [
          'Deal ID: deal-4',
          'Old Status: quoted',
          'New Status: in_progress',
          'Updated At: 2025-07-10T09:20:00Z',
        ],
        rulesApplied: [
          'Status transition validation passed',
          'No commission impact at this stage',
        ],
        output: 'Status: in_progress | Commission State: Unchanged',
      },
    },
  ];

  const handleExport = () => {
    console.log('Exporting pay period audit trail...');
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredEntries = timelineData.filter((entry) => {
    const userMatch = entry.user.toLowerCase().includes(userFilter.toLowerCase());
    const actionMatch = actionType === 'all' || entry.action === actionType;
    return userMatch && actionMatch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Audit Trail</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">Complete calculation history with full traceability</p>
        </div>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition"
        >
          Export Pay Period
        </button>
      </div>

      {/* Compliance Badge */}
      <div className="bg-[#f0f9ff] border border-[#0284c7] rounded-lg p-4 flex items-start gap-3">
        <div className="text-2xl">🔒</div>
        <div>
          <p className="font-semibold text-[#0284c7]">PE-Grade Compliance</p>
          <p className="text-sm text-[#0369a1] mt-1">
            Every calculation preserves inputs, plan version, rate applied, and timestamp
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Filters</h2>
        <div className="grid grid-cols-4 gap-4">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
            />
          </div>

          {/* Brand Dropdown */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
            >
              <option value="all">All Brands</option>
              <option value="apex">Apex Roofing</option>
              <option value="summit">Summit Windows</option>
              <option value="shield">Shield Siding</option>
              <option value="peak">Peak Gutters</option>
              <option value="crown">Crown Exteriors</option>
            </select>
          </div>

          {/* User Filter */}
          <div>
            <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">User</label>
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Filter by user..."
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
            />
          </div>
        </div>

        {/* Action Type */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Action Type</label>
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
          >
            <option value="all">All Actions</option>
            <option value="Deal Created">Deal Created</option>
            <option value="Adjustment Applied">Adjustment Applied</option>
            <option value="Payment Processed">Payment Processed</option>
            <option value="Exception Reviewed">Exception Reviewed</option>
            <option value="Deal Status Updated">Deal Status Updated</option>
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Timeline Entries</h2>
        {filteredEntries.length === 0 ? (
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-8 text-center">
            <p className="text-[var(--color-text-secondary)]">No entries match your filters</p>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div key={entry.id} className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg overflow-hidden">
              <button
                onClick={() => toggleExpand(entry.id)}
                className="w-full text-left p-4 hover:bg-[var(--color-bg-secondary)] transition flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {entry.action === 'Deal Created' && '📝'}
                      {entry.action === 'Adjustment Applied' && '🔧'}
                      {entry.action === 'Payment Processed' && '💰'}
                      {entry.action === 'Exception Reviewed' && '⚠️'}
                      {entry.action === 'Deal Status Updated' && '✏️'}
                    </span>
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)]">{entry.action}</p>
                      <p className="text-sm text-[var(--color-text-secondary)]">{entry.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)] ml-11">
                    <span>{entry.user}</span>
                    <span>•</span>
                    <span>{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <span className="text-[var(--color-text-secondary)] ml-2">
                  {expandedId === entry.id ? '▼' : '▶'}
                </span>
              </button>

              {expandedId === entry.id && entry.details && (
                <div className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    {/* Inputs */}
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)] mb-2">Inputs Used</p>
                      <ul className="space-y-1 text-[var(--color-text-secondary)]">
                        {entry.details.inputs?.map((input, idx) => (
                          <li key={idx} className="text-xs">• {input}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Rules */}
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)] mb-2">Rules Applied</p>
                      <ul className="space-y-1 text-[var(--color-text-secondary)]">
                        {entry.details.rulesApplied?.map((rule, idx) => (
                          <li key={idx} className="text-xs">• {rule}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Output */}
                    <div>
                      <p className="font-semibold text-[var(--color-text-primary)] mb-2">Output</p>
                      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded p-2 font-mono text-xs text-[var(--color-text-primary)]">
                        {entry.details.output}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
