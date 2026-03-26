'use client';

import React, { useState } from 'react';
import { Star, Clock, AlertTriangle, ThumbsUp, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Shield, DollarSign } from 'lucide-react';

const metrics = {
  qualityScore: 94,
  qualityTrend: 2,
  onTimeRate: 87,
  onTimeTrend: -3,
  callbackRate: 6.7,
  callbackTrend: 1.2,
  customerSatisfaction: 4.7,
  satTrend: 0.1,
  materialWaste: 3.2,
  wasteTrend: -0.5,
  warrantyClaimRate: 2.1,
  warrantyTrend: 0.3,
};

const qualityImpact = {
  efficiencyBonusEarned: 400,
  efficiencyBonusMissed: 350,
  callbackDeductions: -200,
  materialDeductions: -80,
  netQualityImpact: 70,
};

const jobQualityBreakdown = [
  { id: 'J-1041', customer: 'Rodriguez Residence', onTime: true, callback: false, satisfaction: 5.0, materialVariance: -1.2, efficiencyBonus: 50, deduction: 0 },
  { id: 'J-1039', customer: 'Chen Family Home', onTime: true, callback: false, satisfaction: 4.8, materialVariance: 0.5, efficiencyBonus: 50, deduction: 0 },
  { id: 'J-1037', customer: 'Oakwood Estates #4', onTime: false, callback: true, satisfaction: 3.2, materialVariance: 8.1, efficiencyBonus: 0, deduction: -120 },
  { id: 'J-1035', customer: 'Thompson Duplex', onTime: true, callback: false, satisfaction: 4.9, materialVariance: -0.8, efficiencyBonus: 50, deduction: 0 },
  { id: 'J-1033', customer: 'Birchwood Condo', onTime: false, callback: false, satisfaction: 4.1, materialVariance: 6.3, efficiencyBonus: 0, deduction: -80 },
  { id: 'J-1030', customer: 'Maple Street Remodel', onTime: true, callback: false, satisfaction: 4.6, materialVariance: 1.1, efficiencyBonus: 50, deduction: 0 },
  { id: 'J-1028', customer: 'Sunset Heights HOA', onTime: true, callback: false, satisfaction: 4.8, materialVariance: -0.3, efficiencyBonus: 50, deduction: 0 },
];

const thresholds = [
  { metric: 'Quality Score', target: '≥ 90', current: '94', status: 'pass', payImpact: 'Qualifies for efficiency bonus ($50/job)' },
  { metric: 'On-Time Rate', target: '≥ 85%', current: '87%', status: 'pass', payImpact: 'Qualifies for efficiency bonus ($50/job)' },
  { metric: 'Callback Rate', target: '< 5%', current: '6.7%', status: 'fail', payImpact: 'Callbacks trigger per-job deductions ($80–$140)' },
  { metric: 'Material Waste', target: '< 3%', current: '3.2%', status: 'warn', payImpact: 'Overages > 5% per job trigger deduction' },
  { metric: 'Customer Satisfaction', target: '≥ 4.5', current: '4.7', status: 'pass', payImpact: 'Maintains SPIF eligibility' },
];

