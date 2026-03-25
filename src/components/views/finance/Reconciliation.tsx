'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ReconciliationRow {
  period: string;
  expectedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  status: 'matched' | 'variance' | 'pending';
}

interface DiscrepancyDetail {
  period: string;
  expectedAmount: number;
  actualAmount: number;
  variance: number;
  variancePercent: number;
  status: 'matched' | 'variance' | 'pending';
  reason?: string;
  notes?: string;
}

export default function Reconciliation() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const reconciliationData: ReconciliationRow[] = [
    {
      period: 'Feb 1-15, 2026',
      expectedAmount: 23450,
      actualAmount: 23450,
      variance: 0,
      variancePercent: 0,
      status: 'matched',
    },
    {
      period: 'Jan 16-31, 2026',
      expectedAmount: 21800,
      actualAmount: 21800,
      variance: 0,
      variancePercent: 0,
      status: 'matched',
    },
    {
      period: 'Jan 1-15, 2026',
      expectedAmount: 24500,
      actualAmount: 24675,
      variance: 175,
      variancePercent: 0.71,
      status: 'variance',
    },
    {
      period: 'Dec 16-31, 2025',
      expectedAmount: 22300,
      actualAmount: 22150,
      variance: -150,
      variancePercent: -0.67,
      status: 'pending',
    },
    {
      period: 'Dec 1-15, 2025',
      expectedAmount: 25600,
      actualAmount: 25600,
      variance: 0,
      variancePercent: 0,
      status: 'matched',
    },
    {
      period: 'Nov 16-30, 2025',
      expectedAmount: 23100,
      actualAmount: 22960,
      variance: -140,
      variancePercent: -0.61,
      status: 'variance',
    },
    {
      period: 'Nov 1-15, 2025',
      expectedAmount: 26450,
      actualAmount: 26450,
      variance: 0,
      variancePercent: 0,
      status: 'matched',
    },
    {
      period: 'Oct 16-31, 2025',
      expectedAmount: 21200,
      actualAmount: 21315,
      variance: 115,
      variancePercent: 0.54,
      status: 'pending',
    },
  ];

  const discrepancyDetails: DiscrepancyDetail[] = [
    {
      period: 'Jan 1-15, 2026',
      expectedAmount: 24500,
      actualAmount: 24675,
      variance: 175,
      variancePercent: 0.71,
      status: 'variance',
      reason: 'Late adjustment entry',
      notes: 'Deal adjustment for Crown Exteriors applied after initial calculation',
    },
    {
      period: 'Dec 16-31, 2025',
      expectedAmount: 22300,
      actualAmount: 22150,
      variance: -150,
      variancePercent: -0.67,
      status: 'pending',
      reason: 'Under investigation',
      notes: 'Reviewing payroll sync timing with Paycor',
    },
    {
      period: 'Nov 16-30, 2025',
      expectedAmount: 23100,
      actualAmount: 22960,
      variance: -140,
      variancePercent: -0.61,
      status: 'variance',
      reason: 'Clawback applied',
      notes: 'Commission clawback for Shield Siding deal reversal',
    },
    {
      period: 'Oct 16-31, 2025',
      expectedAmount: 21200,
      actualAmount: 21315,
      variance: 115,
      variancePercent: 0.54,
      status: 'pending',
      reason: 'Waiting for verification',
      notes: 'Split commission allocation pending final approval',
    },
  ];

  const matchedCount = reconciliationData.filter((r) => r.status === 'matched').length;
  const totalMatched = reconciliationData
    .filter((r) => r.status === 'matched')
    .reduce((sum, r) => sum + r.expectedAmount, 0);
  const totalVariance = Math.abs(
    reconciliationData.reduce((sum, r) => sum + r.variance, 0)
  );
  const pendingCount = reconciliationData.filter((r) => r.status === 'pending').length;

  const handleDrill = (period: string) => {
    setExpandedRow(expandedRow === period ? null : period);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Reconciliation</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Match engine output to payroll actuals</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">Matched</p>
          <p className="text-3xl font-bold text-[var(--color-success)]">${(totalMatched / 1000).toFixed(0)}K</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">{matchedCount} pay periods</p>
        </div>
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">Variance</p>
          <p className="text-3xl font-bold text-[var(--color-warning)]">${(totalVariance / 1000).toFixed(1)}K</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">Total discrepancies</p>
        </div>
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
          <p className="text-sm text-[var(--color-text-secondary)] mb-2">Pending Review</p>
          <p className="text-3xl font-bold text-[var(--color-primary)]">{pendingCount}</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-2">items awaiting review</p>
        </div>
      </div>

      {/* Discrepancy Table */}
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Discrepancy Details</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Period</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Expected</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Actual</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Variance</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">%</th>
                <th className="text-center py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Status</th>
                <th className="text-center py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Action</th>
              </tr>
            </thead>
            <tbody>
              {reconciliationData.map((row) => (
                <div key={row.period}>
                  <tr className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-secondary)] cursor-pointer"
                    onClick={() => handleDrill(row.period)}>
                    <td className="py-3 px-4 text-[var(--color-text-primary)] font-medium">{row.period}</td>
                    <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono">
                      ${row.expectedAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono">
                      ${row.actualAmount.toLocaleString()}
                    </td>
                    <td className={cn(
                      'py-3 px-4 text-right font-mono font-semibold',
                      row.variance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
                    )}>
                      ${row.variance.toLocaleString()}
                    </td>
                    <td className={cn(
                      'py-3 px-4 text-right font-mono',
                      row.variance >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-error)]'
                    )}>
                      {row.variance >= 0 ? '+' : ''}{row.variancePercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={cn(
                          'inline-block px-3 py-1 rounded-full text-xs font-medium',
                          row.status === 'matched' && 'bg-[#dbeafe] text-[#065f46]',
                          row.status === 'variance' && 'bg-[#fef3c7] text-[#92400e]',
                          row.status === 'pending' && 'bg-[#e0e7ff] text-[#3730a3]'
                        )}
                      >
                        {row.status === 'matched' && 'Matched'}
                        {row.status === 'variance' && 'Variance'}
                        {row.status === 'pending' && 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="text-[var(--color-primary)] text-xs font-medium hover:underline"
                      >
                        {expandedRow === row.period ? '▼ Details' : '▶ Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRow === row.period && (
                    <tr className="bg-[var(--color-bg-secondary)] border-b border-[var(--color-border)]">
                      <td colSpan={7} className="py-4 px-4">
                        {discrepancyDetails
                          .filter((d) => d.period === row.period)
                          .map((detail) => (
                            <div key={detail.period} className="space-y-2">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-[var(--color-text-secondary)]">Reason</p>
                                  <p className="text-[var(--color-text-primary)] font-medium">{detail.reason}</p>
                                </div>
                                <div>
                                  <p className="text-[var(--color-text-secondary)]">Notes</p>
                                  <p className="text-[var(--color-text-primary)]">{detail.notes}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                      </td>
                    </tr>
                  )}
                </div>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
