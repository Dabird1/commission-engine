// @ts-nocheck

'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
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

  const planModelMultipliers: Record<PlanModel, number> = {
    gp_tiered: 1.0,
    draw_against: 0.95,
    salary_bonus: 1.12,
    per_job: 0.88,
    revenue_share: 1.05,
  };

  const newModelCost = currentPlanCost * (planModelMultipliers[newPlanModel] || 1.0);
  const modelChangeDelta = newModelCost - currentPlanCost;

  const changePlanScenario = [
    {
      scenario: 'Current',
      cost: currentPlanCost,
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
    <div className="p-3 sm:p-8 w-full space-y-5" style={{ maxWidth: '1400px' }}>
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Scenario Modeling
        </h1>
        <p className="text-14" style={{ color: 'var(--text-secondary)' }}>
          Calculate the impact of strategic changes on commission costs
        </p>
      </div>

      {/* Scenarios Grid — Side by side, no vertical scrolling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
        {/* Scenario 1: Add Reps — Calculator-style layout */}
        <div
          className="rounded-lg border p-3 sm:p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 className="text-18 font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
            Add Sales Reps
          </h2>

          {/* Brand Selector */}
          <div className="mb-5">
            <label className="text-13 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              SELECT BRAND
            </label>
            <select
              value={addRepsBrand}
              onChange={(e) => setAddRepsBrand(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg border text-14 font-semibold"
              style={{
                backgroundColor: 'var(--bg-secondary)',
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

          {/* New Reps Slider — Large with visible value */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-13 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                NUMBER OF NEW REPS
              </label>
              <span className="text-24 font-bold" style={{ color: 'var(--accent-blue)' }}>
                {newRepsCount}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={newRepsCount}
              onChange={(e) => setNewRepsCount(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg cursor-pointer"
              style={{
                accentColor: 'var(--accent-blue)',
              }}
            />
            <div className="flex justify-between mt-2 text-12 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          {/* Calculation Metrics — Like a calculator display */}
          <div className="space-y-3 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between">
              <span className="text-14" style={{ color: 'var(--text-secondary)' }}>
                Cost per Rep (avg)
              </span>
              <span className="text-16 font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(currentCostPerRep)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-14" style={{ color: 'var(--text-secondary)' }}>
                {newRepsCount} New Rep{newRepsCount !== 1 ? 's' : ''} Cost
              </span>
              <span className="text-16 font-bold" style={{ color: 'var(--accent-blue)' }}>
                {formatCurrency(addRepsCost)}
              </span>
            </div>
            <div
              className="pt-3 border-t flex items-center justify-between"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <span className="text-14 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                TOTAL COST INCREASE
              </span>
              <span className="text-20 font-bold" style={{ color: 'var(--accent-red)' }}>
                +{formatCurrency(addRepsCost)}
              </span>
            </div>
          </div>

          {/* Chart — Shows before/after */}
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={addRepsScenario} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="scenario" stroke="var(--text-tertiary)" fontSize={13} fontWeight="600" />
              <YAxis stroke="var(--text-tertiary)" fontSize={13} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Bar dataKey="cost" fill="var(--accent-blue)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scenario 2: Change Plan Model — Calculator-style layout */}
        <div
          className="rounded-lg border p-3 sm:p-6"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-primary)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 className="text-18 font-bold mb-5" style={{ color: 'var(--text-primary)' }}>
            Change Commission Plan
          </h2>

          {/* Brand Selector */}
          <div className="mb-5">
            <label className="text-13 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              SELECT BRAND
            </label>
            <select
              value={changePlanBrand}
              onChange={(e) => setChangePlanBrand(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-lg border text-14 font-semibold"
              style={{
                backgroundColor: 'var(--bg-secondary)',
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
            <label className="text-13 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
              NEW PLAN MODEL
            </label>
            <select
              value={newPlanModel}
              onChange={(e) => setNewPlanModel(e.target.value as PlanModel)}
              className="w-full mt-2 px-4 py-3 rounded-lg border text-14 font-semibold"
              style={{
                backgroundColor: 'var(--bg-secondary)',
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

          {/* Calculation Metrics — Like a calculator display */}
          <div className="space-y-3 mb-6 p-4 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between">
              <span className="text-14" style={{ color: 'var(--text-secondary)' }}>
                Current Model Cost
              </span>
              <span className="text-16 font-bold" style={{ color: 'var(--text-primary)' }}>
                {formatCurrency(currentPlanCost)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-14" style={{ color: 'var(--text-secondary)' }}>
                {planModelLabels[newPlanModel]} Cost
              </span>
              <span className="text-16 font-bold" style={{ color: 'var(--accent-blue)' }}>
                {formatCurrency(newModelCost)}
              </span>
            </div>
            <div
              className="pt-3 border-t flex items-center justify-between"
              style={{ borderColor: 'var(--border-primary)' }}
            >
              <span className="text-14 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
                COST CHANGE
              </span>
              <span className="text-20 font-bold" style={{ color: modelChangeDelta > 0 ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {modelChangeDelta > 0 ? '+' : ''}{formatCurrency(modelChangeDelta)}
              </span>
            </div>
          </div>

          {/* Chart — Shows before/after */}
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={changePlanScenario} margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-secondary)" />
              <XAxis dataKey="scenario" stroke="var(--text-tertiary)" fontSize={13} fontWeight="600" />
              <YAxis stroke="var(--text-tertiary)" fontSize={13} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border-primary)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
                formatter={(value: any) => formatCurrency(value)}
              />
              <Bar dataKey="cost" fill={modelChangeDelta > 0 ? 'var(--accent-red)' : 'var(--accent-green)'} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Disclaimer — Clear and prominent */}
      <div
        className="rounded-lg border p-3 sm:p-5"
        style={{
          borderColor: 'var(--accent-blue)',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
        }}
      >
        <p className="text-14 font-semibold" style={{ color: 'var(--text-primary)' }}>
          Note: These estimates are based on current averages and historical patterns. Actual results depend on market conditions, rep performance, and deal mix. Consult with Finance before making strategic changes.
        </p>
      </div>
    </div>
  );
}
