// @ts-nocheck
'use client';

import { useState } from 'react';
import { Check, AlertCircle, Zap, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      brandName: 'Infinity Exteriors',
      calculated: 12450,
      verified: 12450,
      status: 'ready',
      discrepancies: 0,
    },
    {
      brandId: 'brand-2',
      brandName: 'Overhead Solutions',
      calculated: 9875,
      verified: 9875,
      status: 'ready',
      discrepancies: 0,
    },
    {
      brandId: 'brand-3',
      brandName: 'G. Fedale',
      calculated: 7320,
      verified: 7200,
      status: 'review',
      discrepancies: 1,
    },
    {
      brandId: 'brand-4',
      brandName: 'Werner Roofing',
      calculated: 5680,
      verified: 5680,
      status: 'ready',
      discrepancies: 0,
    },
    {
      brandId: 'brand-5',
      brandName: 'Cochran Exteriors',
      calculated: 11925,
      verified: 11925,
      status: 'ready',
      discrepancies: 0,
    },
  ];

  const handlePush = (brandId: string) => {
    // Push initiated — no-op for demo
  };

  const totalCalculated = 47250;
  const totalToPush = 47250;
  const totalDiscrepancies = 1;
  const readyCount = brandReadinessData.filter((b) => b.status === 'ready').length;

  return (
    <div className="p-3 sm:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-[var(--text-primary)] mb-1">Payroll Status</h1>
        <p className="text-[16px] text-[var(--text-secondary)]">Pay Period: Mar 16 - Mar 29, 2026</p>
      </div>

      {/* Hero: Big Numbers + Health At A Glance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total to Push */}
        <div className="bg-gradient-to-br from-[var(--accent-blue)] to-[var(--accent-blue)]/80 rounded-lg p-3 sm:p-6 text-white sm:col-span-2 lg:col-span-2">
          <p className="text-[14px] text-white/80 mb-3">Total Ready to Push</p>
          <p className="text-[48px] font-bold mb-2">${(totalToPush / 1000).toFixed(1)}K</p>
          <p className="text-[14px] text-white/70">Across {readyCount} brands</p>
        </div>

        {/* Integration Health Summary */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-3 sm:p-6">
          <p className="text-[14px] text-[var(--text-secondary)] mb-4 font-medium">Integrations</p>
          <div className="space-y-3">
            {integrationHealth.map((int) => (
              <div key={int.name} className="flex items-center gap-2">
                {int.status === 'connected' && (
                  <Check className="w-4 h-4 text-green-600" />
                )}
                {int.status === 'pending' && (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                {int.status === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                )}
                <span className="text-[14px] text-[var(--text-primary)]">{int.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Discrepancies Alert */}
        <div
          className={cn(
            'rounded-lg p-3 sm:p-6 border',
            totalDiscrepancies > 0
              ? 'bg-red-50 border-red-200'
              : 'bg-green-50 border-green-200'
          )}
        >
          <p className="text-[14px] font-medium mb-3">
            {totalDiscrepancies > 0 ? 'Action Required' : 'All Clear'}
          </p>
          <p className={cn(
            'text-[36px] font-bold',
            totalDiscrepancies > 0
              ? 'text-red-600'
              : 'text-green-600'
          )}>
            {totalDiscrepancies}
          </p>
          <p className="text-[14px] text-[var(--text-secondary)] mt-2">
            {totalDiscrepancies === 0 ? 'No issues' : 'discrepanc' + (totalDiscrepancies === 1 ? 'y' : 'ies')}
          </p>
        </div>
      </div>

      {/* Integration Detail Cards */}
      <div>
        <h2 className="text-[20px] font-semibold text-[var(--text-primary)] mb-4">Sync Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {integrationHealth.map((integration) => (
            <div
              key={integration.name}
              className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg p-3 sm:p-5"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-[var(--text-primary)]">
                  {integration.name}
                </h3>
                <span
                  className={cn(
                    'px-3 py-1 rounded-full text-[14px] font-medium inline-flex items-center gap-1',
                    integration.status === 'connected' && 'bg-green-100 text-green-700',
                    integration.status === 'pending' && 'bg-amber-100 text-amber-700',
                    integration.status === 'error' && 'bg-red-100 text-red-700'
                  )}
                >
                  {integration.status === 'connected' && <Check className="w-3 h-3" />}
                  {integration.status === 'pending' && <AlertCircle className="w-3 h-3" />}
                  {integration.status === 'error' && <AlertCircle className="w-3 h-3" />}
                  {integration.status === 'connected' && 'Connected'}
                  {integration.status === 'pending' && 'Pending'}
                  {integration.status === 'error' && 'Error'}
                </span>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[14px] text-[var(--text-secondary)] mb-1 font-medium">Last Sync</p>
                  <p className="text-[14px] text-[var(--text-primary)] font-mono">
                    {integration.lastSync}
                  </p>
                </div>
                <div>
                  <p className="text-[14px] text-[var(--text-secondary)] mb-1 font-medium">Next Sync</p>
                  <p className="text-[14px] text-[var(--text-primary)] font-mono">
                    {integration.nextSync}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Readiness Table */}
      <div>
        <h2 className="text-[20px] font-semibold text-[var(--text-primary)] mb-4">Brand-by-Brand Readiness</h2>
        <div className="overflow-x-auto bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-lg">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <th className="text-left py-3 px-3 sm:px-5 font-semibold text-[14px] text-[var(--text-secondary)]">
                  Brand
                </th>
                <th className="text-right py-3 px-3 sm:px-5 font-semibold text-[14px] text-[var(--text-secondary)]">
                  Calculated
                </th>
                <th className="text-right py-3 px-3 sm:px-5 font-semibold text-[14px] text-[var(--text-secondary)]">
                  Verified
                </th>
                <th className="text-center py-3 px-3 sm:px-5 font-semibold text-[14px] text-[var(--text-secondary)]">
                  Status
                </th>
                <th className="text-center py-3 px-3 sm:px-5 font-semibold text-[14px] text-[var(--text-secondary)]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {brandReadinessData.map((brand, idx) => (
                <tr
                  key={brand.brandId}
                  className={cn(
                    'border-b border-[var(--border-subtle)] hover:bg-[var(--bg-secondary)] transition',
                    idx % 2 === 0 && 'bg-[var(--bg-card)]'
                  )}
                >
                  <td className="py-4 px-3 sm:px-5 text-[14px] text-[var(--text-primary)] font-semibold">
                    {brand.brandName}
                  </td>
                  <td className="py-4 px-3 sm:px-5 text-right text-[14px] text-[var(--text-primary)] font-mono">
                    ${brand.calculated.toLocaleString()}
                  </td>
                  <td className="py-4 px-3 sm:px-5 text-right text-[14px] text-[var(--text-primary)] font-mono">
                    ${brand.verified.toLocaleString()}
                  </td>
                  <td className="py-4 px-3 sm:px-5 text-center">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[14px] font-medium',
                        brand.status === 'ready' && 'bg-green-100 text-green-700',
                        brand.status === 'review' && 'bg-amber-100 text-amber-700',
                        brand.status === 'hold' && 'bg-red-100 text-red-700'
                      )}
                    >
                      {brand.status === 'ready' && <Check className="w-3 h-3" />}
                      {brand.status === 'review' && <AlertCircle className="w-3 h-3" />}
                      {brand.status === 'hold' && <AlertCircle className="w-3 h-3" />}
                      {brand.status === 'ready' && 'Ready'}
                      {brand.status === 'review' && 'Review'}
                      {brand.status === 'hold' && 'Hold'}
                    </span>
                  </td>
                  <td className="py-4 px-3 sm:px-5 text-center">
                    <button
                      onClick={() => handlePush(brand.brandId)}
                      disabled={brand.status !== 'ready'}
                      className={cn(
                        'inline-flex items-center gap-1 px-3 py-1.5 rounded text-[14px] font-medium transition',
                        brand.status === 'ready'
                          ? 'bg-[var(--accent-blue)] text-white hover:opacity-90'
                          : 'bg-[var(--border-primary)] text-[var(--text-secondary)] cursor-not-allowed'
                      )}
                    >
                      <Zap className="w-3 h-3" />
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
