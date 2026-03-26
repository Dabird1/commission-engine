// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { brandAnalytics, monthlyTrends } from '@/data/sample-data';
import { cn } from '@/lib/utils';

interface ForecastTableRow {
  brandName: string;
  currentPipeline: number;
  projectedClose: number;
  estimatedCost: number;
}

export default function AccrualForecast() {
  const [pipelineCloseRate, setPipelineCloseRate] = useState(80);

  const projectedNextPeriod = 52400;
  const baselineRate = 80;

  // Calculate projected cost based on close rate
  const projectedCost = Math.round(projectedNextPeriod * (pipelineCloseRate / baselineRate));

  const chartData = useMemo(() => {
    return monthlyTrends.map((trend) => ({
      month: trend.month.split(' ')[0],
      actual: trend.earnings,
      projected: Math.round(trend.earnings * (1 + (pipelineCloseRate - baselineRate) * 0.005)),
    }));
  }, [pipelineCloseRate]);

  const forecastTable: ForecastTableRow[] = useMemo(() => {
    return brandAnalytics
      .map((brand) => {
        const currentPipeline = Math.floor(brand.totalEarned * 1.2);
        const projectedClose = Math.round(currentPipeline * (pipelineCloseRate / 100));
        const estimatedCost = Math.round(projectedClose * 0.065);

        return {
          brandName: brand.brandName,
          currentPipeline,
          projectedClose,
          estimatedCost,
        };
      })
      .sort((a, b) => b.estimatedCost - a.estimatedCost)
      .slice(0, 8);
  }, [pipelineCloseRate]);

  const totalEstimatedCost = forecastTable.reduce((sum, row) => sum + row.estimatedCost, 0);

  // Range scenarios
  const conservativeRate = 60;
  const optimisticRate = 100;
  const conservativeCost = Math.round(projectedNextPeriod * (conservativeRate / baselineRate));
  const optimisticCost = Math.round(projectedNextPeriod * (optimisticRate / baselineRate));

  // Variance calculations for insights
  const costVariance = projectedCost - (projectedNextPeriod);
  const costVariancePercent = ((costVariance / projectedNextPeriod) * 100).toFixed(0);

  return (
    <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[var(--bg-primary)] flex flex-col">
      {/* Header + Decision Hero */}
      <div className="p-3 sm:p-8 pb-0">
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-[var(--text-primary)] mb-2">Accrual Forecast</h1>
          <p className="text-[14px] text-[var(--text-secondary)]">Commission accrual through period • Real-time sensitivity</p>
        </div>

        {/* Decision-First Hero: Big Number with Range Inline */}
        <div className="bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-blue)]/70 rounded-lg p-4 sm:p-7 text-white mb-6">
          <p className="text-[14px] text-white/75 mb-2 font-medium">Accrual to Book This Period</p>
          <div className="flex items-baseline gap-6 mb-3">
            <p className="text-[48px] font-bold">${(projectedCost / 1000).toFixed(1)}K</p>
            <div className="text-[14px] text-white/70 space-y-1">
              <p>Conservative (60%): ${(conservativeCost / 1000).toFixed(1)}K</p>
              <p>Optimistic (100%): ${(optimisticCost / 1000).toFixed(1)}K</p>
            </div>
          </div>
          <p className="text-[14px] text-white/70">
            Range: ${(optimisticCost - conservativeCost) / 1000}K | {forecastTable.length} brands tracked
          </p>
        </div>
      </div>

      {/* Interactive Sensitivity + Insights Strip (Side by side, compact) */}
      <div className="px-3 sm:px-8 pb-6 space-y-4">
        {/* Slider Control */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-3 sm:p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            <div className="flex-1">
              <div className="flex items-baseline justify-between mb-3">
                <label className="text-[14px] font-semibold text-[var(--text-secondary)]">Close Rate</label>
                <span className="text-[32px] font-bold text-[var(--accent-blue)]">{pipelineCloseRate}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="100"
                value={pipelineCloseRate}
                onChange={(e) => setPipelineCloseRate(parseInt(e.target.value))}
                className="w-full h-2 bg-[var(--bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--accent-blue)]"
              />
              <div className="flex justify-between text-[14px] text-[var(--text-secondary)] mt-2">
                <span>60%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Instant Impact Insight */}
            {pipelineCloseRate !== baselineRate && (
              <div className={cn(
                'px-4 py-3 rounded-lg border text-[14px] font-medium whitespace-nowrap',
                costVariance > 0
                  ? 'bg-[var(--accent-red)]/10 border-[var(--accent-red)]/30 text-[var(--accent-red)]'
                  : 'bg-[var(--accent-green)]/10 border-[var(--accent-green)]/30 text-[var(--accent-green)]'
              )}>
                {costVariance > 0 ? '+' : ''}{costVariancePercent}% ({costVariance > 0 ? '+' : ''}${Math.abs(costVariance / 1000).toFixed(1)}K)
              </div>
            )}
          </div>
        </div>

        {/* Actionable Insights: Immediate Impact Statements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/30 rounded-lg p-4">
            <p className="text-[14px] text-[var(--text-secondary)] font-medium mb-1">If close rate drops to 60%:</p>
            <p className="text-[16px] font-bold text-[var(--text-primary)]">${Math.abs((conservativeCost - projectedCost) / 1000).toFixed(1)}K</p>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1">Accrual decreases</p>
          </div>

          <div className="bg-[var(--accent-green)]/10 border border-[var(--accent-green)]/30 rounded-lg p-4">
            <p className="text-[14px] text-[var(--text-secondary)] font-medium mb-1">If close rate hits 100%:</p>
            <p className="text-[16px] font-bold text-[var(--text-primary)]">${(optimisticCost - projectedCost) / 1000}K</p>
            <p className="text-[14px] text-[var(--text-secondary)] mt-1">Accrual increases</p>
          </div>
        </div>
      </div>

      {/* Two-Column Layout: Chart + Table */}
      <div className="flex-1 overflow-hidden px-3 sm:px-8 pb-8 gap-3 sm:gap-6 flex flex-col lg:flex-row">
        {/* Left: Compact 12-Month Trend */}
        <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-3 sm:p-5 overflow-hidden flex flex-col min-h-[300px]">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-4">Actual vs Projected Trend</h2>
          <div className="flex-1 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '0.5rem',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                  }}
                  formatter={(value) => `$${(value as number).toLocaleString()}`}
                />
                <Line
                  type="monotone"
                  dataKey="actual"
                  stroke="var(--accent-green)"
                  strokeWidth={2}
                  dot={false}
                  name="Actual"
                />
                <Line
                  type="monotone"
                  dataKey="projected"
                  stroke="var(--accent-blue)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Projected"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Top 8 Brands by Cost */}
        <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-3 sm:p-5 overflow-hidden flex flex-col min-h-[300px]">
          <h2 className="text-[16px] font-semibold text-[var(--text-primary)] mb-4">Top Brands by Accrual</h2>
          <div className="overflow-y-auto flex-1">
            <table className="w-full text-[14px]">
              <thead className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)]">
                <tr>
                  <th className="text-left py-2 px-2 sm:px-3 font-semibold text-[var(--text-secondary)]">Brand</th>
                  <th className="text-right py-2 px-2 sm:px-3 font-semibold text-[var(--text-secondary)]">Cost</th>
                </tr>
              </thead>
              <tbody>
                {forecastTable.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition"
                  >
                    <td className="py-2 px-2 sm:px-3 text-[var(--text-primary)] font-medium truncate">
                      {row.brandName}
                    </td>
                    <td className="py-2 px-2 sm:px-3 text-right text-[var(--text-primary)] font-mono font-semibold">
                      ${(row.estimatedCost / 1000).toFixed(1)}K
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-[var(--border-primary)] pt-3 mt-3">
            <div className="flex justify-between items-center px-2 sm:px-3 font-bold text-[var(--text-primary)]">
              <span>Total (Top 8)</span>
              <span className="font-mono">${(totalEstimatedCost / 1000).toFixed(1)}K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
