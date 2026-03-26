// @ts-nocheck
'use client';

import { useState } from 'react';
import { commissionPlans, brands } from '@/data/sample-data';
import { formatPercent } from '@/lib/utils';
import { Edit2, Copy, Trash2, ChevronDown, X } from 'lucide-react';

interface ExpandedPlan {
  [key: string]: boolean;
}

interface NewPlanForm {
  name: string;
  brandId: string;
  type: string;
  baseRate: string;
}

export default function PlanManagement() {
  const [expandedPlans, setExpandedPlans] = useState<ExpandedPlan>({});
  const [showModal, setShowModal] = useState(false);
  const [plans, setPlans] = useState(commissionPlans);
  const [newPlan, setNewPlan] = useState<NewPlanForm>({
    name: '',
    brandId: brands[0]?.id || '',
    type: 'tiered_percentage',
    baseRate: '8',
  });

  const toggleExpand = (planId: string) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planId]: !prev[planId]
    }));
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewPlan({
      name: '',
      brandId: brands[0]?.id || '',
      type: 'tiered_percentage',
      baseRate: '8',
    });
  };

  const handleCreatePlan = () => {
    if (!newPlan.name.trim() || !newPlan.brandId) {
      return;
    }

    const createdPlan = {
      id: `plan-${Date.now()}`,
      name: newPlan.name,
      brandId: newPlan.brandId,
      type: newPlan.type,
      description: `Custom ${newPlan.type} plan`,
      tiers: newPlan.type === 'tiered_percentage' ? [
        { label: 'Base', minGp: 0, maxGp: 40, rate: parseInt(newPlan.baseRate) * 100 },
      ] : undefined,
      monthlyDraw: newPlan.type === 'draw_against_commission' ? 2000 : undefined,
      baseCommissionRate: newPlan.type === 'draw_against_commission' ? parseInt(newPlan.baseRate) : undefined,
      baseSalary: newPlan.type === 'salary_plus_bonus' ? 50000 : undefined,
      bonusRate: newPlan.type === 'salary_plus_bonus' ? parseInt(newPlan.baseRate) : undefined,
      bonusThreshold: newPlan.type === 'salary_plus_bonus' ? 40 : undefined,
      revenueShareRate: newPlan.type === 'revenue_share' ? parseInt(newPlan.baseRate) : undefined,
      frontEndSplit: 0.5,
      backEndSplit: 0.5,
      version: 1,
      isActive: true,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPlans([...plans, createdPlan]);
    handleCloseModal();
  };

  const getBrandName = (brandId: string) => {
    return brands.find(b => b.id === brandId)?.name || 'Unknown Brand';
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'tiered_percentage': 'GP% Tiered',
      'draw_against_commission': 'Draw Against',
      'salary_plus_bonus': 'Salary + Bonus',
      'per_job_bonus': 'Per-Job Bonus',
      'revenue_share': 'Revenue Share'
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      'tiered_percentage': 'bg-blue-600',
      'draw_against_commission': 'bg-green-600',
      'salary_plus_bonus': 'bg-purple-600',
      'per_job_bonus': 'bg-amber-600',
      'revenue_share': 'bg-teal-600'
    };
    return colors[type] || 'bg-gray-600';
  };

  const renderPlanSummary = (plan: any) => {
    const keyDetails: string[] = [];

    switch (plan.type) {
      case 'tiered_percentage':
        const minRate = Math.min(...(plan.tiers?.map((t: any) => t.rate) || [0]));
        const maxRate = Math.max(...(plan.tiers?.map((t: any) => t.rate) || [0]));
        keyDetails.push(`Rates: ${formatPercent(minRate / 100)}–${formatPercent(maxRate / 100)}`);
        keyDetails.push(`${plan.tiers?.length || 0} Tiers`);
        break;
      case 'draw_against_commission':
        keyDetails.push(`Draw: $${plan.monthlyDraw?.toLocaleString()}/mo`);
        keyDetails.push(`Rate: ${formatPercent(plan.baseCommissionRate || 0)}`);
        break;
      case 'salary_plus_bonus':
        keyDetails.push(`Salary: $${plan.baseSalary?.toLocaleString()}`);
        keyDetails.push(`Bonus: ${formatPercent(plan.bonusRate || 0)}`);
        break;
      case 'revenue_share':
        keyDetails.push(`Share: ${formatPercent(plan.revenueShareRate || 0)}`);
        break;
      default:
        keyDetails.push('Standard Plan');
    }

    return keyDetails;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Commission Plans</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{plans.length} plans configured</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-5 py-2 bg-[var(--accent-blue)] text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          + New Plan
        </button>
      </div>

      {/* Plans as scannable cards/rows */}
      <div className="space-y-3">
        {plans.map(plan => {
          const summary = renderPlanSummary(plan);
          const isExpanded = expandedPlans[plan.id];

          return (
            <div
              key={plan.id}
              className="border rounded-lg overflow-hidden transition-all"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}
            >
              {/* Collapsed Row */}
              <div
                onClick={() => toggleExpand(plan.id)}
                className="p-4 cursor-pointer transition-colors hover:opacity-90"
                style={{ backgroundColor: 'var(--bg-card)' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-[var(--text-primary)]">{plan.name}</h3>
                      <span className={`px-2.5 py-1 text-sm font-semibold rounded text-white ${getTypeBadgeColor(plan.type)}`}>
                        {getTypeLabel(plan.type)}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{getBrandName(plan.brandId)}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
                      {summary.map((detail, idx) => (
                        <span key={idx}>{detail}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={e => { e.stopPropagation(); }}
                      className="p-2 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={e => { e.stopPropagation(); }}
                      className="p-2 rounded-lg text-[var(--text-tertiary)] hover:bg-[var(--bg-secondary)] transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={16} />
                    </button>
                    <ChevronDown
                      size={20}
                      className="text-[var(--text-tertiary)] transition-transform"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    />
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div
                  className="border-t p-4 space-y-4"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}
                >
                  <div>
                    <p className="text-sm text-[var(--text-primary)] mb-2">{plan.description}</p>
                  </div>

                  {/* Type-specific details */}
                  {plan.type === 'tiered_percentage' && (
                    <div>
                      <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Tier Structure</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {plan.tiers?.map((tier: any, idx: number) => (
                          <div key={idx} className="p-2 rounded" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }} className="border">
                            <div className="text-sm font-semibold text-[var(--text-secondary)]">{tier.label}</div>
                            <div className="text-sm font-bold text-[var(--text-primary)] mt-1">{formatPercent(tier.rate / 100)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 text-sm text-[var(--text-secondary)]">
                        Split: {plan.frontEndSplit ? `${Math.round(plan.frontEndSplit * 100)}% front / ${Math.round(plan.backEndSplit * 100)}% back` : 'Not configured'}
                      </div>
                    </div>
                  )}

                  {plan.type === 'draw_against_commission' && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] font-medium">Monthly Draw</div>
                        <div className="text-lg font-bold text-[var(--text-primary)] mt-1">${plan.monthlyDraw?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] font-medium">Base Rate</div>
                        <div className="text-lg font-bold text-[var(--text-primary)] mt-1">{formatPercent(plan.baseCommissionRate || 0)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] font-medium">Split</div>
                        <div className="text-sm font-bold text-[var(--text-primary)] mt-1">{Math.round(plan.frontEndSplit * 100)}% / {Math.round(plan.backEndSplit * 100)}%</div>
                      </div>
                    </div>
                  )}

                  {plan.type === 'salary_plus_bonus' && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] font-medium">Base Salary</div>
                        <div className="text-lg font-bold text-[var(--text-primary)] mt-1">${plan.baseSalary?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] font-medium">Bonus Rate</div>
                        <div className="text-lg font-bold text-[var(--text-primary)] mt-1">{formatPercent(plan.bonusRate || 0)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[var(--text-secondary)] font-medium">Threshold</div>
                        <div className="text-sm font-bold text-[var(--text-primary)] mt-1">{formatPercent(plan.bonusThreshold || 0)} GP</div>
                      </div>
                    </div>
                  )}

                  {/* Version */}
                  <div className="pt-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="text-sm text-[var(--text-secondary)]">v1.0 · Current · Published 2026-03-01</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-[var(--bg-card)] rounded-lg shadow-lg max-w-md w-full border"
            style={{ borderColor: 'var(--border-primary)' }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Create New Plan</h2>
              <button
                onClick={handleCloseModal}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Plan Name */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                  placeholder="e.g., Senior Sales Plan"
                  className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-blue)]"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Brand
                </label>
                <select
                  value={newPlan.brandId}
                  onChange={(e) => setNewPlan({ ...newPlan, brandId: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-blue)]"
                >
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Plan Type */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Plan Type
                </label>
                <select
                  value={newPlan.type}
                  onChange={(e) => setNewPlan({ ...newPlan, type: e.target.value })}
                  className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-blue)]"
                >
                  <option value="tiered_percentage">GP% Tiered</option>
                  <option value="draw_against_commission">Draw Against Commission</option>
                  <option value="salary_plus_bonus">Salary + Bonus</option>
                  <option value="per_job_bonus">Per-Job Bonus</option>
                  <option value="revenue_share">Revenue Share</option>
                </select>
              </div>

              {/* Base Rate */}
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Base Rate / Draw Amount (%)
                </label>
                <input
                  type="number"
                  value={newPlan.baseRate}
                  onChange={(e) => setNewPlan({ ...newPlan, baseRate: e.target.value })}
                  placeholder="8"
                  className="w-full px-3 py-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm focus:outline-none focus:border-[var(--accent-blue)]"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center gap-3 p-6 border-t" style={{ borderColor: 'var(--border-primary)' }}>
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-2 text-[var(--text-primary)] border border-[var(--border-primary)] rounded-lg font-semibold hover:bg-[var(--bg-secondary)] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlan}
                disabled={!newPlan.name.trim()}
                className="flex-1 px-4 py-2 bg-[var(--accent-blue)] text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
