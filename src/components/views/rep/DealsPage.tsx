// @ts-nocheck
'use client';

import React, { useState, useMemo } from 'react';
import { sampleDeals, currentUser } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  Search, ChevronDown, ChevronRight, Clock, DollarSign, AlertCircle,
  CheckCircle, Home, Layers, Droplets, PanelTop, Paintbrush, ArrowRight,
  TrendingUp, Calendar, CircleDot,
} from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  roofing: <Home size={13} />,
  windows: <PanelTop size={13} />,
  siding: <Paintbrush size={13} />,
  gutters: <Droplets size={13} />,
};

const typeColors: Record<string, string> = {
  roofing: '#3b82f6',
  windows: '#8b5cf6',
  siding: '#f59e0b',
  gutters: '#06b6d4',
};

function daysAgo(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DealsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);
  const [collapsedLanes, setCollapsedLanes] = useState<Record<string, boolean>>({});

  const userDeals = useMemo(() => {
    return sampleDeals.filter((deal: any) => deal.repId === currentUser.id);
  }, []);

  // Search filter
  const filtered = useMemo(() => {
    if (!searchQuery) return userDeals;
    const q = searchQuery.toLowerCase();
    return userDeals.filter((d: any) =>
      d.customerName.toLowerCase().includes(q) || d.projectType.toLowerCase().includes(q)
    );
  }, [userDeals, searchQuery]);

  // ── Swim Lanes ──
  // 1. Needs Attention: sold/in_progress deals older than 30 days
  // 2. Active Pipeline: in_progress deals ≤30 days + recently sold
  // 3. Completing Soon: complete stage (back-end earned, awaiting payout)
  // 4. Recently Paid: paid deals (the win column)
  const lanes = useMemo(() => {
    const needsAttention: any[] = [];
    const activePipeline: any[] = [];
    const completingSoon: any[] = [];
    const recentlyPaid: any[] = [];

    // Sort all sold/in_progress deals by age, then split: oldest third → needs attention, rest → active
    const openDeals: any[] = [];
    filtered.forEach((deal: any) => {
      const age = daysAgo(deal.soldDate);
      if (deal.stage === 'paid') {
        recentlyPaid.push({ ...deal, _age: age });
      } else if (deal.stage === 'complete') {
        completingSoon.push({ ...deal, _age: age });
      } else if (deal.stage === 'cancelled') {
        // Skip cancelled
      } else {
        openDeals.push({ ...deal, _age: age });
      }
    });

    // Split open deals: oldest ~40% go to needs attention, rest to active pipeline
    openDeals.sort((a, b) => b._age - a._age);
    const attentionCut = Math.max(2, Math.ceil(openDeals.length * 0.4));
    openDeals.forEach((deal, idx) => {
      if (idx < attentionCut) {
        const reason = deal.stage === 'in_progress' ? 'Stalled — no movement' : deal._age > 200 ? 'Aging 6+ months' : 'Aging — follow up';
        needsAttention.push({ ...deal, _reason: reason });
      } else {
        activePipeline.push(deal);
      }
    });

    // Sort: needs attention by age desc, active by date desc, completing by commission desc, paid by date desc
    needsAttention.sort((a, b) => b._age - a._age);
    activePipeline.sort((a, b) => new Date(b.soldDate).getTime() - new Date(a.soldDate).getTime());
    completingSoon.sort((a, b) => b.totalCommission - a.totalCommission);
    recentlyPaid.sort((a, b) => new Date(b.payDate || b.soldDate).getTime() - new Date(a.payDate || a.soldDate).getTime());

    return { needsAttention, activePipeline, completingSoon, recentlyPaid };
  }, [filtered]);

  // ── KPIs (derived from lanes, not raw data) ──
  const kpis = useMemo(() => {
    const pipelineValue = lanes.activePipeline.reduce((s: number, d: any) => s + d.totalCommission, 0);
    const completingValue = lanes.completingSoon.reduce((s: number, d: any) => s + d.totalCommission, 0);
    const paidValue = lanes.recentlyPaid.reduce((s: number, d: any) => s + d.totalCommission, 0);
    const totalPaid = filtered.reduce((s: number, d: any) => s + (d.paidFront || 0) + (d.paidBack || 0), 0);
    const totalComm = filtered.reduce((s: number, d: any) => s + d.totalCommission, 0);
    const avgGP = filtered.length > 0 ? filtered.reduce((s: number, d: any) => s + d.gpPercent, 0) / filtered.length : 0;
    return { pipelineValue, completingValue, paidValue, totalPaid, totalComm, avgGP, dealCount: filtered.length, attentionCount: lanes.needsAttention.length };
  }, [filtered, lanes]);

  const toggleLane = (lane: string) => {
    setCollapsedLanes(prev => ({ ...prev, [lane]: !prev[lane] }));
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      {/* KPI Strip — answers "Where's my money?" at a glance */}
      <div className="flex-shrink-0 px-3 sm:px-6 pt-4 pb-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>My Deals</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {kpis.dealCount} deals · YTD {new Date().getFullYear()}
            </p>
          </div>
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border w-64"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
            <Search size={13} style={{ color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              placeholder="Search customer or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 outline-none text-sm w-full"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3">
          {/* Needs Attention */}
          <div className="rounded-xl px-4 py-3" style={{
            backgroundColor: kpis.attentionCount > 0 ? 'rgba(239,68,68,0.06)' : 'var(--bg-card)',
            border: kpis.attentionCount > 0 ? '1px solid rgba(239,68,68,0.2)' : '1px solid var(--border-primary)',
          }}>
            <div className="flex items-center gap-1.5 mb-1">
              <AlertCircle size={12} style={{ color: kpis.attentionCount > 0 ? '#ef4444' : 'var(--text-tertiary)' }} />
              <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: kpis.attentionCount > 0 ? '#ef4444' : 'var(--text-tertiary)' }}>
                Needs Attention
              </span>
            </div>
            <p className="text-lg font-black" style={{ color: kpis.attentionCount > 0 ? '#ef4444' : 'var(--text-primary)' }}>
              {kpis.attentionCount} deal{kpis.attentionCount !== 1 ? 's' : ''}
            </p>
            <p className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>aging or stalled</p>
          </div>

          {/* Active Pipeline */}
          <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={12} style={{ color: 'var(--accent-blue)' }} />
              <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Active Pipeline</span>
            </div>
            <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(kpis.pipelineValue)}
            </p>
            <p className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
              {lanes.activePipeline.length} deal{lanes.activePipeline.length !== 1 ? 's' : ''} in progress
            </p>
          </div>

          {/* Completing Soon */}
          <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <Clock size={12} style={{ color: '#f59e0b' }} />
              <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Completing Soon</span>
            </div>
            <p className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(kpis.completingValue)}
            </p>
            <p className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
              {lanes.completingSoon.length} deal{lanes.completingSoon.length !== 1 ? 's' : ''} awaiting payout
            </p>
          </div>

          {/* Paid YTD */}
          <div className="rounded-xl px-4 py-3" style={{ backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign size={12} style={{ color: '#10b981' }} />
              <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Paid YTD</span>
            </div>
            <p className="text-lg font-black" style={{ color: '#10b981' }}>
              {formatCurrency(kpis.totalPaid)}
            </p>
            <p className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
              of {formatCurrency(kpis.totalComm)} total commission
            </p>
          </div>
        </div>
      </div>

      {/* Swim Lanes */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>

        {/* Lane: Needs Attention */}
        {lanes.needsAttention.length > 0 && (
          <LaneSection
            title="Needs Attention"
            subtitle={`${lanes.needsAttention.length} deal${lanes.needsAttention.length !== 1 ? 's' : ''} aging or stalled`}
            icon={<AlertCircle size={14} />}
            color="#ef4444"
            collapsed={!!collapsedLanes['attention']}
            onToggle={() => toggleLane('attention')}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3">
              {lanes.needsAttention.map((deal: any) => (
                <DealCard key={deal.id} deal={deal} expanded={expandedDealId === deal.id}
                  onToggle={() => setExpandedDealId(expandedDealId === deal.id ? null : deal.id)}
                  accent="#ef4444" badge={deal._reason} />
              ))}
            </div>
          </LaneSection>
        )}

        {/* Lane: Active Pipeline */}
        <LaneSection
          title="Active Pipeline"
          subtitle={`${lanes.activePipeline.length} deal${lanes.activePipeline.length !== 1 ? 's' : ''} · ${formatCurrency(lanes.activePipeline.reduce((s: number, d: any) => s + d.totalCommission, 0))} commission`}
          icon={<TrendingUp size={14} />}
          color="var(--accent-blue)"
          collapsed={!!collapsedLanes['active']}
          onToggle={() => toggleLane('active')}
        >
          {lanes.activePipeline.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3">
              {lanes.activePipeline.map((deal: any) => (
                <DealCard key={deal.id} deal={deal} expanded={expandedDealId === deal.id}
                  onToggle={() => setExpandedDealId(expandedDealId === deal.id ? null : deal.id)}
                  accent="var(--accent-blue)" />
              ))}
            </div>
          ) : (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>No active pipeline deals</p>
          )}
        </LaneSection>

        {/* Lane: Completing Soon */}
        <LaneSection
          title="Completing Soon"
          subtitle={`${lanes.completingSoon.length} deal${lanes.completingSoon.length !== 1 ? 's' : ''} · ${formatCurrency(lanes.completingSoon.reduce((s: number, d: any) => s + d.totalCommission, 0))} incoming`}
          icon={<Clock size={14} />}
          color="#f59e0b"
          collapsed={!!collapsedLanes['completing']}
          onToggle={() => toggleLane('completing')}
        >
          {lanes.completingSoon.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3">
              {lanes.completingSoon.map((deal: any) => (
                <DealCard key={deal.id} deal={deal} expanded={expandedDealId === deal.id}
                  onToggle={() => setExpandedDealId(expandedDealId === deal.id ? null : deal.id)}
                  accent="#f59e0b" />
              ))}
            </div>
          ) : (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>No deals completing soon</p>
          )}
        </LaneSection>

        {/* Lane: Recently Paid */}
        <LaneSection
          title="Recently Paid"
          subtitle={`${lanes.recentlyPaid.length} deal${lanes.recentlyPaid.length !== 1 ? 's' : ''} · ${formatCurrency(lanes.recentlyPaid.reduce((s: number, d: any) => s + d.totalCommission, 0))} earned`}
          icon={<CheckCircle size={14} />}
          color="#10b981"
          collapsed={!!collapsedLanes['paid']}
          onToggle={() => toggleLane('paid')}
        >
          {lanes.recentlyPaid.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3">
              {lanes.recentlyPaid.map((deal: any) => (
                <DealCard key={deal.id} deal={deal} expanded={expandedDealId === deal.id}
                  onToggle={() => setExpandedDealId(expandedDealId === deal.id ? null : deal.id)}
                  accent="#10b981" />
              ))}
            </div>
          ) : (
            <p className="text-sm py-4 text-center" style={{ color: 'var(--text-tertiary)' }}>No paid deals yet</p>
          )}
        </LaneSection>
      </div>
    </div>
  );
}

