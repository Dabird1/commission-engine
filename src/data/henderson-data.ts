// @ts-nocheck
/* eslint-disable */
// ============================================================================
// HENDERSON ROOFING — REAL COMMISSION STRUCTURE
// Source: Henderson - Commission Structure.docx (actual brand document)
// ============================================================================

// Henderson's GP%-based commission tier table (from actual document)
// Commission is calculated on Contracted Sale (FCV), NOT on Gross Profit
export const hendersonTiers = [
  { minGP: 43, rate: 0.10, label: '43%+' },
  { minGP: 42, rate: 0.09, label: '42%' },
  { minGP: 41, rate: 0.09, label: '41%' },
  { minGP: 40, rate: 0.09, label: '40%' },
  { minGP: 39, rate: 0.08, label: '39%' },
  { minGP: 38, rate: 0.08, label: '38%' },
  { minGP: 37, rate: 0.08, label: '37%' },
  { minGP: 36, rate: 0.08, label: '36%' },
  { minGP: 35, rate: 0.08, label: '35%' },
  { minGP: 34, rate: 0.07, label: '34%' },
  { minGP: 33, rate: 0.07, label: '33%' },
  { minGP: 32, rate: 0.06, label: '32%' },
  { minGP: 31, rate: 0.06, label: '31%' },
  { minGP: 30, rate: 0.06, label: '30%' },
  { minGP: 29, rate: 0.05, label: '29%' },
  { minGP: 28, rate: 0.05, label: '28%' },
  { minGP: 27, rate: 0.05, label: '27%' },
  { minGP: 26, rate: 0.04, label: '26%' },
  { minGP: 25, rate: 0.04, label: '25%' },
  { minGP: 0,  rate: 0.00, label: '24% & under' },
];

// Deposit rate: always 4% of contracted sale, paid at signing
export const HENDERSON_DEPOSIT_RATE = 0.04;

// Look up commission rate from GP%
export function getHendersonRate(gpPercent: number): number {
  for (const tier of hendersonTiers) {
    if (gpPercent >= tier.minGP) return tier.rate;
  }
  return 0;
}

// Calculate commission for a single deal
export function calcDealCommission(fcv: number, gpPercent: number) {
  const rate = getHendersonRate(gpPercent);
  const totalEarned = Math.round(fcv * rate);
  const deposit = Math.round(fcv * HENDERSON_DEPOSIT_RATE);
  const finalAdj = totalEarned - deposit; // Can be negative if GP < 25%
  const grossProfit = Math.round(fcv * (gpPercent / 100));
  const netToCompany = grossProfit - totalEarned;

  return {
    rate,
    deposit,
    finalAdj,
    totalEarned,
    grossProfit,
    netToCompany,
  };
}

// ============================================================================
// HENDERSON PLAN (for commissionPlans array)
// ============================================================================
export const hendersonPlan = {
  id: 'plan-henderson',
  name: 'Henderson GP%-Based Tiered',
  brandId: 'brand-8',
  type: 'tiered_percentage',
  description: 'Commission based on Contracted Sale. 0-10% depending on Gross Profit % of Project. Deposit at 4%, final adjustment on job costing.',
  tiers: hendersonTiers,
  depositRate: HENDERSON_DEPOSIT_RATE,
  clawbackThreshold: 24, // GP% at or below this = deposit clawed back
  paymentStructure: 'deposit_plus_final',
  // Deposit = 4% of FCV paid at signing
  // Final = (earned rate × FCV) - deposit, paid on job costing completion
  // If GP ≤ 24%, deposit is deducted from monthly commission
};

// ============================================================================
// HENDERSON TEAM — 8 REPS (expanded from 6 to 8)
// ============================================================================
export const hendersonTeam = [
  {
    id: 'hr-1',
    name: 'Tom Henderson',
    email: 'tom.henderson@hendersonroofing.com',
    role: 'Senior Sales Rep',
    joinDate: '2017-09-01',
  },
  {
    id: 'hr-2',
    name: 'Katie Sousa',
    email: 'katie.sousa@hendersonroofing.com',
    role: 'Sales Rep',
    joinDate: '2021-02-18',
  },
  {
    id: 'hr-3',
    name: 'Derek Pina',
    email: 'derek.pina@hendersonroofing.com',
    role: 'Sales Rep',
    joinDate: '2022-05-10',
  },
  {
    id: 'hr-4',
    name: 'Jen Cabral',
    email: 'jen.cabral@hendersonroofing.com',
    role: 'Sales Rep',
    joinDate: '2023-04-15',
  },
  {
    id: 'hr-5',
    name: 'Steve Medeiros',
    email: 'steve.medeiros@hendersonroofing.com',
    role: 'Sales Rep',
    joinDate: '2024-02-01',
  },
  {
    id: 'hr-6',
    name: 'Lauren Silvia',
    email: 'lauren.silvia@hendersonroofing.com',
    role: 'Sales Rep',
    joinDate: '2024-08-15',
  },
  {
    id: 'hr-7',
    name: 'Matt Correia',
    email: 'matt.correia@hendersonroofing.com',
    role: 'Canvasser',
    joinDate: '2025-01-10',
  },
  {
    id: 'hr-8',
    name: 'Brianna Tavares',
    email: 'brianna.tavares@hendersonroofing.com',
    role: 'Trainee',
    joinDate: '2025-06-01',
  },
];

