'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AuditEntry {
  id: string;
  timestamp: Date;
  userName: string;
  action: string;
  brand: string;
  details: {
    calculationInputs: string[];
    result: string;
    affectedReps?: string[];
  };
  expanded?: boolean;
}

export default function AuditLog() {
  const [filterBrand, setFilterBrand] = useState<string>('all');
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  const [entries, setEntries] = useState<AuditEntry[]>([
    {
      id: 'audit-001',
      timestamp: new Date('2026-03-25T15:30:00'),
      userName: 'Sarah Admin',
      action: 'Plan Update',
      brand: 'Brand A',
      details: {
        calculationInputs: ['GP% Tier thresholds modified', 'Rate adjustments applied to all tiers'],
        result: 'Plan v2.1 published to 42 reps',
        affectedReps: ['42 reps in Brand A']
      }
    },
    {
      id: 'audit-002',
      timestamp: new Date('2026-03-25T14:15:00'),
      userName: 'Robert Kim',
      action: 'Commission Recalculation',
      brand: 'Brand B',
      details: {
        calculationInputs: ['Rep: Mike Chen', 'Period: March 2026', 'Deal adjustment applied'],
        result: 'Commission adjusted from $15,200 to $16,800 (+$1,600)',
        affectedReps: ['Mike Chen']
      }
    },
    {
      id: 'audit-003',
      timestamp: new Date('2026-03-25T10:45:00'),
      userName: 'Jennifer Lee',
      action: 'Exception Approval',
      brand: 'Brand A',
      details: {
        calculationInputs: ['Exception Type: High Commission', 'Amount: $45,000', 'Rep: Sarah Johnson'],
        result: 'Exception APPROVED - Deal validated per compliance',
        affectedReps: ['Sarah Johnson']
      }
    },
    {
      id: 'audit-004',
      timestamp: new Date('2026-03-24T16:20:00'),
      userName: 'Sarah Admin',
      action: 'SPIF Calculation',
      brand: 'Brand C',
      details: {
        calculationInputs: ['SPIF: Q1 Enterprise Push', 'Participation: 38 reps', 'Trigger: $100K+ deals'],
        result: 'Total payout: $95,000 across 38 reps',
        affectedReps: ['38 participating reps']
      }
    },
    {
      id: 'audit-005',
      timestamp: new Date('2026-03-24T13:00:00'),
      userName: 'Robert Kim',
      action: 'Clawback Applied',
      brand: 'Brand B',
      details: {
        calculationInputs: ['Deal: Tech Systems (David Martinez)', 'Cancellation date: 45 days post-sale', 'Commission: $8,750'],
        result: 'Clawback processed - rep notified',
        affectedReps: ['David Martinez']
      }
    },
    {
      id: 'audit-006',
      timestamp: new Date('2026-03-23T11:30:00'),
      userName: 'Jennifer Lee',
      action: 'Split Deal Configured',
      brand: 'Brand A',
      details: {
        calculationInputs: ['Split Type: Canvasser/Closer', 'Ratio: 30/70', 'Tier Impact: Full Credit'],
        result: 'Configuration applied to 156 open deals',
        affectedReps: ['Multiple reps with pending splits']
      }
    },
    {
      id: 'audit-007',
      timestamp: new Date('2026-03-22T09:15:00'),
      userName: 'Sarah Admin',
      action: 'Handbook Published',
      brand: 'Brand C',
      details: {
        calculationInputs: ['Handbook Version: 3.2', 'Sections: 8 updated', 'Acknowledgment required: Yes'],
        result: 'Handbook sent to 35 reps - 28 acknowledged',
        affectedReps: ['35 reps in Brand C']
      }
    }
  ]);

  const toggleExpand = (id: string) => {
    setEntries(prev => prev.map(entry =>
      entry.id === id ? { ...entry, expanded: !entry.expanded } : entry
    ));
  };

  const handleExport = () => {
    // Mock export
    console.log('Exporting audit log for auditor...');
  };

  const filteredEntries = entries.filter(entry => {
    if (filterBrand !== 'all' && entry.brand !== filterBrand) return false;
    if (filterUser !== 'all' && entry.userName !== filterUser) return false;
    if (filterAction !== 'all' && entry.action !== filterAction) return false;
    if (filterDateFrom && entry.timestamp < new Date(filterDateFrom)) return false;
    if (filterDateTo && entry.timestamp > new Date(filterDateTo)) return false;
    return true;
  });

  const brands = Array.from(new Set(entries.map(e => e.brand)));
  const users = Array.from(new Set(entries.map(e => e.userName)));
  const actions = Array.from(new Set(entries.map(e => e.action)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Audit Log</h1>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-[var(--color-button-secondary)] text-[var(--color-text-primary)] rounded-lg font-medium hover:bg-[var(--color-button-secondary-hover)] transition-colors flex items-center gap-2"
        >
          📥 Export for Auditor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-4">
        <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-4">Filters</h2>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">Brand</label>
            <select
              value={filterBrand}
              onChange={e => setFilterBrand(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
            >
              <option value="all">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">User</label>
            <select
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">Action</label>
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
            >
              <option value="all">All Actions</option>
              {actions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">From Date</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={e => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2">To Date</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={e => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
            />
          </div>
        </div>
      </div>

      {/* Audit Entries Timeline */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-secondary)]">
            No entries match the selected filters
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div key={entry.id} className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg overflow-hidden">
              {/* Entry Header */}
              <div
                onClick={() => toggleExpand(entry.id)}
                className="p-4 cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-2xl">
                        {entry.action === 'Plan Update' && '📋'}
                        {entry.action === 'Commission Recalculation' && '🧮'}
                        {entry.action === 'Exception Approval' && '✅'}
                        {entry.action === 'SPIF Calculation' && '🎯'}
                        {entry.action === 'Clawback Applied' && '⚠️'}
                        {entry.action === 'Split Deal Configured' && '🔀'}
                        {entry.action === 'Handbook Published' && '📖'}
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--color-text-primary)]">{entry.action}</div>
                        <div className="text-sm text-[var(--color-text-secondary)]">
                          {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-badge-blue)] text-white">{entry.brand}</span>
                      <span className="text-sm text-[var(--color-text-secondary)]">by {entry.userName}</span>
                      <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-badge-teal)] text-white">PE-Grade</span>
                    </div>
                  </div>
                  <div className="text-2xl text-[var(--color-text-tertiary)]">
                    {entry.expanded ? '−' : '+'}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {entry.expanded && (
                <div className="border-t border-[var(--color-border)] p-4 bg-[var(--color-bg-secondary)] space-y-4">
                  {/* Calculation Inputs */}
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Calculation Inputs</h4>
                    <ul className="space-y-1">
                      {entry.details.calculationInputs.map((input, idx) => (
                        <li key={idx} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                          <span className="text-[var(--color-text-tertiary)] mt-0.5">•</span>
                          <span>{input}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Result */}
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Result</h4>
                    <div className="bg-[var(--color-bg-primary)] p-3 rounded text-sm text-[var(--color-text-primary)]">
                      {entry.details.result}
                    </div>
                  </div>

                  {/* Affected Reps */}
                  {entry.details.affectedReps && entry.details.affectedReps.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Affected Reps/Deals</h4>
                      <div className="flex flex-wrap gap-2">
                        {entry.details.affectedReps.map((rep, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs rounded bg-[var(--color-badge-amber)] text-white">
                            {rep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Audit Trail Note */}
                  <div className="bg-[var(--color-success-bg)] border border-[var(--color-success)] rounded p-3">
                    <div className="text-xs text-[var(--color-success)] font-medium">✓ Audit Trail Complete</div>
                    <div className="text-xs text-[var(--color-success)] mt-1">Full calculation details stored and verified</div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Total Entries</div>
          <div className="text-2xl font-bold text-[var(--color-text-primary)]">{filteredEntries.length}</div>
        </div>
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Unique Users</div>
          <div className="text-2xl font-bold text-[var(--color-text-primary)]">{users.length}</div>
        </div>
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Actions Tracked</div>
          <div className="text-2xl font-bold text-[var(--color-text-primary)]">{actions.length}</div>
        </div>
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-4">
          <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-1">Certification Status</div>
          <div className="text-lg font-bold text-[var(--color-success)]">PE-Compliant</div>
        </div>
      </div>
    </div>
  );
}
