'use client';

import React, { useState } from 'react';
import { Trophy, ArrowUpRight, ArrowDownRight, Star, Hammer, Clock, DollarSign, TrendingUp, ChevronDown } from 'lucide-react';

type SortBy = 'totalPay' | 'jobs' | 'quality' | 'margin' | 'efficiency';

const pms = [
  { rank: 1, prevRank: 2, name: 'Mike Torres', brand: 'Henderson Roofing', jobs: 18, avgMargin: 41.2, qualityScore: 96, onTimeRate: 93, callbackRate: 2.1, totalVariable: 3420, totalPay: 4620, efficiencyRate: 89 },
  { rank: 2, prevRank: 1, name: 'Sarah Chen', brand: 'Infinity Exteriors', jobs: 15, avgMargin: 38.2, qualityScore: 94, onTimeRate: 87, callbackRate: 6.7, totalVariable: 2805, totalPay: 4005, efficiencyRate: 80 },
  { rank: 3, prevRank: 3, name: 'Dave Kowalski', brand: 'Cochran Exteriors', jobs: 16, avgMargin: 37.5, qualityScore: 91, onTimeRate: 88, callbackRate: 4.3, totalVariable: 2680, totalPay: 3880, efficiencyRate: 81 },
  { rank: 4, prevRank: 5, name: 'Lisa Park', brand: 'Henderson Roofing', jobs: 14, avgMargin: 39.8, qualityScore: 93, onTimeRate: 92, callbackRate: 3.5, totalVariable: 2540, totalPay: 3740, efficiencyRate: 86 },
  { rank: 5, prevRank: 4, name: 'James Wright', brand: 'Infinity Exteriors', jobs: 13, avgMargin: 36.1, qualityScore: 88, onTimeRate: 82, callbackRate: 7.8, totalVariable: 2180, totalPay: 3380, efficiencyRate: 69 },
  { rank: 6, prevRank: 6, name: 'Ana Martinez', brand: 'Safe Home Windows', jobs: 12, avgMargin: 40.3, qualityScore: 95, onTimeRate: 91, callbackRate: 1.8, totalVariable: 2340, totalPay: 3540, efficiencyRate: 92 },
  { rank: 7, prevRank: 8, name: 'Tom Bradley', brand: 'Cochran Exteriors', jobs: 11, avgMargin: 35.8, qualityScore: 87, onTimeRate: 79, callbackRate: 8.2, totalVariable: 1850, totalPay: 3050, efficiencyRate: 64 },
  { rank: 8, prevRank: 7, name: 'Rachel Kim', brand: 'Henderson Roofing', jobs: 10, avgMargin: 42.1, qualityScore: 97, onTimeRate: 95, callbackRate: 0, totalVariable: 2100, totalPay: 3300, efficiencyRate: 100 },
];

