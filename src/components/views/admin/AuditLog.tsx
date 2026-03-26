// @ts-nocheck
'use client';

import { useState } from 'react';
import { ChevronDown, Filter, Download } from 'lucide-react';

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
    // Mock export — no-op for demo
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
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Audit Log</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{entries.length} events recorded</p>
        </div>
        <button
          onClick={handleExport}
          className="px-5 py-2 bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-lg font-semibold hover:opacity-75 transition-opacity flex items-center gap-2"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Filter Bar */}
      <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Filter size={16} style={{ color: 'var(--text-secondary)' }} />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">Filters</h2>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase">Brand</label>
            <select
              value={filterBrand}
              onChange={e => setFilterBrand(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <option value="all">All Brands</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase">User</label>
            <select
              value={filterUser}
              onChange={e => setFilterUser(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <option value="all">All Users</option>
              {users.map(user => (
                <option key={user} value={user}>{user}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase">Action</label>
            <select
              value={filterAction}
              onChange={e => setFilterAction(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <option value="all">All Actions</option>
              {actions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase">From</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={e => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
              style={{ borderColor: 'var(--border-primary)' }}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2 uppercase">To</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={e => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
              style={{ borderColor: 'var(--border-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Audit Entries */}
      <div className="space-y-3">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12 text-[var(--text-secondary)]">
            <p className="text-sm">No entries match the selected filters</p>
          </div>
        ) : (
          filteredEntries.map(entry => (
            <div
              key={entry.id}
              className="rounded-lg border overflow-hidden transition-all"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
            >
              {/* Header */}
              <div
                onClick={() => toggleExpand(entry.id)}
                className="p-4 cursor-pointer transition-colors hover:opacity-90"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-2xl mt-0.5 flex-shrink-0">
                      {entry.action === 'Plan Update' && '📋'}
                      {entry.action === 'Commission Recalculation' && '🧮'}
                      {entry.action === 'Exception Approval' && '✅'}
                      {entry.action === 'SPIF Calculation' && '🎯'}
                      {entry.action === 'Clawback Applied' && '⚠️'}
                      {entry.action === 'Split Deal Configured' && '🔀'}
                      {entry.action === 'Handbook Published' && '📖'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[var(--text-primary)]">{entry.action}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                        {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 text-sm font-semibold rounded text-white bg-[var(--accent-blue)]">{entry.brand}</span>
                        <span className="text-sm text-[var(--text-secondary)]">by {entry.userName}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    size={20}
                    className="text-[var(--text-tertiary)] flex-shrink-0 mt-1 transition-transform"
                    style={{ transform: entry.expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </div>
              </div>

              {/* Expanded Details */}
              {entry.expanded && (
                <div className="border-t p-4 space-y-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
                  {/* Inputs */}
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2">Inputs</h4>
                    <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                      {entry.details.calculationInputs.map((input, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-[var(--text-tertiary)] mt-0.5 flex-shrink-0">•</span>
                          <span>{input}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Result */}
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2">Result</h4>
                    <div className="p-3 rounded text-sm text-[var(--text-primary)] bg-[var(--bg-card)]" style={{ borderLeft: '3px solid var(--accent-blue)' }}>
                      {entry.details.result}
                    </div>
                  </div>

                  {/* Affected */}
                  {entry.details.affectedReps && entry.details.affectedReps.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)] mb-2">Affected Reps</h4>
                      <div className="flex flex-wrap gap-2">
                        {entry.details.affectedReps.map((rep, idx) => (
                          <span key={idx} className="px-2.5 py-1 text-sm font-semibold rounded text-white bg-[var(--semantic-pending)]">
                            {rep}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Verified */}
                  <div className="p-3 rounded text-sm font-semibold flex items-center gap-2" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--semantic-paid)' }}>
                    <span>✓</span>
                    Audit trail verified and archived
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-semibold uppercase mb-2">Total Entries</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{filteredEntries.length}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-semibold uppercase mb-2">Unique Users</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{users.length}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-semibold uppercase mb-2">Action Types</div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{actions.length}</div>
        </div>
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="text-sm text-[var(--text-secondary)] font-semibold uppercase mb-2">Status</div>
          <div className="text-lg font-bold" style={{ color: 'var(--semantic-paid)' }}>PE-Compliant</div>
        </div>
      </div>
    </div>
  );
}
