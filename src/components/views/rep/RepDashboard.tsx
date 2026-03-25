'use client';

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AnimatedCounter from '@/components/shared/AnimatedCounter';
import ProgressRing from '@/components/shared/ProgressRing';
import TierBadge from '@/components/shared/TierBadge';
import { currentUser, monthlyTrends } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface ExpandableCard {
  id: string;
  isExpanded: boolean;
}

export default function RepDashboard() {
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    compensation: false,
    momentum: false,
    forecast: false,
  });

  const toggleCard = (cardId: string) => {
    setExpandedCards((prev) => ({
      ...prev,
      [cardId]: !prev[cardId],
    }));
  };

  const quotaTarget = 172000; // 86% of target
  const nextPayoutDate = 'March 31';
  const nextPayoutAmount = 4200;
  const gpDifferenceToNextTier = 0.7; // 40.1% needed, currently 39.3%
  const gpNeeded = 1200;
  const weeksToMaintainGold = 4;
  const forecastNextMonth = 12400;
  const currentGPPercent = currentUser.avgGP;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* ===== HERO SECTION ===== */}
      <div
        className="rounded-xl p-8 text-white overflow-hidden relative"
        style={{
          background: 'linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-blue-dark) 100%)',
        }}
      >
        <div className="grid grid-cols-3 gap-8 items-center">
          {/* Left: Earnings */}
          <div>
            <div className="text-sm font-medium opacity-90 mb-2">Your Earnings</div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-4xl font-bold">
                <AnimatedCounter value={currentUser.ytdEarnings} prefix="$" />
              </span>
              <span className="text-xs opacity-75">YTD</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp size={16} className="text-green-300" />
              <span>12% vs last year</span>
            </div>
          </div>

          {/* Center: Quota Ring */}
          <div className="flex flex-col items-center">
            <ProgressRing
              percentage={currentUser.quotaProgress}
              size={140}
              strokeWidth={6}
              color="var(--accent-blue-light)"
              label={`${currentUser.quotaProgress}%`}
              sublabel="Quota"
            />
          </div>

          {/* Right: Next Payout + Tier */}
          <div className="text-right">
            <div className="text-sm font-medium opacity-90 mb-4">Next Payout</div>
            <div className="mb-3">
              <div className="text-3xl font-bold mb-1">
                <AnimatedCounter value={nextPayoutAmount} prefix="$" />
              </div>
              <div className="text-xs opacity-75">{nextPayoutDate}</div>
            </div>
            <div className="flex justify-end">
              <TierBadge tier={currentUser.tier} size="lg" />
            </div>
          </div>
        </div>
      </div>

      {/* ===== STAT CARDS ROW ===== */}
      <div className="grid grid-cols-4 gap-4">
        {/* Front-End Paid */}
        <div
          className="rounded-lg p-5 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Front-End Paid
            </div>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}
            >
              <TrendingUp size={12} />
              +12%
            </span>
          </div>
          <div className="text-2xl font-bold">
            <AnimatedCounter value={currentUser.ytdFrontPaid} prefix="$" />
          </div>
        </div>

        {/* Back-End Earned */}
        <div
          className="rounded-lg p-5 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Back-End Earned
            </div>
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}
            >
              <TrendingUp size={12} />
              +8%
            </span>
          </div>
          <div className="text-2xl font-bold">
            <AnimatedCounter value={currentUser.ytdBackEarned} prefix="$" />
          </div>
        </div>

        {/* Back-End Pending */}
        <div
          className="rounded-lg p-5 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="text-xs font-medium mb-3" style={{ color: 'var(--text-tertiary)' }}>
            Back-End Pending
          </div>
          <div className="text-2xl font-bold mb-1">
            <AnimatedCounter value={currentUser.ytdBackPending} prefix="$" />
          </div>
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {currentUser.ytdDealsCount} jobs
          </div>
        </div>

        {/* Avg GP% */}
        <div
          className="rounded-lg p-5 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Avg GP%
            </div>
            <TrendingUp size={14} style={{ color: 'var(--accent-green)' }} />
          </div>
          <div className="text-2xl font-bold">
            <AnimatedCounter value={currentUser.avgGP} suffix="%" decimals={1} />
          </div>
        </div>
      </div>

      {/* ===== INSIGHT CARDS (Expandable) ===== */}
      <div className="space-y-3">
        {/* Compensation Clarity */}
        <div
          className="rounded-lg border overflow-hidden transition-all"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <button
            onClick={() => toggleCard('compensation')}
            className="w-full px-5 py-4 flex items-center justify-between hover:opacity-75 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-blue)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Compensation Clarity
              </span>
            </div>
            {expandedCards.compensation ? (
              <ChevronUp size={18} style={{ color: 'var(--text-tertiary)' }} />
            ) : (
              <ChevronDown size={18} style={{ color: 'var(--text-tertiary)' }} />
            )}
          </button>
          {expandedCards.compensation && (
            <div
              className="px-5 pb-4 border-t"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Your plan pays <span className="font-semibold">8% on deals</span> in the 35–40% GP tier. You're currently averaging{' '}
                <span className="font-semibold">{formatPercent(currentUser.avgGP)} GP</span>. You need{' '}
                <span className="font-semibold">${gpNeeded.toLocaleString()}</span> more in gross profit to reach the 9% tier (40–45%).
              </p>
            </div>
          )}
        </div>

        {/* Tier Momentum */}
        <div
          className="rounded-lg border overflow-hidden transition-all"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <button
            onClick={() => toggleCard('momentum')}
            className="w-full px-5 py-4 flex items-center justify-between hover:opacity-75 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-amber)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Tier Momentum
              </span>
            </div>
            {expandedCards.momentum ? (
              <ChevronUp size={18} style={{ color: 'var(--text-tertiary)' }} />
            ) : (
              <ChevronDown size={18} style={{ color: 'var(--text-tertiary)' }} />
            )}
          </button>
          {expandedCards.momentum && (
            <div
              className="px-5 pb-4 border-t space-y-3"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <div className="space-y-2">
                <div className="flex gap-2 items-center text-xs font-semibold">
                  <span style={{ color: 'var(--text-secondary)' }}>Bronze</span>
                  <div
                    className="flex-1 h-1.5 rounded"
                    style={{ backgroundColor: 'var(--border-primary)' }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>Silver</span>
                  <div
                    className="flex-1 h-1.5 rounded"
                    style={{ backgroundColor: 'var(--accent-green)' }}
                  />
                  <span style={{ color: 'var(--text-secondary)' }}>Gold</span>
                </div>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                <span className="font-semibold">Current: Gold</span> · ~{weeksToMaintainGold} weeks at current pace to maintain
              </p>
            </div>
          )}
        </div>

        {/* Forecast */}
        <div
          className="rounded-lg border overflow-hidden transition-all"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <button
            onClick={() => toggleCard('forecast')}
            className="w-full px-5 py-4 flex items-center justify-between hover:opacity-75 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent-green)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                Forecast
              </span>
            </div>
            {expandedCards.forecast ? (
              <ChevronUp size={18} style={{ color: 'var(--text-tertiary)' }} />
            ) : (
              <ChevronDown size={18} style={{ color: 'var(--text-tertiary)' }} />
            )}
          </button>
          {expandedCards.forecast && (
            <div
              className="px-5 pb-4 border-t"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Based on pipeline, <span className="font-semibold">estimated next month: {formatCurrency(forecastNextMonth)}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ===== EARNINGS MOMENTUM CHART ===== */}
      <div
        className="rounded-lg p-5 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Earnings Momentum
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={monthlyTrends}>
            <defs>
              <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
              stroke="var(--border-primary)"
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'var(--text-tertiary)' }}
              stroke="var(--border-primary)"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'var(--text-primary)' }}
              formatter={(value: any) => formatCurrency(Number(value))}
            />
            <Area
              type="monotone"
              dataKey="earnings"
              stroke="var(--accent-blue)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEarnings)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ===== QUICK ACCESS BAR ===== */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: '📊', label: 'What-If Calculator', color: 'var(--accent-purple)' },
          { icon: '💼', label: 'My Deals (24 active)', color: 'var(--accent-blue)' },
          { icon: '🏆', label: 'Leaderboard (#1)', color: 'var(--accent-amber)' },
          { icon: '📖', label: 'Handbook', color: 'var(--accent-green)' },
        ].map((item, idx) => (
          <button
            key={idx}
            className="rounded-lg p-4 text-center transition-all hover:opacity-80 active:scale-95 border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="text-2xl mb-2">{item.icon}</div>
            <div
              className="text-sm font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {item.label}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
