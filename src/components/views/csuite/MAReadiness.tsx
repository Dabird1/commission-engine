// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { brandAnalytics } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { AlertCircle, DollarSign, Clock, TrendingUp } from 'lucide-react';

type PlanModel = 'gp_tiered' | 'draw_against' | 'salary_bonus' | 'per_job' | 'revenue_share';

const planModelDetails: Record<PlanModel, { label: string; monthlyRange: [number, number]; description: string }> = {
  gp_tiered: { label: 'GP%-Based Tiered', monthlyRange: [18000, 22000], description: 'Gross profit percentage-based commission with tiered rates' },
  draw_against: { label: 'Draw Against Commission', monthlyRange: [16000, 19000], description: 'Monthly draw against earned commission' },
  salary_bonus: { label: 'Salary Plus Bonus', monthlyRange: [20000, 24000], description: 'Base salary with performance bonus on gross profit' },
  per_job: { label: 'Per-Job Bonus', monthlyRange: [15000, 18000], description: 'Hourly base plus per-job-type bonuses' },
  revenue_share: { label: 'Revenue Share', monthlyRange: [17000, 21000], description: 'Flat percentage of total revenue' },
};

export default function MAReadiness() {
  const [brandName, setBrandName] = useState('TechPro Systems');
  const [estimatedReps, setEstimatedReps] = useState(10);
  const [planModel, setPlanModel] = useState<PlanModel>('gp_tiered');

  // Calculate projections
  const monthlyRange = planModelDetails[planModel].monthlyRange;
  const avgMonthlyCostPerRep = (monthlyRange[0] + monthlyRange[1]) / 2;
  const projectedMonthlyCost = estimatedReps * avgMonthlyCostPerRep;
  const projectedAnnualCost = projectedMonthlyCost * 12;

  // Integration timeline
  const baseIntegrationTime = 4;
  const repAdditionTime = Math.ceil(estimatedReps / 2);
  const totalIntegrationWeeks = baseIntegrationTime + repAdditionTime;

  // Portfolio context
  const totalPortfolioReps = brandAnalytics.reduce((sum, b) => sum + b.repCount, 0);
  const totalPortfolioCost = brandAnalytics.reduce((sum, b) => sum + b.totalEarned, 0);
  const avgCostPerRepPortfolio = totalPortfolioCost / totalPortfolioReps;
  const portfolioGrowthPercent = (projectedAnnualCost / totalPortfolioCost) * 100;

  // Comparison: portfolio avg vs new brand
  const portfolioAvgMonthly = (totalPortfolioCost / 12 / totalPortfolioReps) * estimatedReps;

  // Bar chart data
  const comparisonData = [
    {
      category: 'Monthly Cost',
      'Portfolio Avg': Math.round(portfolioAvgMonthly),
      'New Brand': Math.round(projectedMonthlyCost),
    },
    {
      category: 'Annual Cost',
      'Portfolio Avg': Math.round((totalPortfolioCost / totalPortfolioReps) * estimatedReps),
      'New Brand': Math.round(projectedAnnualCost),
    },
  ];

  // Cost efficiency analysis
  const newBrandCostPerRep = projectedMonthlyCost / estimatedReps;
  const portfolioAvgCostPerRep = avgCostPerRepPortfolio;
  const efficiency = ((portfolioAvgCostPerRep - newBrandCostPerRep) / portfolioAvgCostPerRep) * 100;

  return (
    <div className="p-8 w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          M&A Readiness: Brand Integration Estimator
        </h1>
        <p className="text-lg mt-2" style={{ color: 'var(--text-secondary)' }}>
          Quick-estimate commission impact, timeline, and cost efficiency for new brand acquisition
        </p>
      </div>

      {/* Input Section + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Form */}
        <div
          className="rounded-lg border p-8 lg:col-span-1"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Brand Parameters
          </h2>

          {/* Brand Name */}
          <div className="mb-6">
            <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border text-base"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Estimated Reps */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Estimated Reps
              </label>
              <span className="text-lg font-bold" style={{ color: 'var(--accent-blue)' }}>
                {estimatedReps}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="25"
              value={estimatedReps}
              onChange={(e) => setEstimatedReps(parseInt(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--accent-blue)' }}
            />
            <div className="flex justify-between mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
              <span>1</span>
              <span>25</span>
            </div>
          </div>

          {/* Plan Model */}
          <div className="mb-6">
            <label className="text-sm font-semibold block mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Commission Plan
            </label>
            <select
              value={planModel}
              onChange={(e) => setPlanModel(e.target.value as PlanModel)}
              className="w-full px-4 py-3 rounded-lg border text-base"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              {(Object.keys(planModelDetails) as PlanModel[]).map((model) => (
                <option key={model} value={model}>
                  {planModelDetails[model].label}
                </option>
              ))}
            </select>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              {planModelDetails[planModel].description}
            </p>
          </div>

          {/* Cost Per Rep Range */}
          <div
            className="rounded-lg p-4 mt-8"
            style={{
              backgroundColor: 'rgba(59, 130, 246, 0.05)',
              border: '1px solid var(--border-primary)',
            }}
          >
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Monthly Cost Per Rep
            </div>
            <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(monthlyRange[0])} – {formatCurrency(monthlyRange[1])}
            </div>
            <div className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Avg: {formatCurrency(avgMonthlyCostPerRep)}
            </div>
          </div>
        </div>

        {/* Right: Big KPI Cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Projected Monthly Cost */}
          <div
            className="rounded-lg border p-8"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Projected Monthly Cost
              </span>
              <DollarSign size={22} style={{ color: 'var(--accent-blue)' }} />
            </div>
            <div className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(projectedMonthlyCost)}
            </div>
            <div className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
              {estimatedReps} reps × {formatCurrency(avgMonthlyCostPerRep)}/rep
            </div>
          </div>

          {/* Projected Annual Cost */}
          <div
            className="rounded-lg border p-8"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Projected Annual Cost
              </span>
              <TrendingUp size={22} style={{ color: 'var(--accent-green)' }} />
            </div>
            <div className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(projectedAnnualCost)}
            </div>
            <div className="text-sm mt-3" style={{ color: 'var(--accent-green)' }}>
              +{portfolioGrowthPercent.toFixed(1)}% of current portfolio spend
            </div>
          </div>

          {/* Integration Timeline */}
          <div
            className="rounded-lg border p-8"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Integration Timeline
              </span>
              <Clock size={22} style={{ color: 'var(--accent-orange)' }} />
            </div>
            <div className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalIntegrationWeeks} weeks
            </div>
            <div className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>
              {baseIntegrationTime}w system setup + {repAdditionTime}w rep onboarding
            </div>
          </div>

          {/* Cost Efficiency vs Portfolio */}
          <div
            className="rounded-lg border p-8"
            style={{
              backgroundColor: efficiency > 0 ? 'rgba(34, 197, 94, 0.05)' : 'rgba(245, 158, 11, 0.05)',
              borderColor: efficiency > 0 ? '#22c55e' : '#f59e0b',
              border: '2px solid ' + (efficiency > 0 ? '#22c55e' : '#f59e0b'),
            }}
          >
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Cost Efficiency
            </div>
            <div className="text-3xl font-bold" style={{ color: efficiency > 0 ? '#22c55e' : '#f59e0b' }}>
              {efficiency > 0 ? '✓' : '!'} {Math.abs(efficiency).toFixed(1)}%
            </div>
            <div className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              {efficiency > 0 ? 'More efficient than portfolio average' : 'Higher cost than portfolio average'}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Chart */}
      <div
        className="rounded-lg border p-8"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Cost Comparison: {brandName} vs Portfolio Average
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
            <XAxis dataKey="category" stroke="var(--text-tertiary)" fontSize={13} />
            <YAxis stroke="var(--text-tertiary)" fontSize={13} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
              }}
              formatter={(value: any) => formatCurrency(value)}
            />
            <Bar dataKey="Portfolio Avg" fill="var(--accent-blue)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="New Brand" fill="var(--accent-green)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Portfolio Context */}
      <div
        className="rounded-lg border p-8"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Current Portfolio Context
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Total Reps
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalPortfolioReps}
            </div>
            <div className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Across 25 brands
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
              YTD Commission Cost
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(totalPortfolioCost)}
            </div>
            <div className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Current spend
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-tertiary)' }}>
              Avg Cost Per Rep
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(portfolioAvgCostPerRep)}
            </div>
            <div className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
              Monthly average
            </div>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div
        className="rounded-lg border p-8"
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          borderColor: 'var(--accent-blue)',
          border: '2px solid var(--accent-blue)',
        }}
      >
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <AlertCircle size={22} style={{ color: 'var(--accent-blue)' }} />
          Integration Summary
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          <strong>{brandName}</strong> acquisition would add <strong>{estimatedReps} reps</strong> to the portfolio, generating <strong>{formatCurrency(projectedAnnualCost)}</strong> in annual commission cost. Integration requires <strong>{totalIntegrationWeeks} weeks</strong> (system setup + rep onboarding). The new brand's cost per rep (<strong>{formatCurrency(newBrandCostPerRep)}</strong>/month) is {efficiency > 0 ? 'more' : 'less'} efficient than the current portfolio average (<strong>{formatCurrency(portfolioAvgCostPerRep)}</strong>/month). This represents a <strong>{portfolioGrowthPercent.toFixed(1)}%</strong> increase in overall commission spend.
        </p>
      </div>
    </div>
  );
}
