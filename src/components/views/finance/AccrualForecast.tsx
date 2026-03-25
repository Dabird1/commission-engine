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

  // Prepare chart data: actual vs projected
  const chartData = useMemo(() => {
    return monthlyTrends.map((trend) => ({
      month: trend.month.split(' ')[0],
      actual: trend.earnings,
      projected: Math.round(trend.earnings * (1 + (pipelineCloseRate - 80) * 0.005)),
    }));
  }, [pipelineCloseRate]);

  // Projected next period commission cost
  const projectedNextPeriod = 52400;

  // Forecast table data
  const forecastTable: ForecastTableRow[] = useMemo(() => {
    return brandAnalytics.map((brand) => {
      const currentPipeline = Math.floor(brand.totalEarned * 1.2);
      const projectedClose = Math.round(currentPipeline * (pipelineCloseRate / 100));
      const estimatedCost = Math.round(projectedClose * 0.065);

      return {
        brandName: brand.brandName,
        currentPipeline,
        projectedClose,
        estimatedCost,
      };
    });
  }, [pipelineCloseRate]);

  const totalEstimatedCost = forecastTable.reduce((sum, row) => sum + row.estimatedCost, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Accrual Forecast</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Next period commission projection and sensitivity analysis</p>
      </div>

      {/* Big Number: Projected Next Period */}
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-8">
        <p className="text-sm text-[var(--color-text-secondary)] mb-2">Projected Next Period Commission Cost</p>
        <p className="text-5xl font-bold text-[var(--color-text-primary)]">${(projectedNextPeriod / 1000).toFixed(1)}K</p>
        <p className="text-xs text-[var(--color-text-secondary)] mt-3">Calculated at {pipelineCloseRate}% pipeline close rate</p>
      </div>

      {/* Sensitivity Analysis */}
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">Sensitivity Analysis</h2>

        {/* Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-[var(--color-text-secondary)]">Pipeline Close Rate</label>
            <span className="text-2xl font-bold text-[var(--color-primary)]">{pipelineCloseRate}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="100"
            value={pipelineCloseRate}
            onChange={(e) => setPipelineCloseRate(parseInt(e.target.value))}
            className="w-full h-2 bg-[var(--color-bg-secondary)] rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
          />
          <div className="flex justify-between text-xs text-[var(--color-text-secondary)] mt-2">
            <span>60%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Cost Range */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Conservative (60%)</p>
            <p className="text-xl font-bold text-[var(--color-text-primary)]">$44.9K</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Current ({pipelineCloseRate}%)</p>
            <p className="text-xl font-bold text-[var(--color-primary)]">${(projectedNextPeriod / 1000).toFixed(1)}K</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--color-text-secondary)] mb-2">Optimistic (100%)</p>
            <p className="text-xl font-bold text-[var(--color-text-primary)]">$62.3K</p>
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Actual vs Projected (6 Months)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="month" stroke="var(--color-text-secondary)" />
            <YAxis stroke="var(--color-text-secondary)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--color-bg-secondary)',
                border: '1px solid var(--color-border)',
                borderRadius: '0.5rem',
                color: 'var(--color-text-primary)',
              }}
              formatter={(value) => `$${(value as number).toLocaleString()}`}
            />
            <Legend wrapperStyle={{ color: 'var(--color-text-secondary)' }} />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="var(--color-success)"
              strokeWidth={2}
              dot={{ fill: 'var(--color-success)', r: 4 }}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="var(--color-primary)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: 'var(--color-primary)', r: 4 }}
              name="Projected"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Forecast Table */}
      <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Brand Forecast</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Brand</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Current Pipeline</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">
                  Projected Close ({pipelineCloseRate}%)
                </th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Estimated Cost</th>
              </tr>
            </thead>
            <tbody>
              {forecastTable.map((row, idx) => (
                <tr key={idx} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-secondary)]">
                  <td className="py-3 px-4 text-[var(--color-text-primary)] font-medium">{row.brandName}</td>
                  <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono">
                    ${row.currentPipeline.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono">
                    ${row.projectedClose.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono">
                    ${row.estimatedCost.toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr className="bg-[var(--color-bg-secondary)] border-t-2 border-[var(--color-border)]">
                <td className="py-3 px-4 text-[var(--color-text-primary)] font-bold">Total</td>
                <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono font-bold">
                  ${forecastTable.reduce((sum, row) => sum + row.currentPipeline, 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono font-bold">
                  ${forecastTable.reduce((sum, row) => sum + row.projectedClose, 0).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono font-bold">
                  ${totalEstimatedCost.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
