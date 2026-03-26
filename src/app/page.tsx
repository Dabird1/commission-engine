'use client';

import React, { useState, useEffect } from 'react';
import { UserRole } from '@/types/commission';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

// Rep views
import RepDashboard from '@/components/views/rep/RepDashboard';
import DealsPage from '@/components/views/rep/DealsPage';
import CommissionsPage from '@/components/views/rep/CommissionsPage';
import LeaderboardPage from '@/components/views/rep/LeaderboardPage';
import WhatIfCalculator from '@/components/views/rep/WhatIfCalculator';
import MyPlan from '@/components/views/rep/MyPlan';
import HandbookPage from '@/components/views/rep/HandbookPage';
import DisputeFlow from '@/components/views/rep/DisputeFlow';

// Manager views
import Scoreboard from '@/components/views/manager/Scoreboard';
import Coaching from '@/components/views/manager/Coaching';
import Approvals from '@/components/views/manager/Approvals';
import ThePnL from '@/components/views/manager/ThePnL';

// RVP views
import MultiBrandOverview from '@/components/views/rvp/MultiBrandOverview';
import BrandComparison from '@/components/views/rvp/BrandComparison';
import ScenarioModeling from '@/components/views/rvp/ScenarioModeling';

// C-Suite views
import PortfolioAnalytics from '@/components/views/csuite/PortfolioAnalytics';
import CostTrends from '@/components/views/csuite/CostTrends';
import MAReadiness from '@/components/views/csuite/MAReadiness';

// HR Admin views
import PlanManagement from '@/components/views/admin/PlanManagement';
import Acknowledgments from '@/components/views/admin/Acknowledgments';
import DisputesAdmin from '@/components/views/admin/DisputesAdmin';
import Exceptions from '@/components/views/admin/Exceptions';
import SpifBuilder from '@/components/views/admin/SpifBuilder';
import SplitDealConfig from '@/components/views/admin/SplitDealConfig';
import BrandOnboarding from '@/components/views/admin/BrandOnboarding';
import HandbookEditor from '@/components/views/admin/HandbookEditor';
import AuditLog from '@/components/views/admin/AuditLog';

// Finance views
import PayrollStatus from '@/components/views/finance/PayrollStatus';
import AccrualForecast from '@/components/views/finance/AccrualForecast';
import Reconciliation from '@/components/views/finance/Reconciliation';
import AuditTrail from '@/components/views/finance/AuditTrail';

// Production PM views
import PMDashboard from '@/components/views/production/PMDashboard';
import JobTracker from '@/components/views/production/JobTracker';
import VariablePay from '@/components/views/production/VariablePay';
import QualityMetrics from '@/components/views/production/QualityMetrics';
import PMLeaderboard from '@/components/views/production/PMLeaderboard';

// Shared
import ChatWithHR from '@/components/shared/ChatWithHR';
import AICopilot from '@/components/shared/AICopilot';

export default function Home() {
  const [currentRole, setCurrentRole] = useState<UserRole>('rep');
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [isDark, setIsDark] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const renderView = () => {
    switch (activeView) {
      // Rep
      case 'dashboard': return <RepDashboard />;
      case 'deals': return <DealsPage />;
      case 'commissions': return <CommissionsPage />;
      case 'leaderboard': return <LeaderboardPage />;
      case 'calculator': return <WhatIfCalculator />;
      case 'my-plan': return <MyPlan />;
      case 'handbook': return <HandbookPage />;
      case 'disputes': return <DisputeFlow />;
      // Manager
      case 'scoreboard': return <Scoreboard selectedBrand={selectedBrand} />;
      case 'coaching': return <Coaching selectedBrand={selectedBrand} />;
      case 'approvals': return <Approvals selectedBrand={selectedBrand} />;
      case 'the-pnl': return <ThePnL selectedBrand={selectedBrand} />;
      // RVP
      case 'multi-brand': return <MultiBrandOverview selectedBrand={selectedBrand} />;
      case 'brand-comparison': return <BrandComparison />;
      case 'modeling': return <ScenarioModeling />;
      // C-Suite
      case 'portfolio': return <PortfolioAnalytics />;
      case 'cost-trends': return <CostTrends />;
      case 'ma-readiness': return <MAReadiness />;
      // HR Admin
      case 'plan-management': return <PlanManagement />;
      case 'acknowledgments': return <Acknowledgments />;
      case 'disputes-admin': return <DisputesAdmin />;
      case 'exceptions': return <Exceptions />;
      case 'spif-builder': return <SpifBuilder />;
      case 'split-config': return <SplitDealConfig />;
      case 'brand-onboarding': return <BrandOnboarding />;
      case 'handbook-editor': return <HandbookEditor />;
      case 'audit-log': return <AuditLog />;
      // Finance
      case 'payroll': return <PayrollStatus />;
      case 'accrual': return <AccrualForecast />;
      case 'reconciliation': return <Reconciliation />;
      case 'audit-trail': return <AuditTrail />;
      // Production PM
      case 'pm-dashboard': return <PMDashboard />;
      case 'job-tracker': return <JobTracker />;
      case 'variable-pay': return <VariablePay />;
      case 'quality-metrics': return <QualityMetrics />;
      case 'pm-leaderboard': return <PMLeaderboard />;
      default: return <RepDashboard />;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <Sidebar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeView={activeView}
        onViewChange={setActiveView}
        isDark={isDark}
        onThemeToggle={() => setIsDark(!isDark)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="ml-0 lg:ml-[260px] min-h-screen flex flex-col">
        <Header
          currentRole={currentRole}
          activeView={activeView}
          selectedBrand={selectedBrand}
          onBrandChange={setSelectedBrand}
          isDark={isDark}
          onThemeToggle={() => setIsDark(!isDark)}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          {renderView()}
        </main>
      </div>
      {currentRole === 'rep' && <ChatWithHR />}
      <AICopilot activeView={activeView} currentRole={currentRole} />
    </div>
  );
}
