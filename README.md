# Commission Engine — Infinity Home Services

Interactive prototype demonstrating the Commission Engine for Infinity Home Services. Features 6 role-based experiences, gamification, what-if calculator, commission handbook, dispute flow, and a "Don't Make Me Think" UX philosophy with light/dark theme support.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Import Project" and select this repo
4. Click Deploy — done. You'll get a live URL in ~60 seconds.

## Architecture

- **Framework**: Next.js 14 with TypeScript and App Router
- **Styling**: Tailwind CSS with CSS custom properties for light/dark theming
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion + CSS transitions

## 6 User Roles

| Role | Views |
|------|-------|
| **Sales Rep** | Dashboard, Deals, Commissions, Leaderboard, Calculator, My Plan, Handbook, Disputes |
| **Manager** | Team Overview, Performance, Approvals, Cost Analysis |
| **Regional VP** | Multi-Brand Overview, Brand Comparison, Scenario Modeling |
| **C-Suite** | Portfolio Analytics, Cost Trends, M&A Readiness |
| **HR/Comp Admin** | Plan Management, Acknowledgments, Disputes, Exceptions, SPIF Builder, Split Deals, Brand Onboarding, Handbook Editor, Audit Log |
| **Finance** | Payroll Status, Accrual Forecast, Reconciliation, Audit Trail |

## 5 Commission Plan Types

1. **GP% Tiered** (Apex Roofing) — 6 tiers from 4% to 10% based on gross profit percentage
2. **Draw Against Commission** (Summit Windows) — $2K monthly draw, 8% base rate
3. **Salary + Bonus** (Shield Siding) — $45K base + 12% on GP$ above 30%
4. **Per-Job Flat Bonus** (Peak Gutters) — $22/hr base + per-project-type bonuses
5. **Revenue Share** (Crown Exteriors) — Flat 6% of FCV

Built for Infinity Home Services.
