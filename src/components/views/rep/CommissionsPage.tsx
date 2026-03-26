// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import { sampleDeals, currentUser } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';
import {
  DollarSign, Clock, CheckCircle, AlertTriangle, TrendingUp, Calendar,
  ArrowRight, ChevronDown, Banknote, Wallet, PiggyBank, ArrowDownToLine,
} from 'lucide-react';

export default function CommissionsPage() {
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [showAllMonths, setShowAllMonths] = useState(false);

  const userDeals = useMemo(() => {
    return sampleDeals.filter((deal: any) => deal.repId === currentUser.id);
  }, []);

  // ── Core Stats ──
  const stats = useMemo(() => {
    let totalEarned = 0;
    let totalPaidFront = 0;
    let totalPaidBack = 0;
    let totalPendingFront = 0;
    let totalPendingBack = 0;
    let totalAdjustments = 0;
    let earnedAwaitingPayout = 0;

    userDeals.forEach((d: any) => {
      totalEarned += d.totalCommission;
      totalPaidFront += d.paidFront || 0;
      totalPaidBack += d.paidBack || 0;
      totalPendingFront += Math.max(0, d.frontEnd - (d.paidFront || 0));
      totalPendingBack += Math.max(0, d.backEnd - (d.paidBack || 0));
      if (d.earnedBack > 0 && d.paidBack === 0) earnedAwaitingPayout += d.earnedBack;
      if (d.adjustments) {
        d.adjustments.forEach((adj: any) => { totalAdjustments += adj.commissionAdjustment || 0; });
      }
    });

    const totalPaid = totalPaidFront + totalPaidBack;
    const totalPending = totalPendingFront + totalPendingBack;
    return { totalEarned, totalPaid, totalPending, totalPaidFront, totalPaidBack, totalPendingFront, totalPendingBack, totalAdjustments, earnedAwaitingPayout };
  }, [userDeals]);

  const payPercent = stats.totalEarned > 0 ? (stats.totalPaid / stats.totalEarned) * 100 : 0;

  // ── Monthly payment history (grouped) ──
  const monthlyHistory = useMemo(() => {
    const months: Record<string, { month: string; sortKey: string; paid: number; count: number; items: any[] }> = {};

    userDeals.forEach((d: any) => {
      // Front-end
      if (d.paidFront > 0 && d.soldDate) {
        const dt = new Date(d.soldDate);
        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
        const label = dt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!months[key]) months[key] = { month: label, sortKey: key, paid: 0, count: 0, items: [] };
        months[key].paid += d.paidFront;
        months[key].count++;
        months[key].items.push({ customer: d.customerName, type: d.projectType, amount: d.paidFront, label: 'Front-end', date: d.soldDate });
      }
      // Back-end
      if (d.paidBack > 0) {
        const dt = new Date(d.payDate || d.closeDate || d.soldDate);
        const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
        const label = dt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        if (!months[key]) months[key] = { month: label, sortKey: key, paid: 0, count: 0, items: [] };
        months[key].paid += d.paidBack;
        months[key].count++;
        months[key].items.push({ customer: d.customerName, type: d.projectType, amount: d.paidBack, label: 'Back-end', date: d.payDate || d.closeDate });
      }
    });

    return Object.values(months).sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  }, [userDeals]);

  // ── Upcoming / Pending payouts ──
  const pendingPayouts = useMemo(() => {
    const items: any[] = [];
    userDeals.forEach((d: any) => {
      const frontPending = Math.max(0, d.frontEnd - (d.paidFront || 0));
      const backPending = Math.max(0, d.backEnd - (d.paidBack || 0));
      if (frontPending > 0) {
        items.push({ customer: d.customerName, type: d.projectType, amount: frontPending, label: 'Front-end pending', status: 'pending' });
      }
      if (backPending > 0) {
        const earned = d.earnedBack > 0;
        items.push({
          customer: d.customerName, type: d.projectType, amount: backPending,
          label: earned ? 'Back-end earned — awaiting payout' : 'Back-end — awaiting job completion',
          status: earned ? 'earned' : 'pending',
        });
      }
    });
    // Earned first (closer to payout), then pending
    items.sort((a, b) => {
      if (a.status === 'earned' && b.status !== 'earned') return -1;
      if (a.status !== 'earned' && b.status === 'earned') return 1;
      return b.amount - a.amount;
    });
    return items;
  }, [userDeals]);

  // ── By Customer breakdown ──
  const customerSummaries = useMemo(() => {
    const map: Record<string, any> = {};
    userDeals.forEach((d: any) => {
      if (!map[d.customerName]) {
        map[d.customerName] = { customer: d.customerName, deals: [], totalComm: 0, totalPaid: 0, totalPending: 0, types: new Set() };
      }
      const paid = (d.paidFront || 0) + (d.paidBack || 0);
      const pending = d.totalCommission - paid;
      map[d.customerName].deals.push(d);
      map[d.customerName].totalComm += d.totalCommission;
      map[d.customerName].totalPaid += paid;
      map[d.customerName].totalPending += pending;
      map[d.customerName].types.add(d.projectType);
    });
    return Object.values(map)
      .map((c: any) => ({ ...c, types: Array.from(c.types).join(', ') }))
      .sort((a: any, b: any) => b.totalComm - a.totalComm);
  }, [userDeals]);

  const displayedMonths = showAllMonths ? monthlyHistory : monthlyHistory.slice(0, 3);

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      {/* Hero — The Money Story */}
      <div className="flex-shrink-0 px-6 pt-4 pb-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
        <h1 className="text-2xl font-black tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>My Commissions</h1>

        {/* Money Flow: Earned → Paid → Pending — visual waterfall */}
        <div className="rounded-xl overflow-hidden mb-3" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-primary)' }}>
          <div className="grid grid-cols-4 divide-x" style={{ borderColor: 'var(--border-primary)' }}>
            {/* Total Earned */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <Wallet size={12} style={{ color: 'var(--text-tertiary)' }} />
                <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Total Earned</span>
              </div>
              <p className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>{formatCurrency(stats.totalEarned)}</p>
              <p className="text-[14px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>across {userDeals.length} deals</p>
            </div>

            {/* In Your Pocket */}
            <div className="px-4 py-3" style={{ backgroundColor: 'rgba(16,185,129,0.04)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Banknote size={12} style={{ color: '#10b981' }} />
                <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: '#10b981' }}>In Your Pocket</span>
              </div>
              <p className="text-xl font-black" style={{ color: '#10b981' }}>{formatCurrency(stats.totalPaid)}</p>
              <p className="text-[14px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{payPercent.toFixed(0)}% of earned</p>
            </div>

            {/* Coming Your Way */}
            <div className="px-4 py-3" style={{ backgroundColor: 'rgba(245,158,11,0.04)' }}>
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowDownToLine size={12} style={{ color: '#f59e0b' }} />
                <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: '#f59e0b' }}>Coming Your Way</span>
              </div>
              <p className="text-xl font-black" style={{ color: '#f59e0b' }}>{formatCurrency(stats.totalPending)}</p>
              <p className="text-[14px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                {stats.earnedAwaitingPayout > 0
                  ? `${formatCurrency(stats.earnedAwaitingPayout)} ready for next payout`
                  : 'awaiting job completions'}
              </p>
            </div>

            {/* Adjustments */}
            <div className="px-4 py-3">
              <div className="flex items-center gap-1.5 mb-1">
                <AlertTriangle size={12} style={{ color: stats.totalAdjustments < 0 ? '#ef4444' : 'var(--text-tertiary)' }} />
                <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Adjustments</span>
              </div>
              <p className="text-xl font-black" style={{ color: stats.totalAdjustments >= 0 ? 'var(--text-primary)' : '#ef4444' }}>
                {stats.totalAdjustments >= 0 ? '+' : ''}{formatCurrency(stats.totalAdjustments)}
              </p>
              <p className="text-[14px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>change orders & corrections</p>
            </div>
          </div>

          {/* Visual progress bar spanning full width */}
          <div className="h-2 flex" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div style={{ width: `${payPercent}%`, backgroundColor: '#10b981' }} />
            <div style={{ width: `${stats.totalEarned > 0 ? ((stats.earnedAwaitingPayout) / stats.totalEarned) * 100 : 0}%`, backgroundColor: '#3b82f6' }} />
            <div style={{ width: `${stats.totalEarned > 0 ? ((stats.totalPending - stats.earnedAwaitingPayout) / stats.totalEarned) * 100 : 0}%`, backgroundColor: '#f59e0b' }} />
          </div>
          <div className="px-4 py-1.5 flex items-center gap-4 text-[9px]" style={{ color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-card)' }}>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#10b981' }} />Paid</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#3b82f6' }} />Earned (next payout)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#f59e0b' }} />Pending completion</span>
          </div>
        </div>
      </div>

      {/* Content — Two columns: Left = History, Right = Pending + By Customer */}
      <div className="flex-1 overflow-y-auto px-6 py-4" style={{ scrollbarWidth: 'thin' }}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Left Column: Payment History (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Payment History</h2>
              <span className="text-[14px] font-medium" style={{ color: 'var(--text-tertiary)' }}>by month</span>
            </div>

            {displayedMonths.map((m) => (
              <div key={m.sortKey} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                {/* Month header */}
                <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-primary)' }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={13} style={{ color: 'var(--accent-blue)' }} />
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{m.month}</span>
                    <span className="text-[14px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
                      {m.count} payment{m.count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <span className="text-sm font-black" style={{ color: '#10b981' }}>+{formatCurrency(m.paid)}</span>
                </div>
                {/* Individual payments */}
                <div>
                  {m.items.map((item: any, idx: number) => (
                    <div key={idx} className="px-4 py-2 flex items-center justify-between" style={{
                      borderBottom: idx < m.items.length - 1 ? '1px solid var(--border-primary)' : 'none',
                    }}>
                      <div className="flex items-center gap-2">
                        <CheckCircle size={11} style={{ color: '#10b981' }} />
                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.customer}</span>
                        <span className="text-[9px] uppercase" style={{ color: 'var(--text-tertiary)' }}>{item.type}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>{item.label}</span>
                      </div>
                      <span className="text-sm font-bold" style={{ color: '#10b981' }}>+{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {monthlyHistory.length > 3 && (
              <button onClick={() => setShowAllMonths(!showAllMonths)}
                className="w-full py-2 text-sm font-semibold rounded-lg transition-colors"
                style={{ color: 'var(--accent-blue)', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                {showAllMonths ? 'Show less' : `Show ${monthlyHistory.length - 3} more month${monthlyHistory.length - 3 !== 1 ? 's' : ''}`}
              </button>
            )}
          </div>

          {/* Right Column: Pending Payouts + By Customer (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Pending Payouts */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>
                Pending Payouts
                <span className="text-[14px] font-medium ml-2" style={{ color: '#f59e0b' }}>{formatCurrency(stats.totalPending)}</span>
              </h2>
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
                {pendingPayouts.slice(0, 8).map((item: any, idx: number) => {
                  const isEarned = item.status === 'earned';
                  return (
                    <div key={idx} className="px-3 py-2 flex items-center justify-between" style={{
                      borderBottom: idx < Math.min(pendingPayouts.length, 8) - 1 ? '1px solid var(--border-primary)' : 'none',
                    }}>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {isEarned
                          ? <TrendingUp size={11} style={{ color: '#3b82f6', flexShrink: 0 }} />
                          : <Clock size={11} style={{ color: '#f59e0b', flexShrink: 0 }} />
                        }
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.customer}</p>
                          <p className="text-[9px] truncate" style={{ color: isEarned ? '#3b82f6' : '#f59e0b' }}>{item.label}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold flex-shrink-0 ml-2" style={{ color: isEarned ? '#3b82f6' : '#f59e0b' }}>
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  );
                })}
                {pendingPayouts.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <CheckCircle size={20} style={{ color: '#10b981', margin: '0 auto 8px' }} />
                    <p className="text-sm font-medium" style={{ color: '#10b981' }}>All caught up!</p>
                  </div>
                )}
              </div>
            </div>

            {/* By Customer */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-primary)' }}>By Customer</h2>
              <div className="space-y-2">
                {customerSummaries.map((cs: any) => {
                  const paidPct = cs.totalComm > 0 ? (cs.totalPaid / cs.totalComm) * 100 : 0;
                  const isExpanded = expandedCustomer === cs.customer;
                  return (
                    <div key={cs.customer} className="rounded-xl overflow-hidden transition-all" style={{
                      backgroundColor: 'var(--bg-card)',
                      border: `1px solid ${isExpanded ? 'var(--accent-blue)' : 'var(--border-subtle)'}`,
                    }}>
                      <button onClick={() => setExpandedCustomer(isExpanded ? null : cs.customer)}
                        className="w-full text-left px-3 py-2.5 transition-colors"
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <ChevronDown size={12} style={{
                              color: 'var(--text-tertiary)',
                              transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                              transition: 'transform 0.2s',
                            }} />
                            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{cs.customer}</span>
                            <span className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{cs.deals.length} deal{cs.deals.length > 1 ? 's' : ''}</span>
                          </div>
                          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(cs.totalComm)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <div className="h-full rounded-full" style={{ width: `${paidPct}%`, backgroundColor: '#10b981' }} />
                          </div>
                          <span className="text-[9px] font-semibold" style={{ color: paidPct >= 100 ? '#10b981' : 'var(--text-tertiary)' }}>
                            {paidPct >= 100 ? 'Fully paid' : `${formatCurrency(cs.totalPaid)} paid`}
                          </span>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-2.5 pt-0 space-y-1">
                          {cs.deals.map((d: any) => {
                            const dealPaid = (d.paidFront || 0) + (d.paidBack || 0);
                            return (
                              <div key={d.id} className="flex items-center justify-between py-1 px-2 rounded" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                                <div>
                                  <span className="text-[14px] font-medium uppercase" style={{ color: 'var(--text-tertiary)' }}>{d.projectType}</span>
                                  <span className="text-[14px] ml-1" style={{ color: 'var(--text-tertiary)' }}>· {formatCurrency(d.fcv)} contract</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(d.totalCommission)}</span>
                                  <span className="text-[9px] ml-1" style={{ color: dealPaid >= d.totalCommission ? '#10b981' : '#f59e0b' }}>
                                    {dealPaid >= d.totalCommission ? 'paid' : `${formatCurrency(dealPaid)} paid`}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
