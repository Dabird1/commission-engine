'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { brands } from '@/data/sample-data';

interface IntegrationHealthCard {
  name: string;
  status: 'connected' | 'pending' | 'error';
  lastSync: string;
  nextSync: string;
}

interface BrandReadiness {
  brandId: string;
  brandName: string;
  calculated: number;
  verified: number;
  status: 'ready' | 'review' | 'hold';
  discrepancies: number;
}

export default function PayrollStatus() {
  const integrationHealth: IntegrationHealthCard[] = [
    {
      name: 'Paycor',
      status: 'connected',
      lastSync: '2026-03-25 11:45 AM',
      nextSync: '2026-03-25 2:00 PM',
    },
    {
      name: 'Sales Tool',
      status: 'connected',
      lastSync: '2026-03-25 11:30 AM',
      nextSync: '2026-03-25 12:00 PM',
    },
    {
      name: 'Acumatica',
      status: 'pending',
      lastSync: 'Never',
      nextSync: 'Awaiting setup',
    },
  ];

  const brandReadinessData: BrandReadiness[] = [
    {
      brandId: 'brand-1',
      brandName: 'Apex Roofing',
      calculated: 12450,
      verified: 12450,
      status: 'ready',
      discrepancies: 0,
    },
    {
      brandId: 'brand-2',
      brandName: 'Summit Windows',
      calculated: 9875,
      verified: 9875,
      status: 'ready',
      discrepancies: 0,
    },
    {
      brandId: 'brand-3',
      brandName: 'Shield Siding',
      calculated: 7320,
      verified: 7200,
      status: 'review',
      discrepancies: 1,
    },
    {
      brandId: 'brand-4',
      brandName: 'Peak Gutters',
      calculated: 5680,
      verified: 5680,
      status: 'ready',
      discrepancies: 0,
    },
    {
      brandId: 'brand-5',
      brandName: 'Crown Exteriors',
      calculated: 11925,
      verified: 11925,
      status: 'ready',
      discrepancies: 0,
    },
  ];

  const handlePush = (brandId: string) => {
    console.log(`Push initiated for brand: ${brandId}`);
  };

  const totalCalculated = 47250;
  const totalToPush = 47250;
  const totalDiscrepancies = 1;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Payroll Status</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">Pay Period: Mar 16 - Mar 29, 2026</p>
      </div>

      {/* Integration Health Section */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Integration Health</h2>
        <div className="grid grid-cols-3 gap-4">
          {integrationHealth.map((integration) => (
            <div
              key={integration.name}
              className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-text-primary)]">{integration.name}</h3>
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    integration.status === 'connected' && 'bg-[#dbeafe] text-[#065f46]',
                    integration.status === 'pending' && 'bg-[#fef3c7] text-[#92400e]',
                    integration.status === 'error' && 'bg-[#fee2e2] text-[#991b1b]'
                  )}
                >
                  {integration.status === 'connected' && '✓ Connected'}
                  {integration.status === 'pending' && '⟳ Pending Setup'}
                  {integration.status === 'error' && '✕ Error'}
                </span>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-[var(--color-text-secondary)] mb-1">Last Sync</p>
                  <p className="text-[var(--color-text-primary)] font-mono text-xs">{integration.lastSync}</p>
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] mb-1">Next Sync</p>
                  <p className="text-[var(--color-text-primary)] font-mono text-xs">{integration.nextSync}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pay Period Summary */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Pay Period Summary</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">Total Calculated</p>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">${(totalCalculated / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">Total to Push</p>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">${(totalToPush / 1000).toFixed(1)}K</p>
          </div>
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg p-6">
            <p className="text-sm text-[var(--color-text-secondary)] mb-2">Discrepancies</p>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">{totalDiscrepancies}</p>
          </div>
        </div>
      </div>

      {/* Brand Readiness Table */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Brand-by-Brand Readiness</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Brand</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Calculated</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Verified</th>
                <th className="text-center py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-[var(--color-text-secondary)]">Action</th>
              </tr>
            </thead>
            <tbody>
              {brandReadinessData.map((brand) => (
                <tr key={brand.brandId} className="border-b border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-secondary)]">
                  <td className="py-3 px-4 text-[var(--color-text-primary)] font-medium">{brand.brandName}</td>
                  <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono">
                    ${brand.calculated.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right text-[var(--color-text-primary)] font-mono">
                    ${brand.verified.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={cn(
                        'inline-block px-3 py-1 rounded-full text-xs font-medium',
                        brand.status === 'ready' && 'bg-[#dbeafe] text-[#065f46]',
                        brand.status === 'review' && 'bg-[#fef3c7] text-[#92400e]',
                        brand.status === 'hold' && 'bg-[#fee2e2] text-[#991b1b]'
                      )}
                    >
                      {brand.status === 'ready' && 'Ready'}
                      {brand.status === 'review' && 'Review'}
                      {brand.status === 'hold' && 'Hold'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handlePush(brand.brandId)}
                      className="px-3 py-1 bg-[var(--color-primary)] text-white rounded text-xs font-medium hover:opacity-90 transition"
                    >
                      Push
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
