'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface AckStat {
  date: string;
  status: 'acknowledged' | 'pending' | 'overdue';
}

export default function Acknowledgments() {
  const acknowledgedCount = 32;
  const pendingCount = 5;
  const totalCount = acknowledgedCount + pendingCount;
  const acknowledgedPercent = Math.round((acknowledgedCount / totalCount) * 100);

  const pendingReps = [
    { id: '1', name: 'Sarah Johnson', daysOverdue: 3, planName: 'Sales Tiered Plan' },
    { id: '2', name: 'Mike Chen', daysOverdue: 1, planName: 'Production Plan' },
    { id: '3', name: 'Jennifer Lee', daysOverdue: 5, planName: 'Draw Against Plan' },
    { id: '4', name: 'David Martinez', daysOverdue: 2, planName: 'Revenue Share Plan' },
    { id: '5', name: 'Emily White', daysOverdue: 0, planName: 'Salary Plus Bonus Plan' }
  ];

  const historyEntries = [
    { repName: 'Tom Bradley', planName: 'Sales Tiered Plan', timestamp: new Date('2026-03-24T14:30:00'), status: 'acknowledged' },
    { repName: 'Lisa Anderson', planName: 'Production Plan', timestamp: new Date('2026-03-24T10:15:00'), status: 'acknowledged' },
    { repName: 'Carlos Rodriguez', planName: 'Draw Against Plan', timestamp: new Date('2026-03-23T16:45:00'), status: 'acknowledged' },
    { repName: 'Amanda Foster', planName: 'Revenue Share Plan', timestamp: new Date('2026-03-23T09:20:00'), status: 'acknowledged' },
    { repName: 'James Wilson', planName: 'Salary Plus Bonus Plan', timestamp: new Date('2026-03-22T13:10:00'), status: 'acknowledged' },
    { repName: 'Rebecca Moore', planName: 'Sales Tiered Plan', timestamp: new Date('2026-03-22T11:30:00'), status: 'acknowledged' },
    { repName: 'Kevin Brown', planName: 'Production Plan', timestamp: new Date('2026-03-21T15:50:00'), status: 'acknowledged' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Commission Plan Acknowledgments</h1>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Acknowledged Card */}
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="text-sm text-[var(--color-text-secondary)] font-medium mb-3">Acknowledged</div>
            <div className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">{acknowledgedPercent}%</div>
            <div className="space-y-2">
              <div className="h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--color-success)]"
                  style={{ width: `${acknowledgedPercent}%` }}
                />
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                {acknowledgedCount} of {totalCount} reps
              </div>
            </div>
          </div>

          {/* Pending Card */}
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="text-sm text-[var(--color-text-secondary)] font-medium mb-3">Pending</div>
            <div className="text-3xl font-bold text-[var(--color-warning)] mb-3">{pendingCount}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Awaiting acknowledgment
            </div>
          </div>

          {/* Completed Card */}
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
            <div className="text-sm text-[var(--color-text-secondary)] font-medium mb-3">Completed</div>
            <div className="text-3xl font-bold text-[var(--color-success)] mb-3">{acknowledgedCount}</div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              Successfully acknowledged
            </div>
          </div>
        </div>
      </div>

      {/* Pending Reps Section */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Pending Acknowledgments</h2>
        <div className="space-y-3">
          {pendingReps.map(rep => (
            <div key={rep.id} className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-[var(--color-text-primary)]">{rep.name}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">{rep.planName}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`text-sm font-medium ${rep.daysOverdue > 0 ? 'text-[var(--color-error)]' : 'text-[var(--color-warning)]'}`}>
                  {rep.daysOverdue > 0 ? `${rep.daysOverdue} days overdue` : 'Due today'}
                </div>
                <button className="px-4 py-2 text-sm bg-[var(--color-button-secondary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-button-secondary-hover)] transition-colors">
                  Send Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* History Section */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Recent Acknowledgments</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Rep Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Plan</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Timestamp</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Status</th>
              </tr>
            </thead>
            <tbody>
              {historyEntries.map((entry, idx) => (
                <tr key={idx} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors">
                  <td className="py-3 px-4 text-sm text-[var(--color-text-primary)]">{entry.repName}</td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">{entry.planName}</td>
                  <td className="py-3 px-4 text-sm text-[var(--color-text-secondary)]">
                    {entry.timestamp.toLocaleDateString()} {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-success-bg)] text-[var(--color-success)]">
                      ✓ Acknowledged
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
