'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronRight, Clock, CheckCircle, AlertTriangle, DollarSign, ArrowUpRight, ArrowDownRight, X, Hammer } from 'lucide-react';

type JobStatus = 'all' | 'active' | 'completed' | 'callback';

interface Job {
  id: string;
  customer: string;
  address: string;
  type: string;
  status: 'active' | 'completed' | 'callback';
  startDate: string;
  completedDate?: string;
  estimatedMargin: number;
  actualMargin?: number;
  crew: string;
  perJobBonus: number;
  marginBonus: number;
  efficiencyBonus: number;
  deduction: number;
  deductionReason?: string;
  netPay: number;
  daysOnSite: number;
  estimatedDays: number;
  callbackCount: number;
}

const jobs: Job[] = [
  { id: 'J-1042', customer: 'Williams Residence', address: '142 Elm St, Milwaukee', type: 'Roofing', status: 'active', startDate: 'Mar 15', estimatedMargin: 38, crew: 'Crew Alpha', perJobBonus: 125, marginBonus: 0, efficiencyBonus: 0, deduction: 0, netPay: 0, daysOnSite: 1, estimatedDays: 3, callbackCount: 0 },
  { id: 'J-1041', customer: 'Rodriguez Residence', address: '891 Oak Ave, Waukesha', type: 'Roofing', status: 'completed', startDate: 'Mar 11', completedDate: 'Mar 14', estimatedMargin: 40, actualMargin: 42, crew: 'Crew Alpha', perJobBonus: 125, marginBonus: 85, efficiencyBonus: 50, deduction: 0, netPay: 260, daysOnSite: 3, estimatedDays: 3, callbackCount: 0 },
  { id: 'J-1039', customer: 'Chen Family Home', address: '2300 Maple Dr, Brookfield', type: 'Siding', status: 'completed', startDate: 'Mar 9', completedDate: 'Mar 13', estimatedMargin: 38, actualMargin: 36, crew: 'Crew Bravo', perJobBonus: 125, marginBonus: 40, efficiencyBonus: 50, deduction: 0, netPay: 215, daysOnSite: 4, estimatedDays: 4, callbackCount: 0 },
  { id: 'J-1037', customer: 'Oakwood Estates #4', address: '44 Oakwood Ln, Mequon', type: 'Roofing', status: 'callback', startDate: 'Mar 7', completedDate: 'Mar 12', estimatedMargin: 36, actualMargin: 28, crew: 'Crew Alpha', perJobBonus: 125, marginBonus: 0, efficiencyBonus: 0, deduction: -120, deductionReason: 'Callback — flashing repair needed. Margin dropped to 28% after rework materials.', netPay: 5, daysOnSite: 3, estimatedDays: 2, callbackCount: 1 },
  { id: 'J-1035', customer: 'Thompson Duplex', address: '78 Birch Ct, Wauwatosa', type: 'Windows', status: 'completed', startDate: 'Mar 8', completedDate: 'Mar 11', estimatedMargin: 42, actualMargin: 44, crew: 'Crew Charlie', perJobBonus: 125, marginBonus: 95, efficiencyBonus: 50, deduction: 0, netPay: 270, daysOnSite: 3, estimatedDays: 4, callbackCount: 0 },
  { id: 'J-1033', customer: 'Birchwood Condo', address: '1600 Birchwood Blvd', type: 'Roofing', status: 'callback', startDate: 'Mar 5', completedDate: 'Mar 10', estimatedMargin: 35, actualMargin: 31, crew: 'Crew Bravo', perJobBonus: 125, marginBonus: 15, efficiencyBonus: 0, deduction: -80, deductionReason: 'Material overage — extra underlayment ordered on site.', netPay: 60, daysOnSite: 4, estimatedDays: 3, callbackCount: 0 },
  { id: 'J-1030', customer: 'Maple Street Remodel', address: '210 Maple St, Greenfield', type: 'Siding', status: 'completed', startDate: 'Mar 4', completedDate: 'Mar 8', estimatedMargin: 39, actualMargin: 40, crew: 'Crew Alpha', perJobBonus: 125, marginBonus: 70, efficiencyBonus: 50, deduction: 0, netPay: 245, daysOnSite: 4, estimatedDays: 4, callbackCount: 0 },
  { id: 'J-1028', customer: 'Sunset Heights HOA', address: '330 Sunset Dr, Pewaukee', type: 'Roofing', status: 'completed', startDate: 'Mar 1', completedDate: 'Mar 5', estimatedMargin: 41, actualMargin: 43, crew: 'Crew Alpha', perJobBonus: 125, marginBonus: 90, efficiencyBonus: 50, deduction: 0, netPay: 265, daysOnSite: 4, estimatedDays: 5, callbackCount: 0 },
];

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: 'rgba(59,130,246,0.1)', text: 'var(--accent-blue)', label: 'In Progress' },
  completed: { bg: 'rgba(34,197,94,0.1)', text: 'var(--accent-green)', label: 'Completed' },
  callback: { bg: 'rgba(239,68,68,0.1)', text: 'var(--accent-red)', label: 'Callback' },
};

