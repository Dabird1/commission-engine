// @ts-nocheck
/* eslint-disable */
// Sample data for prototype — types are intentionally loose for rapid development

// ============================================================================
// BRANDS
// ============================================================================
export const brands: any[] = [
  { id: 'brand-1', name: 'Infinity Exteriors', location: 'New Berlin, WI', region: 'Midwest', repCount: 18, color: '#2563eb', rating: 4.8 },
  { id: 'brand-2', name: 'Overhead Solutions', location: 'Suamico, WI', region: 'Midwest', repCount: 8, color: '#059669', rating: 5.0 },
  { id: 'brand-3', name: 'Cochran Exteriors', location: 'Indianapolis, IN', region: 'Midwest', repCount: 12, color: '#dc2626', rating: 4.6 },
  { id: 'brand-4', name: 'Exterior Heroes', location: 'Euclid, OH', region: 'Midwest', repCount: 7, color: '#f59e0b', rating: 4.9 },
  { id: 'brand-5', name: 'Parkhill Roofing', location: 'Columbus, OH', region: 'Midwest', repCount: 6, color: '#7c3aed', rating: 4.9 },
  { id: 'brand-6', name: 'Werner Roofing', location: 'Grand Haven, MI', region: 'Midwest', repCount: 9, color: '#0891b2', rating: 4.9 },
  { id: 'brand-7', name: 'Premier Roofing', location: 'Grandville, MI', region: 'Midwest', repCount: 10, color: '#be185d', rating: 4.9 },
  { id: 'brand-8', name: 'Henderson Roofing', location: 'Westerly, RI', region: 'Northeast', repCount: 8, color: '#4f46e5', rating: 4.9 },
  { id: 'brand-9', name: 'GF Sprague', location: 'Needham, MA', region: 'Northeast', repCount: 11, color: '#0d9488', rating: 4.7 },
  { id: 'brand-10', name: 'Resnick Roofing', location: 'Gibsonia, PA', region: 'Northeast', repCount: 8, color: '#ca8a04', rating: 4.9 },
  { id: 'brand-11', name: 'High Point Roofing', location: 'Pilesgrove, NJ', region: 'Northeast', repCount: 7, color: '#e11d48', rating: 4.9 },
  { id: 'brand-12', name: 'Couto Construction', location: 'New Bedford, MA', region: 'Northeast', repCount: 9, color: '#7c3aed', rating: 4.8 },
  { id: 'brand-13', name: 'G. Fedale', location: 'Wilmington, DE', region: 'Northeast', repCount: 14, color: '#2563eb', rating: 4.8 },
  { id: 'brand-14', name: 'Franzoso', location: 'Croton-on-Hudson, NY', region: 'Northeast', repCount: 8, color: '#059669', rating: 4.8 },
  { id: 'brand-15', name: 'American Home Contractors', location: 'Fulton, MD', region: 'Mid-Atlantic', repCount: 22, color: '#f97316', rating: 4.9 },
  { id: 'brand-16', name: 'Exterior Medics', location: 'Springfield, VA', region: 'Mid-Atlantic', repCount: 10, color: '#6366f1', rating: 4.7 },
  { id: 'brand-17', name: 'Valentine Roofing', location: 'Tukwila, WA', region: 'Pacific NW', repCount: 15, color: '#dc2626', rating: 4.8 },
  { id: 'brand-18', name: 'Interstate Roofing', location: 'Portland, OR', region: 'Pacific NW', repCount: 12, color: '#0891b2', rating: 4.8 },
  { id: 'brand-19', name: 'Specialty Exteriors', location: 'Spokane, WA', region: 'Pacific NW', repCount: 6, color: '#84cc16', rating: 4.7 },
  { id: 'brand-20', name: 'Skywalker Roofing', location: 'Stokesdale, NC', region: 'Mid-Atlantic', repCount: 14, color: '#f59e0b', rating: 4.8 },
  { id: 'brand-21', name: 'Altec Roofing', location: 'Palm Beach, FL', region: 'Southeast & Canada', repCount: 11, color: '#be185d', rating: 4.9 },
  { id: 'brand-22', name: "Carpenter's", location: 'Riviera Beach, FL', region: 'Southeast & Canada', repCount: 8, color: '#4f46e5', rating: 5.0 },
  { id: 'brand-23', name: 'Watkins Construction', location: 'Ridgeland, MS', region: 'Southeast & Canada', repCount: 7, color: '#0d9488', rating: 4.9 },
  { id: 'brand-24', name: "D'Angelo & Sons", location: 'Ontario, Canada', region: 'Southeast & Canada', repCount: 10, color: '#e11d48', rating: 4.6 },
  { id: 'brand-25', name: 'Wheatland Roofing', location: 'Regina, SK', region: 'Southeast & Canada', repCount: 5, color: '#ca8a04', rating: 4.8 },
];

// ============================================================================
// COMMISSION PLANS
// ============================================================================
export const commissionPlans: CommissionPlan[] = [
  {
    id: 'plan-1',
    name: 'Infinity GP%-Based Tiered',
    brandId: 'brand-1',
    type: 'tiered_percentage',
    description: 'Gross Profit percentage-based tiered commission with 50/50 split',
    tiers: [
      { threshold: 0, rate: 0.04, label: '<25% GP' },
      { threshold: 25, rate: 0.05, label: '25-30% GP' },
      { threshold: 30, rate: 0.07, label: '30-35% GP' },
      { threshold: 35, rate: 0.08, label: '35-40% GP' },
      { threshold: 40, rate: 0.09, label: '40-45% GP' },
      { threshold: 45, rate: 0.1, label: '45%+ GP' },
    ],
    frontEndSplit: 0.5,
    backEndSplit: 0.5,
    paymentTrigger: 'final_payment',
  },
  {
    id: 'plan-2',
    name: 'Summit Draw Against Commission',
    brandId: 'brand-2',
    type: 'draw_against_commission',
    description: 'Monthly draw against earned commission',
    monthlyDraw: 2000,
    baseCommissionRate: 0.08,
    frontEndSplit: 0.6,
    backEndSplit: 0.4,
    paymentTrigger: 'job_complete',
  },
  {
    id: 'plan-3',
    name: 'Shield Salary Plus Bonus',
    brandId: 'brand-3',
    type: 'salary_plus_bonus',
    description: 'Base salary with gross profit bonus',
    baseSalary: 45000,
    bonusThreshold: 0.3,
    bonusRate: 0.12,
    frontEndSplit: 1.0,
    backEndSplit: 0.0,
  },
  {
    id: 'plan-4',
    name: 'Peak Per-Job Flat Bonus',
    brandId: 'brand-4',
    type: 'per_job_bonus',
    description: 'Hourly base plus per-job type bonuses',
    baseHourlyRate: 22,
    jobBonuses: {
      roofing: 150,
      windows: 100,
      siding: 120,
      gutters: 75,
      trim: 50,
    },
  },
  {
    id: 'plan-5',
    name: 'Crown Revenue Share',
    brandId: 'brand-5',
    type: 'revenue_share',
    description: 'Flat percentage of total revenue',
    revenueShareRate: 0.06,
    frontEndSplit: 0.5,
    backEndSplit: 0.5,
    paymentTrigger: 'final_payment',
  },
];

// ============================================================================
// SAMPLE DEALS
// ============================================================================
export const sampleDeals: Deal[] = [
  // Jim Cardo
  {
    id: 'deal-1',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Jim Cardo',
    projectType: 'roofing',
    fcv: 14000,
    gpPercent: 44.6,
    stage: 'sold',
    commissionRate: 0.09,
    totalCommission: 1260,
    frontEnd: 630,
    backEnd: 630,
    paidFront: 630,
    paidBack: 0,
    earnedBack: 630,
    soldDate: '2025-08-15',
    closeDate: null,
    payDate: null,
    adjustments: [
      {
        id: 'adj-1',
        dealId: 'deal-1',
        type: 'change_order',
        description: 'Change order - reduced scope',
        originalFcv: 14000,
        newFcv: 12000,
        commissionAdjustment: -180,
        appliedAt: '2025-09-01',
      },
    ],
  },
  {
    id: 'deal-2',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Jim Cardo',
    projectType: 'gutters',
    fcv: 3000,
    gpPercent: 38.0,
    stage: 'in_progress',
    commissionRate: 0.08,
    totalCommission: 240,
    frontEnd: 120,
    backEnd: 120,
    paidFront: 120,
    paidBack: 0,
    earnedBack: 0,
    soldDate: '2025-09-20',
    closeDate: null,
    payDate: null,
  },
  // Jeremy & Kara Reynolds
  {
    id: 'deal-3',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Jeremy & Kara Reynolds',
    projectType: 'windows',
    fcv: 12000,
    gpPercent: 42.0,
    stage: 'sold',
    commissionRate: 0.09,
    totalCommission: 1080,
    frontEnd: 540,
    backEnd: 540,
    paidFront: 540,
    paidBack: 0,
    earnedBack: 540,
    soldDate: '2025-10-05',
    closeDate: null,
    payDate: null,
  },
  // Eric & Candice Lee
  {
    id: 'deal-4',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Eric & Candice Lee',
    projectType: 'windows',
    fcv: 17000,
    gpPercent: 36.0,
    stage: 'in_progress',
    commissionRate: 0.08,
    totalCommission: 1360,
    frontEnd: 680,
    backEnd: 680,
    paidFront: 680,
    paidBack: 0,
    earnedBack: 0,
    soldDate: '2025-07-10',
    closeDate: null,
    payDate: null,
  },
  {
    id: 'deal-5',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Eric & Candice Lee',
    projectType: 'roofing',
    fcv: 26000,
    gpPercent: 41.0,
    stage: 'complete',
    commissionRate: 0.09,
    totalCommission: 2340,
    frontEnd: 1170,
    backEnd: 1170,
    paidFront: 1170,
    paidBack: 1170,
    earnedBack: 1170,
    soldDate: '2025-06-18',
    closeDate: '2025-11-20',
    payDate: '2025-12-01',
  },
  // Bill Peters - SPLIT DEAL: canvasser/closer (Aaron 70% / Jake Torres 30%)
  {
    id: 'deal-6',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Bill Peters',
    projectType: 'roofing',
    fcv: 82000,
    gpPercent: 45.2,
    stage: 'in_progress',
    commissionRate: 0.1,
    totalCommission: 8200,
    frontEnd: 4100,
    backEnd: 4100,
    paidFront: 2870, // 70% of 4100
    paidBack: 0,
    earnedBack: 4100, // Still earning back
    soldDate: '2025-05-22',
    closeDate: null,
    payDate: null,
    splitType: 'canvasser_closer',
    splitPercentage: 0.7,
    splitPartner: 'rep-8',
    splitPartnerName: 'Jake Torres',
  },
  // Tim Lipke
  {
    id: 'deal-7',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Tim Lipke',
    projectType: 'roofing',
    fcv: 20000,
    gpPercent: 38.5,
    stage: 'complete',
    commissionRate: 0.08,
    totalCommission: 1600,
    frontEnd: 800,
    backEnd: 800,
    paidFront: 800,
    paidBack: 800,
    earnedBack: 800,
    soldDate: '2025-08-10',
    closeDate: '2025-11-15',
    payDate: '2025-12-01',
    adjustments: [
      {
        id: 'adj-2',
        dealId: 'deal-7',
        type: 'insurance_supplement',
        description: 'Insurance supplement - additional coverage',
        originalFcv: 20000,
        newFcv: 22000,
        commissionAdjustment: 180,
        appliedAt: '2025-11-20',
      },
    ],
  },
  {
    id: 'deal-8',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Tim Lipke',
    projectType: 'gutters',
    fcv: 3000,
    gpPercent: 35.0,
    stage: 'paid',
    commissionRate: 0.08,
    totalCommission: 240,
    frontEnd: 120,
    backEnd: 120,
    paidFront: 120,
    paidBack: 120,
    earnedBack: 120,
    soldDate: '2025-09-05',
    closeDate: '2025-11-30',
    payDate: '2025-12-15',
  },
  // Donald & Christine Smith
  {
    id: 'deal-9',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Donald & Christine Smith',
    projectType: 'siding',
    fcv: 17000,
    gpPercent: 33.0,
    stage: 'sold',
    commissionRate: 0.07,
    totalCommission: 1190,
    frontEnd: 595,
    backEnd: 595,
    paidFront: 595,
    paidBack: 0,
    earnedBack: 595,
    soldDate: '2025-10-12',
    closeDate: null,
    payDate: null,
  },
  {
    id: 'deal-10',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Donald & Christine Smith',
    projectType: 'windows',
    fcv: 9000,
    gpPercent: 40.0,
    stage: 'in_progress',
    commissionRate: 0.09,
    totalCommission: 810,
    frontEnd: 405,
    backEnd: 405,
    paidFront: 405,
    paidBack: 0,
    earnedBack: 0,
    soldDate: '2025-11-01',
    closeDate: null,
    payDate: null,
  },
  {
    id: 'deal-11',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Donald & Christine Smith',
    projectType: 'gutters',
    fcv: 2000,
    gpPercent: 37.0,
    stage: 'complete',
    commissionRate: 0.08,
    totalCommission: 160,
    frontEnd: 80,
    backEnd: 80,
    paidFront: 80,
    paidBack: 80,
    earnedBack: 80,
    soldDate: '2025-09-18',
    closeDate: '2025-11-25',
    payDate: '2025-12-10',
  },
  // Todd Schonfeldt
  {
    id: 'deal-12',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Todd Schonfeldt',
    projectType: 'siding',
    fcv: 23000,
    gpPercent: 41.5,
    stage: 'in_progress',
    commissionRate: 0.09,
    totalCommission: 2070,
    frontEnd: 1035,
    backEnd: 1035,
    paidFront: 1035,
    paidBack: 0,
    earnedBack: 0,
    soldDate: '2025-10-30',
    closeDate: null,
    payDate: null,
  },
  // Garrett Gogin - SPLIT DEAL: co-sell (Aaron 50% / Sarah Mitchell 50%)
  {
    id: 'deal-13',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Garrett Gogin',
    projectType: 'windows',
    fcv: 16000,
    gpPercent: 39.0,
    stage: 'sold',
    commissionRate: 0.09,
    totalCommission: 1440,
    frontEnd: 720,
    backEnd: 720,
    paidFront: 360, // 50% of 720
    paidBack: 0,
    earnedBack: 720, // Still earning back
    soldDate: '2025-10-08',
    closeDate: null,
    payDate: null,
    splitType: 'co_sell',
    splitPercentage: 0.5,
    splitPartner: 'rep-2',
    splitPartnerName: 'Sarah Mitchell',
  },
  // Christopher & Melissa Johnson
  {
    id: 'deal-14',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Christopher & Melissa Johnson',
    projectType: 'windows',
    fcv: 6000,
    gpPercent: 42.0,
    stage: 'complete',
    commissionRate: 0.09,
    totalCommission: 540,
    frontEnd: 270,
    backEnd: 270,
    paidFront: 270,
    paidBack: 270,
    earnedBack: 270,
    soldDate: '2025-09-25',
    closeDate: '2025-12-05',
    payDate: '2025-12-20',
  },
  // Troy Schuelke
  {
    id: 'deal-15',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Troy Schuelke',
    projectType: 'windows',
    fcv: 4000,
    gpPercent: 35.0,
    stage: 'sold',
    commissionRate: 0.08,
    totalCommission: 320,
    frontEnd: 160,
    backEnd: 160,
    paidFront: 160,
    paidBack: 0,
    earnedBack: 160,
    soldDate: '2025-11-03',
    closeDate: null,
    payDate: null,
  },
  {
    id: 'deal-16',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Troy Schuelke',
    projectType: 'siding',
    fcv: 31000,
    gpPercent: 43.0,
    stage: 'in_progress',
    commissionRate: 0.09,
    totalCommission: 2790,
    frontEnd: 1395,
    backEnd: 1395,
    paidFront: 1395,
    paidBack: 0,
    earnedBack: 0,
    soldDate: '2025-11-10',
    closeDate: null,
    payDate: null,
  },
  // Sara Lee-Kurabelis
  {
    id: 'deal-17',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Sara Lee-Kurabelis',
    projectType: 'trim',
    fcv: 2000,
    gpPercent: 50.0,
    stage: 'paid',
    commissionRate: 0.1,
    totalCommission: 200,
    frontEnd: 100,
    backEnd: 100,
    paidFront: 100,
    paidBack: 100,
    earnedBack: 100,
    soldDate: '2025-08-28',
    closeDate: '2025-11-10',
    payDate: '2025-11-20',
  },
  {
    id: 'deal-18',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Sara Lee-Kurabelis',
    projectType: 'gutters',
    fcv: 974,
    gpPercent: 28.0,
    stage: 'paid',
    commissionRate: 0.04,
    totalCommission: 39,
    frontEnd: 19,
    backEnd: 20,
    paidFront: 19,
    paidBack: 20,
    earnedBack: 20,
    soldDate: '2025-09-12',
    closeDate: '2025-11-15',
    payDate: '2025-12-01',
  },
  // Bryan Habeck
  {
    id: 'deal-19',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Bryan Habeck',
    projectType: 'trim',
    fcv: 112,
    gpPercent: 55.0,
    stage: 'paid',
    commissionRate: 0.1,
    totalCommission: 11,
    frontEnd: 6,
    backEnd: 5,
    paidFront: 6,
    paidBack: 5,
    earnedBack: 5,
    soldDate: '2025-10-01',
    closeDate: '2025-11-20',
    payDate: '2025-12-01',
  },
  // Bekki & Ryan Kaminski
  {
    id: 'deal-20',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Bekki & Ryan Kaminski',
    projectType: 'roofing',
    fcv: 30000,
    gpPercent: 40.8,
    stage: 'complete',
    commissionRate: 0.09,
    totalCommission: 2700,
    frontEnd: 1350,
    backEnd: 1350,
    paidFront: 1350,
    paidBack: 1350,
    earnedBack: 1350,
    soldDate: '2025-07-05',
    closeDate: '2025-11-18',
    payDate: '2025-12-01',
  },
  // Keng Lee & Mai Xiong
  {
    id: 'deal-21',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Keng Lee & Mai Xiong',
    projectType: 'roofing',
    fcv: 27000,
    gpPercent: 37.5,
    stage: 'in_progress',
    commissionRate: 0.08,
    totalCommission: 2160,
    frontEnd: 1080,
    backEnd: 1080,
    paidFront: 1080,
    paidBack: 0,
    earnedBack: 0,
    soldDate: '2025-09-08',
    closeDate: null,
    payDate: null,
  },
  // Patricia Unseth
  {
    id: 'deal-22',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Patricia Unseth',
    projectType: 'windows',
    fcv: 10000,
    gpPercent: 41.0,
    stage: 'sold',
    commissionRate: 0.09,
    totalCommission: 900,
    frontEnd: 450,
    backEnd: 450,
    paidFront: 450,
    paidBack: 0,
    earnedBack: 450,
    soldDate: '2025-10-20',
    closeDate: null,
    payDate: null,
  },
  // Tim & Geralyn Plautz
  {
    id: 'deal-23',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Tim & Geralyn Plautz',
    projectType: 'roofing',
    fcv: 30000,
    gpPercent: 42.3,
    stage: 'sold',
    commissionRate: 0.09,
    totalCommission: 2700,
    frontEnd: 1350,
    backEnd: 1350,
    paidFront: 1350,
    paidBack: 0,
    earnedBack: 1350,
    soldDate: '2025-09-30',
    closeDate: null,
    payDate: null,
  },
  // Dianna & Dave Herman
  {
    id: 'deal-24',
    repId: 'rep-1',
    brandId: 'brand-1',
    customerName: 'Dianna & Dave Herman',
    projectType: 'windows',
    fcv: 26000,
    gpPercent: 44.0,
    stage: 'in_progress',
    commissionRate: 0.09,
    totalCommission: 2340,
    frontEnd: 1170,
    backEnd: 1170,
    paidFront: 1170,
    paidBack: 0,
    earnedBack: 0,
    soldDate: '2025-10-15',
    closeDate: null,
    payDate: null,
  },
];

