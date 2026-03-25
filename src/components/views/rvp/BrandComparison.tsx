'use client';

import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { brandAnalytics, brands, monthlyTrends } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';

export default function BrandComparison() {
  const [selectedBrand1, setSelectedBrand1] = useState('brand-1'); // Apex
  const [selectedBrand2, setSelectedBrand2] = useState('brand-2'); // Summit

  const brand1 = brandAnalytics.find(b => b.brandId === selectedBrand1);
  const brand2 = brandAnalytics.find(b => b.brandId === selectedBrand2);

  // Prepare data for comparison charts
  const comparisonData = [
    {
      metric: 'Commission Cost',
      [brand1?.brandName || '']: brand1?.totalEarned || 0,
      [brand2?.brandName || '']: brand2?.totalEarned || 0,
    },
    {
      metric: 'Avg Rate',
      [brand1?.brandName || '']: parseFloat((brand1?.avgRate ? brand1.avgRate * 100 : 0).toFixed(2)),
      [brand2?.brandName || '']: parseFloat((brand2?.avgRate ? brand2.avgRate * 100 : 0).toFixed(2)),
    },
    {
      metric: 'Avg GP%',
      [brand1?.brandName || '']: brand1?.avgGP || 0,
      [brand2?.brandName || '']: brand2?.avgGP || 0,
    },
  ];

  // 12-month trend data
  const trendData = monthlyTrends.map((month, idx) => {
    const brand1Value = 130000 + (idx * 5000) + (Math.sin(idx / 4) * 15000);
    const brand2Value = 95000 + (idx * 3000) + (Math.sin(idx / 5) * 12000);
    return {
      month: month.month,
      [brand1?.brandName || 'Brand 1']: parseFloat(brand1Value.toFixed(0)),
      [brand2?.brandName || 'Brand 2']: parseFloat(brand2Value.toFixed(0)),
    };
  });

  const statsComparison = [
    { label: 'Total Earned (YTD)', brand1: brand1?.totalEarned || 0, brand2: brand2?.totalEarned || 0 },
    { label: 'Rep Count', brand1: brand1?.repCount || 0, brand2: brand2?.repCount || 0 },
    { label: 'Avg Commission Rate', brand1: brand1?.avgRate || 0, brand2: brand2?.avgRate || 0, isPercent: true },
    { label: 'Avg GP%', brand1: brand1?.avgGP || 0, brand2: brand2?.avgGP || 0, isPercent: true },
    { label: 'Cost Per Rep', brand1: brand1?.costPerRep || 0, brand2: brand2?.costPerRep || 0 },
  ];

  const brand1Info = brands.find(b => b.id === selectedBrand1);
  const brand2Info = brands.find(b => b.id === selectedBrand2);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Brand Comparison
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Side-by-side analysis of brand performance
        </p>
      </div>

      {/* Brand Selectors */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
            Brand 1
          </label>
          <select
            value={selectedBrand1}
            onChange={(e) => setSelectedBrand1(e.target.value)}
            className="w-full mt-2 px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
            Brand 2
          </label>
          <select
            value={selectedBrand2}
            onChange={(e) => setSelectedBrand2(e.target.value)}
            className="w-full mt-2 px-3 py-2 rounded-lg border"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              color: 'var(--text-primary)',
            }}
          >
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Commission Cost Comparison */}
        <div
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Commission Cost
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[comparisonData[0]]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="metric" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey={brand1?.brandName || 'Brand 1'} fill={'#2563eb'} radius={[8, 8, 0, 0]} />
              <Bar dataKey={brand2?.brandName || 'Brand 2'} fill={'#059669'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg Rate Comparison */}
        <div
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Avg Commission Rate
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[comparisonData[1]]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="metric" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => `${value.toFixed(2)}%`}
              />
              <Legend />
              <Bar dataKey={brand1?.brandName || 'Brand 1'} fill={'#2563eb'} radius={[8, 8, 0, 0]} />
              <Bar dataKey={brand2?.brandName || 'Brand 2'} fill={'#059669'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg GP% Comparison */}
        <div
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Avg Gross Profit %
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[comparisonData[2]]}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="metric" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => `${value.toFixed(1)}%`}
              />
              <Legend />
              <Bar dataKey={brand1?.brandName || 'Brand 1'} fill={'#2563eb'} radius={[8, 8, 0, 0]} />
              <Bar dataKey={brand2?.brandName || 'Brand 2'} fill={'#059669'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 12-Month Trend */}
        <div
          className="rounded-lg border p-5"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            12-Month Cost Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={brand1?.brandName || 'Brand 1'}
                stroke={'#2563eb'}
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={brand2?.brandName || 'Brand 2'}
                stroke={'#059669'}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Comparison Table */}
      <div
        className="rounded-lg border overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ borderBottomColor: 'var(--border-secondary)' }} className="border-b">
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Metric
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                {brand1?.brandName}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                {brand2?.brandName}
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Difference
              </th>
            </tr>
          </thead>
          <tbody>
            {statsComparison.map((stat, idx) => {
              const diff = stat.brand1 - stat.brand2;
              const diffPercent = stat.brand2 !== 0 ? (diff / stat.brand2) * 100 : 0;
              const isPositive = diff > 0;

              return (
                <tr
                  key={idx}
                  style={{
                    borderBottomColor: 'var(--border-secondary)',
                    backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)',
                  }}
                  className="border-b"
                >
                  <td className="px-6 py-3 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {stat.label}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {stat.isPercent ? formatPercent(stat.brand1) : formatCurrency(stat.brand1)}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {stat.isPercent ? formatPercent(stat.brand2) : formatCurrency(stat.brand2)}
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold">
                    <span
                      style={{
                        color: isPositive ? 'var(--accent-green)' : 'var(--accent-red)',
                      }}
                    >
                      {isPositive ? '+' : ''}{stat.isPercent ? formatPercent(diff) : formatCurrency(diff)}
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