export default function PMLeaderboard() {
  const [sortBy, setSortBy] = useState<SortBy>('totalPay');
  const [highlightSelf, setHighlightSelf] = useState(true);
  const selfName = 'Sarah Chen';

  const sorted = [...pms].sort((a, b) => {
    switch (sortBy) {
      case 'jobs': return b.jobs - a.jobs;
      case 'quality': return b.qualityScore - a.qualityScore;
      case 'margin': return b.avgMargin - a.avgMargin;
      case 'efficiency': return b.efficiencyRate - a.efficiencyRate;
      default: return b.totalPay - a.totalPay;
    }
  }).map((pm, i) => ({ ...pm, displayRank: i + 1 }));

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>PM Leaderboard</h2>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Current period · All brands</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold" style={{ color: 'var(--text-tertiary)' }}>Sort by</span>
          <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            {([
              ['totalPay', 'Pay'],
              ['jobs', 'Jobs'],
              ['quality', 'Quality'],
              ['margin', 'Margin'],
              ['efficiency', 'Efficiency'],
            ] as [SortBy, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className="px-2.5 py-1 rounded-md text-[10px] font-semibold transition-colors"
                style={{
                  backgroundColor: sortBy === key ? 'var(--accent-blue)' : 'transparent',
                  color: sortBy === key ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sorted.slice(0, 3).map((pm, i) => {
          const isSelf = pm.name === selfName;
          const medalColors = ['#f59e0b', '#94a3b8', '#cd7f32'];
          return (
            <div
              key={pm.name}
              className="rounded-2xl p-4 text-center relative overflow-hidden"
              style={{
                backgroundColor: isSelf ? 'rgba(59,130,246,0.06)' : 'var(--bg-card)',
                border: isSelf ? '2px solid var(--accent-blue)' : '1px solid var(--border-primary)',
              }}
            >
              <div className="w-10 h-10 rounded-full mx-auto flex items-center justify-center text-white font-bold text-sm" style={{ background: `linear-gradient(135deg, ${medalColors[i]}, ${medalColors[i]}dd)` }}>
                #{pm.displayRank}
              </div>
              <p className="text-sm font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{pm.name}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{pm.brand}</p>
              <p className="text-xl font-black mt-2" style={{ color: 'var(--accent-green)' }}>${pm.totalPay.toLocaleString()}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>total pay</p>
              <div className="flex justify-center gap-3 mt-3">
                <div className="text-center">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{pm.jobs}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Jobs</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{pm.qualityScore}</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Quality</p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{pm.avgMargin}%</p>
                  <p className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Margin</p>
                </div>
              </div>
              {isSelf && (
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ backgroundColor: 'var(--accent-blue)', color: '#fff' }}>YOU</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-primary)' }}>
                <th className="text-left px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>#</th>
                <th className="text-left px-2 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>PM</th>
                <th className="text-right px-2 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Jobs</th>
                <th className="text-right px-2 py-3 font-semibold hidden sm:table-cell" style={{ color: 'var(--text-tertiary)' }}>Avg Margin</th>
                <th className="text-right px-2 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Quality</th>
                <th className="text-right px-2 py-3 font-semibold hidden md:table-cell" style={{ color: 'var(--text-tertiary)' }}>On-Time</th>
                <th className="text-right px-2 py-3 font-semibold hidden md:table-cell" style={{ color: 'var(--text-tertiary)' }}>Callback</th>
                <th className="text-right px-2 py-3 font-semibold hidden lg:table-cell" style={{ color: 'var(--text-tertiary)' }}>Efficiency</th>
                <th className="text-right px-2 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Variable</th>
                <th className="text-right px-4 py-3 font-semibold" style={{ color: 'var(--text-tertiary)' }}>Total Pay</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(pm => {
                const isSelf = pm.name === selfName;
                const rankDiff = pm.prevRank - pm.displayRank;
                return (
                  <tr
                    key={pm.name}
                    style={{
                      borderBottom: '1px solid var(--border-primary)',
                      backgroundColor: isSelf ? 'rgba(59,130,246,0.04)' : 'transparent',
                    }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{pm.displayRank}</span>
                        {rankDiff > 0 && <ArrowUpRight size={10} style={{ color: 'var(--accent-green)' }} />}
                        {rankDiff < 0 && <ArrowDownRight size={10} style={{ color: 'var(--accent-red)' }} />}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0" style={{ background: isSelf ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'linear-gradient(135deg, #64748b, #475569)' }}>
                          {pm.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {pm.name}
                            {isSelf && <span className="ml-1 text-[8px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-blue)', color: '#fff' }}>YOU</span>}
                          </span>
                          <div className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{pm.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-right font-medium" style={{ color: 'var(--text-primary)' }}>{pm.jobs}</td>
                    <td className="px-2 py-3 text-right font-medium hidden sm:table-cell" style={{ color: pm.avgMargin >= 38 ? 'var(--accent-green)' : 'var(--text-primary)' }}>{pm.avgMargin}%</td>
                    <td className="px-2 py-3 text-right font-medium" style={{ color: pm.qualityScore >= 93 ? 'var(--accent-green)' : pm.qualityScore >= 90 ? 'var(--text-primary)' : 'var(--accent-red)' }}>{pm.qualityScore}</td>
                    <td className="px-2 py-3 text-right hidden md:table-cell" style={{ color: pm.onTimeRate >= 85 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{pm.onTimeRate}%</td>
                    <td className="px-2 py-3 text-right hidden md:table-cell" style={{ color: pm.callbackRate < 5 ? 'var(--accent-green)' : 'var(--accent-red)' }}>{pm.callbackRate}%</td>
                    <td className="px-2 py-3 text-right hidden lg:table-cell" style={{ color: pm.efficiencyRate >= 80 ? 'var(--accent-green)' : 'var(--text-secondary)' }}>{pm.efficiencyRate}%</td>
                    <td className="px-2 py-3 text-right font-medium" style={{ color: 'var(--accent-blue)' }}>${pm.totalVariable.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right font-bold" style={{ color: 'var(--accent-green)' }}>${pm.totalPay.toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
