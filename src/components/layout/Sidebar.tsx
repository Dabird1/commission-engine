'use client';

import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, FileText, DollarSign, Trophy, BookOpen, Calculator,
  Users, TrendingUp, CheckSquare, PieChart, Building2, GitCompare,
  Brain, BarChart3, Settings, Shield, Clock, Search, FileCheck,
  Wallet, LineChart, RefreshCw, ClipboardList, Award, MessageSquare,
  Zap, UserPlus, Sun, Moon, ChevronDown, Home, X, HardHat, Hammer,
  Star, Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/commission';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const roleNavItems: Record<UserRole, NavItem[]> = {
  rep: [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} strokeWidth={1.8} /> },
    { id: 'deals', label: 'Deals', icon: <FileText size={16} strokeWidth={1.8} /> },
    { id: 'commissions', label: 'Commissions', icon: <DollarSign size={16} strokeWidth={1.8} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={16} strokeWidth={1.8} /> },
    { id: 'calculator', label: 'What-If Calculator', icon: <Calculator size={16} strokeWidth={1.8} /> },
    { id: 'my-plan', label: 'My Plan', icon: <BookOpen size={16} strokeWidth={1.8} /> },
    { id: 'handbook', label: 'Handbook', icon: <FileCheck size={16} strokeWidth={1.8} /> },
    { id: 'disputes', label: 'My Disputes', icon: <MessageSquare size={16} strokeWidth={1.8} /> },
  ],
  manager: [
    { id: 'scoreboard', label: 'Scoreboard', icon: <LayoutDashboard size={16} strokeWidth={1.8} /> },
    { id: 'coaching', label: 'Coaching', icon: <Users size={16} strokeWidth={1.8} /> },
    { id: 'approvals', label: 'Approvals', icon: <CheckSquare size={16} strokeWidth={1.8} /> },
    { id: 'the-pnl', label: 'The P&L', icon: <BarChart3 size={16} strokeWidth={1.8} /> },
  ],
  rvp: [
    { id: 'multi-brand', label: 'Multi-Brand Overview', icon: <Building2 size={16} strokeWidth={1.8} /> },
    { id: 'brand-comparison', label: 'Brand Comparison', icon: <GitCompare size={16} strokeWidth={1.8} /> },
    { id: 'modeling', label: 'Scenario Modeling', icon: <Brain size={16} strokeWidth={1.8} /> },
  ],
  csuite: [
    { id: 'portfolio', label: 'Portfolio Analytics', icon: <BarChart3 size={16} strokeWidth={1.8} /> },
    { id: 'cost-trends', label: 'Cost Trends', icon: <LineChart size={16} strokeWidth={1.8} /> },
    { id: 'ma-readiness', label: 'M&A Readiness', icon: <Zap size={16} strokeWidth={1.8} /> },
  ],
  hr_admin: [
    { id: 'plan-management', label: 'Plan Management', icon: <Settings size={16} strokeWidth={1.8} /> },
    { id: 'acknowledgments', label: 'Acknowledgments', icon: <FileCheck size={16} strokeWidth={1.8} /> },
    { id: 'disputes-admin', label: 'Disputes', icon: <MessageSquare size={16} strokeWidth={1.8} /> },
    { id: 'exceptions', label: 'Exceptions', icon: <Shield size={16} strokeWidth={1.8} /> },
    { id: 'spif-builder', label: 'SPIF Builder', icon: <Award size={16} strokeWidth={1.8} /> },
    { id: 'split-config', label: 'Split Deals', icon: <GitCompare size={16} strokeWidth={1.8} /> },
    { id: 'brand-onboarding', label: 'Brand Onboarding', icon: <UserPlus size={16} strokeWidth={1.8} /> },
    { id: 'handbook-editor', label: 'Handbook Editor', icon: <BookOpen size={16} strokeWidth={1.8} /> },
    { id: 'audit-log', label: 'Audit Log', icon: <ClipboardList size={16} strokeWidth={1.8} /> },
  ],
  finance: [
    { id: 'payroll', label: 'Payroll Status', icon: <Wallet size={16} strokeWidth={1.8} /> },
    { id: 'accrual', label: 'Accrual Forecast', icon: <LineChart size={16} strokeWidth={1.8} /> },
    { id: 'reconciliation', label: 'Reconciliation', icon: <RefreshCw size={16} strokeWidth={1.8} /> },
    { id: 'audit-trail', label: 'Audit Trail', icon: <ClipboardList size={16} strokeWidth={1.8} /> },
  ],
  production_pm: [
    { id: 'pm-dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} strokeWidth={1.8} /> },
    { id: 'job-tracker', label: 'Job Tracker', icon: <Hammer size={16} strokeWidth={1.8} /> },
    { id: 'variable-pay', label: 'Variable Pay', icon: <DollarSign size={16} strokeWidth={1.8} /> },
    { id: 'quality-metrics', label: 'Quality & Efficiency', icon: <Star size={16} strokeWidth={1.8} /> },
    { id: 'pm-leaderboard', label: 'Leaderboard', icon: <Trophy size={16} strokeWidth={1.8} /> },
  ],
};

