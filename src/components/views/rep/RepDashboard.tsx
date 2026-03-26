'use client';

import React, { useState } from 'react';
import {
  TrendingUp, DollarSign, Target, Zap, Calendar,
  ArrowRight, Clock, Award, Briefcase, BarChart3,
  Star, CheckCircle2, Circle, ChevronRight, ChevronDown,
  Bell, Trophy, Flame, Gift, AlertTriangle, CreditCard,
  ArrowUpRight, ArrowDownRight, Hash,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import TierBadge from '@/components/shared/TierBadge';
import {
  currentUser, monthlyTrends, repPipeline, commissionWaterfall,
  repMilestones, activeSpifs, repNotifications, ihsIdentity,
} from '@/data/sample-data';
import { formatCurrency } from '@/lib/utils';

// ============================================================================
// REUSABLE CARD — with accent bar and hover lift
// ============================================================================
interface CardProps {
  children: React.ReactNode;
  accent?: string;
  onClick?: () => void;
  className?: string;
  animDelay?: number;
}

function Card({ children, accent, onClick, className = '', animDelay = 0 }: CardProps) {
  const accentClass = accent ? `card-accent-${accent}` : '';
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 min-h-0 ${accentClass} ${onClick ? 'cursor-pointer' : ''} ${className} animate-fade-up stagger-${animDelay}`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {children}
    </div>
  );
}

function CardHeader({ icon, title, badge }: { icon: React.ReactNode; title: string; badge?: React.ReactNode }) {
  return (
    <div className="px-3 py-1.5 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-[14px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-tertiary)' }}>{title}</h3>
      </div>
      {badge}
    </div>
  );
}

// ============================================================================
// NOTIFICATION ICON MAP
// ============================================================================
const notifIcons: Record<string, React.ReactNode> = {
  deal_closed: <CheckCircle2 size={13} className="text-emerald-500" />,
  spif: <Gift size={13} className="text-purple-500" />,
  tier_alert: <AlertTriangle size={13} className="text-amber-500" />,
  payout: <CreditCard size={13} className="text-blue-500" />,
  leaderboard: <Trophy size={13} className="text-amber-500" />,
};

// ============================================================================
// MAIN DASHBOARD
// ============================================================================
export default function RepDashboard() {
  const [showWaterfall, setShowWaterfall] = useState(false);

  const unreadNotifs = (repNotifications || []).filter((n: any) => !n.read).length;
  const totalSpifEarned = activeSpifs.reduce((sum: number, s: any) => sum + s.earned, 0);
  const pipelineTotal = repPipeline.stages.sold.commission + repPipeline.stages.in_progress.commission + repPipeline.stages.complete.commission + repPipeline.stages.final_payment.commission;

  const recentTrends = monthlyTrends.slice(-6);
  const lastMonth = recentTrends[recentTrends.length - 1];
  const prevMonth = recentTrends[recentTrends.length - 2];
  const monthChange = lastMonth && prevMonth ? ((lastMonth.earnings - prevMonth.earnings) / prevMonth.earnings * 100).toFixed(0) : '0';
  const monthUp = Number(monthChange) >= 0;

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">

      {/* ===== HERO STRIP ===== */}
      <div
        className="flex-shrink-0 px-3 sm:px-4 md:px-6 py-2 relative overflow-hidden"
        style={{ background: 'var(--hero-gradient)' }}
      >
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 25% 50%, rgba(59,130,246,0.2) 0%, transparent 55%), radial-gradient(ellipse at 75% 30%, rgba(99,102,241,0.08) 0%, transparent 50%)',
        }} />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between max-w-[1440px] mx-auto relative z-10 gap-3 sm:gap-0">
          <div className="animate-fade-up w-full sm:w-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2.5 mb-1">
              <p className="text-[14px] font-semibold text-blue-300/70 uppercase tracking-[0.14em]">YTD Earned</p>
              <span className="text-[14px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full w-fit">+12% YoY</span>
            </div>
            <span className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none">
              {formatCurrency(currentUser.ytdEarnings)}
            </span>
            <button
              onClick={() => setShowWaterfall(!showWaterfall)}
              className="flex items-center gap-1.5 text-[14px] font-semibold text-blue-400/70 hover:text-blue-300 mt-2 transition-colors"
            >
              <BarChart3 size={10} />
              {showWaterfall ? 'Hide breakdown' : 'See the math'}
              <ChevronDown size={10} className={`transition-transform ${showWaterfall ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-5 animate-fade-up stagger-2">
            <div className="text-right">
              <p className="text-[14px] font-semibold text-blue-300/70 uppercase tracking-[0.14em]">Next Payout</p>
              <p className="text-2xl font-black text-white leading-tight">$4,200</p>
              <div className="flex items-center gap-1 justify-end mt-0.5">
                <Calendar size={10} className="text-blue-400/60" />
                <span className="text-[14px] text-blue-300/60">Mar 31</span>
              </div>
            </div>
            <TierBadge tier={currentUser.tier} size="sm" />
          </div>
        </div>

        {showWaterfall && (
          <div className="max-w-[1440px] mx-auto mt-3 relative z-10 animate-slide-down">
            <div className="bg-white/[0.05] rounded-xl p-3 border border-white/[0.08]" style={{ backdropFilter: 'blur(10px)' }}>
              <div className="flex items-center gap-3 flex-wrap justify-between">
                {commissionWaterfall.map((step: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="text-center min-w-0">
                      <p className={`text-[9px] font-medium ${step.type === 'final' ? 'text-emerald-300' : step.type === 'pending' ? 'text-amber-300' : 'text-blue-300'}`}>
                        {step.label}
                      </p>
                      <p className={`text-sm font-bold ${step.type === 'final' ? 'text-emerald-400' : step.type === 'pending' ? 'text-amber-400' : 'text-white'}`}>
                        {step.type === 'tier' ? `${step.value}%` : formatCurrency(step.value)}
                      </p>
                      <p className="text-[8px] text-blue-500">{step.note}</p>
                    </div>
                    {idx < commissionWaterfall.length - 1 && (
                      <ArrowRight size={10} className="text-blue-600 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== KPI STAT PILLS ===== */}
      <div className="flex-shrink-0 px-3 sm:px-4 md:px-6 pt-1.5 pb-1 overflow-x-auto" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 min-w-min sm:min-w-0">
            {[
              { label: 'Quota Progress', value: `${currentUser.quotaProgress}%`, sub: `$${((currentUser.quotaTarget - currentUser.ytdEarnings) / 1000).toFixed(0)}K to target`, tint: 'var(--tint-blue)', color: currentUser.quotaProgress >= 100 ? 'var(--semantic-paid)' : 'var(--accent-blue)', borderColor: 'rgba(59,130,246,0.2)' },
              { label: 'Avg GP', value: `${currentUser.avgGP}%`, sub: `${currentUser.tier} tier · ${currentUser.gpToNextTier}% to next`, tint: 'var(--tint-green)', color: 'var(--semantic-paid)', borderColor: 'rgba(16,185,129,0.2)' },
              { label: 'Jobs Sold', value: `${currentUser.ytdJobsSold}`, sub: `${currentUser.ytdJobsActive} active · ${currentUser.ytdJobsCompleted} complete`, tint: 'var(--tint-purple)', color: 'var(--accent-purple)', borderColor: 'rgba(139,92,246,0.2)' },
              { label: 'Leaderboard', value: `#${currentUser.leaderboardRank}`, sub: `of ${currentUser.leaderboardTotal} reps`, tint: 'var(--tint-amber)', color: 'var(--accent-amber)', borderColor: 'rgba(245,158,11,0.2)' },
            ].map((kpi, i) => (
              <div
                key={i}
                className={`px-3 py-1.5 rounded-xl border transition-all animate-fade-up stagger-${i + 1}`}
                style={{ backgroundColor: kpi.tint, borderColor: kpi.borderColor }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-tertiary)' }}>{kpi.label}</p>
                <p className="text-lg font-black leading-tight mt-0.5" style={{ color: kpi.color }}>{kpi.value}</p>
                <p className="text-[14px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{kpi.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== 9-CARD GRID ===== */}
      <div className="flex-1 min-h-0 px-3 sm:px-4 md:px-6 pt-1.5 pb-1 overflow-y-auto lg:overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="max-w-[1440px] mx-auto h-full w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 h-full min-h-0" style={{ gridTemplateRows: 'repeat(3, minmax(0, 1fr))' }}>

            {/* ─── CARD 1: EARNINGS BREAKDOWN ─── */}
            <Card accent="green" animDelay={1}>
              <CardHeader
                icon={<DollarSign size={13} style={{ color: 'var(--accent-green)' }} />}
                title="Earnings"
                badge={<span className="text-[14px] font-black" style={{ color: 'var(--accent-green)' }}>{formatCurrency(currentUser.ytdEarnings)}</span>}
              />
              <div className="px-2 sm:px-3 pb-1.5 flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-2">
                  {[
                    { label: 'Front-End Paid', value: currentUser.ytdFrontPaid, note: `${currentUser.ytdJobsSold} jobs`, color: 'var(--semantic-paid)', pct: currentUser.ytdFrontPaid / currentUser.ytdEarnings },
                    { label: 'Back-End Earned', value: currentUser.ytdBackEarned, note: `${currentUser.ytdJobsCompleted} complete`, color: 'var(--semantic-earned)', pct: currentUser.ytdBackEarned / currentUser.ytdEarnings },
                    { label: 'Back-End Pending', value: currentUser.ytdBackPending, note: `${currentUser.ytdJobsActive} active`, color: 'var(--semantic-pending)', pct: currentUser.ytdBackPending / (currentUser.ytdEarnings + currentUser.ytdBackPending) },
                  ].map((row, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[14px] font-semibold" style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>{row.note}</span>
                          <span className="text-[14px] font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{formatCurrency(row.value)}</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: row.color, width: `${row.pct * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 mt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>Total commission generated</span>
                  <span className="text-[14px] font-black" style={{ color: 'var(--text-primary)' }}>{formatCurrency(currentUser.ytdFrontPaid + currentUser.ytdBackEarned + currentUser.ytdBackPending)}</span>
                </div>
              </div>
            </Card>

            {/* ─── CARD 2: TOP DEAL ─── */}
            <Card accent="amber" animDelay={2}>
              <CardHeader
                icon={<Zap size={13} style={{ color: 'var(--accent-amber)' }} />}
                title="Top Deal"
                badge={
                  <span className="text-[14px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: 'var(--accent-green)' }}>
                    {repPipeline.topDeal.gpPercent}% GP
                  </span>
                }
              />
              <div className="px-2 sm:px-3 pb-1.5 flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{repPipeline.topDeal.customerName}</p>
                  <p className="text-[14px] capitalize" style={{ color: 'var(--text-tertiary)' }}>
                    {repPipeline.topDeal.projectType} · {formatCurrency(repPipeline.topDeal.fcv)} FCV
                  </p>
                  <div className="rounded-xl p-2.5 mt-1.5" style={{ backgroundColor: 'var(--tint-green)', border: '1px solid rgba(16,185,129,0.1)' }}>
                    <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Commission if closed</p>
                    <p className="text-xl font-black mt-0.5" style={{ color: 'var(--accent-green)' }}>
                      +{formatCurrency(repPipeline.topDeal.estimatedCommission)}
                    </p>
                    <div className="flex gap-4 mt-1.5">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Front</p>
                        <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(repPipeline.topDeal.estimatedCommission / 2)}</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Back</p>
                        <p className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(repPipeline.topDeal.estimatedCommission / 2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* ─── CARD 3: TIER & RATE ─── */}
            <Card accent="blue" animDelay={3}>
              <CardHeader
                icon={<Target size={13} style={{ color: 'var(--accent-blue)' }} />}
                title="Tier & Rate"
                badge={<TierBadge tier={currentUser.tier} size="sm" />}
              />
              <div className="px-2 sm:px-3 pb-1.5 flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  {[
                    { name: 'Platinum', gp: '45%+', rate: '10%', active: false, reached: false },
                    { name: 'Diamond', gp: '40-45%', rate: '9%', active: false, reached: false },
                    { name: 'Gold', gp: '35-40%', rate: '8%', active: true, reached: true },
                    { name: 'Silver', gp: '30-35%', rate: '7%', active: false, reached: true },
                    { name: 'Bronze', gp: '25-30%', rate: '5%', active: false, reached: true },
                  ].map((tier, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors"
                      style={{
                        backgroundColor: tier.active ? 'var(--accent-blue)' : 'transparent',
                        boxShadow: tier.active ? 'var(--shadow-glow-blue)' : 'none',
                      }}
                    >
                      {tier.reached ? (
                        <CheckCircle2 size={12} style={{ color: tier.active ? '#fff' : 'var(--accent-green)' }} />
                      ) : (
                        <Circle size={12} style={{ color: 'var(--text-tertiary)' }} />
                      )}
                      <span className={`text-[14px] font-bold flex-1 ${tier.active ? 'text-white' : ''}`}
                        style={{ color: tier.active ? undefined : 'var(--text-primary)' }}>
                        {tier.name}
                        <span className={`font-normal ml-1 ${tier.active ? 'text-blue-200' : ''}`} style={{ color: tier.active ? undefined : 'var(--text-tertiary)' }}>{tier.gp}</span>
                      </span>
                      <span className={`text-[14px] font-black ${tier.active ? 'text-white' : ''}`}
                        style={{ color: tier.active ? undefined : 'var(--text-secondary)' }}>
                        {tier.rate}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 rounded-lg p-2.5 flex items-start gap-2" style={{ backgroundColor: 'var(--tint-amber)', border: '1px solid rgba(245,158,11,0.1)' }}>
                  <Star size={12} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                      <span className="font-bold">{currentUser.gpToNextTier}% GP</span> to Diamond — unlocks 9% rate
                    </p>
                    <p className="text-[9px] mt-0.5 italic" style={{ color: 'var(--text-tertiary)' }}>
                      Higher GP = ethical pricing = peace of mind
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* ─── CARD 4: PIPELINE ─── */}
            <Card accent="purple" animDelay={4}>
              <CardHeader
                icon={<Briefcase size={13} style={{ color: 'var(--accent-purple)' }} />}
                title="Pipeline"
                badge={<span className="text-[14px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--tint-blue)', color: 'var(--accent-blue)' }}>{repPipeline.totalActive} active</span>}
              />
              <div className="px-2 sm:px-3 pb-1.5 flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-2">
                  {[
                    { stage: 'Sold', ...repPipeline.stages.sold, color: 'var(--semantic-earned)' },
                    { stage: 'In Progress', ...repPipeline.stages.in_progress, color: 'var(--semantic-pending)' },
                    { stage: 'Complete', ...repPipeline.stages.complete, color: 'var(--semantic-paid)' },
                    { stage: 'Final Pay', ...repPipeline.stages.final_payment, color: 'var(--semantic-paid)' },
                  ].map((s, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-0.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                          <span className="text-[14px] font-semibold" style={{ color: 'var(--text-primary)' }}>{s.stage}</span>
                          <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>({s.count})</span>
                        </div>
                        <span className="text-[14px] font-black tabular-nums" style={{ color: 'var(--text-primary)' }}>{formatCurrency(s.commission)}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: s.color, width: `${Math.min((s.commission / 15000) * 100, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 mt-2 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                  <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>Pipeline commission</span>
                  <span className="text-sm font-black" style={{ color: 'var(--accent-green)' }}>
                    {formatCurrency(pipelineTotal)}
                  </span>
                </div>
              </div>
            </Card>

            {/* ─── CARD 5: EARNINGS TREND ─── */}
            <Card accent="blue" animDelay={5}>
              <CardHeader
                icon={<TrendingUp size={13} style={{ color: 'var(--accent-blue)' }} />}
                title="Trend"
                badge={
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ backgroundColor: monthUp ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                    {monthUp ? <ArrowUpRight size={11} className="text-emerald-500" /> : <ArrowDownRight size={11} className="text-red-500" />}
                    <span className={`text-[14px] font-bold ${monthUp ? 'text-emerald-500' : 'text-red-500'}`}>{monthChange}% mo/mo</span>
                  </div>
                }
              />
              <div className="p-1 sm:p-2 flex-1 min-h-0 overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={recentTrends} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                    <defs>
                      <linearGradient id="gradE" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent-blue)" stopOpacity={0.15} />
                        <stop offset="100%" stopColor="var(--accent-blue)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} stroke="none" tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: 'var(--text-tertiary)' }} stroke="none" tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)', borderRadius: 12, fontSize: 11, boxShadow: 'var(--shadow-lg)' }}
                      formatter={(value: any) => [formatCurrency(Number(value)), 'Earned']}
                    />
                    <Area type="monotone" dataKey="earnings" stroke="var(--accent-blue)" strokeWidth={2.5} fill="url(#gradE)" dot={{ r: 3, fill: 'var(--accent-blue)', strokeWidth: 2, stroke: 'var(--bg-card)' }} activeDot={{ r: 5, fill: 'var(--accent-blue)', strokeWidth: 2, stroke: 'var(--bg-card)' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* ─── CARD 6: LEADERBOARD ─── */}
            <Card accent="amber" animDelay={6}>
              <CardHeader
                icon={<Trophy size={13} style={{ color: 'var(--accent-amber)' }} />}
                title="Leaderboard"
                badge={<span className="text-[14px] font-black" style={{ color: 'var(--accent-amber)' }}>#{currentUser.leaderboardRank}</span>}
              />
              <div className="px-2 sm:px-3 pb-1.5 flex-1 flex flex-col justify-between min-w-0">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}
                  >
                    #{currentUser.leaderboardRank}
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{currentUser.name}</p>
                    <p className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>{currentUser.brandName}</p>
                    <p className="text-[14px] font-black mt-0.5" style={{ color: 'var(--accent-green)' }}>
                      {formatCurrency(currentUser.ytdEarnings)} earned
                    </p>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  {[
                    { rank: 2, name: 'James Wright', amount: '$136K' },
                    { rank: 3, name: 'Sarah Palmer', amount: '$128K' },
                  ].map((p) => (
                    <div key={p.rank} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <span className="text-[14px] font-medium" style={{ color: 'var(--text-tertiary)' }}>#{p.rank} — {p.name}</span>
                      <span className="text-[14px] font-bold tabular-nums" style={{ color: 'var(--text-secondary)' }}>{p.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ─── CARD 7: ACTIVE SPIFS ─── */}
            <Card accent="orange" animDelay={7}>
              <CardHeader
                icon={<Flame size={13} className="text-orange-500" />}
                title="Active SPIFs"
                badge={
                  <span className="text-[14px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--tint-orange)', color: '#f97316' }}>
                    {formatCurrency(totalSpifEarned)} earned
                  </span>
                }
              />
              <div className="px-3 pb-1.5 flex-1 min-h-0 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                <div className="space-y-2">
                  {activeSpifs.map((spif: any) => (
                    <div
                      key={spif.id}
                      className="px-2.5 py-2 rounded-lg border"
                      style={{ borderColor: 'var(--border-subtle)', backgroundColor: spif.earned > 0 ? 'var(--tint-green)' : 'transparent' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{spif.name}</span>
                        <span className="text-[14px] font-black tabular-nums" style={{ color: spif.earned > 0 ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
                          {spif.earned > 0 ? `+${formatCurrency(spif.earned)}` : '$0'}
                        </span>
                      </div>
                      <p className="text-[9px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{spif.criteria}</p>
                      {spif.target && (
                        <div className="mt-1.5">
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                            <div className="h-full rounded-full bg-orange-500 transition-all duration-500" style={{ width: `${(spif.yourProgress / spif.target) * 100}%` }} />
                          </div>
                          <p className="text-[8px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{spif.yourProgress}% / {spif.target}% target</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ─── CARD 8: ALERTS ─── */}
            <Card accent="red" animDelay={8}>
              <CardHeader
                icon={<Bell size={13} style={{ color: 'var(--accent-blue)' }} />}
                title="Alerts"
                badge={
                  unreadNotifs > 0 ? (
                    <span className="text-[14px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: 'var(--accent-red)' }}>
                      {unreadNotifs} new
                    </span>
                  ) : null
                }
              />
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  {repNotifications.map((n: any) => (
                    <div
                      key={n.id}
                      className="px-3 py-1.5 border-b flex items-start gap-2 transition-colors cursor-pointer"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        backgroundColor: n.read ? 'transparent' : 'var(--tint-blue)',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'var(--tint-blue)'}
                    >
                      <div className="mt-0.5 flex-shrink-0">{notifIcons[n.type] || <Bell size={13} />}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[14px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{n.title}</span>
                          <span className="text-[9px] flex-shrink-0" style={{ color: 'var(--text-tertiary)' }}>{n.time}</span>
                        </div>
                        <p className="text-[14px] line-clamp-1 mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{n.body}</p>
                      </div>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--accent-blue)' }} />}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* ─── CARD 9: MILESTONES ─── */}
            <Card accent="purple" animDelay={9}>
              <CardHeader
                icon={<Award size={13} style={{ color: 'var(--accent-purple)' }} />}
                title="Milestones"
                badge={
                  <span className="text-[14px] font-black" style={{ color: 'var(--accent-purple)' }}>
                    {repMilestones.filter((m: any) => m.completed).length}/{repMilestones.length}
                  </span>
                }
              />
              <div className="flex-1 overflow-y-auto px-2 sm:px-3 pb-2" style={{ scrollbarWidth: 'thin' }}>
                <div className="space-y-1.5">
                  {repMilestones.map((ms: any) => {
                    const valueColor = ms.value === 'Integrity' ? '#3b82f6' : ms.value === 'Hard Work' ? '#f59e0b' : '#10b981';
                    return (
                      <div
                        key={ms.id}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors"
                        style={{
                          backgroundColor: ms.completed ? 'var(--bg-secondary)' : 'transparent',
                          border: `1px solid ${ms.completed ? 'rgba(16,185,129,0.15)' : 'var(--border-subtle)'}`,
                          borderLeftWidth: 3,
                          borderLeftColor: ms.completed ? 'var(--accent-green)' : valueColor,
                          opacity: ms.completed ? 0.7 : 1,
                        }}
                      >
                        <span className="text-sm flex-shrink-0">{ms.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[14px] font-bold truncate" style={{ color: 'var(--text-primary)' }}>{ms.label}</p>
                            {ms.value && (
                              <span className="text-[7px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full flex-shrink-0"
                                style={{ backgroundColor: `${valueColor}12`, color: valueColor }}>
                                {ms.value}
                              </span>
                            )}
                          </div>
                          {!ms.completed && ms.progress > 0 && (
                            <div className="mt-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                              <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: valueColor, width: `${ms.progress}%` }} />
                            </div>
                          )}
                        </div>
                        {ms.completed ? (
                          <CheckCircle2 size={13} style={{ color: 'var(--accent-green)' }} className="flex-shrink-0" />
                        ) : (
                          <span className="text-[14px] font-black flex-shrink-0" style={{ color: valueColor }}>{ms.progress}%</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
