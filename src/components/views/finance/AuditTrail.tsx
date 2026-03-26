// @ts-nocheck
'use client';

import { useState } from 'react';
import { Shield, FileText, Wrench, DollarSign, AlertCircle, Edit } from 'lucide-react';
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
          'Brand: Infinity Exteriors',
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
    // Extract brand from the first detail (if available) or use default
    const getBrandFromEntry = (entry: AuditTimelineEntry) => {
      const brandMatch = entry.details?.inputs?.find((input) =>
        input.includes('Brand:')
      );
      if (brandMatch) {
        return brandMatch.replace('Brand: ', '');
      }
      return 'N/A';
    };

    // Build CSV header
    const headers = ['Action Type', 'Description', 'User', 'Date', 'Brand'];
    const csvRows: string[] = [headers.join(',')];

    // Add filtered entries as CSV rows
    filteredEntries.forEach((entry) => {
      const brand = getBrandFromEntry(entry);
      const date = new Date(entry.timestamp).toLocaleString();
      const row = [
        `"${entry.action}"`,
        `"${entry.description}"`,
        `"${entry.user}"`,
        `"${date}"`,
        `"${brand}"`,
      ].join(',');
      csvRows.push(row);
    });

    // Create blob and trigger download
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `audit-trail-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredEntries = timelineData.filter((entry) => {
    const userMatch = entry.user.toLowerCase().includes(userFilter.toLowerCase());
    const actionMatch = actionType === 'all' || entry.action === actionType;
    return userMatch && actionMatch;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Deal Created':
        return <FileText className="w-5 h-5" />;
      case 'Adjustment Applied':
        return <Wrench className="w-5 h-5" />;
      case 'Payment Processed':
        return <DollarSign className="w-5 h-5" />;
      case 'Exception Reviewed':
        return <AlertCircle className="w-5 h-5" />;
      case 'Deal Status Updated':
        return <Edit className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[var(--text-primary)] mb-1">Audit Trail</h1>
          <p className="text-[16px] text-[var(--text-secondary)]">
            Complete calculation history with full traceability
          </p>
        </div>
        <button
          onClick={handleExport}
          className="px-5 py-2.5 bg-[var(--accent-blue)] text-white rounded-lg text-[14px] font-medium hover:opacity-90 transition"
        >
          Export Pay Period
        </button>
      </div>

      {/* PE-Grade Compliance Badge */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 flex items-start gap-4">
        <div className="mt-0.5">
          <Shield className="w-6 h-6 text-blue-700" />
        </div>
        <div>
          <p className="text-[16px] font-semibold text-blue-900 mb-1">PE-Grade Compliance</p>
          <p className="text-[14px] text-blue-800">
            Every calculation preserves inputs, plan version, rate applied, and timestamp for full auditability
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-6">
        <h2 className="text-[20px] font-semibold text-[var(--text-primary)] mb-5">Filters</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-[14px] font-medium text-[var(--text-secondary)] mb-2 uppercase">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-[14px]"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[var(--text-secondary)] mb-2 uppercase">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-[14px]"
            />
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[var(--text-secondary)] mb-2 uppercase">
              Brand
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-[14px]"
            >
              <option value="all">All Brands</option>
              <option value="apex">Infinity Exteriors</option>
              <option value="summit">Overhead Solutions</option>
              <option value="shield">G. Fedale</option>
              <option value="peak">Werner Roofing</option>
              <option value="crown">Cochran Exteriors</option>
            </select>
          </div>

          <div>
            <label className="block text-[14px] font-medium text-[var(--text-secondary)] mb-2 uppercase">
              User
            </label>
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Type name..."
              className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-[14px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[14px] font-medium text-[var(--text-secondary)] mb-2 uppercase">
            Action Type
          </label>
          <select
            value={actionType}
            onChange={(e) => setActionType(e.target.value)}
            className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-[14px]"
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
      <div>
        <h2 className="text-[20px] font-semibold text-[var(--text-primary)] mb-4">
          Timeline ({filteredEntries.length})
        </h2>

        {filteredEntries.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-8 text-center">
            <p className="text-[16px] text-[var(--text-secondary)]">No entries match your filters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg overflow-hidden hover:border-[var(--accent-blue)] transition"
              >
                <button
                  onClick={() => toggleExpand(entry.id)}
                  className="w-full text-left p-5 hover:bg-[var(--bg-secondary)] transition flex items-start justify-between group"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="text-[var(--accent-blue)] mt-1">
                        {getActionIcon(entry.action)}
                      </div>
                      <div className="flex-1">
                        <p className="text-[16px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition">
                          {entry.action}
                        </p>
                        <p className="text-[14px] text-[var(--text-secondary)] mt-1">
                          {entry.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[14px] text-[var(--text-secondary)] pl-9">
                      <span className="font-medium">{entry.user}</span>
                      <span className="text-[var(--border-primary)]">•</span>
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  <span className={cn(
                    'text-[var(--text-secondary)] ml-3 transition-transform',
                    expandedId === entry.id && 'rotate-180'
                  )}>
                    ▼
                  </span>
                </button>

                {expandedId === entry.id && entry.details && (
                  <div className="border-t border-[var(--border-primary)] bg-[var(--bg-secondary)] p-6">
                    <div className="grid grid-cols-3 gap-6">
                      {/* Inputs */}
                      <div>
                        <p className="text-[14px] font-semibold text-[var(--text-secondary)] uppercase mb-3">
                          Inputs Used
                        </p>
                        <ul className="space-y-2">
                          {entry.details.inputs?.map((input, idx) => (
                            <li key={idx} className="text-[14px] text-[var(--text-primary)] flex gap-2">
                              <span className="text-[var(--text-secondary)]">•</span>
                              <span>{input}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Rules */}
                      <div>
                        <p className="text-[14px] font-semibold text-[var(--text-secondary)] uppercase mb-3">
                          Rules Applied
                        </p>
                        <ul className="space-y-2">
                          {entry.details.rulesApplied?.map((rule, idx) => (
                            <li key={idx} className="text-[14px] text-[var(--text-primary)] flex gap-2">
                              <span className="text-[var(--text-secondary)]">•</span>
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Output */}
                      <div>
                        <p className="text-[14px] font-semibold text-[var(--text-secondary)] uppercase mb-3">
                          Calculated Output
                        </p>
                        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-3 font-mono text-[14px] text-[var(--text-primary)] leading-relaxed">
                          {entry.details.output}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
