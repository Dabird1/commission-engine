// @ts-nocheck
'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, Clock, Mail, Send } from 'lucide-react';

export default function Acknowledgments() {
  const acknowledgedCount = 32;
  const pendingCount = 5;
  const overdueCount = 2;
  const totalCount = acknowledgedCount + pendingCount + overdueCount;
  const acknowledgedPercent = Math.round((acknowledgedCount / totalCount) * 100);

  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'published'>('idle');

  const pendingReps = [
    { id: '1', name: 'Sarah Johnson', daysOverdue: 3, planName: 'Sales Tiered Plan', isOverdue: true },
    { id: '3', name: 'Jennifer Lee', daysOverdue: 5, planName: 'Draw Against Plan', isOverdue: true },
    { id: '4', name: 'David Martinez', daysOverdue: 2, planName: 'Revenue Share Plan', isOverdue: true },
    { id: '2', name: 'Mike Chen', daysOverdue: 0, planName: 'Production Plan', isOverdue: false },
    { id: '5', name: 'Emily White', daysOverdue: 0, planName: 'Salary Plus Bonus Plan', isOverdue: false }
  ];

  const planPreview = {
    planName: 'Sales Tiered Plan',
    baseRate: '12%',
    tiers: [
      { range: '$0–$50k', rate: '12%' },
      { range: '$50k–$100k', rate: '14%' },
      { range: '$100k+', rate: '16%' }
    ],
    clawback: 'Pro-rata clawback on termination',
    drawLimit: '$5,000/month'
  };

  return (
    <div className="p-8 h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[28px] font-bold text-[var(--text-primary)]">Plan Acknowledgments</h1>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
            v5
          </span>
          <button onClick={() => { setPublishStatus('published'); setTimeout(() => setPublishStatus('idle'), 2000); }}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-1.5 transition-all"
            style={{ backgroundColor: publishStatus === 'published' ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
            <Send size={14} />
            {publishStatus === 'published' ? 'Published ✓' : 'Publish to Reps'}
          </button>
        </div>
      </div>

      {/* Status Strip - 3 Big Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        {/* Acknowledged */}
        <div className="rounded-lg border p-3 sm:p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="relative w-20 h-20 mb-4">
            <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="40" cy="40" r="36" fill="none" stroke="var(--bg-secondary)" strokeWidth="3" />
              <circle
                cx="40" cy="40" r="36" fill="none" stroke="var(--accent-green)" strokeWidth="3"
                strokeDasharray={`${(acknowledgedPercent / 100) * 226.19} 226.19`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle size={28} style={{ color: 'var(--accent-green)' }} />
            </div>
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{acknowledgedPercent}%</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Acknowledged</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">{acknowledgedCount} of {totalCount}</div>
        </div>

        {/* Pending */}
        <div className="rounded-lg border p-3 sm:p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Clock size={28} style={{ color: 'var(--accent-amber)' }} />
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{pendingCount}</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Pending</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Awaiting response</div>
        </div>

        {/* Overdue */}
        <div className="rounded-lg border p-3 sm:p-6 flex flex-col items-center text-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
          <div className="relative w-20 h-20 mb-4 flex items-center justify-center rounded-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <AlertTriangle size={28} style={{ color: 'var(--accent-red)' }} />
          </div>
          <div className="text-2xl font-bold text-[var(--text-primary)]">{overdueCount}</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Overdue</div>
          <div className="text-sm text-[var(--text-secondary)] mt-1">Need immediate follow-up</div>
        </div>
      </div>

      {/* Two-Column Split */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-6 flex-1 min-h-0">
        {/* Left Panel - Action Required List (60%) */}
        <div className="flex-1 flex flex-col">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-3">Action Required</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-2" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--border-primary) transparent' }}>
            {pendingReps.map(rep => (
              <div
                key={rep.id}
                className="rounded-lg border p-4 flex items-center justify-between"
                style={{
                  backgroundColor: rep.isOverdue ? 'rgba(220, 38, 38, 0.05)' : 'var(--bg-card)',
                  borderColor: rep.isOverdue ? 'rgba(220, 38, 38, 0.2)' : 'var(--border-primary)'
                }}
              >
                <div className="flex-1">
                  <div className="text-14px font-semibold text-[var(--text-primary)]">{rep.name}</div>
                  <div className="text-14px text-[var(--text-secondary)] mt-0.5">{rep.planName}</div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <div className="text-right min-w-[80px]">
                    {rep.isOverdue ? (
                      <>
                        <div className="text-14px font-semibold" style={{ color: 'var(--accent-red)' }}>
                          {rep.daysOverdue}d overdue
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">Critical</div>
                      </>
                    ) : (
                      <>
                        <div className="text-14px font-semibold" style={{ color: 'var(--accent-amber)' }}>
                          Due today
                        </div>
                        <div className="text-sm text-[var(--text-secondary)]">Pending</div>
                      </>
                    )}
                  </div>
                  <button
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-white hover:opacity-85 transition-opacity flex items-center gap-1.5 whitespace-nowrap"
                    style={{ backgroundColor: 'var(--accent-blue)' }}
                  >
                    <Mail size={14} />
                    Remind
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Quick Preview (40%) */}
        <div className="w-full lg:w-2/5 flex flex-col">
          <h2 className="text-[18px] font-bold text-[var(--text-primary)] mb-3">Rep Preview</h2>
          <div className="rounded-lg border p-3 sm:p-6 flex-1 flex flex-col" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
            <div className="mb-5">
              <div className="text-sm text-[var(--text-secondary)] font-semibold uppercase tracking-wide">Plan Name</div>
              <div className="text-[18px] font-bold text-[var(--text-primary)] mt-1">{planPreview.planName}</div>
            </div>

            <div className="space-y-4 flex-1">
              <div className="pb-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm text-[var(--text-secondary)] font-semibold uppercase tracking-wide">Base Rate</div>
                <div className="text-[22px] font-bold text-[var(--text-primary)] mt-1">{planPreview.baseRate}</div>
              </div>

              <div className="pb-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm text-[var(--text-secondary)] font-semibold uppercase tracking-wide mb-3">Commission Tiers</div>
                <div className="space-y-2">
                  {planPreview.tiers.map((tier, idx) => (
                    <div key={idx} className="flex justify-between items-center text-14px">
                      <span className="text-[var(--text-secondary)]">{tier.range}</span>
                      <span className="font-semibold text-[var(--text-primary)]">{tier.rate}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pb-4 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="text-sm text-[var(--text-secondary)] font-semibold uppercase tracking-wide">Draw Limit</div>
                <div className="text-[16px] font-semibold text-[var(--text-primary)] mt-1">{planPreview.drawLimit}</div>
              </div>

              <div>
                <div className="text-sm text-[var(--text-secondary)] font-semibold uppercase tracking-wide">Clawback Terms</div>
                <div className="text-14px text-[var(--text-secondary)] mt-1">{planPreview.clawback}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Acknowledged Link */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowAcknowledged(!showAcknowledged)}
          className="text-sm font-medium text-[var(--accent-blue)] hover:opacity-75 transition-opacity"
        >
          {showAcknowledged ? 'Hide' : `View ${acknowledgedCount} acknowledged`}
        </button>
      </div>
    </div>
  );
}