// ── Lane Section Component ──
function LaneSection({ title, subtitle, icon, color, collapsed, onToggle, children }: {
  title: string; subtitle: string; icon: React.ReactNode; color: string;
  collapsed: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div>
      <button onClick={onToggle} className="w-full flex items-center gap-2 mb-2 group">
        <span style={{ color }}>{icon}</span>
        <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{title}</h2>
        <span className="text-[14px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
          {subtitle}
        </span>
        <div className="flex-1" />
        <ChevronDown size={14} style={{
          color: 'var(--text-tertiary)',
          transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s',
        }} />
      </button>
      {!collapsed && children}
    </div>
  );
}

// ── Deal Card Component ──
function DealCard({ deal, expanded, onToggle, accent, badge }: {
  deal: any; expanded: boolean; onToggle: () => void; accent: string; badge?: string;
}) {
  const paidTotal = (deal.paidFront || 0) + (deal.paidBack || 0);
  const payProgress = deal.totalCommission > 0 ? (paidTotal / deal.totalCommission) * 100 : 0;
  const age = deal._age || daysAgo(deal.soldDate);
  const hasSplit = deal.splitType || deal.splitDeal;
  const typeColor = typeColors[deal.projectType] || '#6b7280';

  const stageLabels: Record<string, { label: string; color: string }> = {
    sold: { label: 'Sold', color: '#2563eb' },
    in_progress: { label: 'In Progress', color: '#d97706' },
    complete: { label: 'Complete', color: '#16a34a' },
    paid: { label: 'Paid', color: '#10b981' },
    cancelled: { label: 'Cancelled', color: '#dc2626' },
  };
  const stg = stageLabels[deal.stage] || stageLabels.sold;

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: `1px solid ${expanded ? accent : 'var(--border-subtle)'}`,
        boxShadow: expanded ? `0 0 0 1px ${accent}20` : 'var(--shadow-sm)',
      }}
    >
      {/* Card Header — clickable */}
      <button onClick={onToggle} className="w-full text-left px-4 pt-3 pb-2 transition-colors"
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${typeColor}15`, color: typeColor }}>
                {typeIcons[deal.projectType] || <Layers size={13} />}
              </span>
              <span className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {deal.customerName}
              </span>
              {hasSplit && (
                <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ backgroundColor: 'rgba(139,92,246,0.12)', color: '#8b5cf6' }}>SPLIT</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[14px] font-medium uppercase" style={{ color: typeColor }}>{deal.projectType}</span>
              <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>· {formatDate(deal.soldDate)}</span>
              <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>· {age}d ago</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
            {badge ? (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${accent}15`, color: accent }}>{badge}</span>
            ) : (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${stg.color}12`, color: stg.color }}>{stg.label}</span>
            )}
          </div>
        </div>
      </button>

      {/* Metrics row */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[9px] uppercase font-medium" style={{ color: 'var(--text-tertiary)' }}>Contract</p>
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(deal.fcv)}</p>
          </div>
          <div className="flex-1">
            <p className="text-[9px] uppercase font-medium" style={{ color: 'var(--text-tertiary)' }}>GP</p>
            <p className="text-sm font-bold" style={{
              color: deal.gpPercent >= 40 ? 'var(--accent-green)' : deal.gpPercent >= 35 ? 'var(--text-primary)' : 'var(--accent-red)',
            }}>{formatPercent(deal.gpPercent)}</p>
          </div>
          <div className="flex-1">
            <p className="text-[9px] uppercase font-medium" style={{ color: 'var(--text-tertiary)' }}>Commission</p>
            <p className="text-sm font-bold" style={{ color: 'var(--accent-green)' }}>{formatCurrency(deal.totalCommission)}</p>
          </div>
        </div>

        {/* Payment progress */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${Math.min(payProgress, 100)}%`,
              backgroundColor: payProgress >= 100 ? '#10b981' : payProgress >= 50 ? '#3b82f6' : '#d97706',
            }} />
          </div>
          <span className="text-[9px] font-semibold flex-shrink-0" style={{
            color: payProgress >= 100 ? '#10b981' : 'var(--text-tertiary)',
          }}>
            {payProgress >= 100 ? 'Fully paid' : `${formatCurrency(paidTotal)} of ${formatCurrency(deal.totalCommission)}`}
          </span>
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
          {/* Commission Breakdown */}
          <div>
            <p className="text-[14px] font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-tertiary)' }}>Commission Math</p>
            <div className="rounded-lg p-3 space-y-1" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>Contract Value</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(deal.fcv)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: 'var(--text-secondary)' }}>
                  GP {formatPercent(deal.gpPercent)} → Rate
                </span>
                <span className="font-semibold" style={{ color: 'var(--accent-blue)' }}>{formatPercent(deal.commissionRate * 100)}</span>
              </div>
              <div className="border-t my-1" style={{ borderColor: 'var(--border-primary)' }} />
              <div className="flex justify-between text-sm">
                <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>Total Commission</span>
                <span className="font-bold" style={{ color: 'var(--accent-green)' }}>{formatCurrency(deal.totalCommission)}</span>
              </div>
            </div>
          </div>

          {/* Front/Back Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Front-End (50%)</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{formatCurrency(deal.frontEnd)}</p>
              <p className="text-[9px] mt-0.5" style={{ color: deal.paidFront >= deal.frontEnd ? '#10b981' : '#d97706' }}>
                {deal.paidFront >= deal.frontEnd ? 'Paid' : `${formatCurrency(deal.paidFront || 0)} paid`}
              </p>
            </div>
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Back-End (50%)</p>
              <p className="text-sm font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>{formatCurrency(deal.backEnd)}</p>
              <p className="text-[9px] mt-0.5" style={{ color: deal.paidBack >= deal.backEnd ? '#10b981' : '#d97706' }}>
                {deal.paidBack >= deal.backEnd ? 'Paid' : deal.earnedBack > 0 ? 'Earned, awaiting payout' : 'Pending completion'}
              </p>
            </div>
          </div>

          {/* Split Deal Info */}
          {(deal.splitType || deal.splitDeal) && (
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: '#8b5cf6' }}>
                Split Deal — {(deal.splitType || deal.splitDeal?.type || '').replace(/_/g, ' ')}
              </p>
              {deal.splitPartnerName && (
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  You: {((deal.splitPercentage || 0.5) * 100).toFixed(0)}% · {deal.splitPartnerName}: {((1 - (deal.splitPercentage || 0.5)) * 100).toFixed(0)}%
                </p>
              )}
            </div>
          )}

          {/* Adjustments */}
          {deal.adjustments && deal.adjustments.length > 0 && (
            <div className="rounded-lg p-2.5" style={{ backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: '#f59e0b' }}>Adjustments</p>
              {deal.adjustments.map((adj: any) => (
                <p key={adj.id} className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {adj.description || adj.type?.replace(/_/g, ' ')} — FCV: {formatCurrency(adj.originalFcv)} → {formatCurrency(adj.newFcv)}
                  {' · '}
                  <span style={{ color: adj.commissionAdjustment >= 0 ? '#10b981' : '#ef4444' }}>
                    {adj.commissionAdjustment >= 0 ? '+' : ''}{formatCurrency(adj.commissionAdjustment)}
                  </span>
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