// ============================================================================
// TEAM MEMBERS (with Aaron as rep-1)
// ============================================================================
export const teamMembers: any[] = [
  {
    id: 'rep-1',
    name: 'Aaron Bagurdes',
    email: 'aaron.bagurdes@infinityexteriors.com',
    brandId: 'brand-1',
    ytdEarnings: 148000,
    ytdJobsCompleted: 151,
    tier: 'gold',
    joinDate: '2020-03-15',
  },
  {
    id: 'rep-2',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@infinityexteriors.com',
    brandId: 'brand-1',
    ytdEarnings: 112000,
    ytdJobsCompleted: 98,
    tier: 'silver',
    joinDate: '2021-06-20',
  },
  {
    id: 'rep-3',
    name: 'Jake Torres',
    email: 'jake.torres@infinityexteriors.com',
    brandId: 'brand-1',
    ytdEarnings: 95000,
    ytdJobsCompleted: 87,
    tier: 'silver',
    joinDate: '2021-09-10',
  },
  {
    id: 'rep-4',
    name: 'Lisa Chen',
    email: 'lisa.chen@infinityexteriors.com',
    brandId: 'brand-1',
    ytdEarnings: 88000,
    ytdJobsCompleted: 76,
    tier: 'bronze',
    joinDate: '2022-01-05',
  },
  {
    id: 'rep-5',
    name: 'Mike Rodriguez',
    email: 'mike.rodriguez@infinityexteriors.com',
    brandId: 'brand-1',
    ytdEarnings: 72000,
    ytdJobsCompleted: 65,
    tier: 'bronze',
    joinDate: '2022-04-18',
  },
  {
    id: 'rep-6',
    name: 'Emma Wilson',
    email: 'emma.wilson@infinityexteriors.com',
    brandId: 'brand-1',
    ytdEarnings: 68000,
    ytdJobsCompleted: 59,
    tier: 'bronze',
    joinDate: '2022-07-22',
  },
  {
    id: 'rep-7',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@infinityexteriors.com',
    brandId: 'brand-1',
    ytdEarnings: 54000,
    ytdJobsCompleted: 48,
    tier: 'bronze',
    joinDate: '2023-02-14',
  },
  {
    id: 'rep-8',
    name: 'Nina Patel',
    email: 'nina.patel@infinityexteriors.com',
    brandId: 'brand-1',
    ytdEarnings: 41000,
    ytdJobsCompleted: 35,
    tier: 'bronze',
    joinDate: '2023-08-09',
  },
];

// ============================================================================
// LEADERBOARD DATA (Top 10 across brands)
// ============================================================================
export const leaderboardData: LeaderboardEntry[] = [
  {
    rank: 1,
    prevRank: 1,
    name: 'Aaron Bagurdes',
    brand: 'Infinity Exteriors',
    deals: 151,
    avgGP: 39.3,
    earnings: 148000,
  },
  {
    rank: 2,
    prevRank: 3,
    name: 'James Wright',
    brand: 'Infinity Exteriors',
    deals: 142,
    avgGP: 37.8,
    earnings: 136000,
  },
  {
    rank: 3,
    prevRank: 2,
    name: 'Sarah Palmer',
    brand: 'Infinity Exteriors',
    deals: 98,
    avgGP: 38.1,
    earnings: 128000,
  },
  {
    rank: 4,
    prevRank: 4,
    name: 'Michael Thompson',
    brand: 'Overhead Solutions',
    deals: 92,
    avgGP: 36.5,
    earnings: 112000,
  },
  {
    rank: 5,
    prevRank: 6,
    name: 'Jake Torres',
    brand: 'Cochran Exteriors',
    deals: 87,
    avgGP: 37.2,
    earnings: 104000,
  },
  {
    rank: 6,
    prevRank: 5,
    name: 'Jennifer Lee',
    brand: 'G. Fedale',
    deals: 84,
    avgGP: 35.9,
    earnings: 96000,
  },
  {
    rank: 7,
    prevRank: 7,
    name: 'Marcus Johnson',
    brand: 'Valentine Roofing',
    deals: 78,
    avgGP: 36.2,
    earnings: 89000,
  },
  {
    rank: 8,
    prevRank: 9,
    name: 'Lisa Chen',
    brand: 'Infinity Exteriors',
    deals: 76,
    avgGP: 36.8,
    earnings: 84000,
  },
  {
    rank: 9,
    prevRank: 8,
    name: 'David Park',
    brand: 'Skywalker Roofing',
    deals: 71,
    avgGP: 38.4,
    earnings: 78000,
  },
  {
    rank: 10,
    prevRank: 11,
    name: 'Patricia Brown',
    brand: 'Werner Roofing',
    deals: 68,
    avgGP: 34.1,
    earnings: 72000,
  },
];

// ============================================================================
// ACHIEVEMENTS
// ============================================================================
export const achievements: Achievement[] = [
  {
    id: 'achievement-1',
    name: 'First $10K Month',
    description: 'Earn $10,000 in a single month',
    icon: '🎯',
    unlocked: true,
    unlockedDate: '2025-04-15',
    progress: 100,
  },
  {
    id: 'achievement-2',
    name: '5-Deal Streak',
    description: 'Close 5 deals in 7 consecutive days',
    icon: '🔥',
    unlocked: true,
    unlockedDate: '2025-08-22',
    progress: 100,
  },
  {
    id: 'achievement-3',
    name: 'GP% Master 45%+',
    description: 'Close a deal with 45%+ gross profit margin',
    icon: '💎',
    unlocked: true,
    unlockedDate: '2025-10-10',
    progress: 100,
  },
  {
    id: 'achievement-4',
    name: 'Quota Crusher 110%+',
    description: 'Achieve 110% of monthly quota',
    icon: '🚀',
    unlocked: false,
    unlockedDate: null,
    progress: 86,
  },
  {
    id: 'achievement-5',
    name: 'Top 3 Finish',
    description: 'Rank in top 3 on monthly leaderboard',
    icon: '🏆',
    unlocked: false,
    unlockedDate: null,
    progress: 0,
  },
  {
    id: 'achievement-6',
    name: 'Perfect Close Rate Week',
    description: 'Close 100% of proposals for an entire week',
    icon: '⭐',
    unlocked: false,
    unlockedDate: null,
    progress: 0,
  },
];

// ============================================================================
// EXCEPTIONS
// ============================================================================
export const exceptions: Exception[] = [
  {
    id: 'exception-1',
    type: 'high_commission',
    severity: 'warning',
    description: 'High Commission Alert',
    details: 'Bill Peters roofing deal ($82K FCV) generated $8,200 commission - exceeds typical range',
    dealId: 'deal-6',
    amount: 8200,
    status: 'pending_review',
    createdAt: '2025-05-22',
    reviewedBy: null,
  },
  {
    id: 'exception-2',
    type: 'negative_gp_percent',
    severity: 'critical',
    description: 'Negative Gross Profit',
    details: 'Tom Richards windows deal closed with -3.2% GP - potential pricing error',
    dealId: null,
    amount: -280,
    status: 'under_investigation',
    createdAt: '2025-11-01',
    reviewedBy: null,
  },
  {
    id: 'exception-3',
    type: 'clawback',
    severity: 'warning',
    description: 'Commission Clawback',
    details: 'Maria Santos job cancelled 30 days post-installation - $1,450 commission reversed per policy',
    dealId: null,
    amount: -1450,
    status: 'applied',
    createdAt: '2025-10-15',
    reviewedBy: 'Sarah HR',
  },
  {
    id: 'exception-4',
    type: 'rep_termination',
    severity: 'info',
    description: 'Rep Termination Payout',
    details: 'Dave Wilson terminated 2025-11-10 - final payout $890 for partial month',
    dealId: null,
    amount: 890,
    status: 'processed',
    createdAt: '2025-11-10',
    reviewedBy: 'Sarah HR',
  },
];

// ============================================================================
// AUDIT ENTRIES
// ============================================================================
export const auditEntries: AuditEntry[] = [
  {
    id: 'audit-1',
    type: 'deal_created',
    description: 'Deal created: Bill Peters Roofing $82,000',
    dealId: 'deal-6',
    repId: 'rep-1',
    changedBy: 'Aaron Bagurdes',
    changedAt: '2025-05-22T10:30:00Z',
    oldValue: null,
    newValue: '82000',
  },
  {
    id: 'audit-2',
    type: 'adjustment_applied',
    description: 'Change order applied: Jim Cardo Roofing FCV reduced 14K → 12K',
    dealId: 'deal-1',
    repId: 'rep-1',
    changedBy: 'Jay Teresi',
    changedAt: '2025-09-01T14:15:00Z',
    oldValue: '14000',
    newValue: '12000',
  },
  {
    id: 'audit-3',
    type: 'payment_processed',
    description: 'Front-end commission paid for deal-20 (Bekki & Ryan Kaminski)',
    dealId: 'deal-20',
    repId: 'rep-1',
    changedBy: 'System',
    changedAt: '2025-12-01T08:00:00Z',
    oldValue: '0',
    newValue: '1350',
  },
  {
    id: 'audit-4',
    type: 'exception_reviewed',
    description: 'Exception #3 (Maria Santos Clawback) approved and processed',
    dealId: null,
    repId: null,
    changedBy: 'Sarah HR',
    changedAt: '2025-10-16T11:45:00Z',
    oldValue: 'pending_review',
    newValue: 'applied',
  },
  {
    id: 'audit-5',
    type: 'deal_status_updated',
    description: 'Eric & Candice Lee Windows moved to in_progress',
    dealId: 'deal-4',
    repId: 'rep-1',
    changedBy: 'Jay Teresi',
    changedAt: '2025-07-10T09:20:00Z',
    oldValue: 'quoted',
    newValue: 'in_progress',
  },
];

// ============================================================================
// DISPUTES
// ============================================================================
export const disputes: Dispute[] = [
  {
    id: 'dispute-1',
    dealId: 'deal-6',
    repId: 'rep-1',
    type: 'split_disagreement',
    status: 'resolved',
    title: 'Split Percentage Dispute - Bill Peters Deal',
    description:
      'Jake Torres questioned the 70/30 split allocation on the Bill Peters roofing deal, claiming equal contribution.',
    createdAt: '2025-06-10',
    resolvedAt: '2025-06-15',
    resolution: 'Agreed: Aaron (canvasser) 70%, Jake (closer) 30% - accurate per contract notes',
    messages: [
      {
        id: 'msg-1',
        sender: 'Jake Torres',
        senderRole: 'rep',
        message: 'Hey, I want to discuss the split on the Peters deal. I did a lot of the closing work.',
        timestamp: '2025-06-10T14:22:00Z',
      },
      {
        id: 'msg-2',
        sender: 'Aaron Bagurdes',
        senderRole: 'rep',
        message:
          'I agree we should discuss. I did the initial canvass and brought them in, you handled the final close. What split did you have in mind?',
        timestamp: '2025-06-10T15:45:00Z',
      },
      {
        id: 'msg-3',
        sender: 'Sarah HR',
        senderRole: 'manager',
        message:
          'I reviewed the deal notes from both of you. Aaron - you did the canvassing and initial qualification (high effort). Jake - you did the closing (high value). The 70/30 split is appropriate per our canvasser/closer policy. This is resolved.',
        timestamp: '2025-06-15T10:00:00Z',
      },
    ],
  },
  {
    id: 'dispute-2',
    dealId: 'deal-13',
    repId: 'rep-2',
    type: 'co_sell_disagreement',
    status: 'open',
    title: 'Co-Sell Attribution - Garrett Gogin Windows',
    description:
      "Sarah Mitchell claims her contribution on the Garrett Gogin windows sale was understated in the 50/50 split.",
    createdAt: '2025-10-20',
    resolvedAt: null,
    resolution: null,
    messages: [
      {
        id: 'msg-4',
        sender: 'Sarah Mitchell',
        senderRole: 'rep',
        message:
          "I'm not comfortable with the 50/50 split on Garrett Gogin. I did the design consultation and spec work - that's more than half the value.",
        timestamp: '2025-10-20T13:10:00Z',
      },
      {
        id: 'msg-5',
        sender: 'Aaron Bagurdes',
        senderRole: 'rep',
        message:
          'Sarah, we both agreed to co-sell on this. I built the relationship and brought Aaron in for consultation. I think 50/50 is fair.',
        timestamp: '2025-10-20T15:30:00Z',
      },
      {
        id: 'msg-6',
        sender: 'Sarah Mitchell',
        senderRole: 'rep',
        message:
          'That might be your perspective, but I documented 12 hours on this project. The split should reflect actual effort.',
        timestamp: '2025-10-21T09:00:00Z',
      },
    ],
  },
  {
    id: 'dispute-3',
    dealId: 'deal-4',
    repId: 'rep-1',
    type: 'payment_discrepancy',
    status: 'pending_review',
    title: 'Commission Payment Variance - Eric Lee Windows',
    description:
      'Aaron reports discrepancy between expected and received front-end commission on Eric & Candice Lee windows deal.',
    createdAt: '2025-11-15',
    resolvedAt: null,
    resolution: null,
    messages: [
      {
        id: 'msg-7',
        sender: 'Aaron Bagurdes',
        senderRole: 'rep',
        message:
          'I received my November payment but the Eric Lee windows deal front-end seems low. Deal is $17K, GP is 36%, should be more than what I got.',
        timestamp: '2025-11-15T10:15:00Z',
      },
      {
        id: 'msg-8',
        sender: 'Sarah HR',
        senderRole: 'manager',
        message:
          'I see the flagged amount. The deal is still in_progress - front-end is only paid when customer signs agreement. The $680 front-end is held pending completion. Let me verify the tier calculation...',
        timestamp: '2025-11-15T14:30:00Z',
      },
    ],
  },
];

