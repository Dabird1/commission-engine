'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, Hammer, Clock, Star, AlertTriangle, ChevronDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

type Period = 'current' | 'prev' | 'ytd';

const periodData: Record<Period, { label: string; basePay: number; perJob: number; perJobCount: number; marginBonus: number; efficiencyBonus: number; efficiencyCount: number; spif: number; deductions: number; deductionCount: number; total: number }> = {
  current: { label: 'Mar 1–15, 2026', basePay: 1200, perJob: 1875, perJobCount: 15, marginBonus: 620, efficiencyBonus: 400, efficiencyCount: 8, spif: 250, deductions: -340, deductionCount: 3, total: 4005 },
  prev: { label: 'Feb 16–28, 2026', basePay: 1200, perJob: 1500, perJobCount: 12, marginBonus: 480, efficiencyBonus: 350, efficiencyCount: 7, spif: 0, deductions: -160, deductionCount: 2, total: 3370 },
  ytd: { label: 'Jan 1 – Mar 15, 2026', basePay: 6000, perJob: 8125, perJobCount: 65, marginBonus: 2840, efficiencyBonus: 2100, efficiencyCount: 42, spif: 750, deductions: -980, deductionCount: 8, total: 18835 },
};

const deductionDetails = [
  { job: 'J-1037', customer: 'Oakwood Estates #4', amount: -120, reason: 'Callback — flashing repair. Margin dropped from 36% to 28%.' },
  { job: 'J-1033', customer: 'Birchwood Condo', amount: -80, reason: 'Material overage — extra underlayment ordered on site.' },
  { job: 'J-1025', customer: 'Lakeshore Plaza', amount: -140, reason: 'Warranty claim — gutter re-alignment needed within 14 days.' },
];

const payHistory = [
  { period: 'Mar 1–15', base: 1200, variable: 2805, total: 4005, change: 12 },
  { period: 'Feb 16–28', base: 1200, variable: 2170, total: 3370, change: -4 },
  { period: 'Feb 1–15', base: 1200, variable: 2310, total: 3510, change: 8 },
  { period: 'Jan 16–31', base: 1200, variable: 2080, total: 3280, change: 5 },
  { period: 'Jan 1–15', base: 1200, variable: 1920, total: 3120, change: 0 },
];

export default function VariablePay() {
  const [period, setPeriod] = useState<Period>('current');
  const d = periodData[period];

  const components = [
    { key: 'base', label: 'Base Pay', amount: d.basePay, detail: 'Fixed bi-weekly base salary', color: 'var(--text-secondary)', icon: <DollarSign size={16} />, pct: (d.basePay / d.total * 100) },
    { key: 'perjob', label: 'Per-Job Bonus', amount: d.perJob, detail: `$125 × ${d.perJobCount} completed jobs`, color: 'var(--accent-blue)', icon: <Hammer size={16} />, pct: (d.perJob / d.total * 100) },
    { key: 'margin', label: 'Margin Bonus', amount: d.marginBonus, detail: 'Bonus on jobs with margin > 35%', color: '#8b5cf6', icon: <TrendingUp size={16} />, pct: (d.marginBonus / d.total * 100) },
    { key: 'efficiency', label: 'Efficiency Bonus', amount: d.efficiencyBonus, detail: `$50 × ${d.efficiencyCount} on-time, no-callback jobs`, color: 'var(--accent-green)', icon: <Clock size={16} />, pct: (d.efficiencyBonus / d.total * 100) },
    { key: 'spif', label: 'SPIF / Bonus', amount: d.spif, detail: d.spif > 0 ? 'March Roofing Blitz milestone bonus' : 'No active SPIFs this period', color: '#f59e0b', icon: <Star size={16} />, pct: (d.spif / d.total * 100) },
    { key: 'deductions', label: 'Deductions', amount: d.deductions, detail: `${d.deductionCount} job${d.deductionCount !== 1 ? 's' : ''} with callbacks, overages, or claims`, color: 'var(--accent-red)', icon: <AlertTriangle size={16} />, pct: (Math.abs(d.deductions) / d.total * 100) },
  ];

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Period Selector + Total */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Variable Pay Breakdown</h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Every dollar, explained</p>
        </div>
        <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          {([['current', 'Current'], ['prev', 'Previous'], ['ytd', 'YTD']] as [Period, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors"
              style={{
                backgroundColor: period === key ? 'var(--accent-blue)' : 'transparent',
                color: period === key ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Total Pay Hero */}
      <div className="rounded-2xl p-4 sm:p-6" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>{d.label}</p>
        <div className="flex items-baseline gap-3 mt-1">
          <span className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>${d.total.toLocaleString()}</span>
          <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>total pay</span>
        </div>
        {/* Stacked bar */}
        <div className="flex h-3 rounded-full overflow-hidden mt-4 gap-0.5">
          {components.filter(c => c.amount > 0).map(c => (
            <div key={c.key} className="rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color, minWidth: '4px' }} title={`${c.label}: $${c.amount.toLocaleString()}`} />
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mt-2">
          {components.filter(c => c.amount !== 0).map(c => (
            <div key={c.key} className="flex items-center gap-1.5 text-[10px]">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
              <span style={{ color: 'var(--text-tertiary)' }}>{c.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Component Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {components.map(c => (
          <div key={c.key} className="rounded-xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: c.amount < 0 ? 'rgba(239,68,68,0.1)' : `${c.color}15`, color: c.color }}>
                  {c.icon}
                </div>
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{c.label}</span>
              </div>
              <span className="text-lg font-bold" style={{ color: c.amount < 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
                {c.amount < 0 ? '-' : ''}${Math.abs(c.amount).toLocaleString()}
              </span>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{c.detail}</p>
            {c.amount > 0 && (
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-full" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Deduction Breakdown */}
      {d.deductions < 0 && period === 'current' && (
        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border-primary)' }}>
            <AlertTriangle size={14} style={{ color: 'var(--accent-red)' }} />
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Deduction Details</h3>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)' }}>
              -${Math.abs(d.deductions)}
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
            {deductionDetails.map(dd => (
              <div key={dd.job} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{dd.customer}</span>
                    <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{dd.job}</span>
                  </div>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{dd.reason}</p>
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--accent-red)' }}>-${Math.abs(dd.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pay History */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Pay History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <th className="text-left px-4 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Period</th>
                <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Base</th>
                <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Variable</th>
                <th className="text-right px-3 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Total</th>
                <th className="text-right px-4 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Change</th>
              </tr>
            </thead>
            <tbody>
              {payHistory.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td className="px-4 py-2.5 font-medium" style={{ color: 'var(--text-primary)' }}>{row.period}</td>
                  <td className="px-3 py-2.5 text-right" style={{ color: 'var(--text-secondary)' }}>${row.base.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-medium" style={{ color: 'var(--accent-blue)' }}>${row.variable.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right font-bold" style={{ color: 'var(--text-primary)' }}>${row.total.toLocaleString()}</td>
                  <td className="px-4 py-2.5 text-right">
                    {row.change !== 0 ? (
                      <span className="flex items-center justify-end gap-0.5 font-semibold" style={{ color: row.change > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                        {row.change > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {Math.abs(row.change)}%
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                    )}
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
