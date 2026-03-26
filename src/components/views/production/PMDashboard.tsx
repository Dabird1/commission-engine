'use client';

import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Hammer, Star, Clock, AlertTriangle, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const currentPeriod = {
  label: 'March 1–15, 2026',
  basePay: 1200,
  perJobBonus: 1875,
  efficiencyBonus: 400,
  marginBonus: 620,
  spifEarnings: 250,
  deductions: -340,
  totalVariable: 2805,
  totalPay: 4005,
  jobsCompleted: 15,
  avgMargin: 38.2,
  qualityScore: 94,
  onTimeRate: 87,
};

const recentJobs = [
  { id: 'J-1041', customer: 'Rodriguez Residence', type: 'Roofing', completedDate: 'Mar 14', margin: 42, perJobBonus: 125, marginBonus: 85, efficiencyBonus: 50, deduction: 0, net: 260, status: 'paid' },
  { id: 'J-1039', customer: 'Chen Family Home', type: 'Siding', completedDate: 'Mar 13', margin: 36, perJobBonus: 125, marginBonus: 40, efficiencyBonus: 50, deduction: 0, net: 215, status: 'paid' },
  { id: 'J-1037', customer: 'Oakwood Estates #4', type: 'Roofing', completedDate: 'Mar 12', margin: 28, perJobBonus: 125, marginBonus: 0, efficiencyBonus: 0, deduction: -120, net: 5, status: 'paid' },
  { id: 'J-1035', customer: 'Thompson Duplex', type: 'Windows', completedDate: 'Mar 11', margin: 44, perJobBonus: 125, marginBonus: 95, efficiencyBonus: 50, deduction: 0, net: 270, status: 'paid' },
  { id: 'J-1033', customer: 'Birchwood Condo', type: 'Roofing', completedDate: 'Mar 10', margin: 31, perJobBonus: 125, marginBonus: 15, efficiencyBonus: 0, deduction: -80, net: 60, status: 'paid' },
  { id: 'J-1030', customer: 'Maple Street Remodel', type: 'Siding', completedDate: 'Mar 8', margin: 40, perJobBonus: 125, marginBonus: 70, efficiencyBonus: 50, deduction: 0, net: 245, status: 'pending' },
];

const payAlerts = [
  { type: 'deduction', message: 'J-1037 callback reduced margin to 28% — $120 deducted from margin bonus', time: '2 days ago' },
  { type: 'deduction', message: 'J-1033 material overage flagged — $80 efficiency deduction', time: '4 days ago' },
  { type: 'bonus', message: 'Hit 15-job milestone — $250 SPIF bonus earned', time: '1 day ago' },
  { type: 'info', message: 'Next payout scheduled for March 16 — estimated $2,805', time: 'Upcoming' },
];

