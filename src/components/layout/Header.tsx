'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, Search, X, Settings, Moon, Sun, Mail, Smartphone, BarChart3, Eye, RefreshCw, Database, Shield, FileText, DollarSign, Users, Building, Menu } from 'lucide-react';
import { UserRole } from '@/types/commission';
import { brands, notifications } from '@/data/sample-data';

interface HeaderProps {
  currentRole: UserRole;
  activeView: string;
  selectedBrand: string;
  onBrandChange: (brandId: string) => void;
  isDark?: boolean;
  onThemeToggle?: () => void;
  onMenuToggle?: () => void;
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
  scoreboard: 'Scoreboard',
  coaching: 'Coaching',
  approvals: 'Approvals',
  'the-pnl': 'The P&L',
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

// Group brands by region for the dropdown
const regionOrder = ['Midwest', 'Northeast', 'Mid-Atlantic', 'Pacific NW', 'Southeast & Canada'];
const brandsByRegion = regionOrder.map(region => ({
  region,
  brands: brands.filter((b: any) => b.region === region),
})).filter(g => g.brands.length > 0);

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

export default function Header({ currentRole, activeView, selectedBrand, onBrandChange, isDark, onThemeToggle, onMenuToggle }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [brandOpen, setBrandOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  // Settings state (prototype — in-memory only)
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [defaultPeriod, setDefaultPeriod] = useState('ytd');
  const [showCents, setShowCents] = useState(false);

  const brandRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const settingsRef = useRef<HTMLDivElement>(null);

  useClickOutside(brandRef, () => { setBrandOpen(false); setBrandSearch(''); });
  useClickOutside(notifRef, () => setNotifOpen(false));
  useClickOutside(settingsRef, () => setSettingsOpen(false));

  // Role-aware notifications
  const roleNotifications: Record<string, Array<{ id: string; title: string; body: string; read: boolean }>> = {
    rep: [
      { id: 'r1', title: 'Front-End Commission Paid', body: 'You received $630 from Jim Cardo Roofing', read: false },
      { id: 'r2', title: 'Tier Progress', body: "You're 0.7% GP from Platinum tier (9% rate)", read: false },
      { id: 'r3', title: 'SPIF Progress', body: "You've earned $1,000 on March Roofing Blitz (4 jobs)", read: true },
      { id: 'r4', title: 'Payout Scheduled', body: '$4,200 commission payout scheduled for March 31', read: true },
    ],
    manager: [
      { id: 'm1', title: 'Approval Required', body: 'Exception request: Sarah Palmer — deal exceeds 2x avg FCV', read: false },
      { id: 'm2', title: 'Clawback Alert', body: 'Jim Cardo GP at 22% on Roofing deal — clawback triggered', read: false },
      { id: 'm3', title: 'Coaching Note Synced', body: 'Your note for Aaron Bagurdes was pushed to Rilla', read: true },
      { id: 'm4', title: 'Team Scoreboard', body: 'Henderson Roofing hit $114K YTD — 3rd in Northeast', read: true },
    ],
    rvp: [
      { id: 'v1', title: 'Brand Watch Alert', body: 'Cochran Exteriors cost/rep up 44% — now $26K avg', read: false },
      { id: 'v2', title: 'Region Summary', body: 'Mid-Atlantic region: 3 brands, 46 reps, $1.26M commission', read: false },
      { id: 'v3', title: 'Scenario Saved', body: '"Add 5 reps to Midwest" scenario saved for review', read: true },
    ],
    csuite: [
      { id: 'c1', title: 'Portfolio Alert', body: '12 brands under $200K YTD — monitor list growing', read: false },
      { id: 'c2', title: 'Cost Trend', body: 'Portfolio commission cost up 23.3% over 12 months', read: false },
      { id: 'c3', title: 'M&A Estimate Ready', body: 'TechPro Systems integration cost estimate: $200K/mo', read: true },
    ],
    hr_admin: [
      { id: 'h1', title: 'Acknowledgments Overdue', body: '2 reps overdue on plan sign-off (Jennifer Lee: 5 days)', read: false },
      { id: 'h2', title: 'Dispute Filed', body: 'Sarah Johnson — GP% mismatch on Acme Corp contract', read: false },
      { id: 'h3', title: 'SPIF Ending Soon', body: 'Q1 Enterprise Push ends in 4 days — $187K budget', read: false },
      { id: 'h4', title: 'Handbook Published', body: 'v5 published — 32 of 37 reps acknowledged', read: true },
    ],
    finance: [
      { id: 'f1', title: 'Reconciliation Variance', body: 'Jan 1-15 period: $175 variance detected — needs review', read: false },
      { id: 'f2', title: 'Payroll Ready', body: '4 brands ready to push — $47.3K total', read: false },
      { id: 'f3', title: 'Acumatica Pending', body: 'ERP integration awaiting setup — sync not started', read: false },
      { id: 'f4', title: 'Accrual Forecast', body: 'Next period projected: $52.4K at 80% close rate', read: true },
    ],
  };
  const activeNotifications = roleNotifications[currentRole] || roleNotifications.rep;
  const unreadCount = activeNotifications.filter((n) => !n.read).length;
  const showBrandSelector = ['manager', 'rvp', 'csuite', 'hr_admin', 'finance'].includes(currentRole);

  const filteredBrands = brandSearch.trim()
    ? brands.filter((b: any) => b.name.toLowerCase().includes(brandSearch.toLowerCase()) || b.location?.toLowerCase().includes(brandSearch.toLowerCase()))
    : null;

  return (
    <header
      className="h-14 flex items-center justify-between px-3 sm:px-6 border-b"
      style={{ backgroundColor: 'var(--bg-primary)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger menu — mobile only */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg transition-colors flex-shrink-0"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Menu size={20} strokeWidth={1.8} />
        </button>
        <h1 className="text-sm sm:text-base font-bold tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
          {viewTitles[activeView] || activeView}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Brand Selector */}
        {showBrandSelector && (
          <div className="relative" ref={brandRef}>
            <button
              onClick={() => { setBrandOpen(!brandOpen); setBrandSearch(''); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors"
              style={{
                borderColor: brandOpen ? 'var(--accent-blue)' : 'var(--border-primary)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-card)',
              }}
            >
              <span className="max-w-[100px] sm:max-w-[180px] truncate">
                {selectedBrand === 'all' ? 'All Brands' : brands.find((b: any) => b.id === selectedBrand)?.name}
              </span>
              <ChevronDown size={14} className={`transition-transform ${brandOpen ? 'rotate-180' : ''}`} />
            </button>

            {brandOpen && (
              <div
                className="absolute right-0 top-full mt-1 w-[calc(100vw-2rem)] sm:w-64 max-w-64 rounded-xl border overflow-hidden z-50"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  boxShadow: 'var(--shadow-dropdown)',
                }}
              >
                {/* Search */}
                <div className="px-3 pt-3 pb-2">
                  <div
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                    style={{ backgroundColor: 'var(--bg-secondary)' }}
                  >
                    <Search size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                    <input
                      type="text"
                      placeholder="Search brands..."
                      value={brandSearch}
                      onChange={e => setBrandSearch(e.target.value)}
                      autoFocus
                      className="bg-transparent border-0 outline-none text-xs w-full"
                      style={{ color: 'var(--text-primary)' }}
                    />
                    {brandSearch && (
                      <button onClick={() => setBrandSearch('')}>
                        <X size={12} style={{ color: 'var(--text-tertiary)' }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Brand List */}
                <div className="max-h-72 overflow-y-auto overscroll-contain pb-1" style={{ scrollbarWidth: 'thin' }}>
                  {/* All Brands option */}
                  <button
                    onClick={() => { onBrandChange('all'); setBrandOpen(false); setBrandSearch(''); }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold transition-colors"
                    style={{
                      color: selectedBrand === 'all' ? 'var(--accent-blue)' : 'var(--text-primary)',
                      backgroundColor: selectedBrand === 'all' ? 'var(--bg-secondary)' : 'transparent',
                    }}
                    onMouseEnter={e => { if (selectedBrand !== 'all') e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}
                    onMouseLeave={e => { if (selectedBrand !== 'all') e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    All Brands ({brands.length})
                  </button>

                  <div className="my-1" style={{ height: 1, backgroundColor: 'var(--border-primary)' }} />

                  {filteredBrands ? (
                    // Search results (flat list)
                    filteredBrands.length > 0 ? (
                      filteredBrands.map((b: any) => (
                        <button
                          key={b.id}
                          onClick={() => { onBrandChange(b.id); setBrandOpen(false); setBrandSearch(''); }}
                          className="w-full text-left px-3 py-1.5 transition-colors"
                          style={{
                            color: selectedBrand === b.id ? 'var(--accent-blue)' : 'var(--text-primary)',
                            backgroundColor: selectedBrand === b.id ? 'var(--bg-secondary)' : 'transparent',
                          }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                          onMouseLeave={e => { if (selectedBrand !== b.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                        >
                          <span className="text-xs font-medium">{b.name}</span>
                          <span className="text-xs ml-1" style={{ color: 'var(--text-tertiary)' }}>{b.location}</span>
                        </button>
                      ))
                    ) : (
                      <p className="px-3 py-4 text-xs text-center" style={{ color: 'var(--text-tertiary)' }}>No brands found</p>
                    )
                  ) : (
                    // Grouped by region
                    brandsByRegion.map(group => (
                      <div key={group.region}>
                        <p
                          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                          style={{ color: 'var(--text-tertiary)' }}
                        >
                          {group.region}
                        </p>
                        {group.brands.map((b: any) => (
                          <button
                            key={b.id}
                            onClick={() => { onBrandChange(b.id); setBrandOpen(false); setBrandSearch(''); }}
                            className="w-full text-left px-3 py-1.5 transition-colors"
                            style={{
                              color: selectedBrand === b.id ? 'var(--accent-blue)' : 'var(--text-primary)',
                              backgroundColor: selectedBrand === b.id ? 'var(--bg-secondary)' : 'transparent',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'}
                            onMouseLeave={e => { if (selectedBrand !== b.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                          >
                            <span className="text-xs font-medium">{b.name}</span>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Settings */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => { setSettingsOpen(!settingsOpen); setNotifOpen(false); }}
            className="relative p-2.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-primary)', backgroundColor: settingsOpen ? 'var(--bg-hover)' : 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
            onMouseLeave={e => { if (!settingsOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
            title="Settings"
          >
            <Settings size={20} strokeWidth={1.8} />
          </button>

          {settingsOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-[calc(100vw-2rem)] sm:w-80 max-w-80 rounded-xl border overflow-hidden z-50"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-dropdown)',
              }}
            >
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-primary)' }}>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Settings</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
                  {currentRole === 'rep' ? 'Sales Rep' : currentRole === 'manager' ? 'Manager' : currentRole === 'rvp' ? 'Regional VP' : currentRole === 'csuite' ? 'C-Suite' : currentRole === 'hr_admin' ? 'HR / Comp Admin' : 'Finance'}
                </span>
              </div>

              <div className="max-h-[400px] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                {/* Theme — universal */}
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Appearance</p>
                  <button
                    onClick={() => onThemeToggle?.()}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors"
                    style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                  >
                    <div className="flex items-center gap-2">
                      {isDark ? <Sun size={14} /> : <Moon size={14} />}
                      <span className="text-xs font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </div>
                    <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>{isDark ? 'Dark' : 'Light'}</span>
                  </button>
                </div>

                {/* Notifications — universal but role-labeled */}
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Notifications</p>
                  <div className="space-y-2">
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Mail size={13} style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Email alerts</span>
                      </div>
                      <div onClick={() => setEmailNotifs(!emailNotifs)} className="w-8 h-[18px] rounded-full relative cursor-pointer transition-colors" style={{ backgroundColor: emailNotifs ? 'var(--accent-blue)' : 'var(--bg-active)' }}>
                        <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-all" style={{ left: emailNotifs ? '16px' : '2px' }} />
                      </div>
                    </label>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Smartphone size={13} style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Push notifications</span>
                      </div>
                      <div onClick={() => setPushNotifs(!pushNotifs)} className="w-8 h-[18px] rounded-full relative cursor-pointer transition-colors" style={{ backgroundColor: pushNotifs ? 'var(--accent-blue)' : 'var(--bg-active)' }}>
                        <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-all" style={{ left: pushNotifs ? '16px' : '2px' }} />
                      </div>
                    </label>
                  </div>
                </div>

                {/* Display — universal */}
                <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Display</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart3 size={13} style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Default period</span>
                      </div>
                      <div className="flex gap-0.5 rounded-md p-0.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                        {['mtd', 'qtd', 'ytd'].map(p => (
                          <button key={p} onClick={() => setDefaultPeriod(p)} className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: defaultPeriod === p ? 'var(--bg-card)' : 'transparent', color: defaultPeriod === p ? 'var(--text-primary)' : 'var(--text-tertiary)', boxShadow: defaultPeriod === p ? 'var(--shadow-sm)' : 'none' }}>
                            {p.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                    <label className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Eye size={13} style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Show cents</span>
                      </div>
                      <div onClick={() => setShowCents(!showCents)} className="w-8 h-[18px] rounded-full relative cursor-pointer transition-colors" style={{ backgroundColor: showCents ? 'var(--accent-blue)' : 'var(--bg-active)' }}>
                        <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px] transition-all" style={{ left: showCents ? '16px' : '2px' }} />
                      </div>
                    </label>
                  </div>
                </div>

                {/* ROLE-SPECIFIC SETTINGS */}
                {currentRole === 'rep' && (
                  <div className="px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>My Preferences</p>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <DollarSign size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Show pipeline estimates</span>
                        </div>
                        <div className="w-8 h-[18px] rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--accent-blue)' }}>
                          <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px]" style={{ left: '16px' }} />
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Show leaderboard rank</span>
                        </div>
                        <div className="w-8 h-[18px] rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--accent-blue)' }}>
                          <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px]" style={{ left: '16px' }} />
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {currentRole === 'manager' && (
                  <div className="px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Team Management</p>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Users size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Auto-flag low GP% deals</span>
                        </div>
                        <div className="w-8 h-[18px] rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--accent-blue)' }}>
                          <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px]" style={{ left: '16px' }} />
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Shield size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Clawback alerts threshold</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>24% GP</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Rilla coaching sync</span>
                        </div>
                        <div className="w-8 h-[18px] rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--accent-blue)' }}>
                          <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px]" style={{ left: '16px' }} />
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {currentRole === 'rvp' && (
                  <div className="px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Portfolio Settings</p>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Building size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Brand watch threshold</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>&lt;$200K</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Default view: card vs list</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>Cards</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Users size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Show cost/rep on cards</span>
                        </div>
                        <div className="w-8 h-[18px] rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--accent-blue)' }}>
                          <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px]" style={{ left: '16px' }} />
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {currentRole === 'csuite' && (
                  <div className="px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Executive View</p>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <DollarSign size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Commission % of revenue alert</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>&gt;8%</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <BarChart3 size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Cost trend lookback</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>12 mo</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Building size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>M&A default plan model</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>GP% Tiered</span>
                      </label>
                    </div>
                  </div>
                )}

                {currentRole === 'hr_admin' && (
                  <div className="px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Administration</p>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <FileText size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Require e-signature on plans</span>
                        </div>
                        <div className="w-8 h-[18px] rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--accent-blue)' }}>
                          <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px]" style={{ left: '16px' }} />
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Shield size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Auto-remind overdue acks</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>3 days</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Users size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Dispute auto-escalation</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>5 days</span>
                      </label>
                    </div>
                  </div>
                )}

                {currentRole === 'finance' && (
                  <div className="px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Finance & Sync</p>
                    <div className="space-y-2">
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Database size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>ERP sync frequency</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>2x daily</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <RefreshCw size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Payroll auto-push</span>
                        </div>
                        <div className="w-8 h-[18px] rounded-full relative cursor-pointer" style={{ backgroundColor: 'var(--bg-active)' }}>
                          <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-[2px]" style={{ left: '2px' }} />
                        </div>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Shield size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Variance alert threshold</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>$100</span>
                      </label>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <DollarSign size={13} style={{ color: 'var(--text-secondary)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>Accrual close rate default</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>80%</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 rounded-lg transition-colors"
            style={{ color: 'var(--text-primary)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Bell size={20} strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span
                className="absolute top-0.5 right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: 'var(--accent-red)', boxShadow: '0 0 0 2px var(--bg-primary)' }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-[calc(100vw-2rem)] sm:w-80 max-w-80 rounded-xl border overflow-hidden z-50"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-primary)',
                boxShadow: 'var(--shadow-dropdown)',
              }}
            >
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-primary)' }}>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Notifications</span>
                {unreadCount > 0 && (
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--accent-red)', color: '#fff' }}
                  >
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto overscroll-contain" style={{ scrollbarWidth: 'thin' }}>
                {activeNotifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-4 py-3 border-b transition-colors cursor-pointer"
                    style={{
                      borderColor: 'var(--border-primary)',
                      backgroundColor: n.read ? 'transparent' : 'rgba(59,130,246,0.04)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = n.read ? 'transparent' : 'rgba(59,130,246,0.04)')}
                  >
                    <div className="flex items-start gap-2">
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: 'var(--accent-blue)' }} />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{n.title}</div>
                        <div className="text-sm mt-0.5 line-clamp-2" style={{ color: 'var(--text-tertiary)' }}>{n.body}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t text-center" style={{ borderColor: 'var(--border-primary)' }}>
                <button className="text-xs font-semibold" style={{ color: 'var(--accent-blue)' }}>View all notifications</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
