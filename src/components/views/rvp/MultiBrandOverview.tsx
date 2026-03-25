'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { brandAnalytics, brands, monthlyTrends } from '@/data/sample-data';
import { formatCurrency, formatPercent, formatNumber } from '@/lib/utils';

interface BrandTrendData {
  brandId: string;
  month: string;
  value: number;
}

export default function MultiBrandOverview() {
  // Generate mini sparkline data for each brand
  const generateBrandSparkline = (brandId: string) => {
    // Create realistic trend data for each brand
    const baseValue = brandAnalytics.find(b => b.brandId === brandId)?.costPerRep || 20000;
    return monthlyTrends.map((month, idx) => ({
      month: idx,
      value: baseValue + (Math.sin(idx / 3) * 2000) + (Math.random() - 0.5) * 500,
    })).slice(-6); // Last 6 months
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Multi-Brand Overview
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          YTD Performance across all brands
        </p>
      </div>

      {/* Brand Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {brandAnalytics.map((brand) => {
          const brandInfo = brands.find(b => b.id === brand.brandId);
          const sparklineData = generateBrandSparkline(brand.brandId);
          const isGrowth = sparklineData[sparklineData.length - 1]?.value >= sparklineData[0]?.value;

          return (
            <div
              key={brand.brandId}
              className="rounded-lg border p-6 overflow-hidden"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              {/* Header with brand name and trend */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {brand.brandName}
                </h3>
                {isGrowth ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-green)' }}>
                    <TrendingUp size={12} />
                    +4%
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
                    style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red)' }}>
                    <TrendingDown size={12} />
                    -2%
                  </span>
                )}
              </div>

              {/* Mini Sparkline */}
              <div className="mb-5 h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sparklineData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={'var(--accent-blue)'}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Key Metrics Grid */}
              <div className="space-y-3">
                {/* Total Earned */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    Total Earned
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatCurrency(brand.totalEarned)}
                  </span>
                </div>

                {/* Rep Count */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    Rep Count
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {formatNumber(brand.repCount)}
                  </span>
                </div>

                {/* Avg Commission Rate */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    Avg Commission Rate
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>
                    {formatPercent(brand.avgRate * 100)}
                  </span>
                </div>

                {/* Avg GP% */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                    Avg GP%
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--accent-green)' }}>
                    {formatPercent(brand.avgGP)}
                  </span>
                </div>

                {/* Cost Per Rep */}
                <div className="pt-3 border-t" style={{ borderColor: 'var(--border-secondary)' }}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
                      Cost Per Rep
                    </span>
                    <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      {formatCurrency(brand.costPerRep)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div
        className="rounded-lg border p-5 flex items-center justify-between"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div>
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            Portfolio Summary
          </p>
          <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
            {brandAnalytics.length} brands • {brandAnalytics.reduce((sum, b) => sum + b.repCount, 0)} total reps • {formatCurrency(brandAnalytics.reduce((sum, b) => sum + b.totalEarned, 0))} YTD
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
            Avg Cost Per Rep
          </p>
          <p className="text-2xl font-bold" style={{ color: 'var(--accent-blue)' }}>
            {formatCurrency(brandAnalytics.reduce((sum, b) => sum + b.costPerRep * b.repCount, 0) / brandAnalytics.reduce((sum, b) => sum + b.repCount, 0))}
          </p>
        </div>
      </div>
    </div>
  );
}
