'use client';

import { useState, useMemo } from 'react';
import { currentUser } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';

const PROJECT_TYPES = ['roofing', 'windows', 'siding', 'gutters', 'trim'];

const COMMISSION_TIERS = [
  { min: 0, max: 25, rate: 0.04 },
  { min: 25, max: 30, rate: 0.05 },
  { min: 30, max: 35, rate: 0.07 },
  { min: 35, max: 40, rate: 0.08 },
  { min: 40, max: 45, rate: 0.09 },
  { min: 45, max: 100, rate: 0.1 },
];

export default function WhatIfCalculator() {
  const [dealSize, setDealSize] = useState(25000);
  const [gpPercent, setGpPercent] = useState(40);
  const [projectType, setProjectType] = useState('roofing');

  const calculation = useMemo(() => {
    const tier = COMMISSION_TIERS.find((t) => gpPercent >= t.min && gpPercent < t.max);
    const rate = tier?.rate || 0.1;
    const commission = dealSize * (gpPercent / 100) * rate;
    const frontEnd = commission * 0.5;
    const backEnd = commission * 0.5;

    // Calculate nudge
    const nuddedGP = gpPercent + 5;
    const nudgeTier = COMMISSION_TIERS.find((t) => nuddedGP >= t.min && nuddedGP < t.max);
    const nudgeRate = nudgeTier?.rate || 0.1;
    const nudgeCommission = dealSize * (nuddedGP / 100) * nudgeRate;
    const nudgeDelta = nudgeCommission - commission;

    // Calculate quota impact
    const newYTDTotal = currentUser.ytdEarnings + commission;
    const quotaProgress = ((newYTDTotal / (currentUser.ytdEarnings * 2)) * 100).toFixed(1);

    return {
      rate,
      commission,
      frontEnd,
      backEnd,
      nuddedGP,
      nudgeRate,
      nudgeCommission,
      nudgeDelta,
      newYTDTotal,
      quotaProgress,
    };
  }, [dealSize, gpPercent]);

  const tierComparison = useMemo(() => {
    return COMMISSION_TIERS.map((tier) => {
      const midpoint = (tier.min + tier.max) / 2;
      const testCommission = dealSize * (midpoint / 100) * tier.rate;
      return {
        ...tier,
        label: `${tier.min}%-${tier.max > 99 ? '99' : tier.max}%`,
        testCommission,
      };
    });
  }, [dealSize]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">What If Calculator</h1>
        <p className="mt-2 text-slate-600">
          Model different deal scenarios to see how they impact your earnings and quota
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-6">
          {/* Deal Size */}
          <div>
            <label className="block text-sm font-semibold text-slate-900">
              Deal Size: {formatCurrency(dealSize)}
            </label>
            <div className="mt-2 flex gap-4 items-center">
              <input
                type="range"
                min="5000"
                max="100000"
                step="1000"
                value={dealSize}
                onChange={(e) => setDealSize(Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={dealSize}
                onChange={(e) => setDealSize(Number(e.target.value))}
                className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* GP Percent */}
          <div>
            <label className="block text-sm font-semibold text-slate-900">
              GP%: {formatPercent(gpPercent)}
            </label>
            <div className="mt-2 flex gap-4 items-center">
              <input
                type="range"
                min="20"
                max="60"
                step="1"
                value={gpPercent}
                onChange={(e) => setGpPercent(Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                value={gpPercent}
                onChange={(e) => setGpPercent(Number(e.target.value))}
                className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm"
            >
              {PROJECT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Live Output */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Your Estimated Commission</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-lg bg-white p-4 border border-blue-100">
            <p className="text-sm text-slate-600">Commission</p>
            <p className="mt-1 text-2xl font-bold text-blue-600">
              {formatCurrency(calculation.commission)}
            </p>
          </div>

          <div className="rounded-lg bg-white p-4 border border-blue-100">
            <p className="text-sm text-slate-600">Rate Applied</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {formatPercent(calculation.rate * 100)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Based on {formatPercent(gpPercent)}% GP (Tier)
            </p>
          </div>

          <div className="rounded-lg bg-white p-4 border border-blue-100">
            <p className="text-sm text-slate-600">Front / Back Split</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatCurrency(calculation.frontEnd)} | {formatCurrency(calculation.backEnd)}
            </p>
          </div>
        </div>

        {/* Quota Impact */}
        <div className="rounded-lg bg-white p-4 border border-blue-100">
          <p className="text-sm text-slate-600 mb-2">YTD Projection</p>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(calculation.newYTDTotal)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {calculation.quotaProgress}% of quota
              </p>
            </div>
            <div className="h-8 w-full max-w-xs bg-slate-200 rounded-lg overflow-hidden ml-4">
              <div
                className="h-full bg-green-500"
                style={{ width: `${Math.min(Number(calculation.quotaProgress), 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Nudge Section */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-amber-900 mb-3">Opportunity</h2>
        <p className="text-sm text-amber-800 mb-4">
          If you negotiate to <span className="font-semibold">{formatPercent(calculation.nuddedGP)}%</span>, your rate jumps to{' '}
          <span className="font-semibold">{formatPercent(calculation.nudgeRate * 100)}</span> →{' '}
          <span className="text-lg font-bold text-amber-900">
            {formatCurrency(calculation.nudgeCommission)}
          </span>{' '}
          <span className="text-green-700 font-semibold">
            (+{formatCurrency(calculation.nudgeDelta)})
          </span>
        </p>
      </div>

      {/* Tier Comparison Table */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Commission at Each GP% Tier</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-slate-600">GP% Range</th>
                <th className="px-4 py-2 text-center font-semibold text-slate-600">Rate</th>
                <th className="px-4 py-2 text-right font-semibold text-slate-600">
                  Commission @ {formatCurrency(dealSize)}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {tierComparison.map((tier, idx) => (
                <tr
                  key={idx}
                  className={
                    gpPercent >= tier.min && gpPercent < tier.max ? 'bg-blue-50' : 'hover:bg-slate-50'
                  }
                >
                  <td className="px-4 py-3 font-medium text-slate-900">{tier.label}</td>
                  <td className="px-4 py-3 text-center text-slate-900">
                    {formatPercent(tier.rate * 100)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    {formatCurrency(tier.testCommission)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Current Stats */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-600 uppercase mb-4">Your Current YTD</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-600">Earnings</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatCurrency(currentUser.ytdEarnings)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Front Paid</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatCurrency(currentUser.ytdFrontPaid)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Back Earned</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatCurrency(currentUser.ytdBackEarned)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-600">Back Pending</p>
            <p className="mt-1 text-lg font-bold text-slate-900">
              {formatCurrency(currentUser.ytdBackPending)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
