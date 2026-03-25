'use client';

import { useState } from 'react';
import { commissionPlans, brands } from '@/data/sample-data';
import { cn } from '@/lib/utils';

interface ExpandedPlan {
  [key: string]: boolean;
}

export default function PlanManagement() {
  const [expandedPlans, setExpandedPlans] = useState<ExpandedPlan>({});

  const toggleExpand = (planId: string) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || 'Unknown Brand';
  };

  const renderPlanDetails = (plan: any) => {
    switch (plan.model) {
      case 'gp_tiered':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {plan.tiers.map((tier: any, idx: number) => (
                <div key={idx} className="bg-[var(--color-bg-secondary)] p-3 rounded-lg border border-[var(--color-border)]">
                  <div className="text-sm font-medium">Tier {idx + 1}</div>
                  <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                    GP% Range: {tier.minGp}% - {tier.maxGp}%
                  </div>
                  <div className="text-xs text-[var(--color-text-secondary)]">
                    Rate: {tier.rate}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'draw_against':
        return (
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Draw Amount:</span> ${plan.drawAmount?.toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="font-medium">Base Rate:</span> {plan.baseRate}%
            </div>
            <div className="text-sm">
              <span className="font-medium">Splits:</span> {Object.entries(plan.splits || {}).map(([key, val]) => `${key}: ${val}`).join(', ')}
            </div>
          </div>
        );
      case 'salary_plus_bonus':
        return (
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Salary:</span> ${plan.salary?.toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="font-medium">Rate:</span> {plan.bonusRate}%
            </div>
            <div className="text-sm">
              <span className="font-medium">Basis:</span> {plan.basis}
            </div>
          </div>
        );
      case 'production':
        return (
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Hourly Base:</span> ${plan.hourlyBase}
            </div>
            <div className="text-sm font-medium">Per-Job Bonuses:</div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(plan.jobBonuses || {}).map(([type, amount]) => (
                <div key={type} className="text-xs bg-[var(--color-bg-secondary)] p-2 rounded">
                  {type}: ${String(amount)}
                </div>
              ))}
            </div>
          </div>
        );
      case 'revenue_share':
        return (
          <div className="space-y-3">
            <div className="text-sm">
              <span className="font-medium">Rate:</span> {plan.revenueShareRate}%
            </div>
            <div className="text-sm">
              <span className="font-medium">Splits:</span> {Object.entries(plan.splits || {}).map(([key, val]) => `${key}: ${val}`).join(', ')}
            </div>
          </div>
        );
      default:
        return <div className="text-sm text-[var(--color-text-secondary)]">Standard Details</div>;
    }
  };

  const getModelBadgeColor = (model: string) => {
    const colors: Record<string, string> = {
      'gp_tiered': 'bg-[var(--color-badge-blue)]',
      'draw_against': 'bg-[var(--color-badge-green)]',
      'salary_plus_bonus': 'bg-[var(--color-badge-purple)]',
      'production': 'bg-[var(--color-badge-amber)]',
      'revenue_share': 'bg-[var(--color-badge-teal)]'
    };
    return colors[model] || 'bg-[var(--color-badge-gray)]';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Plan Management</h1>
        <button className="px-4 py-2 bg-[var(--color-button-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-button-primary-hover)] transition-colors">
          + New Plan
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {commissionPlans.map(plan => (
          <div key={plan.id} className="border border-[var(--color-border)] rounded-lg overflow-hidden bg-[var(--color-bg-primary)]">
            {/* Collapsed Header */}
            <div
              onClick={() => toggleExpand(plan.id)}
              className="p-4 cursor-pointer hover:bg-[var(--color-bg-hover)] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">{plan.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-[var(--color-badge-blue)] text-white">
                      {plan.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded text-white ${getModelBadgeColor(plan.model)}`}>
                      {plan.model}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                    {getBrandName(plan.brandId)}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)]">{plan.description}</p>
                </div>
                <div className="text-2xl text-[var(--color-text-tertiary)] ml-4">
                  {expandedPlans[plan.id] ? '−' : '+'}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedPlans[plan.id] && (
              <div className="border-t border-[var(--color-border)] p-4 bg-[var(--color-bg-secondary)]">
                <div className="space-y-4">
                  {renderPlanDetails(plan)}

                  {/* Version History */}
                  <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
                    <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Version History</h4>
                    <div className="space-y-2">
                      <div className="text-xs bg-[var(--color-bg-tertiary)] p-2 rounded flex justify-between items-center">
                        <span>Version 1.0 - Current</span>
                        <span className="text-[var(--color-text-secondary)]">{new Date(plan.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="text-xs bg-[var(--color-bg-tertiary)] p-2 rounded flex justify-between items-center">
                        <span>Version 0.9 - Previous</span>
                        <span className="text-[var(--color-text-secondary)]">2024-01-15</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-4">
                    <button className="px-3 py-2 text-sm bg-[var(--color-button-secondary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-button-secondary-hover)] transition-colors">
                      Edit Plan
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
