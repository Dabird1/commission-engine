'use client';

import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { brandAnalytics, brands } from '@/data/sample-data';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';

export default function PortfolioAnalytics() {
  // Calculate portfolio totals
  const totalCommissionCost = brandAnalytics.reduce((sum, b) => sum + b.totalEarned, 0);
  const totalReps = brandAnalytics.reduce((sum, b) => sum + b.repCount, 0);
  const avgCostPerRep = totalCommissionCost / totalReps;

  // Estimate revenue at 6.8% commission rate
  const estimatedRevenue = totalCommissionCost / 0.068;

  // Brand data for pie chart
  const brandColors: Record<string, string> = {
    'Apex Roofing': '#2563eb',
    'Summit Windows': '#059669',
    'Shield Siding': '#dc2626',
    'Peak Gutters': '#f59e0b',
    'Crown Exteriors': '#7c3aed',
  };
  const brandChartData = brandAnalytics.map((brand) => ({
    name: brand.brandName,
    value: brand.totalEarned,
    color: brandColors[brand.brandName] || '#64748b',
  }));

  // Table data
  const tableData = brandAnalytics.map((brand) => ({
    ...brand,
    status: brand.totalEarned > 250000 ? 'High Performer' : brand.totalEarned > 150000 ? 'On Track' : 'Developing',
  }));

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Portfolio Analytics
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Executive summary of commission spend and brand performance
        </p>
      </div>

      {/* Big Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Commission Cost */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Total Commission Cost (YTD)
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(totalCommissionCost)}
          </div>
          <div className="text-xs" style={{ color: 'var(--accent-blue)' }}>
            Across {brandAnalytics.length} brands
          </div>
        </div>

        {/* Commission as % of Revenue */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Commission % of Revenue
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            6.8%
          </div>
          <div className="text-xs" style={{ color: 'var(--accent-green)' }}>
            On target budget
          </div>
        </div>

        {/* Total Reps */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Total Reps
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {formatNumber(totalReps)}
          </div>
          <div className="text-xs" style={{ color: 'var(--accent-blue)' }}>
            Active across portfolio
          </div>
        </div>

        {/* Avg Cost Per Rep */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Avg Cost Per Rep
          </div>
          <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(avgCostPerRep)}
          </div>
          <div className="text-xs" style={{ color: 'var(--accent-blue)' }}>
            Portfolio average
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart - Cost Distribution */}
        <div
          className="rounded-lg border p-6 lg:col-span-1"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Cost Distribution by Brand
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={brandChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }: { percent?: number }) => `${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {brandChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Brand Performance Table */}
        <div
          className="rounded-lg border overflow-hidden lg:col-span-2"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-secondary)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Brand Performance Summary
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottomColor: 'var(--border-secondary)' }} className="border-b">
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    Total Earned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    Rep Count
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    Avg Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    Avg GP%
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    Cost/Rep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((brand, idx) => (
                  <tr
                    key={brand.brandId}
                    style={{
                      borderBottomColor: 'var(--border-secondary)',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                    }}
                    className="border-b"
                  >
                    <td className="px-6 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {brand.brandName}
                    </td>
                    <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(brand.totalEarned)}
                    </td>
                    <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatNumber(brand.repCount)}
                    </td>
                    <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatPercent(brand.avgRate * 100)}
                    </td>
                    <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatPercent(brand.avgGP)}
                    </td>
                    <td className="px-6 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(brand.costPerRep)}
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <span
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-semibold"
                        style={{
                          backgroundColor:
                            brand.status === 'High Performer'
                              ? 'rgba(16, 185, 129, 0.1)'
                              : brand.status === 'On Track'
                                ? 'rgba(59, 130, 246, 0.1)'
                                : 'rgba(245, 158, 11, 0.1)',
                          color:
                            brand.status === 'High Performer'
                              ? 'var(--accent-green)'
                              : brand.status === 'On Track'
                                ? 'var(--accent-blue)'
                                : 'var(--accent-orange)',
                        }}
                      >
                        {brand.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer Insights */}
      <div
        className="rounded-lg border p-5"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Key Insights
        </h3>
        <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <li>
            Apex Roofing leads the portfolio with {formatCurrency(brandAnalytics[0].totalEarned)} YTD earnings across 12 reps
          </li>
          <li>
            Crown Exteriors shows strong performance with {formatPercent(brandAnalytics[4].avgGP)} avg GP%, highest in portfolio
          </li>
          <li>
            Average rep cost remains stable at {formatCurrency(avgCostPerRep)}, indicating efficient commission structure
          </li>
          <li>
            Commission spend at 6.8% of revenue is aligned with strategic targets
          </li>
        </ul>
      </div>
    </div>
  );
}
