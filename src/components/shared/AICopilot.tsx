// @ts-nocheck
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Sparkles, X, Send, Globe, Lightbulb, ChevronRight, Loader2, RotateCcw, Minimize2 } from 'lucide-react';

interface AICopilotProps {
  activeView: string;
  currentRole: string;
}

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  isSearching?: boolean;
  sources?: string[];
  timestamp: Date;
}

// Context labels for each view
const viewContextLabels: Record<string, string> = {
  dashboard: 'Rep Dashboard',
  deals: 'Deals Pipeline',
  commissions: 'Commissions',
  leaderboard: 'Leaderboard',
  calculator: 'What-If Calculator',
  'my-plan': 'My Plan',
  handbook: 'Handbook',
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
  'disputes-admin': 'Disputes Admin',
  exceptions: 'Exceptions',
  'spif-builder': 'SPIF Builder',
  'split-config': 'Split Deals',
  'brand-onboarding': 'Brand Onboarding',
  'handbook-editor': 'Handbook Editor',
  'audit-log': 'Audit Log',
  payroll: 'Payroll Status',
  accrual: 'Accrual Forecast',
  reconciliation: 'Reconciliation',
  'audit-trail': 'Audit Trail',
};

// Context-aware suggested questions per view
const viewSuggestions: Record<string, string[]> = {
  dashboard: [
    'Why did my GP% drop this month?',
    'How close am I to Platinum tier?',
    'What\'s my projected payout for March?',
    'Show me my best-performing deal types',
  ],
  deals: [
    'Which deals are at risk of falling off?',
    'What\'s my average close rate this quarter?',
    'Find deals with GP above 40%',
    'How does my pipeline compare to last quarter?',
  ],
  commissions: [
    'When is my next payout scheduled?',
    'Why is this back-end still pending?',
    'How are split deals calculated?',
    'Show me my commission breakdown by deal type',
  ],
  leaderboard: [
    'What do I need to hit #1?',
    'Who\'s gaining the most this month?',
    'Compare my stats to the top 5',
    'Which brand has the most top-10 reps?',
  ],
  calculator: [
    'What happens if I hit 42% GP next month?',
    'Model my earnings if I close 15 more deals',
    'What GP% do I need for Diamond tier?',
    'Simulate doubling my window & door sales',
  ],
  'my-plan': [
    'Explain my back-end commission structure',
    'When do GP% thresholds reset?',
    'What\'s the difference between Gold and Platinum?',
    'How do SPIFs stack on top of my base plan?',
  ],
  handbook: [
    'Summarize the dispute process',
    'What are the IHS core values?',
    'How are split deals handled?',
    'Search for payout schedule details',
  ],
  disputes: [
    'What\'s the typical resolution timeline?',
    'Can I dispute a GP calculation?',
    'Who reviews my dispute?',
    'What evidence should I include?',
  ],
  scoreboard: [
    'Who needs my attention this week?',
    'Which reps are behind pace for quota?',
    'Show me the team standings vs target',
    'Who\'s trending up in the last 30 days?',
  ],
  coaching: [
    'Which rep needs coaching most urgently?',
    'Show me Jake Torres\' development areas',
    'Who should I pair for mentorship?',
    'Flag any reps at risk of tier drop',
  ],
  approvals: [
    'Are there any overdue approvals?',
    'Show exceptions pending my review',
    'What\'s the average approval turnaround?',
    'Flag any high-value exceptions',
  ],
  'the-pnl': [
    'How much net contribution did my team generate?',
    'Which rep has the best economics?',
    'What would 2% more GP mean for the bottom line?',
    'Are commission costs growing faster than revenue?',
  ],
  'multi-brand': [
    'Which brand has the best GP% right now?',
    'Show me underperforming brands by region',
    'Compare Midwest vs Northeast performance',
    'Which brands need the most attention?',
  ],
  'brand-comparison': [
    'Why is Brand X outperforming Brand Y?',
    'Normalize comparison by rep count',
    'Which region is most cost-efficient?',
    'Show me the top brand by growth rate',
  ],
  modeling: [
    'What happens if we raise the Gold threshold to 38%?',
    'Model flattening all brands to one plan',
    'Simulate adding 50 reps across Midwest',
    'What if we cap back-end at 5%?',
  ],
  portfolio: [
    'Give me a portfolio health summary',
    'Which region is driving the most growth?',
    'What\'s our total commission liability?',
    'Show me M&A readiness by brand',
  ],
  'cost-trends': [
    'Are costs trending up or down?',
    'What percentage of revenue goes to commissions?',
    'Compare this quarter to last year',
    'Forecast next quarter\'s commission expense',
  ],
  'ma-readiness': [
    'Which brands are most acquisition-ready?',
    'What plan standardization gaps exist?',
    'Show me integration risk factors',
    'Rank brands by operational maturity',
  ],
  'plan-management': [
    'Which brands don\'t have a plan yet?',
    'Show me plans expiring this quarter',
    'Compare plan structures across brands',
    'What\'s the most common commission model?',
  ],
  'brand-onboarding': [
    'What\'s the typical onboarding timeline?',
    'Show me the checklist for a new brand',
    'Which fields are most often missed?',
    'How many brands are in onboarding now?',
  ],
  'spif-builder': [
    'Which SPIFs have the best ROI?',
    'Show me active SPIFs by brand',
    'What\'s the participation rate on current SPIFs?',
    'Compare SPIF performance this quarter',
  ],
  payroll: [
    'Are all payroll files on schedule?',
    'Which brands have pending reconciliation?',
    'Show me the next payroll cutoff date',
    'Flag any discrepancies in this cycle',
  ],
  accrual: [
    'What\'s our current accrual balance?',
    'How does this month compare to forecast?',
    'Show me accrual by brand breakdown',
    'Flag any accrual anomalies',
  ],
};