// ============================================================================
// HENDERSON DEALS — Realistic deal-level data for 8 reps
// Each deal has actual FCV and GP%, commission computed from real tier table
// Mix of project types, GP% ranges, and stages to create interesting P&L
// ============================================================================
export const hendersonDeals = [
  // --- Tom Henderson (top performer, 84 jobs YTD, avg ~38% GP) ---
  // Showing Q1 2026 deals for the demo (recent 3 months)
  { id: 'hd-1',  repId: 'hr-1', customer: 'Westerly Shores HOA',     type: 'roofing',  fcv: 48000, gpPercent: 43.2, stage: 'complete', date: '2026-01-08' },
  { id: 'hd-2',  repId: 'hr-1', customer: 'Frank & Diane Moretti',   type: 'roofing',  fcv: 22000, gpPercent: 40.1, stage: 'complete', date: '2026-01-22' },
  { id: 'hd-3',  repId: 'hr-1', customer: 'Charlestown Marina',      type: 'roofing',  fcv: 35000, gpPercent: 38.5, stage: 'complete', date: '2026-02-05' },
  { id: 'hd-4',  repId: 'hr-1', customer: 'Ed & Rita Soares',        type: 'siding',   fcv: 18000, gpPercent: 41.8, stage: 'complete', date: '2026-02-18' },
  { id: 'hd-5',  repId: 'hr-1', customer: 'Watch Hill Properties',   type: 'roofing',  fcv: 62000, gpPercent: 39.0, stage: 'in_progress', date: '2026-03-02' },
  { id: 'hd-6',  repId: 'hr-1', customer: 'Phil Gardiner',           type: 'windows',  fcv: 14000, gpPercent: 36.5, stage: 'in_progress', date: '2026-03-15' },

  // --- Katie Sousa (solid #2, consistent GP%) ---
  { id: 'hd-7',  repId: 'hr-2', customer: 'Narragansett Bay Condo',  type: 'roofing',  fcv: 38000, gpPercent: 37.4, stage: 'complete', date: '2026-01-12' },
  { id: 'hd-8',  repId: 'hr-2', customer: 'Joe & Maria DaCosta',     type: 'roofing',  fcv: 24000, gpPercent: 39.2, stage: 'complete', date: '2026-01-28' },
  { id: 'hd-9',  repId: 'hr-2', customer: 'Wickford Village LLC',    type: 'siding',   fcv: 16000, gpPercent: 35.8, stage: 'complete', date: '2026-02-10' },
  { id: 'hd-10', repId: 'hr-2', customer: 'Brenda Pacheco',          type: 'roofing',  fcv: 20000, gpPercent: 42.0, stage: 'complete', date: '2026-02-25' },
  { id: 'hd-11', repId: 'hr-2', customer: 'Newport Sailing Club',    type: 'roofing',  fcv: 45000, gpPercent: 36.1, stage: 'in_progress', date: '2026-03-08' },

  // --- Derek Pina (mid-pack, trending up) ---
  { id: 'hd-12', repId: 'hr-3', customer: 'Paul & Susan Ricci',      type: 'roofing',  fcv: 19000, gpPercent: 34.7, stage: 'complete', date: '2026-01-15' },
  { id: 'hd-13', repId: 'hr-3', customer: 'Misquamicut Beach Resort',type: 'roofing',  fcv: 42000, gpPercent: 33.1, stage: 'complete', date: '2026-02-01' },
  { id: 'hd-14', repId: 'hr-3', customer: 'Al Ferreira',             type: 'windows',  fcv: 11000, gpPercent: 36.9, stage: 'complete', date: '2026-02-20' },
  { id: 'hd-15', repId: 'hr-3', customer: 'Pawcatuck Builders',      type: 'siding',   fcv: 28000, gpPercent: 35.2, stage: 'in_progress', date: '2026-03-10' },

  // --- Jen Cabral (improving, higher volume lower GP) ---
  { id: 'hd-16', repId: 'hr-4', customer: 'Mike & Amy Silveira',     type: 'roofing',  fcv: 16000, gpPercent: 31.5, stage: 'complete', date: '2026-01-20' },
  { id: 'hd-17', repId: 'hr-4', customer: 'Stonington Borough Hall', type: 'roofing',  fcv: 34000, gpPercent: 30.8, stage: 'complete', date: '2026-02-08' },
  { id: 'hd-18', repId: 'hr-4', customer: 'Linda Raposa',            type: 'roofing',  fcv: 21000, gpPercent: 33.4, stage: 'complete', date: '2026-02-22' },
  { id: 'hd-19', repId: 'hr-4', customer: 'Cross Mills Fire Station',type: 'roofing',  fcv: 52000, gpPercent: 29.1, stage: 'in_progress', date: '2026-03-05' },

  // --- Steve Medeiros (newer rep, inconsistent GP) ---
  { id: 'hd-20', repId: 'hr-5', customer: 'Tony & Gina Baptista',    type: 'roofing',  fcv: 18000, gpPercent: 32.6, stage: 'complete', date: '2026-01-25' },
  { id: 'hd-21', repId: 'hr-5', customer: 'Hope Valley Farms',       type: 'siding',   fcv: 26000, gpPercent: 28.4, stage: 'complete', date: '2026-02-12' },
  { id: 'hd-22', repId: 'hr-5', customer: 'Dave Mello',              type: 'roofing',  fcv: 15000, gpPercent: 35.0, stage: 'complete', date: '2026-03-01' },

  // --- Lauren Silvia (newer, learning pricing) ---
  { id: 'hd-23', repId: 'hr-6', customer: 'Richmond Town Hall',      type: 'roofing',  fcv: 30000, gpPercent: 27.3, stage: 'complete', date: '2026-01-18' },
  { id: 'hd-24', repId: 'hr-6', customer: 'Chris & Beth Almeida',    type: 'roofing',  fcv: 20000, gpPercent: 31.2, stage: 'complete', date: '2026-02-15' },
  { id: 'hd-25', repId: 'hr-6', customer: 'Exeter Grange',           type: 'siding',   fcv: 14000, gpPercent: 34.1, stage: 'in_progress', date: '2026-03-12' },

  // --- Matt Correia (canvasser turning closer, low GP) ---
  { id: 'hd-26', repId: 'hr-7', customer: 'Bob & Nancy Viveiros',    type: 'roofing',  fcv: 17000, gpPercent: 26.4, stage: 'complete', date: '2026-02-05' },
  { id: 'hd-27', repId: 'hr-7', customer: 'Ashaway Fire District',   type: 'roofing',  fcv: 22000, gpPercent: 23.1, stage: 'complete', date: '2026-02-28' },  // CLAWBACK — below 24%
  { id: 'hd-28', repId: 'hr-7', customer: 'Sandra Gomes',            type: 'roofing',  fcv: 13000, gpPercent: 30.5, stage: 'in_progress', date: '2026-03-18' },

  // --- Brianna Tavares (trainee, small deals, learning) ---
  { id: 'hd-29', repId: 'hr-8', customer: 'Jim & Pat Souza',         type: 'roofing',  fcv: 12000, gpPercent: 28.7, stage: 'complete', date: '2026-02-10' },
  { id: 'hd-30', repId: 'hr-8', customer: 'Wakefield Apartments',    type: 'roofing',  fcv: 19000, gpPercent: 25.2, stage: 'complete', date: '2026-03-05' },
  { id: 'hd-31', repId: 'hr-8', customer: 'Mark Vieira',             type: 'windows',  fcv: 8000,  gpPercent: 22.0, stage: 'complete', date: '2026-03-20' },  // CLAWBACK
];

