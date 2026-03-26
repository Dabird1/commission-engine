// @ts-nocheck
/* eslint-disable */

import { computeHendersonPnL, hendersonTiers } from './henderson-data';

// ============================================================================
// BRAND DIRECTORY
// ============================================================================
const BRAND_DIRECTORY: Record<string, { name: string; repCount: number }> = {
  'brand-1': { name: 'Infinity Exteriors', repCount: 18 },
  'brand-2': { name: 'Overhead Solutions', repCount: 8 },
  'brand-3': { name: 'Cochran Exteriors', repCount: 12 },
  'brand-4': { name: 'Exterior Heroes', repCount: 7 },
  'brand-5': { name: 'Parkhill Roofing', repCount: 6 },
  'brand-6': { name: 'Werner Roofing', repCount: 9 },
  'brand-7': { name: 'Premier Roofing', repCount: 10 },
  'brand-8': { name: 'Henderson Roofing', repCount: 8 },
  'brand-9': { name: 'GF Sprague', repCount: 11 },
  'brand-10': { name: 'Resnick Roofing', repCount: 8 },
  'brand-11': { name: 'High Point Roofing', repCount: 7 },
  'brand-12': { name: 'Couto Construction', repCount: 9 },
  'brand-13': { name: 'G. Fedale', repCount: 14 },
  'brand-14': { name: 'Franzoso', repCount: 8 },
  'brand-15': { name: 'American Home Contractors', repCount: 22 },
  'brand-16': { name: 'Exterior Medics', repCount: 10 },
  'brand-17': { name: 'Valentine Roofing', repCount: 15 },
  'brand-18': { name: 'Interstate Roofing', repCount: 12 },
  'brand-19': { name: 'Specialty Exteriors', repCount: 6 },
  'brand-20': { name: 'Skywalker Roofing', repCount: 14 },
  'brand-21': { name: 'Altec Roofing', repCount: 11 },
  'brand-22': { name: "Carpenter's", repCount: 8 },
  'brand-23': { name: 'Watkins Construction', repCount: 7 },
  'brand-24': { name: "D'Angelo & Sons", repCount: 10 },
  'brand-25': { name: 'Wheatland Roofing', repCount: 5 },
};

// ============================================================================
// SEEDED PSEUDO-RANDOM GENERATOR (for stable synthetic data)
// ============================================================================
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  pickOne<T>(arr: T[]): T {
    return arr[this.nextInt(0, arr.length - 1)];
  }
}

// ============================================================================
// SYNTHETIC DATA GENERATORS
// ============================================================================
const FIRST_NAMES = [
  'Tom', 'Katie', 'Derek', 'Jen', 'Steve', 'Lauren', 'Matt', 'Brianna',
  'John', 'Sarah', 'Mike', 'Amanda', 'Chris', 'Jessica', 'David', 'Emily',
  'Mark', 'Lisa', 'Robert', 'Karen', 'James', 'Mary', 'Michael', 'Jennifer',
  'Richard', 'Patricia', 'Joseph', 'Linda', 'Charles', 'Barbara',
];

const LAST_NAMES = [
  'Henderson', 'Sousa', 'Pina', 'Cabral', 'Medeiros', 'Silvia', 'Correia', 'Tavares',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
];

const CUSTOMER_FIRST = [
  'Frank', 'Diane', 'Joe', 'Maria', 'Paul', 'Susan', 'Mike', 'Amy', 'Tony', 'Gina',
  'Dave', 'Linda', 'Ed', 'Rita', 'Bob', 'Nancy', 'Jim', 'Pat', 'Chris', 'Beth',
  'Al', 'Phil', 'John', 'Mary', 'Richard', 'Patricia', 'James', 'Jennifer', 'Robert', 'Lisa',
];

const CUSTOMER_LAST = [
  'Moretti', 'Soares', 'DaCosta', 'Pacheco', 'Viveiros', 'Baptista', 'Mello', 'Gomes', 'Souza', 'Vieira',
  'Ricci', 'Almeida', 'Raposa', 'Silveira', 'Ferreira', 'Gardiner',
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
];

const CUSTOMER_COMPANY = [
  'Westerly Shores HOA', 'Narragansett Bay Condo', 'Wickford Village LLC', 'Newport Sailing Club',
  'Misquamicut Beach Resort', 'Pawcatuck Builders', 'Watch Hill Properties', 'Charlestown Marina',
  'Stonington Borough Hall', 'Cross Mills Fire Station', 'Hope Valley Farms', 'Ashaway Fire District',
  'Richmond Town Hall', 'Exeter Grange', 'Wakefield Apartments',
  'Main Street Plaza', 'Downtown Office Complex', 'Harbor View Properties', 'Coastal Estates',
  'Industrial Park Complex', 'Commercial Center', 'Shopping District', 'Riverside Development',
];

const ROLES = ['Senior Sales Rep', 'Sales Rep', 'Canvasser', 'Trainee'];