const roleLabels: Record<UserRole, string> = {
  rep: 'Sales Rep',
  production_pm: 'Production PM',
  manager: 'Manager',
  rvp: 'Regional VP',
  csuite: 'C-Suite',
  hr_admin: 'HR / Comp Admin',
  finance: 'Finance',
};

interface SidebarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: string;
  onViewChange: (view: string) => void;
  isDark: boolean;
  onThemeToggle: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ currentRole, onRoleChange, activeView, onViewChange, isDark, onThemeToggle, isOpen, onClose }: SidebarProps) {
  const [roleOpen, setRoleOpen] = useState(false);
  const navItems = roleNavItems[currentRole];

  // Close sidebar on navigation (mobile)
  const handleViewChange = (view: string) => {
    onViewChange(view);
    onClose();
  };

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 w-[260px] flex flex-col z-50 transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: 'var(--sidebar-bg)' }}
      >
      {/* Logo */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-[10px] tracking-widest"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)', color: 'white', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
          >
            IHS
          </div>
          <div className="flex-1">
            <div className="text-[13px] font-bold tracking-[0.08em] text-white">INFINITY</div>
            <div className="text-[10px] font-medium text-slate-500">Commission Engine</div>
          </div>
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="px-3 pb-3">
        <div className="relative">
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-semibold transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <span>{roleLabels[currentRole]}</span>
            <ChevronDown
              size={13}
              className={cn("transition-transform", roleOpen && "rotate-180")}
              style={{ color: 'rgba(255,255,255,0.4)' }}
            />
          </button>
          {roleOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1.5 rounded-xl overflow-hidden z-50 animate-slide-down"
              style={{ backgroundColor: '#1e4276', border: '1px solid rgba(255,255,255,0.12)', boxShadow: 'var(--shadow-dropdown)' }}
            >
              {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => { onRoleChange(role); setRoleOpen(false); handleViewChange(roleNavItems[role][0].id); }}
                  className="w-full text-left px-4 py-2.5 text-[13px] transition-colors"
                  style={{
                    color: role === currentRole ? '#3b82f6' : 'rgba(255,255,255,0.7)',
                    backgroundColor: role === currentRole ? 'rgba(59,130,246,0.1)' : 'transparent',
                    fontWeight: role === currentRole ? 600 : 400,
                  }}
                  onMouseEnter={(e) => { if (role !== currentRole) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={(e) => { if (role !== currentRole) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {roleLabels[role]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 mb-2" style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.06)' }} />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <div className="space-y-0.5">
          {navItems.map((item, idx) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all relative animate-fade-up stagger-${idx + 1}`}
                style={{
                  color: isActive ? '#ffffff' : 'var(--sidebar-text)',
                  backgroundColor: isActive ? 'var(--sidebar-active)' : 'transparent',
                  fontWeight: isActive ? 600 : 400,
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = isActive ? 'var(--sidebar-active)' : 'transparent'; }}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full"
                    style={{ backgroundColor: 'var(--sidebar-indicator)' }}
                  />
                )}
                <span style={{ color: isActive ? '#3b82f6' : 'var(--sidebar-text)' }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* IHS Purpose Strip */}
      <div className="mx-3 mb-2 px-3.5 py-2.5 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-blue-400/50 mb-0.5">Our Purpose</p>
        <p className="text-[10.5px] font-medium text-slate-400 leading-snug italic">
          &ldquo;Saving our communities from unscrupulous contractors&rdquo;
        </p>
      </div>

      {/* Bottom: Theme + User */}
      <div className="px-3 py-3 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button
          onClick={onThemeToggle}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] transition-all"
          style={{ color: 'var(--sidebar-text)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {isDark ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className="flex items-center gap-3 px-3 py-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 0 0 2px rgba(59,130,246,0.3)' }}
          >
            AB
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white/90">Aaron Bagurdes</div>
            <div className="text-[10px] text-slate-500">Infinity Exteriors</div>
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
