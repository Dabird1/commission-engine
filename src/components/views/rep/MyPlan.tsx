// @ts-nocheck
'use client';

import { useState } from 'react';
import { commissionPlans, currentUser, ihsIdentity } from '@/data/sample-data';
import { formatPercent, cn } from '@/lib/utils';
import { BookOpen, CheckCircle, DollarSign, AlertTriangle, ArrowRight, Clock, CreditCard, Shield, Heart, Zap } from 'lucide-react';

export default function MyPlan() {
  const [acknowledged, setAcknowledged] = useState(false);

  const plan = commissionPlans.find((p: any) => p.brandId === currentUser.brandId);
  const gpTiers = plan?.tiers || [];

  if (!plan) {
    return (
      <div className="p-6 text-center" style={{ color: 'var(--text-tertiary)' }}>Plan not found</div>
    );
  }

  // Semantic: red→amber→yellow→lime→green→blue (low GP = risk, high GP = integrity)
  const tierColors = ['var(--semantic-risk)', 'var(--semantic-pending)', '#eab308', '#84cc16', 'var(--semantic-paid)', 'var(--semantic-earned)'];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      <div className="flex-shrink-0 px-3 sm:px-6 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>{plan.name}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {currentUser.brandName} · Effective January 1, 2026
            </p>
          </div>
          {!acknowledged && (
            <span className="text-[14px] font-bold px-2 py-1 rounded" style={{ backgroundColor: 'rgba(245,158,11,0.12)', color: '#f59e0b' }}>
              PENDING ACKNOWLEDGMENT
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 sm:px-6 pb-4" style={{ scrollbarWidth: 'thin' }}>
        <div className="space-y-3 sm:space-y-4">
          {/* How You Get Paid */}
          <div className="rounded-2xl border p-3 sm:p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign size={16} style={{ color: 'var(--accent-blue)' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>How You Get Paid</span>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              Your commission rate is determined by the Gross Profit % of each job. Higher GP% = higher rate. Commission is calculated as:
            </p>
            <div className="rounded-lg p-3 mb-3 text-center" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              <code className="text-sm font-bold" style={{ color: 'var(--accent-blue)' }}>
                Deal Value × Commission Rate = Your Commission
              </code>
              <div className="text-[9px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Deal Value = Full Contract Value (FCV) — the total customer-facing price of the job
              </div>
            </div>

            {/* Tier Chart */}
            <div className="space-y-1 sm:space-y-1.5">
              {gpTiers.map((tier: any, idx: number) => {
                const maxRate = 0.10;
                const width = (tier.rate / maxRate) * 100;
                // Check if current user's avg GP falls in this tier
                const userGP = currentUser.avgGP || 39.3;
                const tierMin = tier.min || (tier.threshold || 0);
                const tierMax = tier.max || (gpTiers[idx + 1]?.min || gpTiers[idx + 1]?.threshold || 100);
                const isUserTier = userGP >= tierMin && userGP < tierMax;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-[14px] font-medium w-16 text-right" style={{ color: isUserTier ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isUserTier ? 700 : 500 }}>
                      {tier.label || `${tier.threshold || tier.min}%+`}
                    </span>
                    <div className="flex-1 h-6 rounded overflow-hidden relative" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <div className="h-full rounded flex items-center px-2 transition-all" style={{
                        width: `${Math.max(width, 12)}%`,
                        backgroundColor: tierColors[idx] || '#64748b',
                        boxShadow: isUserTier ? '0 0 0 2px var(--accent-blue)' : 'none',
                      }}>
                        <span className="text-[9px] font-bold text-white">{formatPercent(tier.rate * 100)}</span>
                      </div>
                      {isUserTier && (
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-bold px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
                          ← YOU ({formatPercent(userGP)})
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment Timeline */}
          <div className="rounded-2xl border p-3 sm:p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={16} style={{ color: 'var(--accent-blue)' }} />
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>When You Get Paid</span>
            </div>
            {/* Next pay date callout */}
            <div className="rounded-lg p-2 sm:p-2.5 mb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-2" style={{ backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <div className="flex items-center gap-2">
                <CreditCard size={14} style={{ color: '#10b981' }} />
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Next Pay Date: <strong>April 1, 2026</strong></span>
              </div>
              <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>Payroll closes March 28</span>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {[
                { step: '1', label: 'Sale Closed', desc: '50% front-end commission paid when you close the deal', color: '#3b82f6', icon: '📝' },
                { step: '2', label: 'Job Complete', desc: '50% back-end commission paid when installation is done and inspected', color: '#f59e0b', icon: '🔨' },
                { step: '3', label: 'Direct Deposit', desc: 'All commissions deposited on the 1st and 15th of each month via Paycor', color: '#10b981', icon: '💰' },
              ].map((s, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-start gap-2 sm:gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
                    style={{ backgroundColor: `${s.color}15`, color: s.color }}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{s.label}</div>
                    <div className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>{s.desc}</div>
                  </div>
                  {i < 2 && (
                    <div className="flex-shrink-0 self-center" style={{ color: 'var(--text-tertiary)' }}>
                      <ArrowRight size={12} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What Can Reduce Pay */}
          <div className="rounded-lg p-3 sm:p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--tint-red)', border: '1px solid rgba(239,68,68,0.12)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={16} style={{ color: '#ef4444' }} />
              <span className="text-sm font-bold" style={{ color: '#ef4444' }}>What Can Reduce Your Pay</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Change Orders', desc: 'Scope reduction lowers deal amount and commission' },
                { title: 'Cost Variances', desc: 'Actual costs exceed estimates, reducing GP%' },
                { title: 'GP Revisions', desc: 'Pricing errors discovered before job completion' },
                { title: 'Insurance Shortfalls', desc: 'Insurance pays less than full estimate' },
              ].map((item, i) => (
                <div key={i} className="rounded p-2" style={{ backgroundColor: 'var(--bg-card)' }}>
                  <div className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</div>
                  <div className="text-[9px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{item.desc}</div>
                </div>
              ))}
            </div>
            <div className="text-[14px] mt-3 p-2 rounded" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
              All adjustments are transparent, documented, and posted immediately. You can dispute any adjustment.
            </div>
          </div>

          {/* The IHS Way */}
          <div className="rounded-lg border overflow-hidden duration-300 transition-all" style={{ borderColor: 'var(--accent-blue)', backgroundColor: 'var(--bg-card)', scrollbarWidth: 'thin' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}>
            {/* Header strip */}
            <div className="px-3 sm:px-4 py-3" style={{ background: 'linear-gradient(135deg, #0f2744 0%, #1e3a5f 100%)' }}>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-[14px]"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                  IHS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">The IHS Way</h3>
                  <p className="text-[9px] text-blue-300/70">Why your commission plan is built the way it is</p>
                </div>
              </div>
            </div>

            <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
              {/* Purpose */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: 'var(--accent-blue)' }}>Our Purpose</p>
                <p className="text-sm font-semibold italic" style={{ color: 'var(--text-primary)' }}>
                  &ldquo;{ihsIdentity.purpose}&rdquo;
                </p>
                <p className="text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                  Your commission plan rewards ethical pricing because high GP% means honest, sustainable work — not cutting corners.
                </p>
              </div>

              {/* Vision + Mission */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-md p-2 sm:p-2.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] mb-0.5" style={{ color: 'var(--accent-blue)' }}>Vision</p>
                  <p className="text-sm font-semibold italic" style={{ color: 'var(--text-primary)' }}>{ihsIdentity.vision}</p>
                </div>
                <div className="rounded-md p-2 sm:p-2.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] mb-0.5" style={{ color: 'var(--accent-blue)' }}>Mission</p>
                  <p className="text-[14px] font-medium" style={{ color: 'var(--text-primary)' }}>Border to Border, Coast to Coast</p>
                </div>
              </div>

              {/* Core Values */}
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: 'var(--accent-blue)' }}>Core Values</p>
                <div className="space-y-1.5">
                  {ihsIdentity.coreValues.map((v: any) => (
                    <div key={v.letter} className="flex items-center gap-2.5 px-3 py-2 rounded-md" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <div className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                        style={{ backgroundColor: 'var(--accent-blue)' }}>
                        {v.letter}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{v.name}</p>
                        <p className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>{v.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Non-Negotiables */}
              <div className="rounded-md p-3" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] mb-1.5" style={{ color: 'var(--accent-blue)' }}>Non-Negotiables</p>
                <div className="flex flex-wrap gap-1.5">
                  {ihsIdentity.nonNegotiables.map((item: string) => (
                    <span key={item} className="text-[14px] font-medium px-2 py-1 rounded-md"
                      style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tagline */}
              <p className="text-[14px] font-semibold italic text-center py-1" style={{ color: 'var(--accent-blue)' }}>
                {ihsIdentity.tagline}
              </p>
            </div>
          </div>

          {/* Acknowledgment */}
          <div className="rounded-2xl border p-3 sm:p-4 duration-300 transition-all" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)'; }}>
            <div className="flex items-start gap-3">
              <input type="checkbox" id="ack" checked={acknowledged} onChange={e => setAcknowledged(e.target.checked)}
                className="mt-0.5 accent-blue-500" />
              <label htmlFor="ack" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                I acknowledge that I have read and understood the {plan.name} commission plan, effective January 1, 2026.
              </label>
            </div>
            <button disabled={!acknowledged}
              className="mt-3 px-4 py-2 rounded-lg text-sm font-bold transition-all"
              style={{
                backgroundColor: acknowledged ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                color: acknowledged ? 'white' : 'var(--text-tertiary)',
                cursor: acknowledged ? 'pointer' : 'not-allowed',
              }}>
              {acknowledged ? '✓ Acknowledged' : 'Acknowledge & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