// ============================================================================
// NOTIFICATIONS
// ============================================================================
export const notifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'payment_received',
    title: 'Front-End Commission Paid',
    message: 'You received $630 from deal #1 (Jim Cardo Roofing)',
    timestamp: '2025-12-01T08:30:00Z',
    read: true,
    actionUrl: '/deals/deal-1',
  },
  {
    id: 'notif-2',
    type: 'deal_status_change',
    title: 'Deal Status Update',
    message: 'Bekki & Ryan Kaminski roofing moved to complete - back-end commission earned',
    timestamp: '2025-11-18T16:45:00Z',
    read: true,
    actionUrl: '/deals/deal-20',
  },
  {
    id: 'notif-3',
    type: 'dispute_created',
    title: 'New Dispute Notification',
    message: "Sarah Mitchell opened a dispute about the Garrett Gogin co-sell attribution",
    timestamp: '2025-10-20T13:15:00Z',
    read: true,
    actionUrl: '/disputes/dispute-2',
  },
  {
    id: 'notif-4',
    type: 'quota_alert',
    title: 'Monthly Quota Update',
    message: 'You are currently at 86% of monthly quota. 14 days remaining in period.',
    timestamp: '2025-11-15T09:00:00Z',
    read: true,
    actionUrl: '/dashboard',
  },
  {
    id: 'notif-5',
    type: 'achievement_unlocked',
    title: 'Achievement Unlocked!',
    message: "You've unlocked the 'GP% Master 45%+' badge!",
    timestamp: '2025-10-10T14:22:00Z',
    read: true,
    actionUrl: '/achievements',
  },
  {
    id: 'notif-6',
    type: 'exception_alert',
    title: 'Exception Under Review',
    message: 'High commission alert on Bill Peters deal ($8,200) pending manager review',
    timestamp: '2025-05-23T08:00:00Z',
    read: true,
    actionUrl: '/exceptions/exception-1',
  },
  {
    id: 'notif-7',
    type: 'spif_program',
    title: 'New SPIF Program Available',
    message: 'March Madness Roofing Blitz launched - $300 per roof through March 31',
    timestamp: '2025-03-15T07:00:00Z',
    read: false,
    actionUrl: '/spif-programs',
  },
  {
    id: 'notif-8',
    type: 'payment_pending',
    title: 'Back-End Commission Pending',
    message: 'Eric & Candice Lee roofing ($1,170) will be paid upon final payment - currently in_progress',
    timestamp: '2025-09-22T12:00:00Z',
    read: true,
    actionUrl: '/deals/deal-5',
  },
];

// ============================================================================
// SPIF PROGRAMS
// ============================================================================
export const spifPrograms: SpifProgram[] = [
  {
    id: 'spif-1',
    name: 'March Madness Roofing Blitz',
    description: 'Extra $300 bonus per roofing job closed during March',
    status: 'active',
    bonus: 300,
    projectType: 'roofing',
    startDate: '2025-03-15',
    endDate: '2025-03-31',
    qualificationCriteria: 'All roofing jobs closed during period',
  },
  {
    id: 'spif-2',
    name: 'GP% Crusher',
    description: 'Earn $500 bonus for any deal closed at 48%+ gross profit margin',
    status: 'active',
    bonus: 500,
    projectType: null,
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    qualificationCriteria: 'Gross profit margin >= 48% on any job type',
  },
];

// ============================================================================
// HANDBOOK SECTIONS
// ============================================================================
export const handbookSections: HandbookSection[] = [
  {
    id: 'handbook-0',
    title: 'The IHS Way',
    content: `At Infinity Home Services, compensation is not just about numbers — it's about reinforcing who we are. Our commission structure is intentionally designed to reward the behaviors that align with our purpose: Saving our communities from unscrupulous contractors.

Our three core values — Integrity, Hard Work, and Service — are baked into how you earn. Integrity shows up in the GP%-based tier system: higher margins mean honest, transparent pricing that builds trust. Hard Work is reflected in volume bonuses, SPIFs, and milestones that reward consistent effort. Service shows up in back-end commission tied to job completion quality and customer satisfaction.

Our Vision is "Installing peace of mind." When you close a deal at a fair margin, install it right, and collect final payment — that's peace of mind for the customer and for you. Our Mission is Border to Border, Coast to Coast: to be America's most trusted home exterior services company in every community, in every market.

Our Non-Negotiables apply everywhere, including your comp plan: Safety First, Show Respect, Team Unity, Provide Ethical Solutions, and Be Accountable. These aren't aspirations — they're expectations. Every brand. Every market. Every day.`,
    lastUpdated: '2026-01-01',
    updatedBy: 'Jay Teresi, CEO',
  },
  {
    id: 'handbook-1',
    title: 'How Your Plan Works',
    content: `Your commission plan is the foundation of your earning potential. At Infinity Exteriors, we use a gross profit percentage-based tiered commission structure. This means your commission rate adjusts based on the gross profit margin of each job you close.

Here's how it works: When you close a deal, we look at the deal's total gross profit percentage (GP%). Based on that percentage, you earn a specific commission rate on the full job value. The rates are tiered to reward higher-margin work: at 25-30% GP, you earn 5%, but if you bring in work at 45%+ GP, you earn 10%. This encourages you to focus on quality over just volume.

Your commission is split 50/50 between front-end (paid when the job is signed) and back-end (paid at final payment). This balance ensures you get paid quickly for closing work while maintaining financial accountability through the completion of the project.`,
  },
  {
    id: 'handbook-2',
    title: 'When You Get Paid',
    content: `Understanding payment timing is critical to your cash flow planning. Front-end commission is paid within 5 business days after the customer signs the agreement—this is your immediate reward for closing the sale. Back-end commission is paid within 5 business days after the job is completed and the final payment is collected from the customer.

We deposit all payments directly to your designated bank account. You'll receive a detailed payment statement showing all deals included, the GP% for each, the tier applied, and the exact amounts paid. If there are any disputes or exceptions flagged on your account, they will be noted on the statement. Keep in mind that change orders or adjustments to a job may affect your commission, and we'll notify you of any changes within 24 hours of processing.`,
  },
  {
    id: 'handbook-3',
    title: 'What Triggers a Clawback',
    content: `A clawback is when previously paid commission is reversed or recovered. This sounds harsh, but it protects the integrity of our commission system and ensures fairness across the entire organization. Clawbacks are triggered in specific, documented situations.

The most common trigger is customer cancellation within 30 days of installation. If a customer cancels after you've already received both front and back-end commission, we recover the back-end portion. Other clawback triggers include: documented pricing errors (more than 5% variance), significant scope reductions after payment, or warranty issues that result in substantial rework. We always notify you within 48 hours of identifying a clawback situation, and you have the right to dispute it. Disputes are reviewed by management and resolved within 10 business days.`,
  },
  {
    id: 'handbook-4',
    title: 'How Splits Work',
    content: `Splits happen when two or more reps contribute meaningfully to a single deal. Understanding how splits are allocated helps you maximize your earnings and build strong team relationships.

We have three types of splits: canvasser/closer splits (common in roofing where someone generates the lead and someone closes it), co-sell splits (when two reps jointly present and close a deal), and training splits (when an experienced rep mentors a junior rep on a deal). The split percentage is determined at deal creation based on documented evidence of each rep's contribution. For canvasser/closer splits, we typically favor the closer slightly (70/30 is common), as closing is higher-value work. For co-sells, we usually split 50/50 unless documentation shows unequal effort.

Each rep on a split deal receives their proportional commission based on their percentage. You'll see the split clearly documented on your payment statement, and disputed splits go through our formal dispute resolution process.`,
  },
  {
    id: 'handbook-5',
    title: 'How Disputes Work',
    content: `Disputes are a normal part of commission management. They might involve disagreements over splits, payment amounts, deal status, or GP% calculations. We have a structured process to ensure fairness and rapid resolution.

To initiate a dispute, submit it in writing (through the app or email) within 30 days of the issue occurring. Clearly state what you're disputing, provide any supporting documentation (emails, deal notes, customer communications), and explain your position. Your manager will acknowledge receipt within 24 hours. Within 5-10 business days, you'll receive a detailed response explaining the decision, along with any corrections to your account if warranted.

If you disagree with the initial decision, you can escalate to our Finance Director for a second review. This process takes an additional 5-10 days. Our goal is always to resolve disputes quickly while maintaining accuracy and fairness. Once a dispute is resolved, we implement the decision immediately, and you'll see adjustments on your next payment.`,
  },
  {
    id: 'handbook-6',
    title: 'Glossary of Terms',
    content: `Understanding commission terminology ensures you can navigate your statements and reports with confidence. Here are the key terms you'll encounter:

FCV (Full Contract Value): The total dollar amount of the customer's signed agreement, including all change orders.
GP% (Gross Profit Percentage): The gross profit margin as a percentage of the FCV. Calculated as (Gross Profit / FCV) × 100.
Commission Rate: The percentage of FCV you earn based on your plan structure and GP% tier.
Front-End: The first 50% of commission, typically paid when the customer signs.
Back-End: The second 50% of commission, paid when the job is complete and final payment collected.
Change Order: A documented modification to the original scope, which may increase or decrease the FCV and commission.
Clawback: Recovery of previously paid commission due to cancellation, error, or other documented reason.
Split: Division of commission between two or more reps based on their contribution to a deal.
Paid vs. Earned: Paid commission has been transferred to your account; earned commission is owed to you but may be held pending completion or review.`,
  },
];

// ============================================================================
// BRAND ANALYTICS
// ============================================================================
export const brandAnalytics: BrandAnalytics[] = [
  { brandId: 'brand-1', brandName: 'Infinity Exteriors', totalEarned: 485000, avgRate: 0.084, avgGP: 42.1, repCount: 18, costPerRep: 26944 },
  { brandId: 'brand-2', brandName: 'Overhead Solutions', totalEarned: 168000, avgRate: 0.072, avgGP: 38.5, repCount: 8, costPerRep: 21000 },
  { brandId: 'brand-3', brandName: 'Cochran Exteriors', totalEarned: 312000, avgRate: 0.078, avgGP: 39.8, repCount: 12, costPerRep: 26000 },
  { brandId: 'brand-4', brandName: 'Exterior Heroes', totalEarned: 147000, avgRate: 0.068, avgGP: 36.2, repCount: 7, costPerRep: 21000 },
  { brandId: 'brand-5', brandName: 'Parkhill Roofing', totalEarned: 108000, avgRate: 0.062, avgGP: 34.8, repCount: 6, costPerRep: 18000 },
  { brandId: 'brand-6', brandName: 'Werner Roofing', totalEarned: 225000, avgRate: 0.081, avgGP: 41.5, repCount: 9, costPerRep: 25000 },
  { brandId: 'brand-7', brandName: 'Premier Roofing', totalEarned: 245000, avgRate: 0.076, avgGP: 40.2, repCount: 10, costPerRep: 24500 },
  { brandId: 'brand-8', brandName: 'Henderson Roofing', totalEarned: 114000, avgRate: 0.065, avgGP: 35.8, repCount: 6, costPerRep: 19000 },
  { brandId: 'brand-9', brandName: 'GF Sprague', totalEarned: 275000, avgRate: 0.082, avgGP: 43.1, repCount: 11, costPerRep: 25000 },
  { brandId: 'brand-10', brandName: 'Resnick Roofing', totalEarned: 176000, avgRate: 0.071, avgGP: 37.9, repCount: 8, costPerRep: 22000 },
  { brandId: 'brand-11', brandName: 'High Point Roofing', totalEarned: 133000, avgRate: 0.066, avgGP: 36.4, repCount: 7, costPerRep: 19000 },
  { brandId: 'brand-12', brandName: 'Couto Construction', totalEarned: 207000, avgRate: 0.075, avgGP: 39.2, repCount: 9, costPerRep: 23000 },
  { brandId: 'brand-13', brandName: 'G. Fedale', totalEarned: 378000, avgRate: 0.088, avgGP: 44.3, repCount: 14, costPerRep: 27000 },
  { brandId: 'brand-14', brandName: 'Franzoso', totalEarned: 152000, avgRate: 0.069, avgGP: 37.1, repCount: 8, costPerRep: 19000 },
  { brandId: 'brand-15', brandName: 'American Home Contractors', totalEarned: 682000, avgRate: 0.092, avgGP: 45.8, repCount: 22, costPerRep: 31000 },
  { brandId: 'brand-16', brandName: 'Exterior Medics', totalEarned: 218000, avgRate: 0.073, avgGP: 38.6, repCount: 10, costPerRep: 21800 },
  { brandId: 'brand-17', brandName: 'Valentine Roofing', totalEarned: 405000, avgRate: 0.086, avgGP: 43.4, repCount: 15, costPerRep: 27000 },
  { brandId: 'brand-18', brandName: 'Interstate Roofing', totalEarned: 288000, avgRate: 0.079, avgGP: 40.6, repCount: 12, costPerRep: 24000 },
  { brandId: 'brand-19', brandName: 'Specialty Exteriors', totalEarned: 96000, avgRate: 0.058, avgGP: 33.2, repCount: 6, costPerRep: 16000 },
  { brandId: 'brand-20', brandName: 'Skywalker Roofing', totalEarned: 364000, avgRate: 0.085, avgGP: 42.7, repCount: 14, costPerRep: 26000 },
  { brandId: 'brand-21', brandName: 'Altec Roofing', totalEarned: 253000, avgRate: 0.077, avgGP: 39.5, repCount: 11, costPerRep: 23000 },
  { brandId: 'brand-22', brandName: "Carpenter's", totalEarned: 184000, avgRate: 0.074, avgGP: 38.8, repCount: 8, costPerRep: 23000 },
  { brandId: 'brand-23', brandName: 'Watkins Construction', totalEarned: 140000, avgRate: 0.067, avgGP: 36.5, repCount: 7, costPerRep: 20000 },
  { brandId: 'brand-24', brandName: "D'Angelo & Sons", totalEarned: 198000, avgRate: 0.070, avgGP: 37.8, repCount: 10, costPerRep: 19800 },
  { brandId: 'brand-25', brandName: 'Wheatland Roofing', totalEarned: 85000, avgRate: 0.055, avgGP: 32.6, repCount: 5, costPerRep: 17000 },
];

