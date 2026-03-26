// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import { handbookSections, ihsIdentity } from '@/data/sample-data';
import { formatPercent } from '@/lib/utils';
import {
  Search, BookOpen, Clock, User, HelpCircle, DollarSign, Shield, AlertTriangle,
  ArrowRight, Users, MessageSquare, FileText, CheckCircle, XCircle, Banknote,
  Timer, Scale, Handshake, Heart, Zap, Target, Eye, Star, ChevronDown, ChevronRight
} from 'lucide-react';

// Quick reference links mapped to actual section IDs
const QUICK_QUESTIONS = [
  { q: 'How is my rate calculated?', sectionId: 'handbook-1' },
  { q: 'When do I get paid?', sectionId: 'handbook-2' },
  { q: 'What triggers a clawback?', sectionId: 'handbook-3' },
  { q: 'How do splits work?', sectionId: 'handbook-4' },
  { q: 'How do I dispute?', sectionId: 'handbook-5' },
];

// ─── Visual Section Renderers ───────────────────────────────────────────

function TheIHSWay() {
  const values = ihsIdentity?.coreValues || [
    { letter: 'I', name: 'Integrity', description: 'Higher margins = honest, transparent pricing' },
    { letter: 'H', name: 'Hard Work', description: 'Volume bonuses, SPIFs, milestones that reward effort' },
    { letter: 'S', name: 'Service', description: 'Back-end commission tied to job quality & satisfaction' },
  ];

  return (
    <div className="space-y-4">
      {/* Purpose Banner */}
      <div className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)' }}>
        <div className="text-[9px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: 'rgba(147,197,253,0.7)' }}>Our Purpose</div>
        <p className="text-base font-bold text-white italic leading-relaxed">
          "Saving our communities from unscrupulous contractors."
        </p>
        <p className="text-[14px] mt-2 text-blue-200/60">
          Your commission structure is intentionally designed to reward behaviors that align with this purpose.
        </p>
      </div>

      {/* Vision + Mission Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="rounded-xl border p-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Eye size={14} style={{ color: 'var(--accent-blue)' }} />
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-blue)' }}>Vision</span>
          </div>
          <p className="text-sm font-semibold italic" style={{ color: 'var(--text-primary)' }}>
            "Installing peace of mind."
          </p>
          <p className="text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Close at fair margins, install it right, collect payment — peace of mind for the customer and for you.
          </p>
        </div>
        <div className="rounded-xl border p-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Target size={14} style={{ color: 'var(--accent-blue)' }} />
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-blue)' }}>Mission</span>
          </div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Border to Border, Coast to Coast
          </p>
          <p className="text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
            America's most trusted home exterior services company in every community, every market.
          </p>
        </div>
      </div>

      {/* Core Values — How they connect to your pay */}
      <div className="rounded-xl border p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Core Values → How They Show Up In Your Pay
        </div>
        <div className="space-y-2">
          {values.map((v: any) => {
            const icons: Record<string, any> = { I: Shield, H: Zap, S: Heart };
            const colors: Record<string, string> = { I: '#3b82f6', H: '#f59e0b', S: '#10b981' };
            const payLinks: Record<string, string> = {
              I: 'GP%-based tiers reward honest, transparent pricing',
              H: 'Volume bonuses, SPIFs, and milestones reward consistent effort',
              S: 'Back-end commission tied to job completion & customer satisfaction',
            };
            const Icon = icons[v.letter] || Shield;
            const color = colors[v.letter] || '#3b82f6';
            return (
              <div key={v.letter} className="flex items-center gap-3 p-2.5 rounded-lg" style={{ backgroundColor: `${color}08`, border: `1px solid ${color}20` }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${color}15`, color }}>
                  <Icon size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{v.name}</span>
                    <ArrowRight size={10} style={{ color: 'var(--text-tertiary)' }} />
                    <span className="text-[14px] font-medium" style={{ color }}>
                      {payLinks[v.letter]}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Non-Negotiables */}
      <div className="rounded-xl border p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>
          Non-Negotiables — These Apply Everywhere
        </div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {['Safety First', 'Show Respect', 'Team Unity', 'Provide Ethical Solutions', 'Be Accountable'].map(item => (
            <span key={item} className="flex items-center gap-1 text-[14px] font-semibold px-2.5 py-1.5 rounded-lg"
              style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
              <CheckCircle size={10} style={{ color: 'var(--accent-green)' }} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowYourPlanWorks() {
  const tiers = [
    { gp: '<25%', rate: '4%', color: '#ef4444', width: 40 },
    { gp: '25-30%', rate: '5%', color: '#f59e0b', width: 50 },
    { gp: '30-35%', rate: '7%', color: '#eab308', width: 70 },
    { gp: '35-40%', rate: '8%', color: '#84cc16', width: 80 },
    { gp: '40-45%', rate: '9%', color: '#10b981', width: 90 },
    { gp: '45%+', rate: '10%', color: '#3b82f6', width: 100 },
  ];

  return (
    <div className="space-y-4">
      {/* Key Concept */}
      <div className="rounded-xl p-3 sm:p-4" style={{ backgroundColor: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--accent-blue)' }}>The Big Idea</div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Higher gross profit % on the deal = higher commission rate for you.
        </p>
        <p className="text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
          This rewards quality pricing over pure volume.
        </p>
      </div>

      {/* The Formula */}
      <div className="rounded-xl border p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>The Formula</div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 py-3">
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Deal Value</div>
            <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Full contract price</div>
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--text-tertiary)' }}>×</span>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: 'var(--accent-blue)' }}>Rate</div>
            <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Based on GP% tier</div>
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--text-tertiary)' }}>=</span>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: 'var(--accent-green)' }}>Commission</div>
            <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Your earnings</div>
          </div>
        </div>
      </div>

      {/* Tier Chart */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>
          Commission Rate by GP% Tier
        </div>
        <div className="space-y-2">
          {tiers.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[14px] font-semibold w-14 text-right" style={{ color: 'var(--text-secondary)' }}>{t.gp}</span>
              <div className="flex-1 h-7 rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-lg flex items-center px-3 transition-all" style={{ width: `${t.width}%`, backgroundColor: t.color }}>
                  <span className="text-[14px] font-bold text-white">{t.rate}</span>
                </div>
              </div>
              <span className="text-[14px] w-20 text-right" style={{ color: 'var(--text-tertiary)' }}>
                {t.gp === '40-45%' && '← Typical top rep'}
                {t.gp === '45%+' && '← Best of best'}
                {t.gp === '<25%' && '← Minimum'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 50/50 Split Visual */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>How It's Split</div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 rounded-lg p-2 sm:p-3 text-center" style={{ backgroundColor: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <Banknote size={20} className="mx-auto mb-1" style={{ color: '#3b82f6' }} />
            <div className="text-lg font-bold" style={{ color: '#3b82f6' }}>50%</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Front-End</div>
            <div className="text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>Paid when customer signs</div>
          </div>
          <div className="flex-1 rounded-lg p-2 sm:p-3 text-center" style={{ backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <CheckCircle size={20} className="mx-auto mb-1" style={{ color: '#10b981' }} />
            <div className="text-lg font-bold" style={{ color: '#10b981' }}>50%</div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Back-End</div>
            <div className="text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>Paid at job completion</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WhenYouGetPaid() {
  return (
    <div className="space-y-4">
      {/* Timeline */}
      <div className="rounded-xl border p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-tertiary)' }}>Payment Timeline</div>
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5" style={{ backgroundColor: 'var(--border-primary)' }} />
          {[
            { icon: FileText, color: '#3b82f6', label: 'Customer Signs', time: 'Day 0', desc: '50% front-end commission earned immediately', detail: 'Paid within 5 business days' },
            { icon: Timer, color: '#f59e0b', label: 'Job Installed & Inspected', time: 'Varies', desc: '50% back-end commission earned at completion', detail: 'Paid within 5 business days of final payment' },
            { icon: Banknote, color: '#10b981', label: 'Direct Deposit', time: '1st & 15th', desc: 'All commissions deposited via Paycor', detail: 'Detailed statement included with every deposit' },
          ].map((step, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-4 mb-5 last:mb-0 relative">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 z-10"
                style={{ backgroundColor: `${step.color}12`, border: `2px solid ${step.color}30` }}>
                <step.icon size={20} style={{ color: step.color }} />
              </div>
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{step.label}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${step.color}12`, color: step.color }}>
                    {step.time}
                  </span>
                </div>
                <div className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{step.desc}</div>
                <div className="text-[14px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What's on your statement */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>Your Statement Includes</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { icon: FileText, label: 'Each deal listed' },
            { icon: Target, label: 'GP% per deal' },
            { icon: Star, label: 'Tier applied' },
            { icon: DollarSign, label: 'Exact amounts' },
            { icon: AlertTriangle, label: 'Exceptions flagged' },
            { icon: Clock, label: 'Adjustment notices within 24hrs' },
          ].map((item, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <item.icon size={12} style={{ color: 'var(--accent-blue)' }} />
              <span className="text-[14px] font-medium" style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClawbackSection() {
  return (
    <div className="space-y-4">
      {/* What is it */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
          <span className="text-sm font-bold" style={{ color: '#f59e0b' }}>What Is A Clawback?</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          A reversal of previously paid commission. It protects fairness across the organization and only happens in documented situations.
        </p>
      </div>

      {/* Triggers */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--text-tertiary)' }}>What Triggers A Clawback</div>
        <div className="space-y-2">
          {[
            { icon: XCircle, color: '#ef4444', title: 'Customer Cancellation', desc: 'Within 30 days of installation — back-end portion recovered', severity: 'Most Common' },
            { icon: AlertTriangle, color: '#f59e0b', title: 'Pricing Error >5%', desc: 'Documented variance exceeding 5% of contract value', severity: 'Occasional' },
            { icon: Scale, color: '#f59e0b', title: 'Scope Reduction', desc: 'Significant scope changes after commission was paid', severity: 'Occasional' },
            { icon: Shield, color: '#6366f1', title: 'Warranty Rework', desc: 'Substantial rework required due to quality issues', severity: 'Rare' },
          ].map((t, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: `${t.color}06`, border: `1px solid ${t.color}15` }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${t.color}12` }}>
                <t.icon size={14} style={{ color: t.color }} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{t.title}</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${t.color}12`, color: t.color }}>{t.severity}</span>
                </div>
                <div className="text-[14px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Your Rights */}
      <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Shield size={14} style={{ color: '#10b981' }} />
          <span className="text-sm font-bold" style={{ color: '#10b981' }}>Your Protections</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            { label: 'Notification', value: 'Within 48 hours' },
            { label: 'Right to Dispute', value: 'Always guaranteed' },
            { label: 'Resolution Time', value: '10 business days' },
          ].map((p, i) => (
            <div key={i} className="text-center p-1 sm:p-2 rounded-lg" style={{ backgroundColor: 'var(--bg-card)' }}>
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{p.value}</div>
              <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowSplitsWork() {
  return (
    <div className="space-y-4">
      {/* What are splits */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
        <div className="flex items-center gap-2 mb-1">
          <Users size={16} style={{ color: 'var(--accent-blue)' }} />
          <span className="text-sm font-bold" style={{ color: 'var(--accent-blue)' }}>What Are Splits?</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          When two or more reps contribute to a deal, commission is divided based on documented contribution.
        </p>
      </div>

      {/* Split Types */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[
          {
            type: 'Canvasser / Closer',
            icon: Handshake,
            color: '#3b82f6',
            split: '30 / 70',
            desc: 'One rep generates the lead, another closes it. Closer gets the larger share.',
            tag: 'Most Common',
          },
          {
            type: 'Co-Sell',
            icon: Users,
            color: '#10b981',
            split: '50 / 50',
            desc: 'Two reps jointly present and close a deal together. Usually split evenly.',
            tag: 'Common',
          },
          {
            type: 'Training',
            icon: Star,
            color: '#f59e0b',
            split: 'Varies',
            desc: 'Experienced rep mentors a junior rep on a deal. Split reflects mentorship.',
            tag: 'Occasional',
          },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border p-2 sm:p-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: `${s.color}12` }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{s.type}</div>
            <div className="text-lg font-bold mb-1" style={{ color: s.color }}>{s.split}</div>
            <div className="text-[14px] leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{s.desc}</div>
            <span className="inline-block mt-2 text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${s.color}12`, color: s.color }}>{s.tag}</span>
          </div>
        ))}
      </div>

      {/* How it appears */}
      <div className="rounded-xl border p-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-tertiary)' }}>Key Rules</div>
        <div className="space-y-1.5">
          {[
            'Split % is determined at deal creation with documented evidence',
            'Each rep receives proportional commission based on their percentage',
            'Splits are clearly documented on your payment statement',
            'Disputed splits go through the formal dispute process',
          ].map((rule, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start gap-1 sm:gap-2 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
              <CheckCircle size={12} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-green)' }} />
              <span>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HowDisputesWork() {
  return (
    <div className="space-y-4">
      {/* What can you dispute */}
      <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--accent-blue)' }}>What You Can Dispute</div>
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {['Split allocations', 'Payment amounts', 'Deal status', 'GP% calculations', 'Clawback decisions'].map(item => (
            <span key={item} className="text-[14px] font-medium px-2.5 py-1.5 rounded-lg" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Process Steps */}
      <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
        <div className="text-[9px] font-bold uppercase tracking-wider mb-4" style={{ color: 'var(--text-tertiary)' }}>The Process</div>
        <div className="space-y-0">
          {[
            { step: 1, label: 'Submit Your Dispute', desc: 'Through the app or email within 30 days. Include what, why, and supporting docs.', time: 'Day 0', color: '#3b82f6' },
            { step: 2, label: 'Manager Acknowledges', desc: 'Receipt confirmed within 24 hours.', time: '24 hrs', color: '#6366f1' },
            { step: 3, label: 'Review & Decision', desc: 'Detailed response explaining the decision with any corrections.', time: '5-10 days', color: '#f59e0b' },
            { step: 4, label: 'Escalate if Needed', desc: 'Disagree? Finance Director does a second review.', time: '+5-10 days', color: '#ef4444' },
            { step: 5, label: 'Resolution Applied', desc: 'Decision implemented immediately. Adjustments on next payment.', time: 'Same day', color: '#10b981' },
          ].map((s, i) => (
            <div key={i} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 pb-4 last:pb-0 relative">
              {i < 4 && <div className="absolute left-[17px] top-9 bottom-0 w-0.5" style={{ backgroundColor: 'var(--border-primary)' }} />}
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold z-10"
                style={{ backgroundColor: `${s.color}12`, color: s.color, border: `2px solid ${s.color}30` }}>
                {s.step}
              </div>
              <div className="flex-1 pt-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{s.label}</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: `${s.color}12`, color: s.color }}>{s.time}</span>
                </div>
                <div className="text-[14px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GlossarySection() {
  const terms = [
    { term: 'FCV', full: 'Full Contract Value', def: 'Total dollar amount of the signed agreement, including all change orders.' },
    { term: 'GP%', full: 'Gross Profit Percentage', def: 'Gross profit margin as a percentage of FCV. Formula: (Gross Profit / FCV) × 100.' },
    { term: 'Commission Rate', full: '', def: 'Percentage of FCV you earn based on your plan and GP% tier.' },
    { term: 'Front-End', full: '', def: 'First 50% of commission, paid when the customer signs.' },
    { term: 'Back-End', full: '', def: 'Second 50% of commission, paid at job completion and final payment.' },
    { term: 'Change Order', full: '', def: 'Documented scope modification that may increase or decrease FCV and commission.' },
    { term: 'Clawback', full: '', def: 'Recovery of previously paid commission due to cancellation, error, or documented reason.' },
    { term: 'Split', full: '', def: 'Division of commission between two or more reps based on contribution.' },
    { term: 'Paid vs. Earned', full: '', def: 'Paid = transferred to your account. Earned = owed to you but pending completion or review.' },
  ];

  return (
    <div className="space-y-2">
      {terms.map((t, i) => (
        <div key={i} className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
          <div className="flex-shrink-0">
            <span className="text-sm font-bold px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}>
              {t.term}
            </span>
          </div>
          <div>
            {t.full && <span className="text-[14px] font-semibold block mb-0.5" style={{ color: 'var(--text-primary)' }}>{t.full}</span>}
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.def}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// Map section IDs to visual renderers
const VISUAL_RENDERERS: Record<string, () => JSX.Element> = {
  'handbook-0': TheIHSWay,
  'handbook-1': HowYourPlanWorks,
  'handbook-2': WhenYouGetPaid,
  'handbook-3': ClawbackSection,
  'handbook-4': HowSplitsWork,
  'handbook-5': HowDisputesWork,
  'handbook-6': GlossarySection,
};

// ─── Main Component ─────────────────────────────────────────────────────

export default function HandbookPage() {
  const [selectedSectionId, setSelectedSectionId] = useState((handbookSections || [])[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [signatureName, setSignatureName] = useState('');
  const [showFullText, setShowFullText] = useState<Record<string, boolean>>({});

  const sections = handbookSections || [];

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    return sections.filter(
      (s: any) =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, sections]);

  const selectedSection = sections.find((s: any) => s.id === selectedSectionId);
  const VisualRenderer = selectedSection ? VISUAL_RENDERERS[selectedSection.id] : null;

  // Track which sections user has viewed
  const [viewedSections, setViewedSections] = useState<Set<string>>(new Set());
  const markViewed = (id: string) => {
    setViewedSections(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const allViewed = sections.every((s: any) => viewedSections.has(s.id));

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col sm:flex-row overflow-hidden">
      {/* Sidebar Navigation */}
      <div className="w-full sm:w-56 flex-shrink-0 border-b sm:border-b-0 sm:border-r flex flex-col"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
        {/* Search */}
        <div className="p-2 sm:p-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center gap-2 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <Search size={12} style={{ color: 'var(--text-tertiary)' }} />
            <input type="text" placeholder="Search..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 outline-none text-sm w-full"
              style={{ color: 'var(--text-primary)' }} />
          </div>
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin' }}>
          {filteredSections.map((section: any) => (
            <button key={section.id}
              onClick={() => { setSelectedSectionId(section.id); markViewed(section.id); }}
              className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-sm transition-colors flex items-center gap-2"
              style={{
                color: selectedSectionId === section.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                backgroundColor: selectedSectionId === section.id ? 'var(--accent-blue-light)' : 'transparent',
                fontWeight: selectedSectionId === section.id ? 600 : 400,
                borderLeft: selectedSectionId === section.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
              }}
              onMouseEnter={e => { if (selectedSectionId !== section.id) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
              onMouseLeave={e => { if (selectedSectionId !== section.id) e.currentTarget.style.backgroundColor = 'transparent'; }}>
              {viewedSections.has(section.id) && (
                <CheckCircle size={10} style={{ color: 'var(--accent-green)', flexShrink: 0 }} />
              )}
              <span className="flex-1">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Progress + Acknowledge */}
        <div className="p-2 sm:p-3 border-t" style={{ borderColor: 'var(--border-primary)' }}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Progress</span>
            <span className="text-[14px] font-bold" style={{ color: allViewed ? 'var(--accent-green)' : 'var(--text-tertiary)' }}>
              {viewedSections.size}/{sections.length}
            </span>
          </div>
          <div className="h-1.5 rounded-full mb-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            <div className="h-full rounded-full transition-all" style={{
              width: `${(viewedSections.size / Math.max(sections.length, 1)) * 100}%`,
              backgroundColor: allViewed ? 'var(--accent-green)' : 'var(--accent-blue)',
            }} />
          </div>
          {allViewed && !acknowledged && (
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                Type your full name to sign
              </div>
              <input
                type="text"
                placeholder="e.g. John Smith"
                value={signatureName}
                onChange={e => setSignatureName(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg text-sm border outline-none"
                style={{
                  borderColor: signatureName.trim().length >= 2 ? 'var(--accent-blue)' : 'var(--border-primary)',
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontStyle: 'italic',
                }}
              />
              <button
                onClick={() => { if (signatureName.trim().length >= 2) setAcknowledged(true); }}
                disabled={signatureName.trim().length < 2}
                className="w-full py-2 rounded-lg text-[14px] font-bold transition-all"
                style={{
                  backgroundColor: signatureName.trim().length >= 2 ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                  color: signatureName.trim().length >= 2 ? 'white' : 'var(--text-tertiary)',
                  cursor: signatureName.trim().length >= 2 ? 'pointer' : 'not-allowed',
                }}>
                Sign & Acknowledge
              </button>
            </div>
          )}
          {acknowledged && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[14px] font-bold" style={{ color: 'var(--accent-green)' }}>
                <CheckCircle size={12} />
                Signed & Acknowledged
              </div>
              <div className="text-[9px] italic" style={{ color: 'var(--text-tertiary)' }}>
                by {signatureName} · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          )}
          {!allViewed && (
            <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
              Read all sections to sign
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Quick Questions Bar */}
        <div className="flex-shrink-0 px-6 py-2 border-b flex items-center gap-2 overflow-x-auto" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-card)' }}>
          <HelpCircle size={12} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} />
          <span className="text-[14px] font-bold whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>Quick:</span>
          {QUICK_QUESTIONS.map((qq) => {
            const targetSection = sections.find((s: any) => s.id === qq.sectionId);
            return (
              <button key={qq.q}
                onClick={() => { if (targetSection) { setSelectedSectionId(targetSection.id); markViewed(targetSection.id); } }}
                className="px-2 py-1 rounded text-[14px] font-medium whitespace-nowrap transition-all"
                style={{
                  backgroundColor: selectedSectionId === qq.sectionId ? 'var(--accent-blue-light)' : 'var(--bg-secondary)',
                  color: selectedSectionId === qq.sectionId ? 'var(--accent-blue)' : 'var(--text-secondary)',
                  border: selectedSectionId === qq.sectionId ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => { if (selectedSectionId !== qq.sectionId) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
                onMouseLeave={(e) => { if (selectedSectionId !== qq.sectionId) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)'; }}>
                {qq.q}
              </button>
            );
          })}
        </div>

        {selectedSection ? (
          <>
            {/* Header */}
            <div className="flex-shrink-0 px-6 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{selectedSection.title}</h1>
              <div className="flex items-center gap-3 mt-1">
                {selectedSection.lastUpdated && (
                  <span className="flex items-center gap-1 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
                    <Clock size={10} /> Updated {new Date(selectedSection.lastUpdated).toLocaleDateString()}
                  </span>
                )}
                {selectedSection.updatedBy && (
                  <span className="flex items-center gap-1 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
                    <User size={10} /> {selectedSection.updatedBy}
                  </span>
                )}
              </div>
            </div>

            {/* Content — visual or fallback */}
            <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-3 sm:py-4" style={{ scrollbarWidth: 'thin' }}>
              <div className="max-w-3xl">
                {VisualRenderer ? (
                  <>
                    <VisualRenderer />
                    {/* Read Full Text toggle */}
                    <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                      <button
                        onClick={() => setShowFullText(prev => ({ ...prev, [selectedSection.id]: !prev[selectedSection.id] }))}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          backgroundColor: showFullText[selectedSection.id] ? 'rgba(59,130,246,0.06)' : 'var(--bg-secondary)',
                          color: showFullText[selectedSection.id] ? 'var(--accent-blue)' : 'var(--text-tertiary)',
                          border: showFullText[selectedSection.id] ? '1px solid rgba(59,130,246,0.2)' : '1px solid var(--border-primary)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = showFullText[selectedSection.id] ? 'rgba(59,130,246,0.1)' : 'var(--bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = showFullText[selectedSection.id] ? 'rgba(59,130,246,0.06)' : 'var(--bg-secondary)'}
                      >
                        <FileText size={12} />
                        {showFullText[selectedSection.id] ? 'Hide Full Text' : 'Read Full Text'}
                        {showFullText[selectedSection.id] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      </button>
                      {showFullText[selectedSection.id] && (
                        <div className="mt-3 rounded-xl border p-5" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                          <div className="space-y-3">
                            {selectedSection.content.split('\n\n').map((paragraph: string, idx: number) => (
                              <p key={idx} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {selectedSection.content.split('\n\n').map((paragraph: string, idx: number) => {
                      if (idx === 0) {
                        return (
                          <div key={idx} className="rounded-lg p-3 mb-1" style={{ backgroundColor: 'rgba(59,130,246,0.04)', borderLeft: '3px solid var(--accent-blue)' }}>
                            <p className="text-sm leading-relaxed font-medium" style={{ color: 'var(--text-primary)' }}>{paragraph}</p>
                          </div>
                        );
                      }
                      return <p key={idx} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{paragraph}</p>;
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-6 py-2 border-t text-[14px]"
              style={{ borderColor: 'var(--border-primary)', color: 'var(--text-tertiary)' }}>
              Version 2.1 · {selectedSection.title}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <BookOpen size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto' }} />
              <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>Select a section</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