export default function JobTracker() {
  const [filter, setFilter] = useState<JobStatus>('all');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = jobs.filter(j => {
    if (filter !== 'all' && j.status !== filter) return false;
    if (searchTerm && !j.customer.toLowerCase().includes(searchTerm.toLowerCase()) && !j.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const totalEarned = filtered.filter(j => j.status !== 'active').reduce((sum, j) => sum + j.netPay, 0);
  const totalDeductions = filtered.reduce((sum, j) => sum + j.deduction, 0);

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Job Tracker</h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Track every job and see exactly how it impacted your pay</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <p className="text-[10px] uppercase font-semibold" style={{ color: 'var(--text-tertiary)' }}>Earned (shown)</p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>${totalEarned.toLocaleString()}</p>
          </div>
          {totalDeductions < 0 && (
            <div className="text-right pl-3" style={{ borderLeft: '1px solid var(--border-primary)' }}>
              <p className="text-[10px] uppercase font-semibold" style={{ color: 'var(--text-tertiary)' }}>Deductions</p>
              <p className="text-lg font-bold" style={{ color: 'var(--accent-red)' }}>${Math.abs(totalDeductions)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <Search size={14} style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-0 outline-none text-sm w-full"
            style={{ color: 'var(--text-primary)' }}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')}><X size={14} style={{ color: 'var(--text-tertiary)' }} /></button>
          )}
        </div>
        <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          {(['all', 'active', 'completed', 'callback'] as JobStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className="px-3 py-1.5 rounded-md text-xs font-semibold transition-colors capitalize"
              style={{
                backgroundColor: filter === s ? 'var(--accent-blue)' : 'transparent',
                color: filter === s ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {s === 'all' ? 'All' : statusColors[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Job Cards */}
      <div className="space-y-2">
        {filtered.map(job => {
          const isExpanded = expandedJob === job.id;
          const sc = statusColors[job.status];
          return (
            <div key={job.id} className="rounded-xl overflow-hidden transition-all" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              {/* Job Summary Row */}
              <button
                onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <ChevronRight size={14} className={`transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`} style={{ color: 'var(--text-tertiary)' }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{job.customer}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</span>
                    {job.callbackCount > 0 && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full flex items-center gap-0.5" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: 'var(--accent-red)' }}>
                        <AlertTriangle size={9} /> Callback
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                    {job.id} · {job.type} · {job.completedDate || job.startDate}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {job.status === 'active' ? (
                    <span className="text-xs font-medium" style={{ color: 'var(--accent-blue)' }}>In progress</span>
                  ) : (
                    <>
                      <p className="text-sm font-bold" style={{ color: job.netPay >= 200 ? 'var(--accent-green)' : job.netPay >= 100 ? 'var(--text-primary)' : 'var(--accent-red)' }}>
                        ${job.netPay}
                      </p>
                      <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>net pay</p>
                    </>
                  )}
                </div>
              </button>

              {/* Expanded Detail */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1" style={{ borderTop: '1px solid var(--border-primary)' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                    {/* Job Details */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Job Details</p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Address</span><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{job.address}</span></div>
                        <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Crew</span><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{job.crew}</span></div>
                        <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Start Date</span><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{job.startDate}</span></div>
                        {job.completedDate && <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Completed</span><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{job.completedDate}</span></div>}
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Days on Site</span>
                          <span className="font-medium" style={{ color: job.daysOnSite <= job.estimatedDays ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                            {job.daysOnSite} / {job.estimatedDays} est
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Margin</span>
                          <span className="font-medium" style={{ color: (job.actualMargin || job.estimatedMargin) >= 35 ? 'var(--accent-green)' : 'var(--text-primary)' }}>
                            {job.actualMargin ? `${job.actualMargin}% actual` : `${job.estimatedMargin}% est`}
                            {job.actualMargin && job.actualMargin !== job.estimatedMargin && (
                              <span style={{ color: job.actualMargin > job.estimatedMargin ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                {' '}({job.actualMargin > job.estimatedMargin ? '+' : ''}{job.actualMargin - job.estimatedMargin}%)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pay Breakdown */}
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Pay Breakdown</p>
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Per-Job Bonus</span><span className="font-medium" style={{ color: 'var(--accent-blue)' }}>${job.perJobBonus}</span></div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Margin Bonus</span>
                          <span className="font-medium" style={{ color: job.marginBonus > 0 ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                            {job.marginBonus > 0 ? `+$${job.marginBonus}` : '—'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span style={{ color: 'var(--text-secondary)' }}>Efficiency Bonus</span>
                          <span className="font-medium" style={{ color: job.efficiencyBonus > 0 ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                            {job.efficiencyBonus > 0 ? `+$${job.efficiencyBonus}` : '—'}
                          </span>
                        </div>
                        {job.deduction < 0 && (
                          <>
                            <div className="flex justify-between">
                              <span style={{ color: 'var(--accent-red)' }}>Deduction</span>
                              <span className="font-bold" style={{ color: 'var(--accent-red)' }}>-${Math.abs(job.deduction)}</span>
                            </div>
                            <div className="p-2 rounded-lg text-[11px]" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: 'var(--accent-red)' }}>
                              <AlertTriangle size={11} className="inline mr-1" />
                              {job.deductionReason}
                            </div>
                          </>
                        )}
                        <div className="pt-1.5 mt-1.5 flex justify-between font-bold" style={{ borderTop: '1px solid var(--border-primary)' }}>
                          <span style={{ color: 'var(--text-primary)' }}>Net Pay Impact</span>
                          <span style={{ color: job.netPay >= 200 ? 'var(--accent-green)' : job.netPay >= 100 ? 'var(--text-primary)' : 'var(--accent-red)' }}>
                            ${job.netPay}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
