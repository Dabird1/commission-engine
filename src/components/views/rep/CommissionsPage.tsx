'use client';

import { useState, useMemo } from 'react';
import { sampleDeals, currentUser } from '@/data/sample-data';
import { formatCurrency, cn } from '@/lib/utils';

type CommissionStatus = 'all' | 'paid' | 'pending' | 'processing' | 'clawed_back';

export default function CommissionsPage() {
  const [selectedStatus, setSelectedStatus] = useState<CommissionStatus>('all');

  const userDeals = useMemo(() => {
    return sampleDeals.filter((deal) => deal.repId === currentUser.id);
  }, []);

  const stats = useMemo(() => {
    const totalEarned = userDeals.reduce((sum, deal) => sum + deal.totalCommission, 0);
    const pending = userDeals
      .filter((d) => d.stage === 'sold' || d.stage === 'in_progress')
      .reduce((sum, deal) => sum + deal.backEnd, 0);
    const paidOut = userDeals
      .filter((d) => d.stage === 'paid')
      .reduce((sum, deal) => sum + deal.totalCommission, 0);
    const clawedBack = 1450;

    return { totalEarned, pending, paidOut, clawedBack };
  }, [userDeals]);

  const filteredDeals = useMemo(() => {
    if (selectedStatus === 'all') return userDeals;
    if (selectedStatus === 'paid') return userDeals.filter((d) => d.stage === 'paid');
    if (selectedStatus === 'pending') return userDeals.filter((d) => d.stage === 'sold' || d.stage === 'in_progress');
    if (selectedStatus === 'processing') return userDeals.filter((d) => d.stage === 'complete');
    if (selectedStatus === 'clawed_back') return userDeals.filter((d) => d.adjustments && d.adjustments.length > 0);
    return userDeals;
  }, [userDeals, selectedStatus]);

  const getCommissionStatus = (deal: typeof sampleDeals[0]) => {
    if (deal.stage === 'paid') return 'paid';
    if (deal.stage === 'complete') return 'processing';
    if (deal.adjustments && deal.adjustments.length > 0) return 'adjusted';
    return 'pending';
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return { backgroundColor: 'var(--accent-purple-light)', color: 'var(--accent-purple)' };
      case 'pending': return { backgroundColor: 'var(--accent-amber-light)', color: 'var(--accent-amber)' };
      case 'processing': return { backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' };
      case 'adjusted': return { backgroundColor: 'var(--accent-red-light)', color: 'var(--accent-red)' };
      default: return { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' };
    }
  };

  const statusTabs: Array<{ label: string; value: CommissionStatus; amount?: number }> = [
    { label: 'All', value: 'all' },
    { label: 'Paid', value: 'paid', amount: stats.paidOut },
    { label: 'Pending', value: 'pending', amount: stats.pending },
    { label: 'Processing', value: 'processing' },
    { label: 'Clawed Back', value: 'clawed_back', amount: stats.clawedBack },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Earned', value: stats.totalEarned, color: 'var(--accent-green)' },
          { label: 'Pending', value: stats.pending, color: 'var(--accent-amber)' },
          { label: 'Paid Out', value: stats.paidOut, color: 'var(--accent-purple)' },
          { label: 'Clawed Back', value: stats.clawedBack, color: 'var(--accent-red)' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border p-6"
            style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            <p className="mt-2 text-3xl font-bold" style={{ color: stat.color }}>{formatCurrency(stat.value)}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-xl border p-4"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
        {statusTabs.map((tab) => (
          <button key={tab.value} onClick={() => setSelectedStatus(tab.value)}
            className={cn('whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors')}
            style={{
              backgroundColor: selectedStatus === tab.value ? 'var(--accent-blue)' : 'var(--bg-tertiary)',
              color: selectedStatus === tab.value ? 'white' : 'var(--text-secondary)',
            }}>
            {tab.label}
            {tab.amount !== undefined && (
              <span className="ml-2 text-xs opacity-70">({formatCurrency(tab.amount)})</span>
            )}
          </button>
        ))}
      </div>

      {/* Commission Table */}
      <div className="rounded-xl border overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-sm)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Date</th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Type</th>
              <th className="px-6 py-3 text-right text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Amount</th>
              <th className="px-6 py-3 text-center text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>Pay Period</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.map((deal) => {
              const status = getCommissionStatus(deal);
              const statusStyle = getStatusStyle(status);
              return (
                <tr key={deal.id} className="border-b" style={{ borderColor: 'var(--border-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(deal.closeDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {deal.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {deal.projectType}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(deal.totalCommission)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block rounded-md px-3 py-1 text-xs font-medium" style={statusStyle}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(deal.closeDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredDeals.length === 0 && (
          <div className="p-8 text-center">
            <p style={{ color: 'var(--text-tertiary)' }}>No commissions found for this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