export default function QualityMetrics() {
  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Quality & Efficiency</h2>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>How your quality metrics affect your variable pay</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {[
          { label: 'Quality Score', value: metrics.qualityScore.toString(), trend: metrics.qualityTrend, suffix: '', color: 'var(--accent-green)' },
          { label: 'On-Time Rate', value: `${metrics.onTimeRate}%`, trend: metrics.onTimeTrend, suffix: 'pp', color: metrics.onTimeRate >= 85 ? 'var(--accent-green)' : 'var(--accent-red)' },
          { label: 'Callback Rate', value: `${metrics.callbackRate}%`, trend: -metrics.callbackTrend, suffix: 'pp', color: metrics.callbackRate < 5 ? 'var(--accent-green)' : 'var(--accent-red)' },
          { label: 'CSAT', value: metrics.customerSatisfaction.toString(), trend: metrics.satTrend, suffix: '', color: 'var(--accent-green)' },
          { label: 'Material Waste', value: `${metrics.materialWaste}%`, trend: metrics.wasteTrend, suffix: 'pp', color: metrics.materialWaste < 3 ? 'var(--accent-green)' : '#f59e0b' },
          { label: 'Warranty Claims', value: `${metrics.warrantyClaimRate}%`, trend: -metrics.warrantyTrend, suffix: 'pp', color: metrics.warrantyClaimRate < 3 ? 'var(--accent-green)' : 'var(--accent-red)' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-xl p-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>{kpi.label}</p>
            <p className="text-xl font-bold mt-1" style={{ color: kpi.color }}>{kpi.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {kpi.trend > 0 ? <ArrowUpRight size={10} style={{ color: 'var(--accent-green)' }} /> : <ArrowDownRight size={10} style={{ color: 'var(--accent-red)' }} />}
              <span className="text-[10px] font-medium" style={{ color: kpi.trend > 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                {kpi.trend > 0 ? '+' : ''}{kpi.trend}{kpi.suffix} vs last period
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Thresholds & Pay Impact */}
        <div className="rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Thresholds & Pay Impact</h3>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>How each metric gates your variable pay</p>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-primary)' }}>
            {thresholds.map(t => (
              <div key={t.metric} className="px-4 py-3" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.status === 'pass' ? 'var(--accent-green)' : t.status === 'warn' ? '#f59e0b' : 'var(--accent-red)' }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{t.metric}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>Target: {t.target}</span>
                    <span className="text-xs font-bold" style={{ color: t.status === 'pass' ? 'var(--accent-green)' : t.status === 'warn' ? '#f59e0b' : 'var(--accent-red)' }}>
                      {t.current}
                    </span>
                  </div>
                </div>
                <p className="text-[10px] mt-1 ml-4" style={{ color: 'var(--text-secondary)' }}>
                  <DollarSign size={9} className="inline" /> {t.payImpact}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quality Pay Impact Summary */}
        <div className="rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Quality Pay Impact This Period</h3>
            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>How quality earned or cost you money</p>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(34,197,94,0.06)' }}>
              <div className="flex items-center gap-2">
                <ThumbsUp size={14} style={{ color: 'var(--accent-green)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Efficiency Bonuses Earned</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-green)' }}>+${qualityImpact.efficiencyBonusEarned}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-2">
                <Clock size={14} style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Efficiency Bonuses Missed</span>
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-tertiary)' }}>$0 (7 jobs didn't qualify)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: 'var(--accent-red)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Callback Deductions</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-red)' }}>-${Math.abs(qualityImpact.callbackDeductions)}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: 'var(--accent-red)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>Material Overage Deductions</span>
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-red)' }}>-${Math.abs(qualityImpact.materialDeductions)}</span>
            </div>
            <div className="pt-3 mt-2" style={{ borderTop: '2px solid var(--border-primary)' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Net Quality Impact</span>
                <span className="text-lg font-bold" style={{ color: qualityImpact.netQualityImpact >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {qualityImpact.netQualityImpact >= 0 ? '+' : ''}${qualityImpact.netQualityImpact}
                </span>
              </div>
              <p className="text-[10px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Tip: Eliminating callbacks would have added $350 to your pay this period.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Per-Job Quality Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Job-Level Quality Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <th className="text-left px-4 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Job</th>
                <th className="text-center px-2 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>On-Time</th>
                <th className="text-center px-2 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Callback</th>
                <th className="text-center px-2 py-2 font-semibold hidden sm:table-cell" style={{ color: 'var(--text-tertiary)' }}>CSAT</th>
                <th className="text-right px-2 py-2 font-semibold hidden md:table-cell" style={{ color: 'var(--text-tertiary)' }}>Mat. Var.</th>
                <th className="text-right px-2 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Efficiency $</th>
                <th className="text-right px-4 py-2 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Deduction</th>
              </tr>
            </thead>
            <tbody>
              {jobQualityBreakdown.map(j => (
                <tr key={j.id} style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <td className="px-4 py-2.5">
                    <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{j.customer}</div>
                    <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{j.id}</div>
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <span className="text-xs" style={{ color: j.onTime ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                      {j.onTime ? '✓' : '✗'}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center">
                    <span className="text-xs" style={{ color: j.callback ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                      {j.callback ? '✗ Yes' : '✓ No'}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center hidden sm:table-cell">
                    <span className="font-medium" style={{ color: j.satisfaction >= 4.5 ? 'var(--accent-green)' : j.satisfaction >= 3.5 ? '#f59e0b' : 'var(--accent-red)' }}>
                      {j.satisfaction}
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-right hidden md:table-cell">
                    <span style={{ color: j.materialVariance > 5 ? 'var(--accent-red)' : j.materialVariance > 3 ? '#f59e0b' : 'var(--text-secondary)' }}>
                      {j.materialVariance > 0 ? '+' : ''}{j.materialVariance}%
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-right font-medium" style={{ color: j.efficiencyBonus > 0 ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                    {j.efficiencyBonus > 0 ? `+$${j.efficiencyBonus}` : '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right font-medium" style={{ color: j.deduction < 0 ? 'var(--accent-red)' : 'var(--text-tertiary)' }}>
                    {j.deduction < 0 ? `-$${Math.abs(j.deduction)}` : '—'}
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
