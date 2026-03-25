'use client';

import React, { useEffect, useState } from 'react';

interface ProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export default function ProgressRing({ percentage, size = 120, strokeWidth = 8, color, label, sublabel }: ProgressRingProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedPercent / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPercent(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth}
          fill="none" stroke="var(--border-primary)" />
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth}
          fill="none" stroke={color || 'var(--accent-blue)'}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{label}</div>}
        {sublabel && <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{sublabel}</div>}
      </div>
    </div>
  );
}
