'use client';

import React from 'react';
import { Deal } from '@/types/commission';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface PlainEnglishBreakdownProps {
  deal: Deal;
}

export default function PlainEnglishBreakdown({ deal }: PlainEnglishBreakdownProps) {
  const gpTier = deal.gpPercent >= 45 ? '45%+'
    : deal.gpPercent >= 40 ? '40-45%'
    : deal.gpPercent >= 35 ? '35-40%'
    : deal.gpPercent >= 30 ? '30-35%'
    : deal.gpPercent >= 25 ? '25-30%'
    : '<25%';

  return (
    <div className="rounded-xl p-4 text-sm leading-relaxed space-y-2"
      style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
      <p>
        This job was <strong style={{ color: 'var(--text-primary)' }}>{formatCurrency(deal.fcv)} FCV</strong> at{' '}
        <strong style={{ color: 'var(--text-primary)' }}>{formatPercent(deal.gpPercent)} GP</strong>.{' '}
        Your plan (GP% Tiered) maps the {gpTier} tier to a{' '}
        <strong style={{ color: 'var(--accent-blue)' }}>{formatPercent(deal.commissionRate * 100)} rate</strong>.
      </p>
      <p>
        {formatCurrency(deal.fcv)} × {formatPercent(deal.commissionRate * 100)} ={' '}
        <strong style={{ color: 'var(--accent-green)' }}>{formatCurrency(deal.totalCommission)}</strong>.
      </p>
      <p>
        50% front-end (<strong>{formatCurrency(deal.frontEnd)}</strong>) paid at sale.{' '}
        50% back-end (<strong>{formatCurrency(deal.backEnd)}</strong>) pays when customer makes final payment.
      </p>
      {deal.splitDeal && (
        <p style={{ color: 'var(--accent-purple)' }}>
          <strong>Split Deal ({deal.splitDeal.type.replace(/_/g, ' ')}):</strong>{' '}
          {deal.splitDeal.participants.map(p => `${p.repName}: ${p.splitPercent}% (${formatCurrency(p.amount)})`).join(' · ')}
        </p>
      )}
      {deal.adjustments && deal.adjustments.length > 0 && (
        <div>
          {deal.adjustments.map(adj => (
            <p key={adj.id} style={{ color: adj.delta >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
              <strong>Adjustment:</strong> FCV changed from {formatCurrency(adj.originalFcv)} to {formatCurrency(adj.newFcv)}.{' '}
              Commission adjusted by {adj.delta >= 0 ? '+' : ''}{formatCurrency(adj.delta)}.{' '}
              Reason: {adj.reason.replace(/_/g, ' ')}.
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
