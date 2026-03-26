// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { brandAnalytics, monthlyTrends } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

type MetricType = 'total_cost' | 'cost_per_rep' | 'avg_rate' | 'avg_gp';

export default function CostTrends() {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('total_cost');

  // Generate synthetic monthly data for each brand
  const generateMonthlyData = () => {
    return monthlyTrends.map((month, idx) => {
      const baseMultiplier = 1 + (idx * 0.02);
      return {
        month: month.month.substring(0, 3),
        'Infinity Exteriors': Math.round(82000 * baseMultiplier + Math.sin(idx / 3) * 8000),
        'Overhead Solutions': Math.round(59000 * baseMultiplier + Math.sin(idx / 4) * 6000),
        'G. Fedale': Math.round(35000 * baseMultiplier + Math.sin(idx / 5) * 4000),
        'Werner Roofing': Math.round(18000 * baseMultiplier + Math.sin(idx / 6) * 2000),
        'Cochran Exteriors': Math.round(71000 * baseMultiplier + Math.sin(idx / 3.5) * 7000),
      };
    });
  };

  const generateCostPerRepData = () => {
    return monthlyTrends.map((month, idx) => ({
      month: month.month.substring(0, 3),
      'Infinity Exteriors': 19500 + Math.sin(idx / 4) * 800,
      'Overhead Solutions': 20200 + Math.sin(idx / 5) * 900,
      'G. Fedale': 18300 + Math.sin(idx / 3.5) * 700,
      'Werner Roofing': 20500 + Math.sin(idx / 4.5) * 850,
      'Cochran Exteriors': 19800 + Math.sin(idx / 3.2) * 750,
    }));
  };

  const generateAvgRateData = () => {
    return monthlyTrends.map((month, idx) => ({
      month: month.month.substring(0, 3),
      'Infinity Exteriors': 8.2 + Math.sin(idx / 6) * 0.3,
      'Overhead Solutions': 7.6 + Math.sin(idx / 7) * 0.25,
      'G. Fedale': 6.4 + Math.sin(idx / 5.5) * 0.2,
      'Werner Roofing': 5.1 + Math.sin(idx / 6.5) * 0.15,
      'Cochran Exteriors': 5.8 + Math.sin(idx / 4.5) * 0.25,
    }));
  };

  const generateAvgGPData = () => {
    return monthlyTrends.map((month, idx) => ({
      month: month.month.substring(0, 3),
      'Infinity Exteriors': 39.5 + Math.sin(idx / 5) * 1.5 + idx * 0.15,
      'Overhead Solutions': 37.2 + Math.sin(idx / 6) * 1.2 + idx * 0.12,
      'G. Fedale': 34.1 + Math.sin(idx / 7) * 1.0 + idx * 0.1,
      'Werner Roofing': 32.8 + Math.sin(idx / 8) * 0.8 + idx * 0.08,
      'Cochran Exteriors': 36.5 + Math.sin(idx / 5.5) * 1.3 + idx * 0.14,
    }));
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
  const firstMonth = data[0];
  const lastMonth = data[data.length - 1];

  // Calculate period-over-period metrics for top 5 brands
  const topBrands = ['Infinity Exteriors', 'Overhead Solutions', 'G. Fedale', 'Werner Roofing', 'Cochran Exteriors'];

  const popComparison = topBrands.map((brand) => ({
    brand,
    firstValue: firstMonth[brand],
    lastValue: lastMonth[brand],
  }));

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
    if (first === 0) return 0;
    return ((last - first) / first) * 100;
  };

  // Portfolio-wide trend
  const portfolioTrend = allMonthlyData.map((month) => ({
    month: month.month,
    total: Object.keys(month)
      .filter((k) => k !== 'month')
      .reduce((sum, key) => sum + month[key], 0),
  }));

  const portfolioFirstValue = portfolioTrend[0].total;
  const portfolioLastValue = portfolioTrend[portfolioTrend.length - 1].total;
  const portfolioChange = calculatePercentChange(portfolioFirstValue, portfolioLastValue);

  // Compute brand-level insights
  const brandInsights = topBrands.map((brand) => {
    const brandFirst = allMonthlyData[0][brand];
    const brandLast = allMonthlyData[allMonthlyData.length - 1][brand];
    const brandChange = calculatePercentChange(brandFirst, brandLast);
    return { brand, first: brandFirst, last: brandLast, change: brandChange };
  });

  const highestCostBrand = brandInsights.reduce((a, b) => (a.last > b.last ? a : b));
  const fastestGrowingBrand = brandInsights.reduce((a, b) => (a.change > b.change ? a : b));
  const avgCostPerRep = (allCostPerRepData[allCostPerRepData.length - 1]['Infinity Exteriors'] +
    allCostPerRepData[allCostPerRepData.length - 1]['Overhead Solutions'] +
    allCostPerRepData[allCostPerRepData.length - 1]['G. Fedale'] +
    allCostPerRepData[allCostPerRepData.length - 1]['Werner Roofing'] +
    allCostPerRepData[allCostPerRepData.length - 1]['Cochran Exteriors']) / 5;

  const costPerRepTarget = 24000;
  const isOnTarget = avgCostPerRep <= costPerRepTarget;

  return (
    <div
      className="p-8 w-full h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
      }}
    >
      {/* ROW 1: Title + Subtitle + Metric Tabs — All on one line */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="font-bold" style={{ fontSize: '28px', color: 'var(--text-primary)' }}>
            Cost Trends
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            12-month trend analysis — Apr 2025 through Mar 2026
          </p>
        </div>

        {/* Metric Selector Tabs — right side */}
        <div className="flex gap-2">
          {(Object.keys(metricLabels) as MetricType[]).map((metric) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric)}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
              style={{
                backgroundColor: selectedMetric === metric ? 'var(--accent-blue)' : 'var(--bg-card)',
                color: selectedMetric === metric ? 'white' : 'var(--text-primary)',
                border: selectedMetric === metric ? 'none' : '1px solid var(--border-primary)',
                fontSize: '14px',
              }}
            >
              {metricLabels[metric]}
            </button>
          ))}
        </div>
      </div>

      {/* ROW 2: Insight Cards — The KEY insights at the top */}
      <div className="grid grid-cols-4 gap-4 mb-6 flex-shrink-0">
        {/* Portfolio Cost Trend */}
        <div
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Portfolio cost
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {portfolioChange > 0 ? '+' : ''}{portfolioChange.toFixed(1)}%
          </div>
          <div className="flex items-center gap-1 mt-2" style={{ fontSize: '12px', color: portfolioChange > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
            {portfolioChange > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>in 12 months</span>
          </div>
        </div>

        {/* Cost Per Rep Status */}
        <div
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Cost per rep
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)' }}>
            {formatCurrency(avgCostPerRep)}
          </div>
          <div style={{ fontSize: '12px', color: isOnTarget ? 'var(--accent-green)' : 'var(--accent-red)', marginTop: '6px' }}>
            {isOnTarget ? '✓ ON TARGET' : '✗ ABOVE TARGET'}
          </div>
        </div>

        {/* Highest Cost Brand */}
        <div
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Highest cost brand
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2' }}>
            {formatCurrency(highestCostBrand.last)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {highestCostBrand.brand}
          </div>
        </div>

        {/* Fastest Growing Brand */}
        <div
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>
            Fastest growing
          </div>
          <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--accent-red)' }}>
            +{fastestGrowingBrand.change.toFixed(1)}%
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px' }}>
            {fastestGrowingBrand.brand}
          </div>
        </div>
      </div>

      {/* ROW 3: 12-Month Trend Chart — Grows to fill remaining space */}
      <div
        className="rounded-lg border p-6 mb-6 flex-grow flex flex-col"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          minHeight: 0,
        }}
      >
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-primary)' }}>
          {metricLabels[selectedMetric]} Over 12 Months
        </h2>
        <div className="flex-grow">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={13} />
              <YAxis stroke="var(--text-tertiary)" fontSize={13} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-secondary)',
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
              <Legend wrapperStyle={{ fontSize: '13px' }} />
              <Line type="monotone" dataKey="Infinity Exteriors" stroke="#2563eb" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Overhead Solutions" stroke="#059669" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="G. Fedale" stroke="#dc2626" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Werner Roofing" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="Cochran Exteriors" stroke="#7c3aed" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ROW 4: Period-over-Period Comparison — Compact at bottom */}
      <div
        className="rounded-lg border overflow-hidden flex-shrink-0"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
        }}
      >
        <div className="px-6 py-4 border-b" style={{ borderColor: 'var(--border-primary)', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
          Period-over-Period: Apr 2025 vs Mar 2026
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottomColor: 'var(--border-primary)' }} className="border-b">
                <th className="px-6 py-3 text-left" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Brand
                </th>
                <th className="px-6 py-3 text-left" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Apr 2025
                </th>
                <th className="px-6 py-3 text-left" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Mar 2026
                </th>
                <th className="px-6 py-3 text-left" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-secondary)' }}>
                  Change %
                </th>
              </tr>
            </thead>
            <tbody>
              {popComparison.map((item, idx) => {
                const change = item.lastValue - item.firstValue;
                const percentChange = calculatePercentChange(item.firstValue, item.lastValue);
                const isIncrease = change > 0;

                return (
                  <tr
                    key={item.brand}
                    style={{
                      borderBottomColor: 'var(--border-primary)',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                    }}
                    className="border-b"
                  >
                    <td className="px-6 py-3" style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-primary)' }}>
                      {item.brand}
                    </td>
                    <td className="px-6 py-3" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                      {formatValue(item.firstValue, selectedMetric)}
                    </td>
                    <td className="px-6 py-3" style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {formatValue(item.lastValue, selectedMetric)}
                    </td>
                    <td className="px-6 py-3" style={{ fontSize: '14px', fontWeight: '600', color: isIncrease ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                      {isIncrease ? '+' : ''}{percentChange.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