// Smart canned response engine
function generateResponse(query: string, activeView: string, currentRole: string): { content: string; sources?: string[]; delay: number } {
  const q = query.toLowerCase();

  // === GP-related queries ===
  if (q.includes('gp') && (q.includes('drop') || q.includes('down') || q.includes('decrease') || q.includes('fell'))) {
    return {
      content: 'Looking at your recent deals, your GP% dipped from 41.2% to 39.3% over the last 30 days. The main driver was 3 window replacement jobs in early March that came in at 33-35% GP — below your typical 40%+ range.\n\n**Contributing factors:**\n• Competitive pricing pressure on the Lakewood subdivision (2 jobs)\n• One job had a material cost overrun on custom windows\n\n**Recommendation:** Your roofing GP remains strong at 42%. Consider focusing on higher-margin roof/siding combos to pull the average back up. You\'re only 0.7% from Platinum tier — very doable this quarter.',
      sources: ['Commission Engine Analytics', 'Deal History - Last 30 Days'],
      delay: 2200,
    };
  }

  if (q.includes('gp') && (q.includes('platinum') || q.includes('need') || q.includes('hit'))) {
    return {
      content: 'To reach **Platinum tier (45%+ GP)**, you need to increase your average GP by 5.7 percentage points from your current 39.3%.\n\nBased on your pipeline:\n• If your 10 active deals close at 44%+ GP average, you\'d move to ~41.8%\n• You\'d need roughly 20 consecutive deals at 47%+ to cross the Platinum line this quarter\n\n**Fastest path:** Focus on premium roof/siding bundles where your historical GP is 43.5%. Avoid low-margin window-only jobs for the next 6 weeks.',
      sources: ['Tier Requirements', 'Pipeline Analysis'],
      delay: 2500,
    };
  }

  // === Payout queries ===
  if (q.includes('payout') || q.includes('pay') && (q.includes('when') || q.includes('next') || q.includes('schedule'))) {
    return {
      content: 'Your next payout is scheduled for **March 31, 2026** for **$4,200**.\n\nBreakdown:\n• Front-end commissions: $2,800 (from 6 completed jobs)\n• Back-end bonus: $1,400 (Gold tier @ 8%)\n\nThere are also 3 jobs in "Final Pay" status totaling $2,720 that should process in the April 15 cycle. Your YTD total is $148,000 — on pace to break $175K by year-end.',
      sources: ['Payroll Schedule', 'Commission Statements'],
      delay: 1800,
    };
  }

  // === Leaderboard queries ===
  if (q.includes('#1') || q.includes('number one') || q.includes('top spot') || q.includes('beat')) {
    return {
      content: 'You\'re currently **#2 company-wide**, $20,000 behind Chris Martinez (American Home Contractors) who leads at $168,000.\n\nTo overtake him:\n• You need roughly 12-15 more closed deals at your current GP%\n• Chris\'s recent pace has slowed — he closed only 8 deals last month vs your 14\n• At current trajectories, you\'d pass him by mid-April\n\n**Key edge:** Your deal velocity is higher. Chris has higher GP (42.8%) but fewer deals. Keep your volume up and you\'ll close the gap naturally.',
      sources: ['Leaderboard Data', 'Performance Trends'],
      delay: 2800,
    };
  }

  if (q.includes('gaining') || q.includes('moving up') || q.includes('trending')) {
    return {
      content: 'Biggest movers this month across all 25 brands:\n\n**Rising fast:**\n• Lauren Kim (American Home Contractors) — up 4 spots, closed 18 deals in March\n• Derek Marshall (Exterior Heroes) — up 3 spots, GP jumped to 41%\n• Scott Parkhill (Parkhill Roofing) — up 2 spots, strong window/door sales\n\n**Falling:**\n• Dave Westra (Premier Roofing) — down 3 spots, slow March after strong Feb\n• Greg Fedale Jr. (G. Fedale) — down 2 spots, fewer jobs but GP holding steady\n\nOverall company trend: average GP is up 1.2% month-over-month — the new SPIF on roofing is working.',
      sources: ['Leaderboard Trends', 'Monthly Analytics'],
      delay: 2400,
    };
  }

  // === Brand comparison queries ===
  if (q.includes('brand') && (q.includes('best') || q.includes('top') || q.includes('outperform'))) {
    return {
      content: 'Top brands by GP% (YTD):\n\n1. **Overhead Solutions** — 41.5% avg GP (8 reps, Suamico WI)\n2. **Valentine Roofing** — 41.2% avg GP (10 reps, Kirkland WA)\n3. **Skywalker Roofing** — 40.8% avg GP (11 reps, Jamestown NC)\n\nOverhead Solutions punches way above their size — smallest Midwest team but highest GP. Their secret: strict deal qualification and premium-only positioning.\n\nBy earnings per rep, **American Home Contractors** leads at $28,200/rep, followed by **Infinity Exteriors** at $26,944/rep.',
      sources: ['Multi-Brand Analytics', 'Brand Performance Data'],
      delay: 2600,
    };
  }

  // === Region queries ===
  if (q.includes('midwest') || q.includes('northeast') || q.includes('region') && q.includes('compare')) {
    return {
      content: '**Regional Performance Summary (YTD):**\n\n• **Midwest** — 7 brands, 70 reps, $1.69M total. Strongest region by volume.\n• **Northeast** — 5 brands, 41 reps, $905K. Highest GP% average (39.8%).\n• **Mid-Atlantic** — 4 brands, 35 reps, $780K. Fastest growth rate (+18% QoQ).\n• **Pacific NW** — 3 brands, 28 reps, $620K. Valentine & Skywalker driving efficiency.\n• **South** — 4 brands, 54 reps, $1.42M. High volume, slightly lower GP.\n• **Canada** — 2 brands, 25 reps, $625K. Strong performance for newest market.\n\nMidwest and South drive revenue. Northeast and Pacific NW are the GP% leaders.',
      sources: ['Regional Analytics', 'Multi-Brand Overview'],
      delay: 2200,
    };
  }

  // === Plan/tier queries ===
  if (q.includes('tier') || q.includes('gold') || q.includes('silver') || q.includes('diamond')) {
    return {
      content: 'Here\'s the current tier structure for your plan:\n\n| Tier | GP% Range | Commission Rate |\n|------|-----------|----------------|\n| **Platinum** | 45%+ | 10% |\n| **Diamond** | 40-45% | 9% |\n| **Gold** | 35-40% | 8% |\n| **Silver** | 30-35% | 7% |\n| **Bronze** | <30% | 5% |\n\nYou\'re at **Gold (39.3% GP)** — only 0.7% from Diamond, which would bump your commission rate from 8% to 9%. On your current deal volume, that\'s roughly **$14,800 more per year** in earnings.',
      sources: ['Commission Plan', 'Tier Structure'],
      delay: 1800,
    };
  }

  // === Deal/pipeline queries ===
  if (q.includes('deal') && (q.includes('risk') || q.includes('fall') || q.includes('stale'))) {
    return {
      content: 'I found **3 deals at risk** in your pipeline:\n\n1. **Johnson Residence** — Roofing, $18,400. In progress 45 days (avg is 28). Customer hasn\'t signed supplement.\n2. **Elmwood HOA** — Siding, $32,000. Waiting on HOA board approval since Feb 28. High value.\n3. **Parkview Duplex** — Windows, $8,900. GP at only 29% — below Bronze threshold.\n\n**Recommendation:** Johnson Residence is your biggest risk-adjusted value. I\'d prioritize getting that supplement signed this week. The Elmwood HOA deal is worth a follow-up call to the property manager.',
      sources: ['Pipeline Data', 'Deal Aging Report'],
      delay: 2400,
    };
  }

  // === Cost queries (manager/RVP/C-suite) ===
  if (q.includes('cost') && (q.includes('rep') || q.includes('per'))) {
    return {
      content: 'Current **cost-per-rep** across the portfolio: **$23,866** (on target).\n\nBy region:\n• Midwest: $24,143/rep — slightly above average, driven by Infinity Exteriors\' larger team\n• Northeast: $22,073/rep — most efficient\n• South: $26,296/rep — highest cost, but also highest revenue per rep\n• Canada: $25,000/rep — new market premium\n\nTrend: cost-per-rep is up 3.2% YoY, but revenue-per-rep is up 7.8% — so the ratio is actually improving. The new tiered commission structure is working as intended.',
      sources: ['Cost Analysis Dashboard', 'Financial Reports'],
      delay: 2600,
    };
  }

  // === SPIF queries ===
  if (q.includes('spif') || q.includes('bonus') || q.includes('incentive')) {
    return {
      content: 'Active SPIFs right now:\n\n1. **March Roofing Blitz** — +$1,000 per roofing job. You\'ve earned $1,000 so far (1 qualifying job). Runs through March 31.\n2. **GP% Challenge** — Hit 42% avg GP this quarter for $2,500 bonus. You\'re at 39.3% — need to climb 2.7%.\n3. **Window & Door Push** — +$300/job for window or door sales. You\'ve earned $300 (1 job).\n\nTotal SPIF earnings YTD: **$1,300**. The roofing blitz has the best ROI for you — every roofing close is an extra $1K on top of your normal commission.',
      sources: ['SPIF Programs', 'Your Earnings'],
      delay: 2000,
    };
  }

  // === Modeling/what-if queries ===
  if (q.includes('what if') || q.includes('what happens') || q.includes('simulate') || q.includes('model')) {
    return {
      content: 'I can help you model that. Based on the current commission structure:\n\n**If you close 15 more deals at 41% GP this month:**\n• Estimated additional earnings: ~$18,750\n• Your tier would stay Gold (avg GP ~40.1%)\n• You\'d move up to #1 on the leaderboard by ~$6,000\n\n**If those 15 deals come in at 43% GP:**\n• Estimated additional earnings: ~$21,000\n• Your avg GP would hit ~41.4% — crossing into **Diamond tier (9%)**\n• Total projected annual earnings: ~$192,000\n\nWant me to run a different scenario?',
      sources: ['What-If Calculator', 'Commission Model'],
      delay: 2800,
    };
  }

  // === Web search type queries ===
  if (q.includes('market') || q.includes('industry') || q.includes('competitor') || q.includes('trend') || q.includes('news')) {
    return {
      content: 'Here\'s what I found on the latest home services market trends:\n\n**Roofing Industry (Q1 2026):**\n• Storm season driving 12% YoY increase in demand across Midwest\n• Material costs stabilizing after 2025 spikes — shingle prices down 4%\n• Labor shortage continues — companies with strong comp plans are retaining 23% better\n\n**Relevant to IHS:**\n• Your 25-brand portfolio positions you well for the spring rush\n• GP% optimization is the #1 lever — the industry average is 32%, IHS is running 40.2%\n• Competitors like Leaf Home are consolidating at lower margins — IHS\'s quality focus is a differentiator\n\nSource data is as of March 2026.',
      sources: ['IBISWorld Roofing Report', 'HomeAdvisor Market Data', 'Dodge Construction Outlook'],
      delay: 3200,
    };
  }

  // === Coaching queries ===
  if (q.includes('coach') || q.includes('help') || q.includes('improve') || q.includes('advice')) {
    return {
      content: 'Based on your performance data, here are my top 3 recommendations:\n\n**1. GP% Optimization (Biggest impact)**\nYour roofing GP is 42% but windows are dragging you down at 34%. Either negotiate better material pricing on windows or position them as add-ons to higher-margin roofing jobs.\n\n**2. Deal Velocity**\nYour average deal cycle is 28 days — top performers close in 22. Focus on getting supplements signed faster — that\'s where most of your deals stall.\n\n**3. SPIF Maximization**\nYou\'re leaving money on the table. The March Roofing Blitz pays $1K/job and you\'ve only claimed 1. With 10 active roofing deals, that\'s potentially $10K in bonus earnings.\n\nSmall improvements in all three areas could push you to #1 and Diamond tier by Q2.',
      sources: ['Performance Analytics', 'Historical Trends', 'Peer Comparison'],
      delay: 2600,
    };
  }

  // === Dispute queries ===
  if (q.includes('dispute') || q.includes('resolution') || q.includes('challenge')) {
    return {
      content: 'The dispute process at IHS works in 4 steps:\n\n1. **Submit** — File through My Disputes with deal details and reason\n2. **Review** — Your manager reviews within 48 hours\n3. **Investigation** — HR/Finance pulls job records (3-5 business days)\n4. **Resolution** — Decision communicated with adjustment if warranted\n\nAverage resolution time: **6 business days**. Most disputes are GP recalculations (72%) and typically result in a $200-400 adjustment.\n\nYou have 0 open disputes right now. If you believe a GP was miscalculated, I\'d recommend filing within 30 days of the payout for fastest resolution.',
      sources: ['IHS Handbook', 'Dispute Policy'],
      delay: 2200,
    };
  }

  // === Fallback — generic helpful response ===
  return {
    content: `Great question. Based on what I can see on the ${viewContextLabels[activeView] || 'current'} screen, let me analyze that for you.\n\nI'm scanning your data across all 25 IHS brands and 253 reps. Here's a quick summary:\n\n• **Your position:** #2 company-wide, Gold tier (39.3% GP)\n• **YTD earnings:** $148,000 across 151 deals\n• **Next payout:** $4,200 on March 31\n• **Hot trend:** Your monthly earnings are up 6% MoM\n\nCould you be more specific about what you'd like to explore? I can dig into deals, commissions, team comparisons, market trends, or run what-if scenarios.`,
    sources: ['Commission Engine Data'],
    delay: 2000,
  };
}

