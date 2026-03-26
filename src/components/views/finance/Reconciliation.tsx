// @ts-nocheck
'use client';

import { useState } from 'react';
import { Check, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [showMatched, setShowMatched] = useState(false);
  const [resolvedPeriods, setResolvedPeriods] = useState<Set<string>>(new Set());

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
      notes: 'Deal adjustment for Cochran Exteriors applied after initial calculation',
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
      notes: 'Commission clawback for G. Fedale deal reversal',
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
  const varianceCount = reconciliationData.filter((r) => r.status === 'variance').length;
  const pendingCount = reconciliationData.filter((r) => r.status === 'pending').length;
  const actionNeededCount = varianceCount + pendingCount;

  const needsAttention = reconciliationData.filter(
    (r) => r.status === 'variance' || r.status === 'pending'
  );

  const matchRate = ((matchedCount / reconciliationData.length) * 100).toFixed(0);

  const getDetailForPeriod = (period: string) =>
    discrepancyDetails.find((d) => d.period === period);

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col bg-[var(--bg-primary)] p-3 sm:p-8">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <h1 className="text-[28px] font-bold text-[var(--text-primary)] mb-2">Reconciliation</h1>
        <p className="text-[14px] text-[var(--text-secondary)]">Match engine output to payroll actuals</p>
      </div>

      {/* Action-First Banner */}
      {actionNeededCount > 0 && (
        <div className="mb-6 flex-shrink-0 bg-gradient-to-r from-red-50 to-amber-50 border-l-4 border-[var(--accent-red)] rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-[var(--accent-red)] flex-shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                {actionNeededCount} {actionNeededCount === 1 ? 'item' : 'items'} need your review
              </p>
              <p className="text-[14px] text-[var(--text-secondary)]">
                {varianceCount} variance{varianceCount !== 1 ? 's' : ''} and {pendingCount} pending
              </p>
            </div>
          </div>
          <button onClick={() => { needsAttention.forEach(row => setResolvedPeriods(prev => new Set([...prev, row.period]))); }}
            className="px-4 py-2 bg-[var(--accent-red)] text-white text-[14px] font-medium rounded-md hover:bg-red-700 transition flex-shrink-0">
            Resolve
          </button>
        </div>
      )}

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 flex-shrink-0">
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-3 sm:p-4">
          <p className="text-[14px] text-[var(--text-secondary)] font-semibold uppercase mb-2">
            Total Matched
          </p>
          <p className="text-[24px] font-bold text-[var(--accent-green)]">
            ${(totalMatched / 1000).toFixed(0)}K
          </p>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            {matchedCount} periods
          </p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-4">
          <p className="text-[14px] text-[var(--text-secondary)] font-semibold uppercase mb-2">
            Total Variance $
          </p>
          <p className="text-[24px] font-bold text-[var(--accent-amber)]">
            ${needsAttention.reduce((sum, r) => sum + Math.abs(r.variance), 0).toLocaleString()}
          </p>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            {varianceCount} variance{varianceCount !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-4">
          <p className="text-[14px] text-[var(--text-secondary)] font-semibold uppercase mb-2">
            Pending Items
          </p>
          <p className="text-[24px] font-bold text-[var(--accent-blue)]">
            {pendingCount}
          </p>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            awaiting action
          </p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-4">
          <p className="text-[14px] text-[var(--text-secondary)] font-semibold uppercase mb-2">
            Match Rate
          </p>
          <p className="text-[24px] font-bold text-[var(--accent-green)]">
            {matchRate}%
          </p>
          <p className="text-[14px] text-[var(--text-secondary)] mt-1">
            of periods
          </p>
        </div>
      </div>

      {/* Split Panel: Left (Needs Attention) + Right (Detail) */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-6 flex-1 min-h-0">
        {/* Left: Periods needing attention */}
        <div className="flex-1 flex flex-col min-w-0">
          <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-3 flex-shrink-0">
            Periods Needing Attention
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {needsAttention.length > 0 ? (
              needsAttention.map((row) => (
                <button
                  key={row.period}
                  onClick={() => setSelectedPeriod(row.period)}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border transition-all',
                    selectedPeriod === row.period
                      ? 'bg-[var(--bg-secondary)] border-[var(--accent-blue)] ring-2 ring-[var(--accent-blue)] ring-opacity-20'
                      : 'bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--border-primary)]'
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-[var(--text-primary)] truncate">
                        {row.period}
                      </p>
                      <p className="text-[14px] text-[var(--text-secondary)] mt-1">
                        Variance: {row.variance >= 0 ? '+' : ''}${row.variance.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[14px] font-medium flex-shrink-0',
                        row.status === 'variance' && 'bg-amber-100 text-amber-700',
                        row.status === 'pending' && 'bg-blue-100 text-blue-700'
                      )}
                    >
                      {row.status === 'variance' && <AlertCircle className="w-3 h-3" />}
                      {row.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                      {row.status === 'variance' ? 'Variance' : 'Pending'}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-[var(--text-secondary)]">
                <p className="text-[14px]">All periods matched</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail panel */}
        <div className="w-full lg:w-96 flex flex-col flex-shrink-0 min-w-0">
          {selectedPeriod ? (
            <>
              <h2 className="text-[14px] font-semibold text-[var(--text-primary)] mb-3 flex-shrink-0">
                Details
              </h2>
              <div className="flex-1 overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-3 sm:p-5 space-y-5">
                {(() => {
                  const row = reconciliationData.find((r) => r.period === selectedPeriod);
                  const detail = getDetailForPeriod(selectedPeriod);
                  const isResolved = resolvedPeriods.has(selectedPeriod);
                  return (
                    <>
                      {isResolved && (
                        <div className="p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                          <Check className="w-4 h-4" />
                          <span className="text-sm font-semibold">Marked as resolved</span>
                        </div>
                      )}
                      {/* Top KPIs */}
                      <div className="space-y-4">
                        <div>
                          <p className="text-[14px] text-[var(--text-secondary)] font-semibold uppercase mb-1">
                            Expected
                          </p>
                          <p className="text-[18px] font-bold text-[var(--text-primary)]">
                            ${row?.expectedAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[14px] text-[var(--text-secondary)] font-semibold uppercase mb-1">
                            Actual
                          </p>
                          <p className="text-[18px] font-bold text-[var(--text-primary)]">
                            ${row?.actualAmount.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[14px] text-[var(--text-secondary)] font-semibold uppercase mb-1">
                            Variance
                          </p>
                          <p
                            className={cn(
                              'text-[18px] font-bold',
                              (row?.variance ?? 0) > 0
                                ? 'text-green-600'
                                : (row?.variance ?? 0) < 0
                                ? 'text-red-600'
                                : 'text-[var(--text-primary)]'
                            )}
                          >
                            {(row?.variance ?? 0) >= 0 ? '+' : ''}${(row?.variance ?? 0).toLocaleString()}{' '}
                            ({(row?.variancePercent ?? 0).toFixed(2)}%)
                          </p>
                        </div>
                      </div>

                      {detail && (
                        <>
                          <div className="h-px bg-[var(--border-subtle)]" />

                          <div>
                            <p className="text-[14px] text-[var(--text-secondary)] font-semibold uppercase mb-2">
                              Reason
                            </p>
                            <p className="text-[14px] text-[var(--text-primary)] font-medium">
                              {detail.reason}
                            </p>
                          </div>

                          <div>
                            <p className="text-[14px] text-[var(--text-secondary)] font-semibold uppercase mb-2">
                              Notes
                            </p>
                            <p className="text-[14px] text-[var(--text-primary)]">
                              {detail.notes}
                            </p>
                          </div>

                          <button onClick={() => setResolvedPeriods(prev => new Set([...prev, selectedPeriod]))}
                            className="w-full mt-4 px-4 py-2 text-white text-[14px] font-medium rounded-md transition"
                            style={{ backgroundColor: isResolved ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
                            {isResolved ? 'Resolved ✓' : 'Mark Resolved'}
                          </button>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">
              <p className="text-[14px]">Select a period to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Matched Periods Expandable */}
      {matchedCount > 0 && (
        <div className="mt-6 flex-shrink-0 border-t border-[var(--border-subtle)] pt-4">
          <button
            onClick={() => setShowMatched(!showMatched)}
            className="flex items-center gap-2 text-[14px] font-medium text-[var(--accent-blue)] hover:text-blue-700 transition"
          >
            {showMatched ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            View {matchedCount} matched {matchedCount === 1 ? 'period' : 'periods'}
          </button>
          {showMatched && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {reconciliationData
                .filter((r) => r.status === 'matched')
                .map((row) => (
                  <div key={row.period} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-lg p-2 sm:p-3">
                    <div className="flex items-center gap-1 mb-2">
                      <Check className="w-4 h-4 text-[var(--accent-green)]" />
                      <p className="text-[14px] font-semibold text-[var(--text-primary)]">
                        {row.period}
                      </p>
                    </div>
                    <p className="text-[14px] text-[var(--text-secondary)]">
                      ${row.expectedAmount.toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
