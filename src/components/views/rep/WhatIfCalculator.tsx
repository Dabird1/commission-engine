// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import { currentUser } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { Calculator, TrendingUp, Zap, ArrowRight } from 'lucide-react';

const COMMISSION_TIERS = [
  { min: 0, max: 25, rate: 0.04, label: '<25%' },
  { min: 25, max: 30, rate: 0.05, label: '25-30%' },
  { min: 30, max: 35, rate: 0.07, label: '30-35%' },
  { min: 35, max: 40, rate: 0.08, label: '35-40%' },
  { min: 40, max: 45, rate: 0.09, label: '40-45%' },
  { min: 45, max: 100, rate: 0.10, label: '45%+' },
];

// Quick scenario presets
const PRESETS = [
  { label: 'Small Job', deal: 8000, gp: 42, desc: 'Gutters, trim, small repair' },
  { label: 'Mid Roofing', deal: 18000, gp: 38, desc: 'Standard roof replacement' },
  { label: 'Full Exterior', deal: 35000, gp: 40, desc: 'Siding + windows + roof' },
  { label: 'Big Reno', deal: 65000, gp: 36, desc: 'Full home exterior renovation' },
];

export default function WhatIfCalculator() {
  const [dealSize, setDealSize] = useState(25000);
  const [gpPercent, setGpPercent] = useState(40);
  const [dealCount, setDealCount] = useState(1);

  const calc = useMemo(() => {
    const tier = COMMISSION_TIERS.find(t => gpPercent >= t.min && gpPercent < t.max) || COMMISSION_TIERS[5];
    const rate = tier.rate;
    const perDeal = dealSize * rate;
    const commission = perDeal * dealCount;
    const frontEnd = commission * 0.5;
    const backEnd = commission * 0.5;

    // Nudge: +5 GP points
    const nudgeGP = Math.min(gpPercent + 5, 60);
    const nudgeTier = COMMISSION_TIERS.find(t => nudgeGP >= t.min && nudgeGP < t.max) || COMMISSION_TIERS[5];
    const nudgeComm = dealSize * nudgeTier.rate * dealCount;
    const nudgeDelta = nudgeComm - commission;

    // YTD impact
    const newYTD = currentUser.ytdEarnings + commission;

    return { tier, rate, perDeal, commission, frontEnd, backEnd, nudgeGP, nudgeTier, nudgeComm, nudgeDelta, newYTD };
  }, [dealSize, gpPercent, dealCount]);

  const tierBars = COMMISSION_TIERS.map(t => ({
    ...t,
    active: gpPercent >= t.min && gpPercent < t.max,
    commission: dealSize * t.rate,
  }));

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-6 pt-4 pb-2">
        <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>What-If Calculator</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>Model scenarios to optimize your earnings</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: 'thin' }}>
        {/* Quick Scenario Presets */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Quick Start:</span>
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => { setDealSize(p.deal); setGpPercent(p.gp); setDealCount(1); }}
              className="px-3 py-1.5 rounded-lg text-[14px] font-semibold transition-all border"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.color = 'var(--accent-blue)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              title={p.desc}>
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Left: Inputs */}
          <div className="space-y-4">
            {/* Deal Size Slider */}
            <div className="rounded-2xl border p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Deal Size</span>
                <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(dealSize)}</span>
              </div>
              <input type="range" min="5000" max="100000" step="1000" value={dealSize}
                onChange={e => setDealSize(Number(e.target.value))}
                className="w-full accent-blue-500" />
              <div className="flex justify-between text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                <span>$5K</span><span>$100K</span>
              </div>
            </div>

            {/* GP% Slider */}
            <div className="rounded-2xl border p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Gross Profit %</span>
                <span className="text-lg font-bold" style={{ color: gpPercent >= 40 ? 'var(--accent-green)' : gpPercent >= 35 ? 'var(--accent-blue)' : 'var(--accent-orange)' }}>
                  {formatPercent(gpPercent)}
                </span>
              </div>
              <input type="range" min="20" max="55" step="1" value={gpPercent}
                onChange={e => setGpPercent(Number(e.target.value))}
                className="w-full accent-blue-500" />
              <div className="flex justify-between text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                <span>20%</span><span>55%</span>
              </div>
            </div>

            {/* Deal Count */}
            <div className="rounded-2xl border p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>How Many Deals Like This?</span>
                <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{dealCount}</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5, 10].map(n => (
                  <button key={n} onClick={() => setDealCount(n)}
                    className="flex-1 py-1.5 rounded-lg text-sm font-bold transition-all border"
                    style={{
                      backgroundColor: dealCount === n ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                      color: dealCount === n ? 'white' : 'var(--text-secondary)',
                      borderColor: dealCount === n ? 'var(--accent-blue)' : 'var(--border-primary)',
                    }}>
                    {n}
                  </button>
                ))}
              </div>
              {dealCount > 1 && (
                <div className="text-[14px] mt-1.5" style={{ color: 'var(--text-tertiary)' }}>
                  {dealCount} × {formatCurrency(dealSize)} deals at {formatPercent(gpPercent)} GP
                </div>
              )}
            </div>

            {/* Tier Visual */}
            <div className="rounded-2xl border p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
              <div className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
                Commission by GP% Tier
              </div>
              <div className="space-y-1.5">
                {tierBars.map((t, i) => {
                  const maxComm = dealSize * 0.10;
                  const width = maxComm > 0 ? (t.commission / maxComm) * 100 : 0;
                  // Semantic: red→amber→yellow→lime→green→blue (low GP = risk, high GP = good)
                  const colors = ['var(--semantic-risk)', 'var(--semantic-pending)', '#eab308', '#84cc16', 'var(--semantic-paid)', 'var(--semantic-earned)'];
                  return (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-[14px] font-medium w-12 text-right" style={{ color: t.active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                        {t.label}
                      </span>
                      <div className="flex-1 h-5 rounded overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        <div className="h-full rounded flex items-center px-2 transition-all" style={{
                          width: `${Math.max(width, 8)}%`,
                          backgroundColor: t.active ? colors[i] : `${colors[i]}40`,
                        }}>
                          <span className="text-[9px] font-bold text-white whitespace-nowrap">
                            {formatPercent(t.rate * 100)}
                          </span>
                        </div>
                      </div>
                      <span className="text-[14px] font-semibold w-14 text-right" style={{ color: t.active ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                        {formatCurrency(t.commission)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {/* Main Result */}
            <div className="rounded-lg p-4 duration-300 transition-all" style={{ backgroundColor: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div className="text-sm font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--accent-blue)' }}>
                {dealCount > 1 ? `Your Commission — ${dealCount} Deals` : 'Your Commission'}
              </div>
              <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(calc.commission)}
              </div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {dealCount > 1
                  ? `${dealCount} × ${formatCurrency(calc.perDeal)} per deal (${formatPercent(calc.rate * 100)} rate at ${calc.tier.label} GP)`
                  : `${formatCurrency(dealSize)} × ${formatPercent(calc.rate * 100)} rate (${calc.tier.label} GP tier)`
                }
              </div>

              {/* Front/Back */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <div className="rounded p-2" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <div className="text-[14px] font-bold" style={{ color: 'var(--text-tertiary)' }}>Front-End</div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(calc.frontEnd)}</div>
                </div>
                <div className="rounded p-2" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <div className="text-[14px] font-bold" style={{ color: 'var(--text-tertiary)' }}>Back-End</div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(calc.backEnd)}</div>
                </div>
              </div>
            </div>

            {/* Nudge Opportunity */}
            <div className="rounded-lg p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--tint-green)', border: '1px solid rgba(16,185,129,0.3)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Zap size={14} style={{ color: '#10b981' }} />
                <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#10b981' }}>Opportunity</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Push GP to <strong style={{ color: 'var(--text-primary)' }}>{formatPercent(calc.nudgeGP)}</strong> and your rate jumps to{' '}
                <strong style={{ color: '#10b981' }}>{formatPercent(calc.nudgeTier.rate * 100)}</strong>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{formatCurrency(calc.commission)}</span>
                <ArrowRight size={14} style={{ color: '#10b981' }} />
                <span className="text-lg font-bold" style={{ color: '#10b981' }}>{formatCurrency(calc.nudgeComm)}</span>
                <span className="text-sm font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                  +{formatCurrency(calc.nudgeDelta)}
                </span>
              </div>
            </div>

            {/* YTD Impact */}
            <div className="rounded-2xl border p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                YTD Impact
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Current: {formatCurrency(currentUser.ytdEarnings)}</span>
                <ArrowRight size={12} style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(calc.newYTD)}</span>
              </div>
              <div className="text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                +{formatCurrency(calc.commission)} from this deal
              </div>
            </div>

            {/* Your Current Stats */}
            <div className="rounded-2xl border p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
              <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Your YTD Stats
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Earned', value: formatCurrency(currentUser.ytdEarnings) },
                  { label: 'Front Paid', value: formatCurrency(currentUser.ytdFrontPaid) },
                  { label: 'Back Earned', value: formatCurrency(currentUser.ytdBackEarned) },
                  { label: 'Back Pending', value: formatCurrency(currentUser.ytdBackPending) },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>{s.label}</div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