// ============================================================================
// COMPUTED HENDERSON P&L — derived from real deals × real tier table
// ============================================================================
export function computeHendersonPnL() {
  // Compute per-deal economics
  const dealEconomics = hendersonDeals.map(deal => {
    const comm = calcDealCommission(deal.fcv, deal.gpPercent);
    return {
      ...deal,
      ...comm,
      repName: hendersonTeam.find(r => r.id === deal.repId)?.name || deal.repId,
      isClawback: deal.gpPercent <= hendersonPlan.clawbackThreshold,
    };
  });

  // Aggregate by rep
  const repSummaries = hendersonTeam.map(rep => {
    const repDeals = dealEconomics.filter(d => d.repId === rep.id);
    const totalFCV = repDeals.reduce((s, d) => s + d.fcv, 0);
    const totalGP = repDeals.reduce((s, d) => s + d.grossProfit, 0);
    const totalCommission = repDeals.reduce((s, d) => s + d.totalEarned, 0);
    const totalDeposits = repDeals.reduce((s, d) => s + d.deposit, 0);
    const totalFinalAdj = repDeals.reduce((s, d) => s + d.finalAdj, 0);
    const netContribution = totalGP - totalCommission;
    const avgGP = repDeals.length > 0
      ? repDeals.reduce((s, d) => s + d.gpPercent, 0) / repDeals.length
      : 0;
    const clawbackDeals = repDeals.filter(d => d.isClawback);
    const clawbackAmount = clawbackDeals.reduce((s, d) => s + d.deposit, 0); // deposit gets clawed back
    const dealCount = repDeals.length;
    const avgRate = dealCount > 0
      ? repDeals.reduce((s, d) => s + d.rate, 0) / dealCount
      : 0;

    return {
      ...rep,
      deals: repDeals,
      dealCount,
      totalFCV,
      totalGP,
      totalCommission,
      totalDeposits,
      totalFinalAdj,
      netContribution,
      avgGP: Math.round(avgGP * 10) / 10,
      avgRate: Math.round(avgRate * 1000) / 1000,
      clawbackDeals: clawbackDeals.length,
      clawbackAmount,
    };
  }).sort((a, b) => b.netContribution - a.netContribution);

  // Team totals
  const teamTotalFCV = dealEconomics.reduce((s, d) => s + d.fcv, 0);
  const teamTotalGP = dealEconomics.reduce((s, d) => s + d.grossProfit, 0);
  const teamTotalCOGS = teamTotalFCV - teamTotalGP;
  const teamTotalCommission = dealEconomics.reduce((s, d) => s + d.totalEarned, 0);
  const teamNetContribution = teamTotalGP - teamTotalCommission;
  const teamAvgGP = dealEconomics.reduce((s, d) => s + d.gpPercent, 0) / dealEconomics.length;
  const teamAvgRate = dealEconomics.reduce((s, d) => s + d.rate, 0) / dealEconomics.length;
  const teamDealCount = dealEconomics.length;
  const teamClawbacks = dealEconomics.filter(d => d.isClawback);

  // The teaching moment: what happens when GP goes up
  // Show two scenarios using Henderson's actual tier table
  const avgDealFCV = Math.round(teamTotalFCV / teamDealCount);
  const currentGP = Math.round(teamAvgGP * 10) / 10;
  const targetGP = Math.min(currentGP + 3, 43); // target 3 points higher

  const currentScenario = calcDealCommission(avgDealFCV, currentGP);
  const targetScenario = calcDealCommission(avgDealFCV, targetGP);

  const teachingMoment = {
    avgDealFCV,
    currentGP,
    targetGP,
    current: currentScenario,
    target: targetScenario,
    repGain: targetScenario.totalEarned - currentScenario.totalEarned,
    companyGain: targetScenario.netToCompany - currentScenario.netToCompany,
    everyoneWins: targetScenario.netToCompany > currentScenario.netToCompany && targetScenario.totalEarned > currentScenario.totalEarned,
  };

  return {
    deals: dealEconomics,
    repSummaries,
    team: {
      totalFCV: teamTotalFCV,
      totalCOGS: teamTotalCOGS,
      totalGP: teamTotalGP,
      gpPercent: Math.round(teamAvgGP * 10) / 10,
      totalCommission: teamTotalCommission,
      netContribution: teamNetContribution,
      dealCount: teamDealCount,
      avgDealFCV,
      avgRate: Math.round(teamAvgRate * 1000) / 1000,
      commAsPercentRevenue: Math.round((teamTotalCommission / teamTotalFCV) * 1000) / 10,
      commAsPercentGP: Math.round((teamTotalCommission / teamTotalGP) * 1000) / 10,
      revenuePerRep: Math.round(teamTotalFCV / hendersonTeam.length),
      costPerJob: Math.round(teamTotalCommission / teamDealCount),
      returnOnCommission: Math.round((teamTotalGP / teamTotalCommission) * 100) / 100,
      clawbackCount: teamClawbacks.length,
      clawbackTotal: teamClawbacks.reduce((s, d) => s + d.deposit, 0),
    },
    teachingMoment,
    plan: hendersonPlan,
    tiers: hendersonTiers,
  };
}