export default function PMDashboard() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const p = currentPeriod;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Hero: Total Variable Pay this period */}
      <div className="rounded-2xl p-4 sm:p-6" style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--bg-secondary))', border: '1px solid var(--border-primary)' }}>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Variable Pay This Period</p>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{p.label}</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--text-primary)' }}>${p.totalVariable.toLocaleString()}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--accent-green)' }}>
                <ArrowUpRight size={14} className="inline" /> +12% vs last period
              </span>
            </div>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Total pay with base: <span className="font-bold">${p.totalPay.toLocaleString()}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{p.jobsCompleted}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Jobs Done</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{p.avgMargin}%</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Avg Margin</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <p className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>{p.qualityScore}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Quality</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pay Component Breakdown — KPI pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { label: 'Base Pay', value: p.basePay, color: 'var(--text-secondary)', icon: <DollarSign size={14} /> },
          { label: 'Per-Job Bonus', value: p.perJobBonus, color: 'var(--accent-blue)', icon: <Hammer size={14} /> },
          { label: 'Efficiency Bonus', value: p.efficiencyBonus, color: 'var(--accent-green)', icon: <Clock size={14} /> },
          { label: 'Margin Bonus', value: p.marginBonus, color: '#8b5cf6', icon: <TrendingUp size={14} /> },
          { label: 'SPIF Earnings', value: p.spifEarnings, color: '#f59e0b', icon: <Star size={14} /> },
          { label: 'Deductions', value: p.deductions, color: 'var(--accent-red)', icon: <TrendingDown size={14} /> },
        ].map(item => (
          <div key={item.label} className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <span style={{ color: item.color }}>{item.icon}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>{item.label}</span>
            </div>
            <p className="text-lg font-bold" style={{ color: item.value < 0 ? 'var(--accent-red)' : 'var(--text-primary)' }}>
              {item.value < 0 ? '-' : ''}${Math.abs(item.value).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Jobs — Pay Impact */}
        <div className="lg:col-span-2 rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-primary)' }}>
            <div>
              <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Recent Jobs — Pay Impact</h3>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>How each job affected your variable pay</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <th className="text-left px-4 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Job</th>
                  <th className="text-left px-2 py-2 font-semibold hidden sm:table-cell" style={{ color: 'var(--text-tertiary)' }}>Type</th>
                  <th className="text-right px-2 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Margin</th>
                  <th className="text-right px-2 py-2 font-semibold hidden md:table-cell" style={{ color: 'var(--text-tertiary)' }}>Job $</th>
                  <th className="text-right px-2 py-2 font-semibold hidden md:table-cell" style={{ color: 'var(--text-tertiary)' }}>Margin $</th>
                  <th className="text-right px-2 py-2 font-semibold hidden lg:table-cell" style={{ color: 'var(--text-tertiary)' }}>Efficiency</th>
                  <th className="text-right px-2 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Deduction</th>
                  <th className="text-right px-4 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Net</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map(job => (
                  <tr
                    key={job.id}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid var(--border-primary)' }}
                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td className="px-4 py-2.5">
                      <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{job.customer}</div>
                      <div style={{ color: 'var(--text-tertiary)' }}>{job.id} · {job.completedDate}</div>
                    </td>
                    <td className="px-2 py-2.5 hidden sm:table-cell" style={{ color: 'var(--text-secondary)' }}>{job.type}</td>
                    <td className="px-2 py-2.5 text-right">
                      <span className={`font-semibold ${job.margin >= 35 ? '' : ''}`} style={{ color: job.margin >= 35 ? 'var(--accent-green)' : job.margin >= 30 ? 'var(--text-primary)' : 'var(--accent-red)' }}>
                        {job.margin}%
                      </span>
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium hidden md:table-cell" style={{ color: 'var(--text-primary)' }}>${job.perJobBonus}</td>
                    <td className="px-2 py-2.5 text-right font-medium hidden md:table-cell" style={{ color: job.marginBonus > 0 ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                      {job.marginBonus > 0 ? `+$${job.marginBonus}` : '—'}
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium hidden lg:table-cell" style={{ color: job.efficiencyBonus > 0 ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                      {job.efficiencyBonus > 0 ? `+$${job.efficiencyBonus}` : '—'}
                    </td>
                    <td className="px-2 py-2.5 text-right font-medium" style={{ color: job.deduction < 0 ? 'var(--accent-red)' : 'var(--text-tertiary)' }}>
                      {job.deduction < 0 ? `-$${Math.abs(job.deduction)}` : '—'}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-bold" style={{ color: job.net >= 200 ? 'var(--accent-green)' : job.net >= 100 ? 'var(--text-primary)' : 'var(--accent-red)' }}>
                        ${job.net}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pay Alerts & Explanations */}
        <div className="rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Pay Alerts</h3>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>What changed and why</p>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
            {payAlerts.map((alert, i) => (
              <div key={i} className="px-4 py-3 flex gap-3" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex-shrink-0 mt-0.5">
                  {alert.type === 'deduction' ? (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                      <ArrowDownRight size={12} style={{ color: 'var(--accent-red)' }} />
                    </div>
                  ) : alert.type === 'bonus' ? (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}>
                      <ArrowUpRight size={12} style={{ color: 'var(--accent-green)' }} />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}>
                      <DollarSign size={12} style={{ color: 'var(--accent-blue)' }} />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-primary)' }}>{alert.message}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How Your Pay Works — quick reference */}
      <div className="rounded-2xl p-4" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>How Your Variable Pay Works</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { title: 'Per-Job Bonus', desc: '$125 per completed job. Paid on every job regardless of margin.', color: 'var(--accent-blue)' },
            { title: 'Margin Bonus', desc: 'Extra bonus when job margin exceeds 35%. Higher margin = bigger bonus (up to $95/job).', color: '#8b5cf6' },
            { title: 'Efficiency Bonus', desc: '$50/job when completed on-time with no callbacks within 30 days.', color: 'var(--accent-green)' },
            { title: 'Deductions', desc: 'Callbacks, material overages, or warranty claims reduce variable pay on the affected job.', color: 'var(--accent-red)' },
          ].map(item => (
            <div key={item.title} className="p-3 rounded-xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