// ============================================================================
// TIER TABLE & COMMISSION CALCULATION
// ============================================================================
function getTierRate(gpPercent: number): number {
  for (const tier of hendersonTiers) {
    if (gpPercent >= tier.minGP) return tier.rate;
  }
  return 0;
}

function calcDealCommission(fcv: number, gpPercent: number) {
  const rate = getTierRate(gpPercent);
  const deposit = Math.round(fcv * 0.04); // 4% deposit
  const totalEarned = Math.round(fcv * rate);
  const finalAdj = totalEarned - deposit;
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
// GENERATE SYNTHETIC REP TEAM FOR A BRAND
// ============================================================================
function generateSyntheticTeam(brandId: string, repCount: number) {
  const rng = new SeededRandom(parseInt(brandId.replace('brand-', ''), 10) * 1000);
  const team = [];

  for (let i = 0; i < repCount; i++) {
    const firstName = rng.pickOne(FIRST_NAMES);
    const lastName = rng.pickOne(LAST_NAMES);
    const role = rng.pickOne(ROLES);
    const brandNum = brandId.replace('brand-', '');

    team.push({
      id: `${brandId}-rep-${i + 1}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getBrandName(brandId).toLowerCase().replace(/\s+/g, '')}.com`,
      role,
      joinDate: `202${rng.nextInt(3, 5)}-${String(rng.nextInt(1, 12)).padStart(2, '0')}-${String(rng.nextInt(1, 28)).padStart(2, '0')}`,
    });
  }

  return team;
}

// ============================================================================
// GENERATE SYNTHETIC DEALS FOR A BRAND
// ============================================================================
function generateSyntheticDeals(brandId: string, team: any[]) {
  const rng = new SeededRandom(parseInt(brandId.replace('brand-', ''), 10) * 5000);
  const deals = [];
  let dealId = 1;

  // Determine brand performance level (affects GP%)
  const brandNum = parseInt(brandId.replace('brand-', ''), 10);
  let gpBase: number;
  let gpStdDev: number;

  if (brandNum % 5 === 0) {
    // High performers (20%, 10%, 5%, 25%, 20%, 15%)
    gpBase = 37;
    gpStdDev = 3;
  } else if (brandNum % 3 === 0) {
    // Mid performers (33%, 12%, 9%, 24%, 21%, 18%)
    gpBase = 33;
    gpStdDev = 4;
  } else {
    // Average performers (40%, 7%, 4%, 13%, 4%, 10%)
    gpBase = 31;
    gpStdDev = 3.5;
  }

  // 3-6 deals per rep for Q1 2026
  for (const rep of team) {
    const dealCount = rng.nextInt(3, 6);

    for (let d = 0; d < dealCount; d++) {
      const month = rng.nextInt(1, 3); // Jan, Feb, Mar
      const day = rng.nextInt(1, 28);
      const date = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Determine FCV and GP% based on project type
      const projectType = rng.pickOne(['roofing', 'siding', 'windows', 'gutters']);
      let fcv: number;
      let gpPercent: number;

      if (projectType === 'roofing') {
        fcv = rng.nextInt(8000, 65000);
      } else if (projectType === 'siding') {
        fcv = rng.nextInt(10000, 40000);
      } else if (projectType === 'windows') {
        fcv = rng.nextInt(5000, 25000);
      } else {
        // gutters
        fcv = rng.nextInt(3000, 12000);
      }

      // GP% with some variance, but include clawbacks
      const variance = (rng.next() - 0.5) * gpStdDev * 2;
      gpPercent = gpBase + variance;

      // Include some clawback deals (low GP)
      if (rng.next() < 0.15) {
        // 15% chance of clawback deal
        gpPercent = rng.nextFloat(18, 24);
      } else {
        gpPercent = Math.max(gpPercent, 24);
        gpPercent = Math.min(gpPercent, 45);
      }

      // Random customer name
      const useCompany = rng.next() < 0.4;
      let customer: string;
      if (useCompany) {
        customer = rng.pickOne(CUSTOMER_COMPANY);
      } else {
        const first = rng.pickOne(CUSTOMER_FIRST);
        const last = rng.pickOne(CUSTOMER_LAST);
        customer = `${first} & ? ${last}`;
        // Replace ? with another name
        const otherFirst = rng.pickOne(CUSTOMER_FIRST.filter(n => n !== first));
        customer = customer.replace('?', otherFirst);
      }

      const stage = rng.next() < 0.65 ? 'complete' : 'in_progress';

      deals.push({
        id: `${brandId}-deal-${dealId}`,
        repId: rep.id,
        customer,
        type: projectType,
        fcv,
        gpPercent: Math.round(gpPercent * 10) / 10,
        stage,
        date,
      });

      dealId++;
    }
  }

  return deals;
}

// ============================================================================
// COMPUTE BRAND P&L (MAIN FUNCTION)
// ============================================================================
export function computeBrandPnL(brandId: string) {
  // Delegate to Henderson for brand-8
  if (brandId === 'brand-8') {
    return computeHendersonPnL();
  }

  const brandInfo = BRAND_DIRECTORY[brandId];
  if (!brandInfo) {
    throw new Error(`Unknown brand: ${brandId}`);
  }

  const team = generateSyntheticTeam(brandId, brandInfo.repCount);
  const syntheticDeals = generateSyntheticDeals(brandId, team);

  // Compute per-deal economics
  const dealEconomics = syntheticDeals.map(deal => {
    const comm = calcDealCommission(deal.fcv, deal.gpPercent);
    return {
      ...deal,
      ...comm,
      repName: team.find(r => r.id === deal.repId)?.name || deal.repId,
      isClawback: deal.gpPercent <= 24,
    };
  });

  // Aggregate by rep
  const repSummaries = team
    .map(rep => {
      const repDeals = dealEconomics.filter(d => d.repId === rep.id);
      const totalFCV = repDeals.reduce((s, d) => s + d.fcv, 0);
      const totalGP = repDeals.reduce((s, d) => s + d.grossProfit, 0);
      const totalCommission = repDeals.reduce((s, d) => s + d.totalEarned, 0);
      const totalDeposits = repDeals.reduce((s, d) => s + d.deposit, 0);
      const totalFinalAdj = repDeals.reduce((s, d) => s + d.finalAdj, 0);
      const netContribution = totalGP - totalCommission;
      const avgGP = repDeals.length > 0 ? repDeals.reduce((s, d) => s + d.gpPercent, 0) / repDeals.length : 0;
      const clawbackDeals = repDeals.filter(d => d.isClawback);
      const clawbackAmount = clawbackDeals.reduce((s, d) => s + d.deposit, 0);
      const dealCount = repDeals.length;
      const avgRate = dealCount > 0 ? repDeals.reduce((s, d) => s + d.rate, 0) / dealCount : 0;

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
    })
    .sort((a, b) => b.netContribution - a.netContribution);

  // Team totals
  const teamTotalFCV = dealEconomics.reduce((s, d) => s + d.fcv, 0);
  const teamTotalGP = dealEconomics.reduce((s, d) => s + d.grossProfit, 0);
  const teamTotalCOGS = teamTotalFCV - teamTotalGP;
  const teamTotalCommission = dealEconomics.reduce((s, d) => s + d.totalEarned, 0);
  const teamNetContribution = teamTotalGP - teamTotalCommission;
  const teamAvgGP = dealEconomics.length > 0 ? dealEconomics.reduce((s, d) => s + d.gpPercent, 0) / dealEconomics.length : 0;
  const teamAvgRate = dealEconomics.length > 0 ? dealEconomics.reduce((s, d) => s + d.rate, 0) / dealEconomics.length : 0;
  const teamDealCount = dealEconomics.length;
  const teamClawbacks = dealEconomics.filter(d => d.isClawback);

  // Teaching moment
  const avgDealFCV = teamDealCount > 0 ? Math.round(teamTotalFCV / teamDealCount) : 0;
  const currentGP = Math.round(teamAvgGP * 10) / 10;
  const targetGP = Math.min(currentGP + 3, 43);

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

  // Generic commission plan for synthetic brands
  const brandPlan = {
    id: `plan-${brandId}`,
    name: `${brandInfo.name} GP%-Based Tiered`,
    brandId,
    type: 'tiered_percentage',
    description: 'Commission based on Contracted Sale. 0-10% depending on Gross Profit % of Project. Deposit at 4%, final adjustment on job costing.',
    tiers: hendersonTiers,
    depositRate: 0.04,
    clawbackThreshold: 24,
    paymentStructure: 'deposit_plus_final',
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
      commAsPercentRevenue: teamTotalFCV > 0 ? Math.round((teamTotalCommission / teamTotalFCV) * 1000) / 10 : 0,
      commAsPercentGP: teamTotalGP > 0 ? Math.round((teamTotalCommission / teamTotalGP) * 1000) / 10 : 0,
      revenuePerRep: team.length > 0 ? Math.round(teamTotalFCV / team.length) : 0,
      costPerJob: teamDealCount > 0 ? Math.round(teamTotalCommission / teamDealCount) : 0,
      returnOnCommission: teamTotalCommission > 0 ? Math.round((teamTotalGP / teamTotalCommission) * 100) / 100 : 0,
      clawbackCount: teamClawbacks.length,
      clawbackTotal: teamClawbacks.reduce((s, d) => s + d.deposit, 0),
    },
    teachingMoment,
    plan: brandPlan,
    tiers: hendersonTiers,
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getBrandName(brandId: string): string {
  const info = BRAND_DIRECTORY[brandId];
  if (!info) {
    throw new Error(`Unknown brand: ${brandId}`);
  }
  return info.name;
}

export function getAllBrandIds(): string[] {
  return Object.keys(BRAND_DIRECTORY);
}
