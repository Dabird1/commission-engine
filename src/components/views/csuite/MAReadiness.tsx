'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { brandAnalytics } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';

type PlanModel = 'gp_tiered' | 'draw_against' | 'salary_bonus' | 'per_job' | 'revenue_share';

const planModelDetails: Record<PlanModel, { label: string; monthlyRange: [number, number] }> = {
  gp_tiered: { label: 'GP%-Based Tiered', monthlyRange: [18000, 22000] },
  draw_against: { label: 'Draw Against Commission', monthlyRange: [16000, 19000] },
  salary_bonus: { label: 'Salary Plus Bonus', monthlyRange: [20000, 24000] },
  per_job: { label: 'Per-Job Bonus', monthlyRange: [15000, 18000] },
  revenue_share: { label: 'Revenue Share', monthlyRange: [17000, 21000] },
};

export default function MAReadiness() {
  const [brandName, setBrandName] = useState('TechPro Systems');
  const [estimatedReps, setEstimatedReps] = useState(8);
  const [planModel, setPlanModel] = useState<PlanModel>('gp_tiered');
  const [avgDealSize, setAvgDealSize] = useState(25000);
  const [estimatedAvgGP, setEstimatedAvgGP] = useState(38);

  // Calculate projections
  const monthlyRange = planModelDetails[planModel].monthlyRange;
  const avgMonthlyCostPerRep = (monthlyRange[0] + monthlyRange[1]) / 2;
  const projectedMonthlyCost = estimatedReps * avgMonthlyCostPerRep;
  const projectedAnnualCost = projectedMonthlyCost * 12;

  // Estimate integration timeline (in weeks)
  const baseIntegrationTime = 4;
  const repAdditionTime = Math.ceil(estimatedReps / 2); // 1 week per 2 reps
  const totalIntegrationWeeks = baseIntegrationTime + repAdditionTime;

  // Portfolio context
  const totalPortfolioReps = brandAnalytics.reduce((sum, b) => sum + b.repCount, 0);
  const totalPortfolioCost = brandAnalytics.reduce((sum, b) => sum + b.totalEarned, 0);
  const portfolioGrowthPercent = (projectedAnnualCost / totalPortfolioCost) * 100;

  // Comparison data
  const comparisonData = [
    {
      category: 'Monthly Cost',
      'Portfolio Avg': (totalPortfolioCost / 12 / totalPortfolioReps) * estimatedReps,
      'New Brand': projectedMonthlyCost,
    },
    {
      category: 'Annual Cost',
      'Portfolio Avg': (totalPortfolioCost / totalPortfolioReps) * estimatedReps,
      'New Brand': projectedAnnualCost,
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          M&A Readiness: New Brand Integration Estimator
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Evaluate commission impact and integration timeline for brand #26
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div
          className="rounded-lg border p-6 lg:col-span-1"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Integration Estimator
          </h2>

          {/* Brand Name */}
          <div className="mb-5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              Brand Name
            </label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full mt-2 px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            />
          </div>

          {/* Estimated Reps - Slider */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Estimated Reps
              </label>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-blue)' }}>
                {estimatedReps}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={estimatedReps}
              onChange={(e) => setEstimatedReps(parseInt(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--accent-blue)' }}
            />
            <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span>1</span>
              <span>20</span>
            </div>
          </div>

          {/* Plan Model */}
          <div className="mb-5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              Plan Model
            </label>
            <select
              value={planModel}
              onChange={(e) => setPlanModel(e.target.value as PlanModel)}
              className="w-full mt-2 px-3 py-2 rounded-lg border"
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
          </div>

          {/* Avg Deal Size */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Avg Deal Size
              </label>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-green)' }}>
                {formatCurrency(avgDealSize)}
              </span>
            </div>
            <input
              type="range"
              min="15000"
              max="50000"
              step="1000"
              value={avgDealSize}
              onChange={(e) => setAvgDealSize(parseInt(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--accent-green)' }}
            />
          </div>

          {/* Avg GP% */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Estimated Avg GP%
              </label>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-orange)' }}>
                {estimatedAvgGP.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="25"
              max="50"
              step="0.5"
              value={estimatedAvgGP}
              onChange={(e) => setEstimatedAvgGP(parseFloat(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--accent-orange)' }}
            />
            <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span>25%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        {/* Projections Summary */}
        <div className="lg:col-span-2 space-y-5">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Monthly Cost */}
            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Projected Monthly Cost
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(projectedMonthlyCost)}
              </div>
              <div className="text-xs" style={{ color: 'var(--accent-blue)' }}>
                {estimatedReps} reps × {formatCurrency(avgMonthlyCostPerRep)} per rep
              </div>
            </div>

            {/* Annual Cost */}
            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Projected Annual Cost
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(projectedAnnualCost)}
              </div>
              <div className="text-xs" style={{ color: 'var(--accent-green)' }}>
                +{portfolioGrowthPercent.toFixed(1)}% of current portfolio
              </div>
            </div>

            {/* Integration Timeline */}
            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Integration Timeline
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {totalIntegrationWeeks} weeks
              </div>
              <div className="text-xs" style={{ color: 'var(--accent-blue)' }}>
                {baseIntegrationTime}w base + {repAdditionTime}w rep onboarding
              </div>
            </div>

            {/* Cost per Rep */}
            <div
              className="rounded-lg border p-6"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div className="text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                Cost Per Rep (Est.)
              </div>
              <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(avgMonthlyCostPerRep)}
              </div>
              <div className="text-xs" style={{ color: 'var(--accent-green)' }}>
                Monthly average
              </div>
            </div>
          </div>

          {/* Comparison Chart */}
          <div
            className="rounded-lg border p-6"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-primary)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Cost Comparison: New Brand vs Portfolio Average
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
                <XAxis dataKey="category" stroke="var(--text-tertiary)" fontSize={12} />
                <YAxis stroke="var(--text-tertiary)" fontSize={12} />
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
        </div>
      </div>

      {/* Existing Portfolio Summary */}
      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-primary)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          Existing Portfolio Context
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Total Reps
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {totalPortfolioReps}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Across 5 brands
            </div>
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              YTD Commission Cost
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(totalPortfolioCost)}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              Current spend
            </div>
          </div>
          <div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
              Portfolio Impact
            </div>
            <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              +{portfolioGrowthPercent.toFixed(1)}%
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              With new brand
            </div>
          </div>
        </div>
      </div>

      {/* Integration Readiness Note */}
      <div
        className="rounded-lg border p-4 bg-blue-50"
        style={{
          borderColor: 'var(--border-primary)',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
        }}
      >
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
          <strong>Integration Success Factors:</strong> When {brandName} (brand #26) joins the portfolio, plan for {totalIntegrationWeeks}-week onboarding. This includes system setup (4 weeks), rep hiring and training ({repAdditionTime} weeks), and commission plan validation. Budget {formatCurrency(projectedAnnualCost)} annually with {estimatedReps} reps on the {planModelDetails[planModel].label} model, representing a {portfolioGrowthPercent.toFixed(1)}% increase to commission spend.
        </p>
      </div>
    </div>
  );
}
