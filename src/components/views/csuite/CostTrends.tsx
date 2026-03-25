'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { brandAnalytics, brands, monthlyTrends } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';

type MetricType = 'total_cost' | 'cost_per_rep' | 'avg_rate' | 'avg_gp';

export default function CostTrends() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('total_cost');

  // Generate synthetic monthly data for each brand
  const generateMonthlyData = () => {
    return monthlyTrends.map((month, idx) => {
      const baseMultiplier = 1 + (idx * 0.02); // Slight growth over time

      return {
        month: month.month,
        'Apex Roofing': Math.round(82000 * baseMultiplier + (Math.sin(idx / 3) * 8000)),
        'Summit Windows': Math.round(59000 * baseMultiplier + (Math.sin(idx / 4) * 6000)),
        'Shield Siding': Math.round(35000 * baseMultiplier + (Math.sin(idx / 5) * 4000)),
        'Peak Gutters': Math.round(18000 * baseMultiplier + (Math.sin(idx / 6) * 2000)),
        'Crown Exteriors': Math.round(71000 * baseMultiplier + (Math.sin(idx / 3.5) * 7000)),
      };
    });
  };

  const generateCostPerRepData = () => {
    return monthlyTrends.map((month, idx) => {
      const apexCostPerRep = 19500 + (Math.sin(idx / 4) * 800) + (Math.random() - 0.5) * 400;
      const summitCostPerRep = 20200 + (Math.sin(idx / 5) * 900) + (Math.random() - 0.5) * 500;
      const shieldCostPerRep = 18300 + (Math.sin(idx / 3.5) * 700) + (Math.random() - 0.5) * 300;
      const peakCostPerRep = 20500 + (Math.sin(idx / 4.5) * 850) + (Math.random() - 0.5) * 450;
      const crownCostPerRep = 19800 + (Math.sin(idx / 3.2) * 750) + (Math.random() - 0.5) * 400;

      return {
        month: month.month,
        'Apex Roofing': parseFloat(apexCostPerRep.toFixed(0)),
        'Summit Windows': parseFloat(summitCostPerRep.toFixed(0)),
        'Shield Siding': parseFloat(shieldCostPerRep.toFixed(0)),
        'Peak Gutters': parseFloat(peakCostPerRep.toFixed(0)),
        'Crown Exteriors': parseFloat(crownCostPerRep.toFixed(0)),
      };
    });
  };

  const generateAvgRateData = () => {
    return monthlyTrends.map((month, idx) => {
      return {
        month: month.month,
        'Apex Roofing': 8.2 + (Math.sin(idx / 6) * 0.3),
        'Summit Windows': 7.6 + (Math.sin(idx / 7) * 0.25),
        'Shield Siding': 6.4 + (Math.sin(idx / 5.5) * 0.2),
        'Peak Gutters': 5.1 + (Math.sin(idx / 6.5) * 0.15),
        'Crown Exteriors': 5.8 + (Math.sin(idx / 4.5) * 0.25),
      };
    });
  };

  const generateAvgGPData = () => {
    return monthlyTrends.map((month, idx) => {
      return {
        month: month.month,
        'Apex Roofing': 39.5 + (Math.sin(idx / 5) * 1.5) + idx * 0.15,
        'Summit Windows': 37.2 + (Math.sin(idx / 6) * 1.2) + idx * 0.12,
        'Shield Siding': 34.1 + (Math.sin(idx / 7) * 1.0) + idx * 0.1,
        'Peak Gutters': 32.8 + (Math.sin(idx / 8) * 0.8) + idx * 0.08,
        'Crown Exteriors': 36.5 + (Math.sin(idx / 5.5) * 1.3) + idx * 0.14,
      };
    });
  };

  const allMonthlyData = generateMonthlyData();
  const allCostPerRepData = generateCostPerRepData();
  const allAvgRateData = generateAvgRateData();
  const allAvgGPData = generateAvgGPData();

  const dataByMetric = {
    total_cost: allMonthlyData,
    cost_per_rep: allCostPerRepData,
    avg_rate: allAvgRateData,
    avg_gp: allAvgGPData,
  };

  const data = dataByMetric[selectedMetric];

  // Period-over-period comparison (last month vs first month)
  const firstMonth = data[0];
  const lastMonth = data[data.length - 1];

  const popComparison = [
    {
      brand: 'Apex Roofing',
      firstValue: firstMonth['Apex Roofing'],
      lastValue: lastMonth['Apex Roofing'],
    },
    {
      brand: 'Summit Windows',
      firstValue: firstMonth['Summit Windows'],
      lastValue: lastMonth['Summit Windows'],
    },
    {
      brand: 'Shield Siding',
      firstValue: firstMonth['Shield Siding'],
      lastValue: lastMonth['Shield Siding'],
    },
    {
      brand: 'Peak Gutters',
      firstValue: firstMonth['Peak Gutters'],
      lastValue: lastMonth['Peak Gutters'],
    },
    {
      brand: 'Crown Exteriors',
      firstValue: firstMonth['Crown Exteriors'],
      lastValue: lastMonth['Crown Exteriors'],
    },
  ];

  const metricLabels: Record<MetricType, string> = {
    total_cost: 'Total Cost',
    cost_per_rep: 'Cost Per Rep',
    avg_rate: 'Avg Rate (%)',
    avg_gp: 'Avg GP%',
  };

  const formatValue = (value: number, metric: MetricType) => {
    switch (metric) {
      case 'total_cost':
        return formatCurrency(value);
      case 'cost_per_rep':
        return formatCurrency(value);
      case 'avg_rate':
        return `${value.toFixed(2)}%`;
      case 'avg_gp':
        return `${value.toFixed(1)}%`;
      default:
        return value.toFixed(2);
    }
  };

  const calculatePercentChange = (first: number, last: number) => {
    const change = last - first;
    const percentChange = (change / first) * 100;
    return percentChange;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Cost Trends
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          12-month performance analysis across all brands
        </p>
      </div>

      {/* Metric Toggle */}
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(metricLabels) as MetricType[]).map((metric) => (
          <button
            key={metric}
            onClick={() => setSelectedMetric(metric)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{
              backgroundColor: selectedMetric === metric ? 'var(--accent-blue)' : 'var(--bg-card)',
              color: selectedMetric === metric ? 'white' : 'var(--text-primary)',
              border: selectedMetric === metric ? 'none' : '1px solid var(--border-primary)',
            }}
          >
            {metricLabels[metric]}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {metricLabels[selectedMetric]} Over 12 Months
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
            <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} />
            <YAxis stroke="var(--text-tertiary)" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
              }}
              formatter={(value: any) => {
                if (selectedMetric === 'total_cost' || selectedMetric === 'cost_per_rep') {
                  return formatCurrency(value);
                }
                return `${value.toFixed(2)}%`;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Apex Roofing"
              stroke={'#2563eb'}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Summit Windows"
              stroke={'#059669'}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Shield Siding"
              stroke={'#dc2626'}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Peak Gutters"
              stroke={'#f59e0b'}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Crown Exteriors"
              stroke={'#7c3aed'}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Period-over-Period Change Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-secondary)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {metricLabels[selectedMetric]} - Period-over-Period Change (Apr 2025 vs Mar 2026)
          </h3>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottomColor: 'var(--border-secondary)' }} className="border-b">
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Brand
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Apr 2025
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Mar 2026
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                % Change
              </th>
            </tr>
          </thead>
          <tbody>
            {popComparison.map((item, idx) => {
              const change = item.lastValue - item.firstValue;
              const percentChange = calculatePercentChange(item.firstValue, item.lastValue);
              const isPositive = change > 0;

              return (
                <tr
                  key={item.brand}
                  style={{
                    borderBottomColor: 'var(--border-secondary)',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                  }}
                  className="border-b"
                >
                  <td className="px-6 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {item.brand}
                  </td>
                  <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {formatValue(item.firstValue, selectedMetric)}
                  </td>
                  <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {formatValue(item.lastValue, selectedMetric)}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold">
                    <span
                      style={{
                        color: isPositive
                          ? 'var(--accent-red)'
                          : 'var(--accent-green)',
                      }}
                    >
                      {isPositive ? '+' : ''}{formatValue(change, selectedMetric)}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold">
                    <span
                      style={{
                        color: isPositive
                          ? 'var(--accent-red)'
                          : 'var(--accent-green)',
                      }}
                    >
                      {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
