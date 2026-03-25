'use client';

import React, { useState } from 'react';
import { Bell, ChevronDown, Search } from 'lucide-react';
import { UserRole } from '@/types/commission';
import { brands, notifications } from '@/data/sample-data';

interface HeaderProps {
  currentRole: UserRole;
  activeView: string;
  selectedBrand: string;
  onBrandChange: (brandId: string) => void;
}

const viewTitles: Record<string, string> = {
  dashboard: 'Dashboard',
  deals: 'Deals',
  commissions: 'Commissions',
  leaderboard: 'Leaderboard',
  calculator: 'What-If Calculator',
  'my-plan': 'My Plan',
  handbook: 'Commission Handbook',
  disputes: 'My Disputes',
  'team-overview': 'Team Overview',
  performance: 'Team Performance',
  approvals: 'Approvals',
  'cost-analysis': 'Cost Analysis',
  'multi-brand': 'Multi-Brand Overview',
  'brand-comparison': 'Brand Comparison',
  modeling: 'Scenario Modeling',
  portfolio: 'Portfolio Analytics',
  'cost-trends': 'Cost Trends',
  'ma-readiness': 'M&A Readiness',
  'plan-management': 'Plan Management',
  acknowledgments: 'Acknowledgments',
  'disputes-admin': 'Disputes',
  exceptions: 'Exceptions',
  'spif-builder': 'SPIF Builder',
  'split-config': 'Split Deal Configuration',
  'brand-onboarding': 'Brand Onboarding',
  'handbook-editor': 'Handbook Editor',
  'audit-log': 'Audit Log',
  payroll: 'Payroll Status',
  accrual: 'Accrual Forecast',
  reconciliation: 'Reconciliation',
  'audit-trail': 'Audit Trail',
};

export default function Header({ currentRole, activeView, selectedBrand, onBrandChange }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const unreadCount = notifications.filter((n: any) => !n.read).length;
  const showBrandSelector = ['manager', 'rvp', 'csuite', 'hr_admin', 'finance'].includes(currentRole);

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-primary)' }}>
      <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        {viewTitles[activeView] || activeView}
      </h1>

      <div className="flex items-center gap-4">
        {showBrandSelector && (
          <div className="relative">
            <button onClick={() => setBrandOpen(!brandOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border"
              style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)', backgroundColor: 'var(--bg-card)' }}>
              {selectedBrand === 'all' ? 'All Brands' : brands.find(b => b.id === selectedBrand)?.name}
              <ChevronDown size={14} />
            </button>
            {brandOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border overflow-hidden z-50"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-lg)' }}>
                <button onClick={() => { onBrandChange('all'); setBrandOpen(false); }}
                  className="w-full text-left px-3 py-2 text-sm"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  All Brands
                </button>
                {brands.map(b => (
                  <button key={b.id} onClick={() => { onBrandChange(b.id); setBrandOpen(false); }}
                    className="w-full text-left px-3 py-2 text-sm"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notification Bell */}
        <div className="relative">
          <button onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: 'var(--accent-red)' }}>
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className="absolute right-0 top-full mt-1 w-80 rounded-lg border overflow-hidden z-50"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((n: any) => (
                  <div key={n.id} className="px-4 py-3 border-b"
                    style={{ borderColor: 'var(--border-primary)', backgroundColor: n.read ? 'transparent' : 'var(--accent-blue-light)' }}>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{n.body}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