// ============================================================================
// MONTHLY TRENDS (Apr 2025 - Mar 2026)
// ============================================================================
export const monthlyTrends: MonthlyTrend[] = [
  {
    month: 'Apr 2025',
    earnings: 8200,
    deals: 11,
    avgGP: 37.8,
    commissionCost: 1148,
  },
  {
    month: 'May 2025',
    earnings: 9150,
    deals: 13,
    avgGP: 38.4,
    commissionCost: 1281,
  },
  {
    month: 'Jun 2025',
    earnings: 10300,
    deals: 14,
    avgGP: 39.1,
    commissionCost: 1442,
  },
  {
    month: 'Jul 2025',
    earnings: 11250,
    deals: 15,
    avgGP: 39.6,
    commissionCost: 1575,
  },
  {
    month: 'Aug 2025',
    earnings: 12100,
    deals: 16,
    avgGP: 39.8,
    commissionCost: 1694,
  },
  {
    month: 'Sep 2025',
    earnings: 13450,
    deals: 18,
    avgGP: 40.2,
    commissionCost: 1883,
  },
  {
    month: 'Oct 2025',
    earnings: 14200,
    deals: 19,
    avgGP: 40.5,
    commissionCost: 1988,
  },
  {
    month: 'Nov 2025',
    earnings: 15600,
    deals: 21,
    avgGP: 40.8,
    commissionCost: 2184,
  },
  {
    month: 'Dec 2025',
    earnings: 16800,
    deals: 23,
    avgGP: 41.2,
    commissionCost: 2352,
  },
  {
    month: 'Jan 2026',
    earnings: 15200,
    deals: 20,
    avgGP: 39.9,
    commissionCost: 2128,
  },
  {
    month: 'Feb 2026',
    earnings: 14950,
    deals: 19,
    avgGP: 39.6,
    commissionCost: 2093,
  },
  {
    month: 'Mar 2026',
    earnings: 15800,
    deals: 22,
    avgGP: 40.1,
    commissionCost: 2212,
  },
];

// ============================================================================
// CURRENT USER
// ============================================================================
export const currentUser: any = {
  id: 'rep-1',
  name: 'Aaron Bagurdes',
  email: 'aaron.bagurdes@infinityexteriors.com',
  brandId: 'brand-1',
  brandName: 'Infinity Exteriors',
  tier: 'gold',
  // === MATH: 151 jobs sold YTD, $2.28M total FCV ===
  // Avg GP 39.3% → Gold tier → 8% commission rate on FCV
  // Total commission generated: $2.28M × 8% = $182K
  // 50/50 front/back split → $91K front + $91K back
  // 127 jobs completed → back earned on those = $57K
  // 24 jobs still active → back pending = $34K
  // YTD Earned = front paid ($91K) + back earned ($57K) = $148K
  ytdEarnings: 148000,        // front paid + back earned
  ytdFrontPaid: 91000,        // 50% paid at sale (all 151 jobs)
  ytdBackEarned: 57000,       // 50% on 127 completed jobs
  ytdBackPending: 34000,      // 50% on 24 active jobs (not yet earned)
  ytdTotalFCV: 2275000,       // total contract value across 151 jobs
  ytdJobsSold: 151,           // total jobs sold this year
  ytdJobsCompleted: 127,      // jobs fully complete
  ytdJobsActive: 24,          // jobs still in progress
  avgDealSize: 15066,         // $2.275M / 151 = $15,066
  avgGP: 39.3,
  quotaProgress: 86,          // $148K / $172K = 86%
  quotaTarget: 172000,
  leaderboardRank: 1,
  leaderboardTotal: 18,       // 18 reps at Infinity Exteriors
  joinDate: '2020-03-15',
  currentTierRate: 0.08,      // Gold = 8%
  nextTierRate: 0.09,         // next tier (40-45% GP) = 9%
  nextTierThreshold: 40,      // need 40% avg GP
  gpToNextTier: 0.7,          // 40.0 - 39.3 = 0.7%
  planType: 'GP% Tiered',
  splitFront: 50,
  splitBack: 50,
};

// ============================================================================
// REP PIPELINE SUMMARY (for dashboard)
// ============================================================================
export const repPipeline: any = {
  totalActive: 24,
  stages: {
    sold: { count: 8, value: 142000, commission: 11360 },
    in_progress: { count: 10, value: 186000, commission: 14880 },
    complete: { count: 4, value: 78000, commission: 6240 },
    final_payment: { count: 2, value: 34000, commission: 2720 },
  },
  nextDeal: {
    id: 'deal-4',
    customerName: 'Eric & Candice Lee',
    projectType: 'windows',
    fcv: 17000,
    gpPercent: 36.0,
    stage: 'in_progress',
    estimatedCommission: 1360,
    daysInStage: 12,
    expectedCloseDate: '2026-04-15',
  },
  topDeal: {
    id: 'deal-5',
    customerName: 'Eric & Candice Lee',
    projectType: 'roofing',
    fcv: 26000,
    gpPercent: 41.0,
    stage: 'complete',
    estimatedCommission: 2340,
    daysInStage: 5,
    expectedCloseDate: '2026-04-08',
  },
  weeklyVelocity: {
    dealsClosedThisWeek: 2,
    dealsClosedLastWeek: 1,
    avgDaysToClose: 34,
    trend: 'accelerating',
  },
};

// ============================================================================
// COMMISSION WATERFALL (for dashboard trust section)
// ============================================================================
// Waterfall traces the real math: FCV → GP% tier → rate → split → earned
export const commissionWaterfall: any[] = [
  { label: '151 Jobs Sold', value: 2275000, type: 'total', note: '$15K avg deal' },
  { label: 'Avg GP% → Gold Tier', value: 39.3, type: 'tier', note: '35-45% GP = 8%' },
  { label: 'Commission (8% of FCV)', value: 182000, type: 'calc', note: '$2.28M × 8%' },
  { label: 'Front-End Paid (50%)', value: 91000, type: 'split', note: 'Paid at sale' },
  { label: 'Back-End Earned (50%)', value: 57000, type: 'split', note: '127 completed' },
  { label: 'Back-End Pending', value: 34000, type: 'pending', note: '24 active jobs' },
  { label: 'YTD Earned', value: 148000, type: 'final', note: 'Front + Back earned' },
];

// ============================================================================
// REP MILESTONES / GOALS
// ============================================================================
export const repMilestones: any[] = [
  { id: 'ms-1', label: 'Hit Silver Tier', description: 'Maintain 30%+ GP average', completed: true, completedDate: '2025-06-15', icon: '🥈', value: 'Integrity' },
  { id: 'ms-2', label: 'Hit Gold Tier', description: 'Maintain 35%+ GP average', completed: true, completedDate: '2025-09-20', icon: '🥇', value: 'Integrity' },
  { id: 'ms-3', label: 'Diamond GP — Ethical Pricing', description: '0.7% away — higher GP means honest, sustainable work', completed: false, progress: 98, icon: '💎', value: 'Integrity' },
  { id: 'ms-4', label: 'Hard Work: 200 Jobs YTD', description: '49 more to go — outwork the competition', completed: false, progress: 75, icon: '💪', value: 'Hard Work' },
  { id: 'ms-5', label: 'Quota Crusher (110%)', description: 'Currently at 86% — hard work pays off', completed: false, progress: 78, icon: '🚀', value: 'Hard Work' },
  { id: 'ms-6', label: 'Service: $200K Club', description: 'Serving customers well builds your earnings', completed: false, progress: 74, icon: '⭐', value: 'Service' },
];

// ============================================================================
// ACTIVE SPIFS (for rep dashboard)
// ============================================================================
export const activeSpifs: any[] = [
  { id: 'spif-active-1', name: 'March Roofing Blitz', bonus: 250, type: 'per_job', criteria: 'Every roofing job sold in March', deadline: '2026-03-31', yourProgress: 4, target: null, earned: 1000 },
  { id: 'spif-active-2', name: 'GP% Challenge', bonus: 1500, type: 'threshold', criteria: 'Hit 42% avg GP this quarter', deadline: '2026-03-31', yourProgress: 39.3, target: 42, earned: 0 },
  { id: 'spif-active-3', name: 'Window & Door Push', bonus: 150, type: 'per_job', criteria: '$150 bonus per window/door job', deadline: '2026-04-30', yourProgress: 2, target: null, earned: 300 },
];

// ============================================================================
// REP NOTIFICATIONS (role-specific, actionable)
// ============================================================================
// ============================================================================
// IHS PURPOSE, VISION, MISSION, VALUES
// ============================================================================
export const ihsIdentity = {
  purpose: 'Saving our communities from unscrupulous contractors',
  vision: 'Installing peace of mind',
  mission: 'Border to Border, Coast to Coast — to be America\'s most trusted home exterior services company in every community, in every market.',
  coreValues: [
    { letter: 'I', name: 'Integrity', description: 'We do the right thing, even when no one is watching' },
    { letter: 'H', name: 'Hard Work', description: 'We outwork the competition every single day' },
    { letter: 'S', name: 'Service', description: 'We exist to serve our customers, communities, and each other' },
  ],
  nonNegotiables: [
    'Safety First',
    'Show Respect',
    'Team Unity',
    'Provide Ethical Solutions',
    'Be Accountable',
  ],
  tagline: 'These aren\'t aspirations — they\'re expectations. Every brand. Every market. Every day.',
};

export const repNotifications: any[] = [
  { id: 'rn-1', type: 'deal_closed', title: 'Deal Completed', body: 'Jim Cardo roofing job marked complete — $630 back-end earned', time: '2 hours ago', read: false, actionLabel: 'View Deal' },
  { id: 'rn-2', type: 'spif', title: 'SPIF Progress', body: 'You\'ve earned $1,000 on March Roofing Blitz (4 jobs)', time: '1 day ago', read: false, actionLabel: 'View SPIF' },
  { id: 'rn-3', type: 'tier_alert', title: 'Tier Alert', body: 'You\'re 0.7% GP away from Platinum tier (9% rate)', time: '2 days ago', read: false, actionLabel: 'View Plan' },
  { id: 'rn-4', type: 'payout', title: 'Payout Scheduled', body: '$4,200 commission payout scheduled for March 31', time: '3 days ago', read: true, actionLabel: 'View Details' },
  { id: 'rn-5', type: 'leaderboard', title: 'Leaderboard Update', body: 'You\'re #1 at Infinity Exteriors — $12K ahead of #2', time: '1 week ago', read: true, actionLabel: 'View Board' },
];

// ============================================================================
// BRAND EMAIL DOMAINS
// ============================================================================
export const brandEmailDomains: Record<string, string> = {
  'brand-1': 'infinityexteriors.com',
  'brand-2': 'overheadsolutions.com',
  'brand-3': 'cochranexteriors.com',
  'brand-4': 'exteriorheroes.com',
  'brand-5': 'parkhillroofing.com',
  'brand-6': 'wernerroofing.com',
  'brand-7': 'premierroofing.com',
  'brand-8': 'hendersonroofing.com',
  'brand-9': 'gfsprague.com',
  'brand-10': 'resnickroofing.com',
  'brand-11': 'highpointroofing.com',
  'brand-12': 'coutoconstruction.com',
  'brand-13': 'gfedale.com',
  'brand-14': 'franzoso.com',
  'brand-15': 'ahcenergy.com',
  'brand-16': 'exteriormedics.com',
  'brand-17': 'valentineroofing.com',
  'brand-18': 'interstateroofing.com',
  'brand-19': 'specialtyexteriors.com',
  'brand-20': 'skywalkerroofing.com',
  'brand-21': 'altecroofing.com',
  'brand-22': 'carpentersroofing.com',
  'brand-23': 'watkinsconstruction.com',
  'brand-24': 'dangeloandsons.ca',
  'brand-25': 'wheatlandroofing.ca',
};

