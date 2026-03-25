'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { TierLevel } from '@/types/commission';

const tierColors: Record<TierLevel, { bg: string; text: string; border: string }> = {
  bronze: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
  silver: { bg: '#f1f5f9', text: '#475569', border: '#94a3b8' },
  gold: { bg: '#fef9c3', text: '#854d0e', border: '#eab308' },
};

interface TierBadgeProps {
  tier: TierLevel;
  size?: 'sm' | 'md' | 'lg';
}

export default function TierBadge({ tier, size = 'md' }: TierBadgeProps) {
  const colors = tierColors[tier];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-1.5 text-base gap-2',
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full capitalize ${sizeClasses[size]}`}
      style={{ backgroundColor: colors.bg, color: colors.text, border: `1.5px solid ${colors.border}` }}>
      <Award size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
      {tier}
    </span>
  );
}
