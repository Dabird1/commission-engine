'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard, FileText, DollarSign, Trophy, BookOpen, Calculator,
  Users, TrendingUp, CheckSquare, PieChart, Building2, GitCompare,
  Brain, BarChart3, Settings, Shield, Clock, Search, FileCheck,
  Wallet, LineChart, RefreshCw, ClipboardList, Award, MessageSquare,
  Zap, UserPlus, Sun, Moon, ChevronDown, Home
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
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'deals', label: 'Deals', icon: <FileText size={18} /> },
    { id: 'commissions', label: 'Commissions', icon: <DollarSign size={18} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    { id: 'calculator', label: 'What-If Calculator', icon: <Calculator size={18} /> },
    { id: 'my-plan', label: 'My Plan', icon: <BookOpen size={18} /> },
    { id: 'handbook', label: 'Handbook', icon: <FileCheck size={18} /> },
    { id: 'disputes', label: 'My Disputes', icon: <MessageSquare size={18} /> },
  ],
  manager: [
    { id: 'team-overview', label: 'Team Overview', icon: <Users size={18} /> },
    { id: 'performance', label: 'Performance', icon: <TrendingUp size={18} /> },
    { id: 'approvals', label: 'Approvals', icon: <CheckSquare size={18} /> },
    { id: 'cost-analysis', label: 'Cost Analysis', icon: <PieChart size={18} /> },
  ],
  rvp: [
    { id: 'multi-brand', label: 'Multi-Brand Overview', icon: <Building2 size={18} /> },
    { id: 'brand-comparison', label: 'Brand Comparison', icon: <GitCompare size={18} /> },
    { id: 'modeling', label: 'Scenario Modeling', icon: <Brain size={18} /> },
  ],
  csuite: [
    { id: 'portfolio', label: 'Portfolio Analytics', icon: <BarChart3 size={18} /> },
    { id: 'cost-trends', label: 'Cost Trends', icon: <LineChart size={18} /> },
    { id: 'ma-readiness', label: 'M&A Readiness', icon: <Zap size={18} /> },
  ],
  hr_admin: [
    { id: 'plan-management', label: 'Plan Management', icon: <Settings size={18} /> },
    { id: 'acknowledgments', label: 'Acknowledgments', icon: <FileCheck size={18} /> },
    { id: 'disputes-admin', label: 'Disputes', icon: <MessageSquare size={18} /> },
    { id: 'exceptions', label: 'Exceptions', icon: <Shield size={18} /> },
    { id: 'spif-builder', label: 'SPIF Builder', icon: <Award size={18} /> },
    { id: 'split-config', label: 'Split Deals', icon: <GitCompare size={18} /> },
    { id: 'brand-onboarding', label: 'Brand Onboarding', icon: <UserPlus size={18} /> },
    { id: 'handbook-editor', label: 'Handbook Editor', icon: <BookOpen size={18} /> },
    { id: 'audit-log', label: 'Audit Log', icon: <ClipboardList size={18} /> },
  ],
  finance: [
    { id: 'payroll', label: 'Payroll Status', icon: <Wallet size={18} /> },
    { id: 'accrual', label: 'Accrual Forecast', icon: <LineChart size={18} /> },
    { id: 'reconciliation', label: 'Reconciliation', icon: <RefreshCw size={18} /> },
    { id: 'audit-trail', label: 'Audit Trail', icon: <ClipboardList size={18} /> },
  ],
};

const roleLabels: Record<UserRole, string> = {
  rep: 'Sales Rep',
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
}

export default function Sidebar({ currentRole, onRoleChange, activeView, onViewChange, isDark, onThemeToggle }: SidebarProps) {
  const [roleOpen, setRoleOpen] = useState(false);
  const navItems = roleNavItems[currentRole];

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[260px] flex flex-col border-r"
      style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-primary)' }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
            IHS
          </div>
          <div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>INFINITY</div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Commission Engine</div>
          </div>
        </div>
      </div>

      {/* Role Switcher */}
      <div className="px-3 py-3">
        <div className="relative">
          <button
            onClick={() => setRoleOpen(!roleOpen)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
            <span>{roleLabels[currentRole]}</span>
            <ChevronDown size={14} className={cn("transition-transform", roleOpen && "rotate-180")} />
          </button>
          {roleOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border overflow-hidden z-50"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-lg)' }}>
              {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                <button key={role}
                  onClick={() => { onRoleChange(role); setRoleOpen(false); onViewChange(roleNavItems[role][0].id); }}
                  className={cn("w-full text-left px-3 py-2 text-sm", role === currentRole && "font-semibold")}
                  style={{
                    color: role === currentRole ? 'var(--accent-blue)' : 'var(--text-primary)',
                    backgroundColor: role === currentRole ? 'var(--accent-blue-light)' : 'transparent',
                  }}
                  onMouseEnter={(e) => { if (role !== currentRole) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
                  onMouseLeave={(e) => { if (role !== currentRole) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                  {roleLabels[role]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-1 overflow-y-auto">
        <div className="space-y-0.5">
          {navItems.map((item) => (
            <button key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn("w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors")}
              style={{
                color: activeView === item.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                backgroundColor: activeView === item.id ? 'var(--accent-blue-light)' : 'transparent',
                fontWeight: activeView === item.id ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (activeView !== item.id) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
              onMouseLeave={(e) => { if (activeView !== item.id) e.currentTarget.style.backgroundColor = activeView === item.id ? 'var(--accent-blue-light)' : 'transparent'; }}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom: Theme + User */}
      <div className="px-3 py-3 border-t space-y-2" style={{ borderColor: 'var(--border-primary)' }}>
        <button onClick={onThemeToggle}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm"
          style={{ color: 'var(--text-secondary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
            AB
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Aaron Bagurdes</div>
            <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Apex Roofing</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
