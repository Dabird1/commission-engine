export type UserRole = 'rep' | 'manager' | 'rvp' | 'csuite' | 'hr_admin' | 'finance';

export type DealStage = 'sold' | 'in_progress' | 'complete' | 'paid' | 'cancelled';
export type PlanModel = 'gp_tiered' | 'draw_against' | 'salary_bonus' | 'per_job' | 'revenue_share';
export type TierLevel = 'bronze' | 'silver' | 'gold';
export type SplitType = 'canvasser_closer' | 'training' | 'co_sell' | 'referral' | 'manager_override' | 'reassigned';
export type AdjustmentReason = 'change_order' | 'cost_variance' | 'gp_revision' | 'insurance_supplement';
export type ExceptionStatus = 'pending' | 'approved' | 'denied' | 'escalated';
export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'escalated';
export type SpifStatus = 'active' | 'expired' | 'draft';

export interface CommissionTier {
  min: number;
  max: number;
  rate: number;
  metric: string;
}

export interface CommissionPlan {
  id: string;
  brandId: string;
  name: string;
  type: 'sales' | 'production';
  model: PlanModel;
  description: string;
  tiers?: CommissionTier[];
  drawAmount?: number;
  baseSalary?: number;
  baseRate?: number;
  bonuses?: Record<string, number>;
  frontEndSplit: number;
  backEndSplit: number;
  backEndTrigger: string;
  status: 'active' | 'draft' | 'archived';
  version: number;
  createdAt: string;
  updatedAt: string;
  acknowledgedBy: string[];
}

export interface SplitParticipant {
  repId: string;
  repName: string;
  role: string;
  splitPercent: number;
  amount: number;
}

export interface SplitDealInfo {
  type: SplitType;
  participants: SplitParticipant[];
  approvedBy?: string;
  approvedAt?: string;
}

export interface RetroactiveAdjustment {
  id: string;
  dealId: string;
  reason: AdjustmentReason;
  originalFcv: number;
  newFcv: number;
  originalGpPercent: number;
  newGpPercent: number;
  originalCommission: number;
  newCommission: number;
  delta: number;
  status: 'auto_applied' | 'pending_approval' | 'approved' | 'denied';
  createdAt: string;
  approvedBy?: string;
}

export interface Deal {
  id: string;
  customerId: string;
  customerName: string;
  projectType: string;
  stage: DealStage;
  fcv: number;
  gpPercent: number;
  commissionRate: number;
  totalCommission: number;
  frontEnd: number;
  backEnd: number;
  backEndStatus: 'pending' | 'earned' | 'paid';
  repId: string;
  brandId: string;
  createdAt: string;
  closeDate: string;
  completionDate?: string;
  splitDeal?: SplitDealInfo;
  adjustments?: RetroactiveAdjustment[];
}

export interface SpifProgram {
  id: string;
  name: string;
  description: string;
  brandId: string;
  eligibility: string;
  triggerCriteria: string;
  payoutAmount: string;
  startDate: string;
  endDate: string;
  status: SpifStatus;
  qualifiedReps?: string[];
}

export interface PlanVersion {
  id: string;
  planId: string;
  version: number;
  effectiveDate: string;
  endDate?: string;
  changes: string;
  createdBy: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'milestone' | 'streak' | 'performance';
  progress?: number;
}

export interface Rep {
  id: string;
  name: string;
  brandId: string;
  role: 'sales' | 'production' | 'manager';
  planId: string;
  avatar?: string;
  tier: TierLevel;
  ytdEarnings: number;
  quota: number;
  quotaProgress: number;
  achievements: Achievement[];
}

export interface Brand {
  id: string;
  name: string;
  market: string;
  region: string;
  repCount: number;
  planCount: number;
  rvpId: string;
}

export interface Exception {
  id: string;
  type: 'high_commission' | 'negative_gp' | 'clawback' | 'rep_termination';
  jobId: string;
  amount: number;
  reason: string;
  status: ExceptionStatus;
  createdAt: string;
  reviewedBy?: string;
  resolvedAt?: string;
  notes: string[];
}

export interface AuditEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  brandId: string;
  brandName: string;
  timestamp: string;
  details?: string;
}

export interface LeaderboardEntry {
  id: string;
  repId: string;
  repName: string;
  brandName: string;
  rank: number;
  prevRank: number;
  deals: number;
  avgGP: number;
}

export interface PlanAcknowledgment {
  id: string;
  planId: string;
  repId: string;
  acknowledgedAt: string;
  planVersion: number;
}

export interface DisputeMessage {
  id: string;
  author: string;
  authorRole: string;
  content: string;
  timestamp: string;
}

export interface Dispute {
  id: string;
  dealId: string;
  repId: string;
  repName: string;
  reason: string;
  status: DisputeStatus;
  messages: DisputeMessage[];
  createdAt: string;
  resolvedAt?: string;
}

export interface Notification {
  id: string;
  type: 'payout' | 'plan_change' | 'achievement' | 'dispute' | 'system';
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface HandbookSection {
  id: string;
  title: string;
  content: string;
  order: number;
  lastUpdated: string;
  updatedBy: string;
}

export interface WhatIfResult {
  dealSize: number;
  gpPercent: number;
  projectType: string;
  commission: number;
  tierImpact: string;
  monthlyProjectionChange: number;
  frontEnd: number;
  backEnd: number;
  nudge?: string;
}

export interface BrandAnalytics {
  brandId: string;
  brandName: string;
  totalEarned: number;
  avgRate: number;
  avgGP: number;
  repCount: number;
  costPerRep: number;
}

export interface MonthlyTrend {
  month: string;
  earnings: number;
  deals: number;
  avgGP: number;
  commissionCost: number;
}