export default function AICopilot({ activeView, currentRole }: AICopilotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const contextLabel = viewContextLabels[activeView] || 'Dashboard';
  const suggestions = viewSuggestions[activeView] || viewSuggestions.dashboard;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset suggestions when view changes
  useEffect(() => {
    // Don't clear messages, just update context
  }, [activeView]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Generate response
    const response = generateResponse(text, activeView, currentRole);

    // Simulate "searching" for web-type queries
    const isWebQuery = text.toLowerCase().match(/market|industry|competitor|trend|news|latest|current/);

    if (isWebQuery) {
      const searchingMsg: Message = {
        id: `msg-${Date.now()}-searching`,
        role: 'ai',
        content: 'Searching the web and analyzing your data...',
        isSearching: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, searchingMsg]);

      await new Promise(r => setTimeout(r, 1500));

      setMessages(prev => prev.filter(m => !m.isSearching));
    }

    // Simulate typing delay
    await new Promise(r => setTimeout(r, response.delay));

    const aiMsg: Message = {
      id: `msg-${Date.now()}-ai`,
      role: 'ai',
      content: response.content,
      sources: response.sources,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setIsTyping(false);
  };

  return (
    <>
      {/* AI Panel */}
      {isOpen && (
        <div
          className="fixed z-[999] flex flex-col"
          style={{
            left: '270px',
            bottom: '16px',
            width: '420px',
            height: '560px',
            borderRadius: '20px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(59,130,246,0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            className="flex-shrink-0 px-4 py-3 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(139,92,246,0.08))',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' }}
              >
                <Sparkles size={15} color="white" />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Compass</div>
                <div className="text-[10px] flex items-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  Powered by Claude · Viewing {contextLabel}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clearChat} className="p-1.5 rounded-lg transition-colors hover:bg-black/5" title="Clear chat">
                <RotateCcw size={13} style={{ color: 'var(--text-tertiary)' }} />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg transition-colors hover:bg-black/5" title="Close">
                <X size={15} style={{ color: 'var(--text-tertiary)' }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
            {messages.length === 0 ? (
              // Welcome + Suggestions
              <div>
                <div className="text-center py-4">
                  <div
                    className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))' }}
                  >
                    <Sparkles size={22} style={{ color: '#6366f1' }} />
                  </div>
                  <div className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    How can I help?
                  </div>
                  <div className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                    I can analyze your data, search the web, and answer questions about the {contextLabel}.
                  </div>
                </div>

                <div className="space-y-1.5 mt-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb size={11} style={{ color: 'var(--accent-blue)' }} />
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Suggested</span>
                  </div>
                  {suggestions.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between group"
                      style={{
                        backgroundColor: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.2)';
                        e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent';
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                      }}
                    >
                      <span>{q}</span>
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent-blue)' }} />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              // Message Thread
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${msg.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}
                      style={{
                        backgroundColor: msg.role === 'user'
                          ? 'var(--accent-blue)'
                          : msg.isSearching
                            ? 'rgba(139,92,246,0.08)'
                            : 'var(--bg-secondary)',
                        color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                        border: msg.role === 'user' ? 'none' : '1px solid var(--border-primary)',
                      }}
                    >
                      {msg.isSearching ? (
                        <div className="flex items-center gap-2">
                          <Loader2 size={13} className="animate-spin" style={{ color: '#8b5cf6' }} />
                          <span className="text-xs" style={{ color: '#8b5cf6' }}>{msg.content}</span>
                        </div>
                      ) : (
                        <>
                          <div className="text-xs leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{
                            __html: msg.content
                              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                              .replace(/\n/g, '<br/>')
                              .replace(/• /g, '<span style="color: var(--accent-blue)">•</span> ')
                          }} />
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-2 pt-2 flex flex-wrap gap-1.5" style={{ borderTop: '1px solid var(--border-primary)' }}>
                              {msg.sources.map((s, i) => (
                                <span key={i} className="text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1"
                                  style={{ backgroundColor: 'rgba(59,130,246,0.08)', color: 'var(--accent-blue)' }}>
                                  <Globe size={8} /> {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && !messages.some(m => m.isSearching) && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md px-3.5 py-2.5 flex items-center gap-1.5"
                      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-3 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <div
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-primary)',
              }}
            >
              <Sparkles size={14} style={{ color: '#6366f1', flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask about ${contextLabel.toLowerCase()}...`}
                className="flex-1 text-xs bg-transparent outline-none placeholder:text-gray-400"
                style={{ color: 'var(--text-primary)' }}
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="p-1 rounded-lg transition-all"
                style={{
                  backgroundColor: input.trim() ? 'var(--accent-blue)' : 'transparent',
                  color: input.trim() ? 'white' : 'var(--text-tertiary)',
                  opacity: input.trim() ? 1 : 0.4,
                }}
              >
                <Send size={13} />
              </button>
            </div>
            <div className="text-center mt-1.5">
              <span className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
                Compass responses are simulated for prototype · <Globe size={8} className="inline" style={{ verticalAlign: '-1px' }} /> Web search enabled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Compass Toggle Button — sits above purpose strip in sidebar */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed z-[998] flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all group"
          style={{
            left: '12px',
            bottom: '196px',
            width: '236px',
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.12))',
            border: '1px solid rgba(99,102,241,0.2)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.25), rgba(139,92,246,0.2))';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(99,102,241,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.12))';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
          >
            <Sparkles size={13} color="white" />
          </div>
          <div className="text-left flex-1">
            <div className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>Ask Compass</div>
            <div className="text-[9px]" style={{ color: 'rgba(255,255,255,0.4)' }}>AI · Search · Analyze</div>
          </div>
          <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'rgba(255,255,255,0.5)' }} />
        </button>
      )}
    </>
  );
}
