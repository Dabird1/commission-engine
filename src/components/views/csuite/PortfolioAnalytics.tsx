// @ts-nocheck
'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { brandAnalytics } from '@/data/sample-data';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';
import { TrendingUp, DollarSign, Users, AlertCircle } from 'lucide-react';

export default function PortfolioAnalytics() {
  // Calculate portfolio totals
  const totalCommissionCost = brandAnalytics.reduce((sum, b) => sum + b.totalEarned, 0);
  const totalReps = brandAnalytics.reduce((sum, b) => sum + b.repCount, 0);
  const totalBrands = brandAnalytics.length;
  const avgCostPerRep = totalCommissionCost / totalReps;
  const avgCommissionRate = brandAnalytics.reduce((sum, b) => sum + b.avgRate, 0) / totalBrands;
  const avgGPPercent = brandAnalytics.reduce((sum, b) => sum + b.avgGP, 0) / totalBrands;

  // Estimate revenue: commission cost / avg commission rate
  const estimatedRevenue = totalCommissionCost / avgCommissionRate;
  const commissionAsPercentOfRevenue = (totalCommissionCost / estimatedRevenue) * 100;

  // Color-code brands by health (GP%)
  const getHealthColor = (gp: number) => {
    if (gp >= 42) return { bg: 'rgba(34, 197, 94, 0.1)', text: '#22c55e', label: 'Strong' };
    if (gp >= 38) return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', label: 'Healthy' };
    return { bg: 'rgba(245, 158, 11, 0.1)', text: '#f59e0b', label: 'Monitor' };
  };

  // Sort brands by commission cost (descending)
  const sortedBrands = [...brandAnalytics].sort((a, b) => b.totalEarned - a.totalEarned);

  // Top 10 brands for bar chart
  const topBrandsForChart = sortedBrands.slice(0, 10).map((b) => ({
    name: b.brandName.length > 18 ? b.brandName.substring(0, 15) + '...' : b.brandName,
    value: Math.round(b.totalEarned / 1000), // in thousands
    gp: b.avgGP,
  }));

  // Create status summary
  const highPerformers = brandAnalytics.filter((b) => b.totalEarned > 350000).length;
  const healthy = brandAnalytics.filter((b) => b.totalEarned >= 200000 && b.totalEarned <= 350000).length;
  const developing = brandAnalytics.filter((b) => b.totalEarned < 200000).length;

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Portfolio Analytics
        </h1>
        <p className="text-lg mt-2" style={{ color: 'var(--text-secondary)' }}>
          25 brands · All commission spend and brand performance above the fold
        </p>
      </div>

      {/* CEO KPI Row — 5 Big Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Commission Cost */}
        <div
          className="rounded-lg border p-3 sm:p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              YTD Commission
            </span>
            <DollarSign size={20} style={{ color: 'var(--accent-blue)' }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(totalCommissionCost)}
          </div>
          <div className="text-sm mt-2" style={{ color: 'var(--accent-blue)' }}>
            Across {totalBrands} brands
          </div>
        </div>

        {/* Est Revenue */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Est. Revenue
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(estimatedRevenue)}
          </div>
          <div className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            @ {formatPercent(avgCommissionRate * 100)} avg rate
          </div>
        </div>

        {/* Commission % of Revenue */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Comm % of Revenue
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatPercent(commissionAsPercentOfRevenue)}
          </div>
          <div className="text-sm mt-2" style={{ color: 'var(--accent-green)' }}>
            On target
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
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              Total Reps
            </span>
            <Users size={20} style={{ color: 'var(--accent-orange)' }} />
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatNumber(totalReps)}
          </div>
          <div className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
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
          <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
            Cost Per Rep
          </div>
          <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {formatCurrency(avgCostPerRep)}
          </div>
          <div className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
            Portfolio avg
          </div>
        </div>
      </div>

      {/* Status Snapshot */}
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          padding: '16px 12px sm:24px',
        }}
      >
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#22c55e' }}>
            {highPerformers}
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            High Performers
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            &gt;$350K YTD
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
            {healthy}
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Healthy Brands
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            $200K–$350K
          </div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
            {developing}
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Monitor
          </div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            &lt;$200K
          </div>
        </div>
      </div>

      {/* Top 10 Brands by Commission Cost */}
      <div
        className="rounded-lg border p-3 sm:p-8"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Top 10 Brands by YTD Commission Cost
        </h2>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topBrandsForChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
            <XAxis dataKey="name" stroke="var(--text-tertiary)" fontSize={13} />
            <YAxis stroke="var(--text-tertiary)" fontSize={13} label={{ value: '$K', angle: -90, position: 'insideLeft' }} />
            <Tooltip
              formatter={(value: any) => `$${value}K`}
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="value" fill="var(--accent-blue)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Full Brand Table — Ranked, Color-Coded by Health */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="px-3 sm:px-8 py-3 sm:py-6 border-b" style={{ borderColor: 'var(--border-secondary)' }}>
          <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            All 25 Brands — Full Portfolio Breakdown
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottomColor: 'var(--border-secondary)' }} className="border-b">
                <th className="px-3 sm:px-8 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Rank
                </th>
                <th className="px-3 sm:px-8 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Brand
                </th>
                <th className="px-3 sm:px-8 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  YTD Commission
                </th>
                <th className="px-3 sm:px-8 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Reps
                </th>
                <th className="px-3 sm:px-8 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Cost/Rep
                </th>
                <th className="px-3 sm:px-8 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Avg GP%
                </th>
                <th className="px-3 sm:px-8 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Avg Rate
                </th>
                <th className="px-3 sm:px-8 py-4 text-left text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                  Health
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedBrands.map((brand, idx) => {
                const health = getHealthColor(brand.avgGP);
                return (
                  <tr
                    key={brand.brandId}
                    style={{
                      borderBottomColor: 'var(--border-secondary)',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                    }}
                    className="border-b hover:bg-opacity-50"
                  >
                    <td className="px-3 sm:px-8 py-4 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {idx + 1}
                    </td>
                    <td className="px-3 sm:px-8 py-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {brand.brandName}
                    </td>
                    <td className="px-3 sm:px-8 py-4 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(brand.totalEarned)}
                    </td>
                    <td className="px-3 sm:px-8 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {brand.repCount}
                    </td>
                    <td className="px-3 sm:px-8 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(brand.costPerRep)}
                    </td>
                    <td className="px-3 sm:px-8 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatPercent(brand.avgGP)}
                    </td>
                    <td className="px-3 sm:px-8 py-4 text-sm" style={{ color: 'var(--text-primary)' }}>
                      {formatPercent(brand.avgRate * 100)}
                    </td>
                    <td className="px-3 sm:px-8 py-4 text-sm">
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"
                        style={{
                          backgroundColor: health.bg,
                          color: health.text,
                        }}
                      >
                        {health.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executive Summary Box */}
      <div
        className="rounded-lg border p-3 sm:p-8"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderColor: 'var(--accent-blue)',
          border: '2px solid var(--accent-blue)',
        }}
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <TrendingUp size={22} style={{ color: 'var(--accent-blue)' }} />
          Executive Summary
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <div>
            <strong>Top Performer:</strong> {sortedBrands[0].brandName} leads with {formatCurrency(sortedBrands[0].totalEarned)} YTD
          </div>
          <div>
            <strong>Best Margin:</strong> {brandAnalytics.reduce((a, b) => (b.avgGP > a.avgGP ? b : a)).brandName} at {formatPercent(Math.max(...brandAnalytics.map((b) => b.avgGP)))} avg GP
          </div>
          <div>
            <strong>Portfolio Health:</strong> {highPerformers} brands strong, {healthy} healthy, {developing} under watch
          </div>
          <div>
            <strong>Cost Efficiency:</strong> Commission spend controlled at {formatPercent(commissionAsPercentOfRevenue)} of estimated revenue
          </div>
        </div>
      </div>
    </div>
  );
}
