'use client';

import React, { useState, useMemo } from 'react';
import { sampleDeals, currentUser } from '@/data/sample-data';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';
import PlainEnglishBreakdown from '@/components/shared/PlainEnglishBreakdown';

type DealStatus = 'all' | 'sold' | 'in_progress' | 'complete' | 'paid' | 'cancelled';

export default function DealsPage() {
  const [selectedStatus, setSelectedStatus] = useState<DealStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);

  const userDeals = useMemo(() => {
    return sampleDeals.filter((deal) => deal.repId === currentUser.id);
  }, []);

  const filteredDeals = useMemo(() => {
    let deals = userDeals;

    if (selectedStatus !== 'all') {
      deals = deals.filter((deal) => deal.stage === selectedStatus);
    }

    if (searchQuery) {
      deals = deals.filter((deal) =>
        deal.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return deals;
  }, [userDeals, selectedStatus, searchQuery]);

  const pipelineValue = useMemo(() => {
    return filteredDeals.reduce((sum, deal) => sum + deal.fcv, 0);
  }, [filteredDeals]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      sold: 'bg-blue-100 text-blue-900',
      in_progress: 'bg-amber-100 text-amber-900',
      complete: 'bg-green-100 text-green-900',
      paid: 'bg-purple-100 text-purple-900',
      cancelled: 'bg-red-100 text-red-900',
    };
    return colors[status] || 'bg-gray-100 text-gray-900';
  };

  const statusTabs: Array<{ label: string; value: DealStatus; count: number }> = [
    { label: 'All', value: 'all', count: userDeals.length },
    { label: 'Sold', value: 'sold', count: userDeals.filter((d) => d.stage === 'sold').length },
    {
      label: 'In Progress',
      value: 'in_progress',
      count: userDeals.filter((d) => d.stage === 'in_progress').length,
    },
    { label: 'Complete', value: 'complete', count: userDeals.filter((d) => d.stage === 'complete').length },
    { label: 'Paid', value: 'paid', count: userDeals.filter((d) => d.stage === 'paid').length },
    { label: 'Cancelled', value: 'cancelled', count: userDeals.filter((d) => d.stage === 'cancelled').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Pipeline Value */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Revenue Pipeline</h1>
        <p className="mt-2 text-4xl font-bold text-blue-600">
          {formatCurrency(pipelineValue)}
        </p>
        <p className="text-sm text-slate-500">
          {filteredDeals.length} deal{filteredDeals.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        {statusTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedStatus(tab.value)}
            className={cn(
              'whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              selectedStatus === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            {tab.label}
            <span className="ml-2 text-xs opacity-70">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search Input */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg px-4 py-3 text-sm text-slate-900 placeholder-slate-500 outline-none"
        />
      </div>

      {/* Deals Table */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Type</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600">Stage</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">FCV</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">GP%</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">Rate</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">Commission</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600">Split</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredDeals.map((deal) => (
              <React.Fragment key={deal.id}>
                <tr
                  onClick={() =>
                    setExpandedDealId(expandedDealId === deal.id ? null : deal.id)
                  }
                  className="cursor-pointer hover:bg-slate-50"
                >
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {deal.customerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {deal.projectType.charAt(0).toUpperCase() + deal.projectType.slice(1)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn('inline-block rounded-md px-3 py-1 text-xs font-medium', getStatusColor(deal.stage))}>
                      {deal.stage === 'in_progress' ? 'In Progress' : deal.stage.charAt(0).toUpperCase() + deal.stage.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-900 font-medium">
                    {formatCurrency(deal.fcv)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-900">
                    {formatPercent(deal.gpPercent)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-900">
                    {formatPercent(deal.commissionRate * 100)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-slate-900">
                    {formatCurrency(deal.totalCommission)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {deal.splitDeal && (
                      <span className="inline-block rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-900">
                        {deal.splitDeal.type === 'canvasser_closer' && 'C/C'}
                        {deal.splitDeal.type === 'training' && 'Training'}
                        {deal.splitDeal.type === 'co_sell' && 'Co-Sell'}
                        {deal.splitDeal.type === 'referral' && 'Ref'}
                      </span>
                    )}
                    {deal.adjustments && deal.adjustments.length > 0 && (
                      <span className="ml-2 inline-block rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-900">
                        Adj
                      </span>
                    )}
                  </td>
                </tr>
                {expandedDealId === deal.id && (
                  <tr className="bg-slate-50">
                    <td colSpan={8} className="px-6 py-4">
                      <div className="rounded-lg bg-white p-4 border border-slate-200">
                        <PlainEnglishBreakdown deal={deal} />
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>

        {filteredDeals.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-slate-500">No deals found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
