'use client';

import { useState } from 'react';
import { commissionPlans, currentUser } from '@/data/sample-data';
import { formatPercent } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function MyPlan() {
  const [acknowledged, setAcknowledged] = useState(false);

  const plan = commissionPlans.find((p) => p.brandId === currentUser.brandId);

  if (!plan) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-500">Plan not found</p>
      </div>
    );
  }

  const gpTiers = plan.tiers || [];

  return (
    <div className="space-y-6">
      {/* Pending Acknowledgment Banner */}
      {!acknowledged && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-sm text-amber-800">
            You have not yet acknowledged this plan. Please review and acknowledge at the bottom of the page.
          </p>
        </div>
      )}

      {/* Plan Header */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{plan.name}</h1>
        <p className="mt-2 text-slate-600">{currentUser.brandName}</p>
        <p className="text-sm text-slate-500">Effective January 1, 2026</p>
      </div>

      {/* How You Get Paid */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">How You Get Paid</h2>

        <div className="mb-6 space-y-4">
          <p className="text-slate-700">
            Your commission is based on the <span className="font-semibold">Gross Profit percentage</span> of each job. The higher the GP%, the higher your commission rate.
          </p>
          <p className="text-slate-700">
            We calculate your commission as: <span className="font-mono bg-slate-100 px-3 py-1 rounded text-sm">Deal Amount × (GP% ÷ 100) × Rate</span>
          </p>
        </div>

        {/* Tier Chart */}
        <div className="space-y-3">
          {gpTiers.map((tier, idx) => {
            const barWidth = (tier.rate * 250); // scale for visual
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-900">{tier.min}% - {tier.max === 100 ? '+' : tier.max + '%'} GP</span>
                  <span className="text-sm font-bold text-slate-900">
                    {formatPercent(tier.rate * 100)} rate
                  </span>
                </div>
                <div className="h-8 w-full bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all rounded-lg',
                      idx === 0 && 'bg-red-500',
                      idx === 1 && 'bg-orange-500',
                      idx === 2 && 'bg-yellow-500',
                      idx === 3 && 'bg-lime-500',
                      idx === 4 && 'bg-green-500',
                      idx === 5 && 'bg-blue-500'
                    )}
                    style={{ width: `${Math.max(barWidth, 5)}px` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-slate-600 italic">
          The better you negotiate and scope your jobs, the higher your GP% and commission rate.
        </p>
      </div>

      {/* When You Get Paid */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-4">When You Get Paid</h2>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-sm font-bold text-blue-900">1</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Sale → Front-End Commission</p>
              <p className="text-sm text-slate-600 mt-1">
                50% of your commission is paid when the deal closes and you write the proposal.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
              <span className="text-sm font-bold text-amber-900">2</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Job Complete → Back-End Commission</p>
              <p className="text-sm text-slate-600 mt-1">
                The remaining 50% is paid when the job is physically completed and inspected.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-sm font-bold text-green-900">3</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Direct Deposit</p>
              <p className="text-sm text-slate-600 mt-1">
                All commissions are deposited to your designated bank account on the 1st and 15th of each month.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <p className="text-sm text-slate-700">
            <span className="font-semibold">Pro Tip:</span> You can see your back-end commission as "earned" once the job is complete, even if it hasn't been paid yet.
          </p>
        </div>
      </div>

      {/* What Can Reduce Your Pay */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-red-900 mb-4">What Can Reduce Your Pay</h2>

        <div className="space-y-4">
          <div>
            <p className="font-semibold text-red-900">Change Orders</p>
            <p className="text-sm text-red-800 mt-1">
              If the scope of work changes and the deal amount decreases, your commission is adjusted downward automatically. You'll be notified within 24 hours.
            </p>
          </div>

          <div>
            <p className="font-semibold text-red-900">Cost Variances</p>
            <p className="text-sm text-red-800 mt-1">
              If actual costs exceed estimates, the GP% may be recalculated, affecting your rate. This is flagged during quality review.
            </p>
          </div>

          <div>
            <p className="font-semibold text-red-900">GP Revisions</p>
            <p className="text-sm text-red-800 mt-1">
              Rare adjustments if pricing errors are discovered before the job completes. These require manager approval and are fully documented.
            </p>
          </div>

          <div>
            <p className="font-semibold text-red-900">Insurance Supplements</p>
            <p className="text-sm text-red-800 mt-1">
              If insurance doesn't pay the full estimate, the deal amount is reduced and commission is adjusted accordingly.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-white border border-red-200">
          <p className="text-sm text-slate-700">
            All adjustments are transparent, documented, and posted to your commission statement immediately. You can dispute any adjustment in the Disputes section.
          </p>
        </div>
      </div>

      {/* Acknowledge Button */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <input
            type="checkbox"
            id="acknowledge"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="mt-1"
          />
          <label htmlFor="acknowledge" className="text-sm text-slate-700">
            I acknowledge that I have read and understood the {plan.name} commission plan, effective January 1, 2026.
          </label>
        </div>

        <button
          disabled={!acknowledged}
          className={cn(
            'mt-4 rounded-lg px-6 py-2 font-medium transition-colors',
            acknowledged
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          )}
        >
          Acknowledge & Continue
        </button>
      </div>
    </div>
  );
}
