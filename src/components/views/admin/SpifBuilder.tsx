'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SPIF {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired';
  participationCount: number;
  payoutTotal: number;
}

interface FormData {
  name: string;
  description: string;
  eligibility: string;
  triggerCriteria: string;
  payoutType: string;
  amount: string;
  startDate: string;
  endDate: string;
}

export default function SpifBuilder() {
  const [showForm, setShowForm] = useState(false);
  const [selectedSpif, setSelectedSpif] = useState<SPIF | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    eligibility: 'all_reps',
    triggerCriteria: 'deal_closed',
    payoutType: 'flat',
    amount: '',
    startDate: '',
    endDate: ''
  });

  const activeSPIFs: SPIF[] = [
    {
      id: 'spif-001',
      name: 'Q1 Enterprise Push',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
      status: 'active',
      participationCount: 42,
      payoutTotal: 187500
    },
    {
      id: 'spif-002',
      name: 'Product Launch Incentive',
      startDate: new Date('2026-02-15'),
      endDate: new Date('2026-04-15'),
      status: 'active',
      participationCount: 38,
      payoutTotal: 95000
    },
    {
      id: 'spif-003',
      name: 'Territory Expansion Bonus',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-05-31'),
      status: 'active',
      participationCount: 25,
      payoutTotal: 62500
    }
  ];

  const expiredSPIFs: SPIF[] = [
    {
      id: 'spif-004',
      name: 'Holiday Sales Push 2025',
      startDate: new Date('2025-11-01'),
      endDate: new Date('2025-12-31'),
      status: 'expired',
      participationCount: 47,
      payoutTotal: 235000
    },
    {
      id: 'spif-005',
      name: 'Winter Retention Campaign',
      startDate: new Date('2025-12-15'),
      endDate: new Date('2026-01-31'),
      status: 'expired',
      participationCount: 35,
      payoutTotal: 87500
    }
  ];

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitForm = () => {
    // Mock form submission
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      eligibility: 'all_reps',
      triggerCriteria: 'deal_closed',
      payoutType: 'flat',
      amount: '',
      startDate: '',
      endDate: ''
    });
  };

  const getStatusBadge = (status: string) => {
    return status === 'active'
      ? 'bg-[var(--color-success-bg)] text-[var(--color-success)]'
      : 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">SPIF Programs</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-[var(--color-button-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-button-primary-hover)] transition-colors"
        >
          + Create SPIF
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Create New SPIF</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">SPIF Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleFormChange('name', e.target.value)}
                placeholder="e.g., Q1 Enterprise Push"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={e => handleFormChange('description', e.target.value)}
                placeholder="Program description"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Eligibility</label>
              <select
                value={formData.eligibility}
                onChange={e => handleFormChange('eligibility', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
              >
                <option value="all_reps">All Reps</option>
                <option value="sales_team">Sales Team Only</option>
                <option value="new_reps">New Reps</option>
                <option value="top_performers">Top Performers</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Trigger Criteria</label>
              <select
                value={formData.triggerCriteria}
                onChange={e => handleFormChange('triggerCriteria', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
              >
                <option value="deal_closed">Deal Closed</option>
                <option value="revenue_target">Revenue Target</option>
                <option value="activity_count">Activity Count</option>
                <option value="customer_type">Customer Type</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Payout Type</label>
              <select
                value={formData.payoutType}
                onChange={e => handleFormChange('payoutType', e.target.value)}
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
              >
                <option value="flat">Flat Amount</option>
                <option value="per_deal">Per Deal</option>
                <option value="percentage">% of FCV</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Amount</label>
              <input
                type="text"
                value={formData.amount}
                onChange={e => handleFormChange('amount', e.target.value)}
                placeholder="$0.00 or %"
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">Duration</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={e => handleFormChange('startDate', e.target.value)}
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
                />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={e => handleFormChange('endDate', e.target.value)}
                  className="flex-1 px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] text-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSubmitForm}
              className="px-4 py-2 bg-[var(--color-button-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-button-primary-hover)] transition-colors"
            >
              Create SPIF
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 bg-[var(--color-button-secondary)] text-[var(--color-text-primary)] rounded-lg font-medium hover:bg-[var(--color-button-secondary-hover)] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Active SPIFs */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Active Programs</h2>
        <div className="grid grid-cols-3 gap-4">
          {activeSPIFs.map(spif => (
            <div
              key={spif.id}
              onClick={() => setSelectedSpif(spif)}
              className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-4 cursor-pointer hover:border-[var(--color-border-hover)] transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-[var(--color-text-primary)]">{spif.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded text-white bg-[var(--color-success)]`}>
                  Active
                </span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="text-[var(--color-text-secondary)]">
                  {spif.startDate.toLocaleDateString()} - {spif.endDate.toLocaleDateString()}
                </div>
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Participating Reps:</span>
                  <span className="font-medium text-[var(--color-text-primary)]">{spif.participationCount}</span>
                </div>
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Total Payout:</span>
                  <span className="font-medium text-[var(--color-text-primary)]">${spif.payoutTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected SPIF Details */}
      {selectedSpif && (
        <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">{selectedSpif.name} - Details</h2>
          <div className="grid grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-2">Program Duration</div>
              <div className="text-sm text-[var(--color-text-primary)]">
                {selectedSpif.startDate.toLocaleDateString()} to {selectedSpif.endDate.toLocaleDateString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-2">Qualified Reps</div>
              <div className="text-sm text-[var(--color-text-primary)]">{selectedSpif.participationCount} reps</div>
            </div>
            <div>
              <div className="text-xs text-[var(--color-text-secondary)] font-medium mb-2">Total Cost</div>
              <div className="text-sm text-[var(--color-text-primary)]">${selectedSpif.payoutTotal.toLocaleString()}</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedSpif(null)}
            className="px-4 py-2 bg-[var(--color-button-secondary)] text-[var(--color-text-primary)] rounded-lg font-medium hover:bg-[var(--color-button-secondary-hover)] transition-colors"
          >
            Close
          </button>
        </div>
      )}

      {/* Expired SPIFs */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Expired Programs</h2>
        <div className="space-y-3">
          {expiredSPIFs.map(spif => (
            <div key={spif.id} className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-[var(--color-text-secondary)]">{spif.name}</h3>
                <div className="text-sm text-[var(--color-text-secondary)] mt-1">
                  {spif.startDate.toLocaleDateString()} - {spif.endDate.toLocaleDateString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-[var(--color-text-secondary)]">{spif.participationCount} reps participated</div>
                <div className="font-semibold text-[var(--color-text-primary)]">${spif.payoutTotal.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