// ============================================================================
// PER-BRAND TEAM ROSTERS — realistic reps for every IHS brand
// ============================================================================
export const brandTeams: Record<string, any[]> = {
  // ────────── MIDWEST ──────────
  'brand-1': [ // Infinity Exteriors — WI/IL
    { id: 'ie-1', name: 'Aaron Bagurdes', email: 'aaron.bagurdes@infinityexteriors.com', role: 'Senior Sales Rep', ytdEarnings: 148000, ytdJobs: 151, avgGP: 39.3, tier: 'gold', joinDate: '2020-03-15' },
    { id: 'ie-2', name: 'Sarah Mitchell', email: 'sarah.mitchell@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 112000, ytdJobs: 98, avgGP: 37.1, tier: 'silver', joinDate: '2021-06-20' },
    { id: 'ie-3', name: 'Jake Torres', email: 'jake.torres@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 95000, ytdJobs: 87, avgGP: 36.5, tier: 'silver', joinDate: '2021-09-10' },
    { id: 'ie-4', name: 'Lisa Chen', email: 'lisa.chen@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 88000, ytdJobs: 76, avgGP: 36.8, tier: 'bronze', joinDate: '2022-01-05' },
    { id: 'ie-5', name: 'Mike Rodriguez', email: 'mike.rodriguez@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 72000, ytdJobs: 65, avgGP: 34.2, tier: 'bronze', joinDate: '2022-04-18' },
    { id: 'ie-6', name: 'Emma Wilson', email: 'emma.wilson@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 68000, ytdJobs: 59, avgGP: 33.8, tier: 'bronze', joinDate: '2022-07-22' },
    { id: 'ie-7', name: 'Carlos Ruiz', email: 'carlos.ruiz@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 54000, ytdJobs: 48, avgGP: 32.1, tier: 'bronze', joinDate: '2023-02-14' },
    { id: 'ie-8', name: 'Nina Patel', email: 'nina.patel@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 41000, ytdJobs: 35, avgGP: 31.5, tier: 'bronze', joinDate: '2023-08-09' },
    { id: 'ie-9', name: 'James Wright', email: 'james.wright@infinityexteriors.com', role: 'Senior Sales Rep', ytdEarnings: 136000, ytdJobs: 142, avgGP: 37.8, tier: 'gold', joinDate: '2019-11-02' },
    { id: 'ie-10', name: 'Sarah Palmer', email: 'sarah.palmer@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 128000, ytdJobs: 98, avgGP: 38.1, tier: 'gold', joinDate: '2020-01-15' },
    { id: 'ie-11', name: 'Derek Stoltz', email: 'derek.stoltz@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 62000, ytdJobs: 54, avgGP: 34.7, tier: 'bronze', joinDate: '2023-03-20' },
    { id: 'ie-12', name: 'Garrett Gogin', email: 'garrett.gogin@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 58000, ytdJobs: 50, avgGP: 33.2, tier: 'bronze', joinDate: '2023-05-11' },
    { id: 'ie-13', name: 'Maddie Kline', email: 'maddie.kline@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 47000, ytdJobs: 42, avgGP: 31.9, tier: 'bronze', joinDate: '2024-01-08' },
    { id: 'ie-14', name: 'Tyler Brann', email: 'tyler.brann@infinityexteriors.com', role: 'Sales Rep', ytdEarnings: 39000, ytdJobs: 34, avgGP: 30.5, tier: 'bronze', joinDate: '2024-04-15' },
    { id: 'ie-15', name: 'Rachel Voss', email: 'rachel.voss@infinityexteriors.com', role: 'Canvasser', ytdEarnings: 28000, ytdJobs: 22, avgGP: 29.1, tier: 'bronze', joinDate: '2024-07-22' },
    { id: 'ie-16', name: 'Zach Hemann', email: 'zach.hemann@infinityexteriors.com', role: 'Canvasser', ytdEarnings: 24000, ytdJobs: 19, avgGP: 28.4, tier: 'bronze', joinDate: '2024-09-01' },
    { id: 'ie-17', name: 'Alyssa Kopp', email: 'alyssa.kopp@infinityexteriors.com', role: 'Canvasser', ytdEarnings: 18000, ytdJobs: 14, avgGP: 27.8, tier: 'bronze', joinDate: '2025-01-06' },
    { id: 'ie-18', name: 'Brandon Lee', email: 'brandon.lee@infinityexteriors.com', role: 'Trainee', ytdEarnings: 12000, ytdJobs: 9, avgGP: 26.2, tier: 'bronze', joinDate: '2025-06-15' },
  ],
  'brand-2': [ // Overhead Solutions — WI
    { id: 'os-1', name: 'Michael Thompson', email: 'michael.thompson@overheadsolutions.com', role: 'Senior Sales Rep', ytdEarnings: 112000, ytdJobs: 92, avgGP: 36.5, tier: 'silver', joinDate: '2019-04-10' },
    { id: 'os-2', name: 'Brenda Halverson', email: 'brenda.halverson@overheadsolutions.com', role: 'Sales Rep', ytdEarnings: 87000, ytdJobs: 74, avgGP: 35.8, tier: 'silver', joinDate: '2020-08-15' },
    { id: 'os-3', name: 'Troy Schaefer', email: 'troy.schaefer@overheadsolutions.com', role: 'Sales Rep', ytdEarnings: 76000, ytdJobs: 68, avgGP: 33.4, tier: 'bronze', joinDate: '2021-02-22' },
    { id: 'os-4', name: 'Kayla Jorgensen', email: 'kayla.jorgensen@overheadsolutions.com', role: 'Sales Rep', ytdEarnings: 64000, ytdJobs: 56, avgGP: 32.7, tier: 'bronze', joinDate: '2022-06-01' },
    { id: 'os-5', name: 'Dan Mielke', email: 'dan.mielke@overheadsolutions.com', role: 'Sales Rep', ytdEarnings: 52000, ytdJobs: 45, avgGP: 31.2, tier: 'bronze', joinDate: '2023-01-18' },
    { id: 'os-6', name: 'Samantha Bauer', email: 'samantha.bauer@overheadsolutions.com', role: 'Sales Rep', ytdEarnings: 43000, ytdJobs: 38, avgGP: 30.1, tier: 'bronze', joinDate: '2023-09-05' },
    { id: 'os-7', name: 'Nick Wendt', email: 'nick.wendt@overheadsolutions.com', role: 'Canvasser', ytdEarnings: 28000, ytdJobs: 22, avgGP: 28.9, tier: 'bronze', joinDate: '2024-03-12' },
    { id: 'os-8', name: 'Megan Krueger', email: 'megan.krueger@overheadsolutions.com', role: 'Canvasser', ytdEarnings: 19000, ytdJobs: 15, avgGP: 27.3, tier: 'bronze', joinDate: '2024-11-01' },
  ],
  'brand-3': [ // Cochran Exteriors — IN
    { id: 'ce-1', name: 'Ryan Cochran', email: 'ryan.cochran@cochranexteriors.com', role: 'Senior Sales Rep', ytdEarnings: 134000, ytdJobs: 118, avgGP: 38.4, tier: 'gold', joinDate: '2018-03-01' },
    { id: 'ce-2', name: 'Amanda Stokes', email: 'amanda.stokes@cochranexteriors.com', role: 'Sales Rep', ytdEarnings: 97000, ytdJobs: 84, avgGP: 36.9, tier: 'silver', joinDate: '2020-05-20' },
    { id: 'ce-3', name: 'Justin Hale', email: 'justin.hale@cochranexteriors.com', role: 'Sales Rep', ytdEarnings: 82000, ytdJobs: 71, avgGP: 35.2, tier: 'silver', joinDate: '2021-01-15' },
    { id: 'ce-4', name: 'Britney Lawson', email: 'britney.lawson@cochranexteriors.com', role: 'Sales Rep', ytdEarnings: 69000, ytdJobs: 60, avgGP: 33.8, tier: 'bronze', joinDate: '2022-03-08' },
    { id: 'ce-5', name: 'Marcus Fields', email: 'marcus.fields@cochranexteriors.com', role: 'Sales Rep', ytdEarnings: 58000, ytdJobs: 51, avgGP: 32.4, tier: 'bronze', joinDate: '2022-09-22' },
    { id: 'ce-6', name: 'Tiffany Banks', email: 'tiffany.banks@cochranexteriors.com', role: 'Sales Rep', ytdEarnings: 47000, ytdJobs: 41, avgGP: 31.1, tier: 'bronze', joinDate: '2023-04-15' },
    { id: 'ce-7', name: 'Cole Hendricks', email: 'cole.hendricks@cochranexteriors.com', role: 'Sales Rep', ytdEarnings: 38000, ytdJobs: 33, avgGP: 30.2, tier: 'bronze', joinDate: '2023-10-01' },
    { id: 'ce-8', name: 'Ashley Parker', email: 'ashley.parker@cochranexteriors.com', role: 'Canvasser', ytdEarnings: 29000, ytdJobs: 24, avgGP: 28.7, tier: 'bronze', joinDate: '2024-02-19' },
    { id: 'ce-9', name: 'Devon Grant', email: 'devon.grant@cochranexteriors.com', role: 'Canvasser', ytdEarnings: 22000, ytdJobs: 18, avgGP: 27.5, tier: 'bronze', joinDate: '2024-06-10' },
    { id: 'ce-10', name: 'Mia Sullivan', email: 'mia.sullivan@cochranexteriors.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 26.9, tier: 'bronze', joinDate: '2025-01-13' },
    { id: 'ce-11', name: 'Brett Norris', email: 'brett.norris@cochranexteriors.com', role: 'Trainee', ytdEarnings: 11000, ytdJobs: 8, avgGP: 25.8, tier: 'bronze', joinDate: '2025-07-01' },
    { id: 'ce-12', name: 'Kendra Yates', email: 'kendra.yates@cochranexteriors.com', role: 'Trainee', ytdEarnings: 8000, ytdJobs: 6, avgGP: 24.5, tier: 'bronze', joinDate: '2025-09-15' },
  ],
  'brand-4': [ // Exterior Heroes — OH
    { id: 'eh-1', name: 'Derek Marshall', email: 'derek.marshall@exteriorheroes.com', role: 'Senior Sales Rep', ytdEarnings: 105000, ytdJobs: 88, avgGP: 37.6, tier: 'silver', joinDate: '2019-06-15' },
    { id: 'eh-2', name: 'Heather Knox', email: 'heather.knox@exteriorheroes.com', role: 'Sales Rep', ytdEarnings: 78000, ytdJobs: 67, avgGP: 35.4, tier: 'silver', joinDate: '2021-03-10' },
    { id: 'eh-3', name: 'Brian Waller', email: 'brian.waller@exteriorheroes.com', role: 'Sales Rep', ytdEarnings: 62000, ytdJobs: 54, avgGP: 33.9, tier: 'bronze', joinDate: '2022-01-25' },
    { id: 'eh-4', name: 'Jenna Hobbs', email: 'jenna.hobbs@exteriorheroes.com', role: 'Sales Rep', ytdEarnings: 48000, ytdJobs: 42, avgGP: 31.8, tier: 'bronze', joinDate: '2023-05-14' },
    { id: 'eh-5', name: 'Patrick Doyle', email: 'patrick.doyle@exteriorheroes.com', role: 'Sales Rep', ytdEarnings: 36000, ytdJobs: 31, avgGP: 30.2, tier: 'bronze', joinDate: '2024-01-08' },
    { id: 'eh-6', name: 'Vanessa Cruz', email: 'vanessa.cruz@exteriorheroes.com', role: 'Canvasser', ytdEarnings: 22000, ytdJobs: 18, avgGP: 28.4, tier: 'bronze', joinDate: '2024-08-20' },
    { id: 'eh-7', name: 'Kyle Pittman', email: 'kyle.pittman@exteriorheroes.com', role: 'Trainee', ytdEarnings: 14000, ytdJobs: 11, avgGP: 26.8, tier: 'bronze', joinDate: '2025-03-01' },
  ],
  'brand-5': [ // Parkhill Roofing — OH
    { id: 'pr-1', name: 'Scott Parkhill', email: 'scott.parkhill@parkhillroofing.com', role: 'Senior Sales Rep', ytdEarnings: 118000, ytdJobs: 95, avgGP: 40.2, tier: 'gold', joinDate: '2017-01-10' },
    { id: 'pr-2', name: 'Megan Dyer', email: 'megan.dyer@parkhillroofing.com', role: 'Sales Rep', ytdEarnings: 84000, ytdJobs: 72, avgGP: 37.1, tier: 'silver', joinDate: '2020-09-15' },
    { id: 'pr-3', name: 'Anthony Reeves', email: 'anthony.reeves@parkhillroofing.com', role: 'Sales Rep', ytdEarnings: 67000, ytdJobs: 58, avgGP: 34.6, tier: 'bronze', joinDate: '2022-04-20' },
    { id: 'pr-4', name: 'Danielle Horn', email: 'danielle.horn@parkhillroofing.com', role: 'Sales Rep', ytdEarnings: 52000, ytdJobs: 45, avgGP: 32.8, tier: 'bronze', joinDate: '2023-02-10' },
    { id: 'pr-5', name: 'Shane Brooks', email: 'shane.brooks@parkhillroofing.com', role: 'Canvasser', ytdEarnings: 31000, ytdJobs: 26, avgGP: 29.5, tier: 'bronze', joinDate: '2024-05-15' },
    { id: 'pr-6', name: 'Tara Whitfield', email: 'tara.whitfield@parkhillroofing.com', role: 'Trainee', ytdEarnings: 16000, ytdJobs: 12, avgGP: 27.2, tier: 'bronze', joinDate: '2025-02-01' },
  ],
  'brand-6': [ // Werner Roofing — MI
    { id: 'wr-1', name: 'Patricia Brown', email: 'patricia.brown@wernerroofing.com', role: 'Senior Sales Rep', ytdEarnings: 72000, ytdJobs: 68, avgGP: 34.1, tier: 'bronze', joinDate: '2020-06-12' },
    { id: 'wr-2', name: 'Mark Werner', email: 'mark.werner@wernerroofing.com', role: 'Sales Rep', ytdEarnings: 95000, ytdJobs: 82, avgGP: 36.7, tier: 'silver', joinDate: '2018-05-01' },
    { id: 'wr-3', name: 'Chris Vandenberg', email: 'chris.vandenberg@wernerroofing.com', role: 'Sales Rep', ytdEarnings: 68000, ytdJobs: 59, avgGP: 33.5, tier: 'bronze', joinDate: '2021-11-15' },
    { id: 'wr-4', name: 'Amy Dekker', email: 'amy.dekker@wernerroofing.com', role: 'Sales Rep', ytdEarnings: 54000, ytdJobs: 47, avgGP: 32.1, tier: 'bronze', joinDate: '2022-08-20' },
    { id: 'wr-5', name: 'Todd Ritsema', email: 'todd.ritsema@wernerroofing.com', role: 'Sales Rep', ytdEarnings: 41000, ytdJobs: 36, avgGP: 30.4, tier: 'bronze', joinDate: '2023-06-01' },
    { id: 'wr-6', name: 'Nicole Vander Wal', email: 'nicole.vanderwal@wernerroofing.com', role: 'Sales Rep', ytdEarnings: 33000, ytdJobs: 28, avgGP: 29.2, tier: 'bronze', joinDate: '2024-01-15' },
    { id: 'wr-7', name: 'Jake Ter Haar', email: 'jake.terhaar@wernerroofing.com', role: 'Canvasser', ytdEarnings: 24000, ytdJobs: 19, avgGP: 27.8, tier: 'bronze', joinDate: '2024-07-01' },
    { id: 'wr-8', name: 'Leah Scholten', email: 'leah.scholten@wernerroofing.com', role: 'Canvasser', ytdEarnings: 18000, ytdJobs: 14, avgGP: 26.5, tier: 'bronze', joinDate: '2025-01-20' },
    { id: 'wr-9', name: 'Dustin Brower', email: 'dustin.brower@wernerroofing.com', role: 'Trainee', ytdEarnings: 11000, ytdJobs: 8, avgGP: 25.1, tier: 'bronze', joinDate: '2025-08-01' },
  ],
  'brand-7': [ // Premier Roofing — MI
    { id: 'pmr-1', name: 'Dave Westra', email: 'dave.westra@premierroofing.com', role: 'Senior Sales Rep', ytdEarnings: 121000, ytdJobs: 104, avgGP: 38.9, tier: 'gold', joinDate: '2018-02-15' },
    { id: 'pmr-2', name: 'Laura Kaminski', email: 'laura.kaminski@premierroofing.com', role: 'Sales Rep', ytdEarnings: 92000, ytdJobs: 78, avgGP: 36.2, tier: 'silver', joinDate: '2020-07-10' },
    { id: 'pmr-3', name: 'Ben Kowalski', email: 'ben.kowalski@premierroofing.com', role: 'Sales Rep', ytdEarnings: 76000, ytdJobs: 66, avgGP: 34.8, tier: 'bronze', joinDate: '2021-04-22' },
    { id: 'pmr-4', name: 'Stacy Nowak', email: 'stacy.nowak@premierroofing.com', role: 'Sales Rep', ytdEarnings: 61000, ytdJobs: 53, avgGP: 33.1, tier: 'bronze', joinDate: '2022-06-18' },
    { id: 'pmr-5', name: 'Kevin Drost', email: 'kevin.drost@premierroofing.com', role: 'Sales Rep', ytdEarnings: 47000, ytdJobs: 41, avgGP: 31.5, tier: 'bronze', joinDate: '2023-03-05' },
    { id: 'pmr-6', name: 'Emily Zientek', email: 'emily.zientek@premierroofing.com', role: 'Sales Rep', ytdEarnings: 38000, ytdJobs: 33, avgGP: 30.2, tier: 'bronze', joinDate: '2023-10-15' },
    { id: 'pmr-7', name: 'Ryan DeVries', email: 'ryan.devries@premierroofing.com', role: 'Canvasser', ytdEarnings: 27000, ytdJobs: 22, avgGP: 28.4, tier: 'bronze', joinDate: '2024-04-01' },
    { id: 'pmr-8', name: 'Hannah Pohl', email: 'hannah.pohl@premierroofing.com', role: 'Canvasser', ytdEarnings: 19000, ytdJobs: 15, avgGP: 27.1, tier: 'bronze', joinDate: '2024-09-20' },
    { id: 'pmr-9', name: 'Alex Mulder', email: 'alex.mulder@premierroofing.com', role: 'Trainee', ytdEarnings: 13000, ytdJobs: 10, avgGP: 25.8, tier: 'bronze', joinDate: '2025-05-01' },
    { id: 'pmr-10', name: 'Chloe Bos', email: 'chloe.bos@premierroofing.com', role: 'Trainee', ytdEarnings: 9000, ytdJobs: 7, avgGP: 24.9, tier: 'bronze', joinDate: '2025-08-15' },
  ],
  // ────────── NORTHEAST ──────────
  'brand-8': [ // Henderson Roofing — RI (8 reps, real commission structure from Henderson doc)
    { id: 'hr-1', name: 'Tom Henderson', email: 'tom.henderson@hendersonroofing.com', role: 'Senior Sales Rep', ytdEarnings: 98000, ytdJobs: 84, avgGP: 39.5, tier: 'silver', joinDate: '2017-09-01' },
    { id: 'hr-2', name: 'Katie Sousa', email: 'katie.sousa@hendersonroofing.com', role: 'Sales Rep', ytdEarnings: 72000, ytdJobs: 62, avgGP: 37.4, tier: 'silver', joinDate: '2021-02-18' },
    { id: 'hr-3', name: 'Derek Pina', email: 'derek.pina@hendersonroofing.com', role: 'Sales Rep', ytdEarnings: 56000, ytdJobs: 48, avgGP: 34.7, tier: 'bronze', joinDate: '2022-05-10' },
    { id: 'hr-4', name: 'Jen Cabral', email: 'jen.cabral@hendersonroofing.com', role: 'Sales Rep', ytdEarnings: 42000, ytdJobs: 36, avgGP: 31.2, tier: 'bronze', joinDate: '2023-04-15' },
    { id: 'hr-5', name: 'Steve Medeiros', email: 'steve.medeiros@hendersonroofing.com', role: 'Sales Rep', ytdEarnings: 28000, ytdJobs: 22, avgGP: 32.0, tier: 'bronze', joinDate: '2024-02-01' },
    { id: 'hr-6', name: 'Lauren Silvia', email: 'lauren.silvia@hendersonroofing.com', role: 'Sales Rep', ytdEarnings: 18000, ytdJobs: 14, avgGP: 30.9, tier: 'bronze', joinDate: '2024-08-15' },
    { id: 'hr-7', name: 'Matt Correia', email: 'matt.correia@hendersonroofing.com', role: 'Canvasser', ytdEarnings: 12000, ytdJobs: 10, avgGP: 26.7, tier: 'bronze', joinDate: '2025-01-10' },
    { id: 'hr-8', name: 'Brianna Tavares', email: 'brianna.tavares@hendersonroofing.com', role: 'Trainee', ytdEarnings: 8000, ytdJobs: 6, avgGP: 25.3, tier: 'bronze', joinDate: '2025-06-01' },
  ],
  'brand-9': [ // GF Sprague — MA
    { id: 'gfs-1', name: 'Robert Sprague', email: 'robert.sprague@gfsprague.com', role: 'Senior Sales Rep', ytdEarnings: 142000, ytdJobs: 112, avgGP: 41.2, tier: 'gold', joinDate: '2016-03-15' },
    { id: 'gfs-2', name: 'Nicole DiMaggio', email: 'nicole.dimaggio@gfsprague.com', role: 'Sales Rep', ytdEarnings: 108000, ytdJobs: 89, avgGP: 38.6, tier: 'gold', joinDate: '2019-08-20' },
    { id: 'gfs-3', name: 'Paul Cavanaugh', email: 'paul.cavanaugh@gfsprague.com', role: 'Sales Rep', ytdEarnings: 86000, ytdJobs: 73, avgGP: 36.4, tier: 'silver', joinDate: '2020-11-10' },
    { id: 'gfs-4', name: 'Angela Russo', email: 'angela.russo@gfsprague.com', role: 'Sales Rep', ytdEarnings: 68000, ytdJobs: 58, avgGP: 34.5, tier: 'bronze', joinDate: '2022-01-22' },
    { id: 'gfs-5', name: 'Tim Flaherty', email: 'tim.flaherty@gfsprague.com', role: 'Sales Rep', ytdEarnings: 54000, ytdJobs: 46, avgGP: 32.7, tier: 'bronze', joinDate: '2022-09-05' },
    { id: 'gfs-6', name: 'Maria Santos', email: 'maria.santos@gfsprague.com', role: 'Sales Rep', ytdEarnings: 42000, ytdJobs: 36, avgGP: 31.3, tier: 'bronze', joinDate: '2023-06-18' },
    { id: 'gfs-7', name: 'Sean Murphy', email: 'sean.murphy@gfsprague.com', role: 'Sales Rep', ytdEarnings: 35000, ytdJobs: 30, avgGP: 29.8, tier: 'bronze', joinDate: '2024-01-10' },
    { id: 'gfs-8', name: 'Kristen O\'Brien', email: 'kristen.obrien@gfsprague.com', role: 'Canvasser', ytdEarnings: 24000, ytdJobs: 19, avgGP: 28.1, tier: 'bronze', joinDate: '2024-06-15' },
    { id: 'gfs-9', name: 'Matt Callahan', email: 'matt.callahan@gfsprague.com', role: 'Canvasser', ytdEarnings: 18000, ytdJobs: 14, avgGP: 26.9, tier: 'bronze', joinDate: '2024-11-01' },
    { id: 'gfs-10', name: 'Amy Sullivan', email: 'amy.sullivan@gfsprague.com', role: 'Trainee', ytdEarnings: 12000, ytdJobs: 9, avgGP: 25.5, tier: 'bronze', joinDate: '2025-05-20' },
    { id: 'gfs-11', name: 'Chris Doherty', email: 'chris.doherty@gfsprague.com', role: 'Trainee', ytdEarnings: 8000, ytdJobs: 6, avgGP: 24.2, tier: 'bronze', joinDate: '2025-09-01' },
  ],
  'brand-10': [ // Resnick Roofing — PA
    { id: 'rr-1', name: 'Joe Resnick', email: 'joe.resnick@resnickroofing.com', role: 'Senior Sales Rep', ytdEarnings: 108000, ytdJobs: 92, avgGP: 38.1, tier: 'gold', joinDate: '2017-04-20' },
    { id: 'rr-2', name: 'Beth Kowalczyk', email: 'beth.kowalczyk@resnickroofing.com', role: 'Sales Rep', ytdEarnings: 82000, ytdJobs: 70, avgGP: 35.9, tier: 'silver', joinDate: '2020-10-05' },
    { id: 'rr-3', name: 'Adam Petrosky', email: 'adam.petrosky@resnickroofing.com', role: 'Sales Rep', ytdEarnings: 64000, ytdJobs: 55, avgGP: 34.2, tier: 'bronze', joinDate: '2022-02-14' },
    { id: 'rr-4', name: 'Dana Yablonski', email: 'dana.yablonski@resnickroofing.com', role: 'Sales Rep', ytdEarnings: 48000, ytdJobs: 42, avgGP: 32.1, tier: 'bronze', joinDate: '2023-01-08' },
    { id: 'rr-5', name: 'Steve Borkowski', email: 'steve.borkowski@resnickroofing.com', role: 'Sales Rep', ytdEarnings: 38000, ytdJobs: 33, avgGP: 30.5, tier: 'bronze', joinDate: '2023-08-22' },
    { id: 'rr-6', name: 'Tina Caputo', email: 'tina.caputo@resnickroofing.com', role: 'Canvasser', ytdEarnings: 24000, ytdJobs: 19, avgGP: 28.3, tier: 'bronze', joinDate: '2024-04-10' },
    { id: 'rr-7', name: 'Matt Shultz', email: 'matt.shultz@resnickroofing.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 26.7, tier: 'bronze', joinDate: '2024-10-15' },
    { id: 'rr-8', name: 'Lauren Kish', email: 'lauren.kish@resnickroofing.com', role: 'Trainee', ytdEarnings: 10000, ytdJobs: 7, avgGP: 25.1, tier: 'bronze', joinDate: '2025-06-01' },
  ],
  'brand-11': [ // High Point Roofing — NJ
    { id: 'hp-1', name: 'Frank DiNapoli', email: 'frank.dinapoli@highpointroofing.com', role: 'Senior Sales Rep', ytdEarnings: 96000, ytdJobs: 82, avgGP: 37.4, tier: 'silver', joinDate: '2018-08-15' },
    { id: 'hp-2', name: 'Maria Gonzalez', email: 'maria.gonzalez@highpointroofing.com', role: 'Sales Rep', ytdEarnings: 74000, ytdJobs: 64, avgGP: 35.2, tier: 'silver', joinDate: '2021-01-10' },
    { id: 'hp-3', name: 'Tony Russo', email: 'tony.russo@highpointroofing.com', role: 'Sales Rep', ytdEarnings: 58000, ytdJobs: 50, avgGP: 33.1, tier: 'bronze', joinDate: '2022-06-22' },
    { id: 'hp-4', name: 'Stephanie Vega', email: 'stephanie.vega@highpointroofing.com', role: 'Sales Rep', ytdEarnings: 44000, ytdJobs: 38, avgGP: 31.4, tier: 'bronze', joinDate: '2023-03-18' },
    { id: 'hp-5', name: 'Mike Costello', email: 'mike.costello@highpointroofing.com', role: 'Sales Rep', ytdEarnings: 34000, ytdJobs: 29, avgGP: 29.8, tier: 'bronze', joinDate: '2024-01-05' },
    { id: 'hp-6', name: 'Rachel Santoro', email: 'rachel.santoro@highpointroofing.com', role: 'Canvasser', ytdEarnings: 21000, ytdJobs: 17, avgGP: 27.6, tier: 'bronze', joinDate: '2024-08-15' },
    { id: 'hp-7', name: 'Danny Ortiz', email: 'danny.ortiz@highpointroofing.com', role: 'Trainee', ytdEarnings: 12000, ytdJobs: 9, avgGP: 25.4, tier: 'bronze', joinDate: '2025-04-01' },
  ],
  'brand-12': [ // Couto Construction — MA
    { id: 'cc-1', name: 'Jason Couto', email: 'jason.couto@coutoconstruction.com', role: 'Senior Sales Rep', ytdEarnings: 115000, ytdJobs: 96, avgGP: 39.5, tier: 'gold', joinDate: '2016-11-01' },
    { id: 'cc-2', name: 'Beth Tavares', email: 'beth.tavares@coutoconstruction.com', role: 'Sales Rep', ytdEarnings: 88000, ytdJobs: 75, avgGP: 36.8, tier: 'silver', joinDate: '2020-04-15' },
    { id: 'cc-3', name: 'Nick Rapoza', email: 'nick.rapoza@coutoconstruction.com', role: 'Sales Rep', ytdEarnings: 72000, ytdJobs: 62, avgGP: 34.9, tier: 'bronze', joinDate: '2021-07-20' },
    { id: 'cc-4', name: 'Lisa Correia', email: 'lisa.correia@coutoconstruction.com', role: 'Sales Rep', ytdEarnings: 56000, ytdJobs: 48, avgGP: 33.2, tier: 'bronze', joinDate: '2022-10-08' },
    { id: 'cc-5', name: 'Eric DeMello', email: 'eric.demello@coutoconstruction.com', role: 'Sales Rep', ytdEarnings: 43000, ytdJobs: 37, avgGP: 31.6, tier: 'bronze', joinDate: '2023-05-22' },
    { id: 'cc-6', name: 'Briana Furtado', email: 'briana.furtado@coutoconstruction.com', role: 'Sales Rep', ytdEarnings: 34000, ytdJobs: 29, avgGP: 30.1, tier: 'bronze', joinDate: '2024-01-15' },
    { id: 'cc-7', name: 'Dan Souza', email: 'dan.souza@coutoconstruction.com', role: 'Canvasser', ytdEarnings: 24000, ytdJobs: 19, avgGP: 28.4, tier: 'bronze', joinDate: '2024-07-10' },
    { id: 'cc-8', name: 'Kelsey Pereira', email: 'kelsey.pereira@coutoconstruction.com', role: 'Canvasser', ytdEarnings: 17000, ytdJobs: 13, avgGP: 26.9, tier: 'bronze', joinDate: '2025-02-01' },
    { id: 'cc-9', name: 'Tyler Amaral', email: 'tyler.amaral@coutoconstruction.com', role: 'Trainee', ytdEarnings: 11000, ytdJobs: 8, avgGP: 25.2, tier: 'bronze', joinDate: '2025-07-15' },
  ],
  // ────────── MID-ATLANTIC ──────────
  'brand-13': [ // G. Fedale — DE/Mid-Atlantic
    { id: 'gf-1', name: 'Jennifer Lee', email: 'jennifer.lee@gfedale.com', role: 'Senior Sales Rep', ytdEarnings: 96000, ytdJobs: 84, avgGP: 35.9, tier: 'silver', joinDate: '2019-05-10' },
    { id: 'gf-2', name: 'Greg Fedale Jr.', email: 'greg.fedale@gfedale.com', role: 'Sales Rep', ytdEarnings: 132000, ytdJobs: 108, avgGP: 40.4, tier: 'gold', joinDate: '2015-01-15' },
    { id: 'gf-3', name: 'Cathy DiSabatino', email: 'cathy.disabatino@gfedale.com', role: 'Sales Rep', ytdEarnings: 88000, ytdJobs: 74, avgGP: 37.2, tier: 'silver', joinDate: '2020-03-22' },
    { id: 'gf-4', name: 'James McBride', email: 'james.mcbride@gfedale.com', role: 'Sales Rep', ytdEarnings: 74000, ytdJobs: 63, avgGP: 35.5, tier: 'silver', joinDate: '2021-06-18' },
    { id: 'gf-5', name: 'Nicole Petrucci', email: 'nicole.petrucci@gfedale.com', role: 'Sales Rep', ytdEarnings: 62000, ytdJobs: 53, avgGP: 33.8, tier: 'bronze', joinDate: '2022-02-14' },
    { id: 'gf-6', name: 'Tom Hastings', email: 'tom.hastings@gfedale.com', role: 'Sales Rep', ytdEarnings: 49000, ytdJobs: 42, avgGP: 32.1, tier: 'bronze', joinDate: '2022-09-10' },
    { id: 'gf-7', name: 'Danielle Marino', email: 'danielle.marino@gfedale.com', role: 'Sales Rep', ytdEarnings: 38000, ytdJobs: 33, avgGP: 30.6, tier: 'bronze', joinDate: '2023-04-05' },
    { id: 'gf-8', name: 'Rob Cianci', email: 'rob.cianci@gfedale.com', role: 'Sales Rep', ytdEarnings: 31000, ytdJobs: 27, avgGP: 29.2, tier: 'bronze', joinDate: '2023-10-20' },
    { id: 'gf-9', name: 'Sarah DeLuca', email: 'sarah.deluca@gfedale.com', role: 'Canvasser', ytdEarnings: 22000, ytdJobs: 18, avgGP: 27.5, tier: 'bronze', joinDate: '2024-05-15' },
    { id: 'gf-10', name: 'Mike Castellano', email: 'mike.castellano@gfedale.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 26.1, tier: 'bronze', joinDate: '2024-11-01' },
    { id: 'gf-11', name: 'Jen Bonfiglio', email: 'jen.bonfiglio@gfedale.com', role: 'Canvasser', ytdEarnings: 14000, ytdJobs: 10, avgGP: 25.4, tier: 'bronze', joinDate: '2025-02-15' },
    { id: 'gf-12', name: 'Chris Palermo', email: 'chris.palermo@gfedale.com', role: 'Trainee', ytdEarnings: 9000, ytdJobs: 7, avgGP: 24.1, tier: 'bronze', joinDate: '2025-07-01' },
    { id: 'gf-13', name: 'Amanda Gentile', email: 'amanda.gentile@gfedale.com', role: 'Trainee', ytdEarnings: 6000, ytdJobs: 4, avgGP: 23.5, tier: 'bronze', joinDate: '2025-10-01' },
    { id: 'gf-14', name: 'Steve Rizzo', email: 'steve.rizzo@gfedale.com', role: 'Trainee', ytdEarnings: 4000, ytdJobs: 3, avgGP: 22.8, tier: 'bronze', joinDate: '2026-01-06' },
  ],
  'brand-14': [ // Franzoso — NY
    { id: 'fz-1', name: 'Marco Franzoso', email: 'marco.franzoso@franzoso.com', role: 'Senior Sales Rep', ytdEarnings: 104000, ytdJobs: 88, avgGP: 38.7, tier: 'gold', joinDate: '2017-06-15' },
    { id: 'fz-2', name: 'Rachel Donnelly', email: 'rachel.donnelly@franzoso.com', role: 'Sales Rep', ytdEarnings: 78000, ytdJobs: 66, avgGP: 35.4, tier: 'silver', joinDate: '2021-01-20' },
    { id: 'fz-3', name: 'Kevin O\'Connell', email: 'kevin.oconnell@franzoso.com', role: 'Sales Rep', ytdEarnings: 62000, ytdJobs: 53, avgGP: 33.9, tier: 'bronze', joinDate: '2022-04-10' },
    { id: 'fz-4', name: 'Theresa Marino', email: 'theresa.marino@franzoso.com', role: 'Sales Rep', ytdEarnings: 48000, ytdJobs: 41, avgGP: 31.8, tier: 'bronze', joinDate: '2023-02-28' },
    { id: 'fz-5', name: 'Brian Sweeney', email: 'brian.sweeney@franzoso.com', role: 'Sales Rep', ytdEarnings: 36000, ytdJobs: 31, avgGP: 30.2, tier: 'bronze', joinDate: '2023-09-15' },
    { id: 'fz-6', name: 'Dana Castellano', email: 'dana.castellano@franzoso.com', role: 'Canvasser', ytdEarnings: 24000, ytdJobs: 19, avgGP: 28.1, tier: 'bronze', joinDate: '2024-05-01' },
    { id: 'fz-7', name: 'Pete Moretti', email: 'pete.moretti@franzoso.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 26.4, tier: 'bronze', joinDate: '2024-10-20' },
    { id: 'fz-8', name: 'Erin Walsh', email: 'erin.walsh@franzoso.com', role: 'Trainee', ytdEarnings: 9000, ytdJobs: 7, avgGP: 24.8, tier: 'bronze', joinDate: '2025-06-01' },
  ],
  'brand-15': [ // American Home Contractors — MD
    { id: 'ahc-1', name: 'Chris Martinez', email: 'chris.martinez@ahcenergy.com', role: 'Senior Energy Advisor', ytdEarnings: 168000, ytdJobs: 134, avgGP: 42.8, tier: 'platinum', joinDate: '2018-01-10' },
    { id: 'ahc-2', name: 'Lauren Kim', email: 'lauren.kim@ahcenergy.com', role: 'Energy Advisor', ytdEarnings: 128000, ytdJobs: 104, avgGP: 39.5, tier: 'gold', joinDate: '2019-07-15' },
    { id: 'ahc-3', name: 'Mike O\'Brien', email: 'mike.obrien@ahcenergy.com', role: 'Energy Advisor', ytdEarnings: 106000, ytdJobs: 88, avgGP: 37.2, tier: 'silver', joinDate: '2020-03-20' },
    { id: 'ahc-4', name: 'Jessica Shah', email: 'jessica.shah@ahcenergy.com', role: 'Energy Advisor', ytdEarnings: 92000, ytdJobs: 76, avgGP: 35.8, tier: 'silver', joinDate: '2020-11-05' },
    { id: 'ahc-5', name: 'David Chen', email: 'david.chen@ahcenergy.com', role: 'Solar Specialist', ytdEarnings: 84000, ytdJobs: 68, avgGP: 34.6, tier: 'bronze', joinDate: '2021-06-18' },
    { id: 'ahc-6', name: 'Amanda Torres', email: 'amanda.torres@ahcenergy.com', role: 'Solar Specialist', ytdEarnings: 72000, ytdJobs: 58, avgGP: 33.2, tier: 'bronze', joinDate: '2022-01-10' },
    { id: 'ahc-7', name: 'Brandon Lewis', email: 'brandon.lewis@ahcenergy.com', role: 'Energy Advisor', ytdEarnings: 64000, ytdJobs: 52, avgGP: 32.1, tier: 'bronze', joinDate: '2022-08-22' },
    { id: 'ahc-8', name: 'Priya Patel', email: 'priya.patel@ahcenergy.com', role: 'Energy Advisor', ytdEarnings: 56000, ytdJobs: 45, avgGP: 31.4, tier: 'bronze', joinDate: '2023-02-14' },
    { id: 'ahc-9', name: 'Ryan Cooper', email: 'ryan.cooper@ahcenergy.com', role: 'Solar Specialist', ytdEarnings: 48000, ytdJobs: 39, avgGP: 30.5, tier: 'bronze', joinDate: '2023-07-01' },
    { id: 'ahc-10', name: 'Sarah Woods', email: 'sarah.woods@ahcenergy.com', role: 'Energy Advisor', ytdEarnings: 41000, ytdJobs: 33, avgGP: 29.8, tier: 'bronze', joinDate: '2023-12-10' },
    { id: 'ahc-11', name: 'Jason Reyes', email: 'jason.reyes@ahcenergy.com', role: 'Energy Advisor', ytdEarnings: 35000, ytdJobs: 28, avgGP: 28.6, tier: 'bronze', joinDate: '2024-04-15' },
    { id: 'ahc-12', name: 'Megan Fox', email: 'megan.fox@ahcenergy.com', role: 'Solar Specialist', ytdEarnings: 28000, ytdJobs: 22, avgGP: 27.4, tier: 'bronze', joinDate: '2024-08-20' },
    { id: 'ahc-13', name: 'Tyler Grant', email: 'tyler.grant@ahcenergy.com', role: 'Energy Advisor', ytdEarnings: 22000, ytdJobs: 17, avgGP: 26.2, tier: 'bronze', joinDate: '2024-12-01' },
    { id: 'ahc-14', name: 'Olivia Tran', email: 'olivia.tran@ahcenergy.com', role: 'Solar Specialist', ytdEarnings: 18000, ytdJobs: 14, avgGP: 25.5, tier: 'bronze', joinDate: '2025-03-15' },
    { id: 'ahc-15', name: 'Derek Adams', email: 'derek.adams@ahcenergy.com', role: 'Canvasser', ytdEarnings: 14000, ytdJobs: 11, avgGP: 24.1, tier: 'bronze', joinDate: '2025-06-01' },
    { id: 'ahc-16', name: 'Brittany Cole', email: 'brittany.cole@ahcenergy.com', role: 'Canvasser', ytdEarnings: 11000, ytdJobs: 8, avgGP: 23.4, tier: 'bronze', joinDate: '2025-08-15' },
    { id: 'ahc-17', name: 'Marcus Hill', email: 'marcus.hill@ahcenergy.com', role: 'Trainee', ytdEarnings: 8000, ytdJobs: 6, avgGP: 22.8, tier: 'bronze', joinDate: '2025-10-01' },
    { id: 'ahc-18', name: 'Emily Rivera', email: 'emily.rivera@ahcenergy.com', role: 'Trainee', ytdEarnings: 5000, ytdJobs: 4, avgGP: 22.1, tier: 'bronze', joinDate: '2025-12-15' },
    { id: 'ahc-19', name: 'Nate Foster', email: 'nate.foster@ahcenergy.com', role: 'Trainee', ytdEarnings: 3000, ytdJobs: 2, avgGP: 21.5, tier: 'bronze', joinDate: '2026-01-20' },
    { id: 'ahc-20', name: 'Aisha Johnson', email: 'aisha.johnson@ahcenergy.com', role: 'Trainee', ytdEarnings: 2000, ytdJobs: 1, avgGP: 21.0, tier: 'bronze', joinDate: '2026-02-10' },
    { id: 'ahc-21', name: 'Ben Mitchell', email: 'ben.mitchell@ahcenergy.com', role: 'Trainee', ytdEarnings: 1000, ytdJobs: 1, avgGP: 20.5, tier: 'bronze', joinDate: '2026-03-01' },
    { id: 'ahc-22', name: 'Zara Khan', email: 'zara.khan@ahcenergy.com', role: 'Trainee', ytdEarnings: 500, ytdJobs: 0, avgGP: 0, tier: 'bronze', joinDate: '2026-03-10' },
  ],
  'brand-16': [ // Exterior Medics — VA
    { id: 'em-1', name: 'James Patterson', email: 'james.patterson@exteriormedics.com', role: 'Senior Sales Rep', ytdEarnings: 114000, ytdJobs: 96, avgGP: 38.5, tier: 'gold', joinDate: '2018-05-20' },
    { id: 'em-2', name: 'Tanya Williams', email: 'tanya.williams@exteriormedics.com', role: 'Sales Rep', ytdEarnings: 86000, ytdJobs: 73, avgGP: 36.1, tier: 'silver', joinDate: '2020-09-10' },
    { id: 'em-3', name: 'Doug Huang', email: 'doug.huang@exteriormedics.com', role: 'Sales Rep', ytdEarnings: 68000, ytdJobs: 58, avgGP: 34.4, tier: 'bronze', joinDate: '2021-12-15' },
    { id: 'em-4', name: 'Kara Jackson', email: 'kara.jackson@exteriormedics.com', role: 'Sales Rep', ytdEarnings: 54000, ytdJobs: 46, avgGP: 32.7, tier: 'bronze', joinDate: '2022-07-22' },
    { id: 'em-5', name: 'Brian Nguyen', email: 'brian.nguyen@exteriormedics.com', role: 'Sales Rep', ytdEarnings: 42000, ytdJobs: 36, avgGP: 31.2, tier: 'bronze', joinDate: '2023-04-08' },
    { id: 'em-6', name: 'Michelle Davis', email: 'michelle.davis@exteriormedics.com', role: 'Sales Rep', ytdEarnings: 34000, ytdJobs: 29, avgGP: 29.8, tier: 'bronze', joinDate: '2023-11-15' },
    { id: 'em-7', name: 'Carlos Reyes', email: 'carlos.reyes@exteriormedics.com', role: 'Canvasser', ytdEarnings: 24000, ytdJobs: 19, avgGP: 27.6, tier: 'bronze', joinDate: '2024-06-01' },
    { id: 'em-8', name: 'Ashley Kim', email: 'ashley.kim@exteriormedics.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 26.1, tier: 'bronze', joinDate: '2024-12-10' },
    { id: 'em-9', name: 'Ryan Patel', email: 'ryan.patel@exteriormedics.com', role: 'Trainee', ytdEarnings: 9000, ytdJobs: 7, avgGP: 24.5, tier: 'bronze', joinDate: '2025-05-20' },
    { id: 'em-10', name: 'Danielle Brooks', email: 'danielle.brooks@exteriormedics.com', role: 'Trainee', ytdEarnings: 5000, ytdJobs: 4, avgGP: 23.2, tier: 'bronze', joinDate: '2025-09-15' },
  ],
  // ────────── PACIFIC NW ──────────
  'brand-17': [ // Valentine Roofing — WA
    { id: 'vr-1', name: 'Marcus Johnson', email: 'marcus.johnson@valentineroofing.com', role: 'Senior Sales Rep', ytdEarnings: 89000, ytdJobs: 78, avgGP: 36.2, tier: 'silver', joinDate: '2019-03-15' },
    { id: 'vr-2', name: 'Heidi Larsen', email: 'heidi.larsen@valentineroofing.com', role: 'Sales Rep', ytdEarnings: 118000, ytdJobs: 102, avgGP: 39.1, tier: 'gold', joinDate: '2018-07-20' },
    { id: 'vr-3', name: 'Pete Olson', email: 'pete.olson@valentineroofing.com', role: 'Sales Rep', ytdEarnings: 82000, ytdJobs: 71, avgGP: 35.4, tier: 'silver', joinDate: '2020-05-10' },
    { id: 'vr-4', name: 'Kendra Nguyen', email: 'kendra.nguyen@valentineroofing.com', role: 'Sales Rep', ytdEarnings: 68000, ytdJobs: 59, avgGP: 33.7, tier: 'bronze', joinDate: '2021-09-08' },
    { id: 'vr-5', name: 'Jake Anderson', email: 'jake.anderson@valentineroofing.com', role: 'Sales Rep', ytdEarnings: 56000, ytdJobs: 48, avgGP: 32.4, tier: 'bronze', joinDate: '2022-03-22' },
    { id: 'vr-6', name: 'Trish Yamamoto', email: 'trish.yamamoto@valentineroofing.com', role: 'Sales Rep', ytdEarnings: 44000, ytdJobs: 38, avgGP: 31.1, tier: 'bronze', joinDate: '2022-10-15' },
    { id: 'vr-7', name: 'Dylan Fischer', email: 'dylan.fischer@valentineroofing.com', role: 'Sales Rep', ytdEarnings: 36000, ytdJobs: 31, avgGP: 29.8, tier: 'bronze', joinDate: '2023-05-01' },
    { id: 'vr-8', name: 'Monica Reyes', email: 'monica.reyes@valentineroofing.com', role: 'Sales Rep', ytdEarnings: 28000, ytdJobs: 24, avgGP: 28.4, tier: 'bronze', joinDate: '2023-11-20' },
    { id: 'vr-9', name: 'Sam Lindgren', email: 'sam.lindgren@valentineroofing.com', role: 'Canvasser', ytdEarnings: 22000, ytdJobs: 18, avgGP: 27.1, tier: 'bronze', joinDate: '2024-04-15' },
    { id: 'vr-10', name: 'Tara Chen', email: 'tara.chen@valentineroofing.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 25.8, tier: 'bronze', joinDate: '2024-09-01' },
    { id: 'vr-11', name: 'Chase McDowell', email: 'chase.mcdowell@valentineroofing.com', role: 'Canvasser', ytdEarnings: 12000, ytdJobs: 9, avgGP: 24.5, tier: 'bronze', joinDate: '2025-01-15' },
    { id: 'vr-12', name: 'Riley Park', email: 'riley.park@valentineroofing.com', role: 'Trainee', ytdEarnings: 8000, ytdJobs: 6, avgGP: 23.2, tier: 'bronze', joinDate: '2025-06-01' },
    { id: 'vr-13', name: 'Jordan Hale', email: 'jordan.hale@valentineroofing.com', role: 'Trainee', ytdEarnings: 5000, ytdJobs: 4, avgGP: 22.1, tier: 'bronze', joinDate: '2025-09-20' },
    { id: 'vr-14', name: 'Alexis Yun', email: 'alexis.yun@valentineroofing.com', role: 'Trainee', ytdEarnings: 3000, ytdJobs: 2, avgGP: 21.0, tier: 'bronze', joinDate: '2026-01-05' },
    { id: 'vr-15', name: 'Brock Wallace', email: 'brock.wallace@valentineroofing.com', role: 'Trainee', ytdEarnings: 1000, ytdJobs: 1, avgGP: 20.0, tier: 'bronze', joinDate: '2026-02-15' },
  ],
  'brand-18': [ // Interstate Roofing — OR/WA
    { id: 'ir-1', name: 'Jeff Daniels', email: 'jeff.daniels@interstateroofing.com', role: 'Senior Sales Rep', ytdEarnings: 124000, ytdJobs: 106, avgGP: 39.8, tier: 'gold', joinDate: '2017-10-01' },
    { id: 'ir-2', name: 'Kelly Sorensen', email: 'kelly.sorensen@interstateroofing.com', role: 'Sales Rep', ytdEarnings: 94000, ytdJobs: 80, avgGP: 36.5, tier: 'silver', joinDate: '2020-02-15' },
    { id: 'ir-3', name: 'Matt Hernandez', email: 'matt.hernandez@interstateroofing.com', role: 'Sales Rep', ytdEarnings: 76000, ytdJobs: 65, avgGP: 34.8, tier: 'bronze', joinDate: '2021-05-20' },
    { id: 'ir-4', name: 'Stacy Winters', email: 'stacy.winters@interstateroofing.com', role: 'Sales Rep', ytdEarnings: 62000, ytdJobs: 53, avgGP: 33.2, tier: 'bronze', joinDate: '2022-03-08' },
    { id: 'ir-5', name: 'Nathan Powell', email: 'nathan.powell@interstateroofing.com', role: 'Sales Rep', ytdEarnings: 48000, ytdJobs: 41, avgGP: 31.5, tier: 'bronze', joinDate: '2022-10-22' },
    { id: 'ir-6', name: 'Amy Nakamura', email: 'amy.nakamura@interstateroofing.com', role: 'Sales Rep', ytdEarnings: 38000, ytdJobs: 33, avgGP: 30.1, tier: 'bronze', joinDate: '2023-06-15' },
    { id: 'ir-7', name: 'Travis Cole', email: 'travis.cole@interstateroofing.com', role: 'Sales Rep', ytdEarnings: 29000, ytdJobs: 25, avgGP: 28.7, tier: 'bronze', joinDate: '2024-01-10' },
    { id: 'ir-8', name: 'Diana Flores', email: 'diana.flores@interstateroofing.com', role: 'Canvasser', ytdEarnings: 22000, ytdJobs: 18, avgGP: 27.2, tier: 'bronze', joinDate: '2024-06-20' },
    { id: 'ir-9', name: 'Luke Peterson', email: 'luke.peterson@interstateroofing.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 25.8, tier: 'bronze', joinDate: '2024-11-15' },
    { id: 'ir-10', name: 'Brenda Lam', email: 'brenda.lam@interstateroofing.com', role: 'Canvasser', ytdEarnings: 11000, ytdJobs: 8, avgGP: 24.5, tier: 'bronze', joinDate: '2025-04-01' },
    { id: 'ir-11', name: 'Tyler Scott', email: 'tyler.scott@interstateroofing.com', role: 'Trainee', ytdEarnings: 7000, ytdJobs: 5, avgGP: 23.1, tier: 'bronze', joinDate: '2025-08-15' },
    { id: 'ir-12', name: 'Cassy Dunn', email: 'cassy.dunn@interstateroofing.com', role: 'Trainee', ytdEarnings: 4000, ytdJobs: 3, avgGP: 22.0, tier: 'bronze', joinDate: '2026-01-01' },
  ],
  'brand-19': [ // Specialty Exteriors — WA
    { id: 'se-1', name: 'Tim Westbrook', email: 'tim.westbrook@specialtyexteriors.com', role: 'Senior Sales Rep', ytdEarnings: 86000, ytdJobs: 74, avgGP: 36.8, tier: 'silver', joinDate: '2019-08-10' },
    { id: 'se-2', name: 'Wendy Carlson', email: 'wendy.carlson@specialtyexteriors.com', role: 'Sales Rep', ytdEarnings: 64000, ytdJobs: 55, avgGP: 34.2, tier: 'bronze', joinDate: '2021-11-20' },
    { id: 'se-3', name: 'Darren Kim', email: 'darren.kim@specialtyexteriors.com', role: 'Sales Rep', ytdEarnings: 48000, ytdJobs: 42, avgGP: 32.5, tier: 'bronze', joinDate: '2023-02-15' },
    { id: 'se-4', name: 'Holly Stevens', email: 'holly.stevens@specialtyexteriors.com', role: 'Sales Rep', ytdEarnings: 36000, ytdJobs: 31, avgGP: 30.8, tier: 'bronze', joinDate: '2023-09-01' },
    { id: 'se-5', name: 'Rich Takahashi', email: 'rich.takahashi@specialtyexteriors.com', role: 'Canvasser', ytdEarnings: 24000, ytdJobs: 19, avgGP: 28.4, tier: 'bronze', joinDate: '2024-05-10' },
    { id: 'se-6', name: 'Angie Mills', email: 'angie.mills@specialtyexteriors.com', role: 'Trainee', ytdEarnings: 14000, ytdJobs: 10, avgGP: 26.1, tier: 'bronze', joinDate: '2025-03-01' },
  ],
  // ────────── SOUTH & CANADA ──────────
  'brand-20': [ // Skywalker Roofing — NC
    { id: 'sk-1', name: 'David Park', email: 'david.park@skywalkerroofing.com', role: 'Senior Sales Rep', ytdEarnings: 78000, ytdJobs: 71, avgGP: 38.4, tier: 'silver', joinDate: '2019-04-15' },
    { id: 'sk-2', name: 'Luke Skywalker', email: 'luke.skywalker@skywalkerroofing.com', role: 'Sales Rep', ytdEarnings: 126000, ytdJobs: 108, avgGP: 40.1, tier: 'gold', joinDate: '2016-01-10' },
    { id: 'sk-3', name: 'Mary Beth Gentry', email: 'marybeth.gentry@skywalkerroofing.com', role: 'Sales Rep', ytdEarnings: 88000, ytdJobs: 75, avgGP: 36.8, tier: 'silver', joinDate: '2020-06-20' },
    { id: 'sk-4', name: 'Travis Long', email: 'travis.long@skywalkerroofing.com', role: 'Sales Rep', ytdEarnings: 72000, ytdJobs: 62, avgGP: 35.1, tier: 'silver', joinDate: '2021-03-08' },
    { id: 'sk-5', name: 'Becky Owens', email: 'becky.owens@skywalkerroofing.com', role: 'Sales Rep', ytdEarnings: 58000, ytdJobs: 50, avgGP: 33.4, tier: 'bronze', joinDate: '2022-01-22' },
    { id: 'sk-6', name: 'Danny Williams', email: 'danny.williams@skywalkerroofing.com', role: 'Sales Rep', ytdEarnings: 46000, ytdJobs: 40, avgGP: 31.7, tier: 'bronze', joinDate: '2022-09-15' },
    { id: 'sk-7', name: 'Crystal Hayes', email: 'crystal.hayes@skywalkerroofing.com', role: 'Sales Rep', ytdEarnings: 36000, ytdJobs: 31, avgGP: 30.2, tier: 'bronze', joinDate: '2023-04-01' },
    { id: 'sk-8', name: 'Billy Atkins', email: 'billy.atkins@skywalkerroofing.com', role: 'Sales Rep', ytdEarnings: 28000, ytdJobs: 24, avgGP: 28.8, tier: 'bronze', joinDate: '2023-10-20' },
    { id: 'sk-9', name: 'Tammy Fox', email: 'tammy.fox@skywalkerroofing.com', role: 'Canvasser', ytdEarnings: 22000, ytdJobs: 18, avgGP: 27.3, tier: 'bronze', joinDate: '2024-03-15' },
    { id: 'sk-10', name: 'Chad Robertson', email: 'chad.robertson@skywalkerroofing.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 25.9, tier: 'bronze', joinDate: '2024-08-01' },
    { id: 'sk-11', name: 'Sierra Mitchell', email: 'sierra.mitchell@skywalkerroofing.com', role: 'Canvasser', ytdEarnings: 11000, ytdJobs: 8, avgGP: 24.5, tier: 'bronze', joinDate: '2025-01-10' },
    { id: 'sk-12', name: 'Tyler Barnes', email: 'tyler.barnes@skywalkerroofing.com', role: 'Trainee', ytdEarnings: 7000, ytdJobs: 5, avgGP: 23.1, tier: 'bronze', joinDate: '2025-06-15' },
    { id: 'sk-13', name: 'Morgan Carter', email: 'morgan.carter@skywalkerroofing.com', role: 'Trainee', ytdEarnings: 4000, ytdJobs: 3, avgGP: 22.0, tier: 'bronze', joinDate: '2025-10-01' },
    { id: 'sk-14', name: 'Austin Clay', email: 'austin.clay@skywalkerroofing.com', role: 'Trainee', ytdEarnings: 2000, ytdJobs: 1, avgGP: 21.0, tier: 'bronze', joinDate: '2026-02-01' },
  ],
  'brand-21': [ // Altec Roofing — FL
    { id: 'ar-1', name: 'Rick Morales', email: 'rick.morales@altecroofing.com', role: 'Senior Sales Rep', ytdEarnings: 118000, ytdJobs: 98, avgGP: 39.4, tier: 'gold', joinDate: '2018-02-15' },
    { id: 'ar-2', name: 'Sandra Vega', email: 'sandra.vega@altecroofing.com', role: 'Sales Rep', ytdEarnings: 92000, ytdJobs: 78, avgGP: 36.8, tier: 'silver', joinDate: '2020-05-10' },
    { id: 'ar-3', name: 'Tommy Diaz', email: 'tommy.diaz@altecroofing.com', role: 'Sales Rep', ytdEarnings: 74000, ytdJobs: 63, avgGP: 35.1, tier: 'silver', joinDate: '2021-04-22' },
    { id: 'ar-4', name: 'Jessica Cruz', email: 'jessica.cruz@altecroofing.com', role: 'Sales Rep', ytdEarnings: 58000, ytdJobs: 50, avgGP: 33.4, tier: 'bronze', joinDate: '2022-01-08' },
    { id: 'ar-5', name: 'Carlos Herrera', email: 'carlos.herrera@altecroofing.com', role: 'Sales Rep', ytdEarnings: 46000, ytdJobs: 40, avgGP: 31.8, tier: 'bronze', joinDate: '2022-08-15' },
    { id: 'ar-6', name: 'Maria Lopez', email: 'maria.lopez@altecroofing.com', role: 'Sales Rep', ytdEarnings: 36000, ytdJobs: 31, avgGP: 30.2, tier: 'bronze', joinDate: '2023-03-22' },
    { id: 'ar-7', name: 'Alex Perez', email: 'alex.perez@altecroofing.com', role: 'Sales Rep', ytdEarnings: 28000, ytdJobs: 24, avgGP: 28.9, tier: 'bronze', joinDate: '2023-10-05' },
    { id: 'ar-8', name: 'Vanessa Torres', email: 'vanessa.torres@altecroofing.com', role: 'Canvasser', ytdEarnings: 22000, ytdJobs: 18, avgGP: 27.4, tier: 'bronze', joinDate: '2024-04-15' },
    { id: 'ar-9', name: 'Kevin Santiago', email: 'kevin.santiago@altecroofing.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 26.0, tier: 'bronze', joinDate: '2024-09-20' },
    { id: 'ar-10', name: 'Diana Reyes', email: 'diana.reyes@altecroofing.com', role: 'Trainee', ytdEarnings: 10000, ytdJobs: 8, avgGP: 24.6, tier: 'bronze', joinDate: '2025-04-01' },
    { id: 'ar-11', name: 'Jose Mendez', email: 'jose.mendez@altecroofing.com', role: 'Trainee', ytdEarnings: 6000, ytdJobs: 4, avgGP: 23.2, tier: 'bronze', joinDate: '2025-09-15' },
  ],
  'brand-22': [ // Carpenter's — FL
    { id: 'cp-1', name: 'Brett Carpenter', email: 'brett.carpenter@carpentersroofing.com', role: 'Senior Sales Rep', ytdEarnings: 108000, ytdJobs: 92, avgGP: 38.6, tier: 'gold', joinDate: '2017-05-01' },
    { id: 'cp-2', name: 'Ashley Rivera', email: 'ashley.rivera@carpentersroofing.com', role: 'Sales Rep', ytdEarnings: 82000, ytdJobs: 70, avgGP: 36.2, tier: 'silver', joinDate: '2020-08-15' },
    { id: 'cp-3', name: 'Marco Gonzalez', email: 'marco.gonzalez@carpentersroofing.com', role: 'Sales Rep', ytdEarnings: 64000, ytdJobs: 55, avgGP: 34.5, tier: 'bronze', joinDate: '2022-01-10' },
    { id: 'cp-4', name: 'Tina Ramirez', email: 'tina.ramirez@carpentersroofing.com', role: 'Sales Rep', ytdEarnings: 48000, ytdJobs: 42, avgGP: 32.1, tier: 'bronze', joinDate: '2023-03-18' },
    { id: 'cp-5', name: 'Devon James', email: 'devon.james@carpentersroofing.com', role: 'Sales Rep', ytdEarnings: 36000, ytdJobs: 31, avgGP: 30.4, tier: 'bronze', joinDate: '2023-10-01' },
    { id: 'cp-6', name: 'Rosa Fernandez', email: 'rosa.fernandez@carpentersroofing.com', role: 'Canvasser', ytdEarnings: 24000, ytdJobs: 19, avgGP: 28.2, tier: 'bronze', joinDate: '2024-05-22' },
    { id: 'cp-7', name: 'Jason Vega', email: 'jason.vega@carpentersroofing.com', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 26.5, tier: 'bronze', joinDate: '2024-11-15' },
    { id: 'cp-8', name: 'Nadia Cruz', email: 'nadia.cruz@carpentersroofing.com', role: 'Trainee', ytdEarnings: 9000, ytdJobs: 7, avgGP: 24.8, tier: 'bronze', joinDate: '2025-06-01' },
  ],
  'brand-23': [ // Watkins Construction — MS/AL
    { id: 'wc-1', name: 'Bobby Watkins', email: 'bobby.watkins@watkinsconstruction.com', role: 'Senior Sales Rep', ytdEarnings: 96000, ytdJobs: 82, avgGP: 37.9, tier: 'silver', joinDate: '2018-01-20' },
    { id: 'wc-2', name: 'Tanya Ford', email: 'tanya.ford@watkinsconstruction.com', role: 'Sales Rep', ytdEarnings: 72000, ytdJobs: 62, avgGP: 35.4, tier: 'silver', joinDate: '2020-11-10' },
    { id: 'wc-3', name: 'Dwayne Coleman', email: 'dwayne.coleman@watkinsconstruction.com', role: 'Sales Rep', ytdEarnings: 56000, ytdJobs: 48, avgGP: 33.2, tier: 'bronze', joinDate: '2022-04-15' },
    { id: 'wc-4', name: 'Carla Jenkins', email: 'carla.jenkins@watkinsconstruction.com', role: 'Sales Rep', ytdEarnings: 42000, ytdJobs: 36, avgGP: 31.5, tier: 'bronze', joinDate: '2023-02-08' },
    { id: 'wc-5', name: 'Derek White', email: 'derek.white@watkinsconstruction.com', role: 'Sales Rep', ytdEarnings: 32000, ytdJobs: 28, avgGP: 29.8, tier: 'bronze', joinDate: '2023-09-22' },
    { id: 'wc-6', name: 'Lisa Green', email: 'lisa.green@watkinsconstruction.com', role: 'Canvasser', ytdEarnings: 22000, ytdJobs: 18, avgGP: 27.6, tier: 'bronze', joinDate: '2024-05-01' },
    { id: 'wc-7', name: 'Marcus Howard', email: 'marcus.howard@watkinsconstruction.com', role: 'Trainee', ytdEarnings: 12000, ytdJobs: 9, avgGP: 25.4, tier: 'bronze', joinDate: '2025-02-15' },
  ],
  'brand-24': [ // D'Angelo & Sons — Ontario, Canada
    { id: 'da-1', name: 'Tony D\'Angelo', email: 'tony.dangelo@dangeloandsons.ca', role: 'Senior Sales Rep', ytdEarnings: 102000, ytdJobs: 86, avgGP: 38.2, tier: 'gold', joinDate: '2016-04-10' },
    { id: 'da-2', name: 'Sarah Mackenzie', email: 'sarah.mackenzie@dangeloandsons.ca', role: 'Sales Rep', ytdEarnings: 78000, ytdJobs: 66, avgGP: 35.8, tier: 'silver', joinDate: '2020-01-15' },
    { id: 'da-3', name: 'Derek Sinclair', email: 'derek.sinclair@dangeloandsons.ca', role: 'Sales Rep', ytdEarnings: 62000, ytdJobs: 53, avgGP: 34.1, tier: 'bronze', joinDate: '2021-07-20' },
    { id: 'da-4', name: 'Natasha Petrov', email: 'natasha.petrov@dangeloandsons.ca', role: 'Sales Rep', ytdEarnings: 48000, ytdJobs: 41, avgGP: 32.4, tier: 'bronze', joinDate: '2022-04-08' },
    { id: 'da-5', name: 'Matt Campbell', email: 'matt.campbell@dangeloandsons.ca', role: 'Sales Rep', ytdEarnings: 38000, ytdJobs: 33, avgGP: 30.7, tier: 'bronze', joinDate: '2023-01-22' },
    { id: 'da-6', name: 'Rachel Thompson', email: 'rachel.thompson@dangeloandsons.ca', role: 'Sales Rep', ytdEarnings: 29000, ytdJobs: 25, avgGP: 29.1, tier: 'bronze', joinDate: '2023-08-15' },
    { id: 'da-7', name: 'Chris Wang', email: 'chris.wang@dangeloandsons.ca', role: 'Canvasser', ytdEarnings: 22000, ytdJobs: 18, avgGP: 27.4, tier: 'bronze', joinDate: '2024-03-01' },
    { id: 'da-8', name: 'Lindsay Fraser', email: 'lindsay.fraser@dangeloandsons.ca', role: 'Canvasser', ytdEarnings: 16000, ytdJobs: 12, avgGP: 25.8, tier: 'bronze', joinDate: '2024-09-10' },
    { id: 'da-9', name: 'Amir Hassan', email: 'amir.hassan@dangeloandsons.ca', role: 'Trainee', ytdEarnings: 10000, ytdJobs: 7, avgGP: 24.2, tier: 'bronze', joinDate: '2025-04-20' },
    { id: 'da-10', name: 'Emily O\'Reilly', email: 'emily.oreilly@dangeloandsons.ca', role: 'Trainee', ytdEarnings: 5000, ytdJobs: 3, avgGP: 22.8, tier: 'bronze', joinDate: '2025-10-15' },
  ],
  'brand-25': [ // Wheatland Roofing — Saskatchewan, Canada
    { id: 'wl-1', name: 'Grant Fehr', email: 'grant.fehr@wheatlandroofing.ca', role: 'Senior Sales Rep', ytdEarnings: 82000, ytdJobs: 70, avgGP: 37.4, tier: 'silver', joinDate: '2018-06-01' },
    { id: 'wl-2', name: 'Tara Makela', email: 'tara.makela@wheatlandroofing.ca', role: 'Sales Rep', ytdEarnings: 62000, ytdJobs: 53, avgGP: 34.8, tier: 'bronze', joinDate: '2021-03-15' },
    { id: 'wl-3', name: 'Kyle Bergen', email: 'kyle.bergen@wheatlandroofing.ca', role: 'Sales Rep', ytdEarnings: 46000, ytdJobs: 40, avgGP: 32.5, tier: 'bronze', joinDate: '2022-08-20' },
    { id: 'wl-4', name: 'Nicole Falk', email: 'nicole.falk@wheatlandroofing.ca', role: 'Canvasser', ytdEarnings: 28000, ytdJobs: 22, avgGP: 29.1, tier: 'bronze', joinDate: '2024-02-01' },
    { id: 'wl-5', name: 'Adam Klassen', email: 'adam.klassen@wheatlandroofing.ca', role: 'Trainee', ytdEarnings: 14000, ytdJobs: 10, avgGP: 26.4, tier: 'bronze', joinDate: '2025-05-15' },
  ],
};

// Helper: get team for a brand
export function getBrandTeam(brandId: string): any[] {
  return brandTeams[brandId] || [];
}

// Helper: get email domain for a brand
export function getBrandEmailDomain(brandId: string): string {
  return brandEmailDomains[brandId] || 'infinityhomeservices.com';
}
