'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { brandAnalytics, brands, commissionPlans } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';

type PlanModel = 'gp_tiered' | 'draw_against' | 'salary_bonus' | 'per_job' | 'revenue_share';

export default function ScenarioModeling() {
  // Add Reps Scenario
  const [addRepsBrand, setAddRepsBrand] = useState('brand-1');
  const [newRepsCount, setNewRepsCount] = useState(3);

  // Change Plan Model Scenario
  const [changePlanBrand, setChangePlanBrand] = useState('brand-1');
  const [newPlanModel, setNewPlanModel] = useState<PlanModel>('draw_against');

  const brand1 = brandAnalytics.find(b => b.brandId === addRepsBrand);
  const changeBrand = brandAnalytics.find(b => b.brandId === changePlanBrand);

  // Calculate Add Reps scenario
  const currentCostPerRep = brand1?.costPerRep || 20000;
  const addRepsCost = newRepsCount * currentCostPerRep;
  const addRepsScenario = [
    {
      scenario: 'Current',
      cost: brand1?.totalEarned || 0,
    },
    {
      scenario: 'With Added Reps',
      cost: (brand1?.totalEarned || 0) + addRepsCost,
    },
  ];

  // Calculate Change Plan Model scenario
  const currentModel = commissionPlans.find(p => p.brandId === changePlanBrand);
  const currentPlanCost = changeBrand?.totalEarned || 0;

  // Estimate cost change based on plan model
  const planModelMultipliers: Record<PlanModel, number> = {
    gp_tiered: 1.0,
    draw_against: 0.95,
    salary_bonus: 1.12,
    per_job: 0.88,
    revenue_share: 1.05,
  };

  const currentModelCost = currentPlanCost;
  const newModelCost = currentPlanCost * (planModelMultipliers[newPlanModel] || 1.0);
  const modelChangeDelta = newModelCost - currentModelCost;

  const changePlanScenario = [
    {
      scenario: 'Current Model',
      cost: currentModelCost,
    },
    {
      scenario: 'New Model',
      cost: newModelCost,
    },
  ];

  const planModelLabels: Record<PlanModel, string> = {
    gp_tiered: 'GP%-Based Tiered',
    draw_against: 'Draw Against Commission',
    salary_bonus: 'Salary Plus Bonus',
    per_job: 'Per-Job Bonus',
    revenue_share: 'Revenue Share',
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Scenario Modeling
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Forecast impact of strategic changes
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario 1: Add Reps */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Scenario 1: Add Reps
          </h2>

          {/* Brand Selector */}
          <div className="mb-4">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              Select Brand
            </label>
            <select
              value={addRepsBrand}
              onChange={(e) => setAddRepsBrand(e.target.value)}
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

          {/* New Reps Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Number of New Reps
              </label>
              <span className="text-sm font-bold" style={{ color: 'var(--accent-blue)' }}>
                {newRepsCount}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={newRepsCount}
              onChange={(e) => setNewRepsCount(parseInt(e.target.value))}
              className="w-full"
              style={{
                accentColor: 'var(--accent-blue)',
              }}
            />
            <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Cost per Rep (Avg)
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(currentCostPerRep)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                New Reps Cost
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>
                {formatCurrency(addRepsCost)}
              </span>
            </div>
            <div
              className="pt-3 border-t flex items-center justify-between"
              style={{ borderColor: 'var(--border-secondary)' }}
            >
              <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Total Cost Increase
              </span>
              <span className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>
                +{formatCurrency(addRepsCost)}
              </span>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={addRepsScenario}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="scenario" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Bar dataKey="cost" fill="var(--accent-blue)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario 2: Change Plan Model */}
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Scenario 2: Change Plan Model
          </h2>

          {/* Brand Selector */}
          <div className="mb-4">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              Select Brand
            </label>
            <select
              value={changePlanBrand}
              onChange={(e) => setChangePlanBrand(e.target.value)}
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

          {/* Plan Model Selector */}
          <div className="mb-6">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              New Plan Model
            </label>
            <select
              value={newPlanModel}
              onChange={(e) => setNewPlanModel(e.target.value as PlanModel)}
              className="w-full mt-2 px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                color: 'var(--text-primary)',
              }}
            >
              {(Object.keys(planModelLabels) as PlanModel[]).map((model) => (
                <option key={model} value={model}>
                  {planModelLabels[model]}
                </option>
              ))}
            </select>
          </div>

          {/* Metrics */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Current Cost
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(currentModelCost)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Estimated New Cost
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>
                {formatCurrency(newModelCost)}
              </span>
            </div>
            <div
              className="pt-3 border-t flex items-center justify-between"
              style={{ borderColor: 'var(--border-secondary)' }}
            >
              <span className="text-sm font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                Cost Change
              </span>
              <span
                className="text-lg font-bold"
                style={{ color: modelChangeDelta > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}
              >
                {modelChangeDelta > 0 ? '+' : ''}{formatCurrency(modelChangeDelta)}
              </span>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={changePlanScenario}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="scenario" stroke="var(--text-tertiary)" fontSize={12} />
              <YAxis stroke="var(--text-tertiary)" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Bar dataKey="cost" fill={modelChangeDelta > 0 ? 'var(--accent-red)' : 'var(--accent-green)'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-lg border p-4 bg-blue-50"
        style={{
          borderColor: 'var(--border-primary)',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
        }}
      >
        <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
          <strong>Note:</strong> This is an estimate based on current averages and historical patterns. Actual results may vary based on market conditions, rep performance, and deal mix. Consult with Finance before implementing major strategy changes.
        </p>
      </div>
    </div>
  );
}
