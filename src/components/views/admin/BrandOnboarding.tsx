// @ts-nocheck
'use client';

import { useState } from 'react';
import { formatPercent } from '@/lib/utils';
import {
  Building2, Layers, DollarSign, Clock, GitCompare, Shield, BookOpen,
  Rocket, Check, ChevronRight, ChevronLeft, Copy, Plus, Trash2,
  AlertTriangle, Info, Zap, ArrowRight, Globe, MapPin, Users,
  FileText, CheckCircle2, Circle, Settings, Star, X
} from 'lucide-react';
import { brands, commissionPlans, ihsIdentity } from '@/data/sample-data';

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

const STEPS = [
  { id: 1, label: 'Brand Profile', icon: Building2, short: 'Profile' },
  { id: 2, label: 'Systems', icon: Zap, short: 'Systems' },
  { id: 3, label: 'Commission Model', icon: Layers, short: 'Model' },
  { id: 4, label: 'Rates & Tiers', icon: DollarSign, short: 'Rates' },
  { id: 5, label: 'Payment Schedule', icon: Clock, short: 'Payments' },
  { id: 6, label: 'Split Deals', icon: GitCompare, short: 'Splits' },
  { id: 7, label: 'Guardrails', icon: Shield, short: 'Guardrails' },
  { id: 8, label: 'Review & Launch', icon: Rocket, short: 'Launch' },
];

const REGIONS = ['Midwest', 'Northeast', 'Mid-Atlantic', 'Pacific NW', 'South', 'Southeast', 'Southwest', 'West', 'Canada'];
const SERVICE_TYPES = ['Roofing', 'Siding', 'Windows', 'Gutters', 'Solar', 'HVAC', 'Painting', 'Multi-Trade'];
const MODEL_TEMPLATES = [
  { id: 'gp_tiered', name: 'GP% Tiered', desc: 'Commission rate scales with gross profit percentage — rewards ethical pricing', icon: '📊', recommended: true },
  { id: 'flat_rate', name: 'Flat Rate', desc: 'Fixed commission percentage on every deal regardless of GP%', icon: '📏', recommended: false },
  { id: 'draw_against', name: 'Draw Against', desc: 'Monthly draw with commission offset — good for new reps ramping up', icon: '💰', recommended: false },
  { id: 'salary_bonus', name: 'Salary + Bonus', desc: 'Base salary with quarterly/annual bonus tied to metrics', icon: '🏆', recommended: false },
];

const DEFAULT_TIERS = [
  { id: 1, min: 0, max: 25, rate: 4, label: '<25%' },
  { id: 2, min: 25, max: 30, rate: 5, label: '25-30%' },
  { id: 3, min: 30, max: 35, rate: 7, label: '30-35%' },
  { id: 4, min: 35, max: 40, rate: 8, label: '35-40%' },
  { id: 5, min: 40, max: 45, rate: 9, label: '40-45%' },
  { id: 6, min: 45, max: 100, rate: 10, label: '45%+' },
];

export default function BrandOnboarding() {
  const [step, setStep] = useState<Step>(1);
  const [maxVisited, setMaxVisited] = useState(1);

  // Step 1: Brand Profile
  const [brandName, setBrandName] = useState('');
  const [region, setRegion] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');

  // Step 2: Systems
  const [crm, setCrm] = useState<string[]>([]);
  const [erp, setErp] = useState<string[]>([]);
  const [payroll, setPayroll] = useState<string[]>([]);
  const [salesTool, setSalesTool] = useState<string[]>([]);

  // Step 3: Model
  const [model, setModel] = useState('gp_tiered');
  const [cloneFrom, setCloneFrom] = useState('');

  // Step 4: Tiers
  const [tiers, setTiers] = useState(DEFAULT_TIERS);

  // Step 5: Payment Rules
  const [frontSplit, setFrontSplit] = useState(50);
  const [paySchedule, setPaySchedule] = useState('semi-monthly');
  const [clawbackDays, setClawbackDays] = useState(90);

  // Step 6: Splits
  const [enableCanvasserCloser, setEnableCanvasserCloser] = useState(false);
  const [canvasserPct, setCanvasserPct] = useState(30);

  // Step 7: Guardrails
  const [minGP, setMinGP] = useState(20);
  const [requireManagerApproval, setRequireManagerApproval] = useState(true);

  // Step 8: Launch
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [effectiveDate, setEffectiveDate] = useState('2026-04-01');

  const toggleSystemCheckbox = (array: string[], value: string, setter: (arr: string[]) => void) => {
    setter(array.includes(value) ? array.filter(v => v !== value) : [...array, value]);
  };

  const goTo = (s: Step) => {
    if (s <= maxVisited + 1 && s >= 1 && s <= 8) {
      setStep(s);
      setMaxVisited(Math.max(maxVisited, s));
    }
  };

  const next = () => goTo((step + 1) as Step);
  const prev = () => goTo((step - 1) as Step);
  const stepComplete = (s: number) => s < step;

  const addTier = () => {
    const last = tiers[tiers.length - 1];
    setTiers([...tiers, { id: Date.now(), min: last.max, max: last.max + 5, rate: last.rate + 1, label: `${last.max}-${last.max + 5}%` }]);
  };

  const removeTier = (id: number) => {
    if (tiers.length > 2) setTiers(tiers.filter(t => t.id !== id));
  };

  const updateTier = (id: number, field: string, value: any) => {
    setTiers(tiers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-4 pb-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Brand Onboarding</h1>
            <p className="text-sm text-[var(--text-tertiary)] mt-0.5">Step {step} of 8 — Configure commission structure</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <Settings size={13} style={{ color: 'var(--semantic-paid)' }} />
            <span className="text-[14px] font-bold uppercase tracking-wider" style={{ color: 'var(--semantic-paid)' }}>
              Zero Code
            </span>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, idx) => {
            const isActive = step === s.id;
            const isDone = s.id < step;
            const isReachable = s.id <= maxVisited + 1;
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => goTo(s.id as Step)}
                disabled={!isReachable}
                className="flex-1 flex items-center gap-1.5 px-2 py-2 rounded-lg transition-all text-[14px] font-semibold"
                style={{
                  backgroundColor: isActive ? 'rgba(59,130,246,0.1)' : isDone ? 'rgba(16,185,129,0.06)' : 'transparent',
                  border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                  cursor: isReachable ? 'pointer' : 'not-allowed',
                  opacity: isReachable ? 1 : 0.4,
                  color: isActive ? 'var(--accent-blue)' : isDone ? 'var(--semantic-paid)' : 'var(--text-tertiary)',
                }}
              >
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[9px]"
                  style={{
                    backgroundColor: isDone ? 'var(--semantic-paid)' : isActive ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                    color: isDone || isActive ? 'white' : 'var(--text-tertiary)',
                  }}>
                  {isDone ? <Check size={10} strokeWidth={3} /> : <span>{s.id}</span>}
                </div>
                <span className="truncate">{s.short}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {/* Step 1: Brand Profile */}
        {step === 1 && (
          <div className="max-w-2xl space-y-4">
            <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Brand Profile</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Brand Name *</label>
                  <input type="text" value={brandName} onChange={e => setBrandName(e.target.value)}
                    placeholder="e.g., Keystone Exteriors"
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                    style={{ borderColor: 'var(--border-primary)' }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">City</label>
                    <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="Columbus"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                      style={{ borderColor: 'var(--border-primary)' }} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">State</label>
                    <input type="text" value={state} onChange={e => setState(e.target.value)} placeholder="OH"
                      className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                      style={{ borderColor: 'var(--border-primary)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Region *</label>
                  <div className="flex flex-wrap gap-1.5">
                    {REGIONS.map(r => (
                      <button key={r} onClick={() => setRegion(r)}
                        className="px-3 py-1.5 rounded text-sm font-semibold transition-all"
                        style={{
                          backgroundColor: region === r ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                          color: region === r ? 'white' : 'var(--text-secondary)',
                        }}>
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Service Type *</label>
                  <div className="flex flex-wrap gap-1.5">
                    {SERVICE_TYPES.map(s => (
                      <button key={s} onClick={() => setServiceType(s)}
                        className="px-3 py-1.5 rounded text-sm font-semibold transition-all"
                        style={{
                          backgroundColor: serviceType === s ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                          color: serviceType === s ? 'white' : 'var(--text-secondary)',
                        }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Systems */}
        {step === 2 && (
          <div className="max-w-2xl space-y-4">
            <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">What Systems Are You On?</h2>
              <p className="text-sm text-[var(--text-secondary)] mb-6">Select all systems that this brand uses. This helps us plan integrations and data syncing.</p>

              <div className="space-y-6">
                {/* CRM */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">CRM Systems</label>
                  <div className="space-y-2">
                    {['Salesforce', 'HubSpot', 'JobNimbus', 'AccuLynx', 'Other'].map(sys => (
                      <label key={sys} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={crm.includes(sys)}
                          onChange={() => toggleSystemCheckbox(crm, sys, setCrm)}
                          className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent-blue)' }} />
                        <span className="text-sm text-[var(--text-secondary)]">{sys}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* ERP / Accounting */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">ERP / Accounting Systems</label>
                  <div className="space-y-2">
                    {['Acumatica', 'QuickBooks', 'NetSuite', 'Other'].map(sys => (
                      <label key={sys} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={erp.includes(sys)}
                          onChange={() => toggleSystemCheckbox(erp, sys, setErp)}
                          className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent-blue)' }} />
                        <span className="text-sm text-[var(--text-secondary)]">{sys}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Payroll */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">Payroll Systems</label>
                  <div className="space-y-2">
                    {['Paycor', 'ADP', 'Gusto', 'Other'].map(sys => (
                      <label key={sys} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={payroll.includes(sys)}
                          onChange={() => toggleSystemCheckbox(payroll, sys, setPayroll)}
                          className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent-blue)' }} />
                        <span className="text-sm text-[var(--text-secondary)]">{sys}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sales Tool */}
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-primary)] mb-3">Sales Tools</label>
                  <div className="space-y-2">
                    {['Rilla', 'Gong', 'Other'].map(sys => (
                      <label key={sys} className="flex items-center gap-3 cursor-pointer">
                        <input type="checkbox" checked={salesTool.includes(sys)}
                          onChange={() => toggleSystemCheckbox(salesTool, sys, setSalesTool)}
                          className="w-4 h-4 rounded" style={{ accentColor: 'var(--accent-blue)' }} />
                        <span className="text-sm text-[var(--text-secondary)]">{sys}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Commission Model */}
        {step === 3 && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Select Commission Model</h2>
            <div className="space-y-2">
              {MODEL_TEMPLATES.map(m => (
                <button key={m.id} onClick={() => setModel(m.id)}
                  className="w-full flex items-start gap-3 p-4 rounded-lg text-left transition-all border"
                  style={{
                    backgroundColor: model === m.id ? 'rgba(59,130,246,0.08)' : 'var(--bg-card)',
                    borderColor: model === m.id ? 'var(--accent-blue)' : 'var(--border-primary)',
                  }}>
                  <span className="text-2xl mt-0.5">{m.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[var(--text-primary)]">{m.name}</span>
                      {m.recommended && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: 'var(--semantic-paid)' }}>
                          RECOMMENDED
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">{m.desc}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1"
                    style={{ borderColor: model === m.id ? 'var(--accent-blue)' : 'var(--border-primary)' }}>
                    {model === m.id && <div className="w-2 h-2 rounded-full bg-[var(--accent-blue)]" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Rates & Tiers */}
        {step === 4 && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Commission Tiers</h2>
            <div className="space-y-2">
              {tiers.map((tier, idx) => (
                <div key={tier.id} className="rounded-lg border p-3 flex flex-col sm:flex-row items-end gap-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="text-sm text-[var(--text-secondary)] font-semibold block mb-1">Label</label>
                      <input type="text" value={tier.label} onChange={e => updateTier(tier.id, 'label', e.target.value)}
                        className="w-full px-2 py-1.5 border rounded text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                        style={{ borderColor: 'var(--border-primary)' }} />
                    </div>
                    <div>
                      <label className="text-sm text-[var(--text-secondary)] font-semibold block mb-1">Min GP%</label>
                      <input type="number" value={tier.min} onChange={e => updateTier(tier.id, 'min', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 border rounded text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                        style={{ borderColor: 'var(--border-primary)' }} />
                    </div>
                    <div>
                      <label className="text-sm text-[var(--text-secondary)] font-semibold block mb-1">Max GP%</label>
                      <input type="number" value={tier.max} onChange={e => updateTier(tier.id, 'max', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 border rounded text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                        style={{ borderColor: 'var(--border-primary)' }} />
                    </div>
                    <div>
                      <label className="text-sm text-[var(--text-secondary)] font-semibold block mb-1">Rate %</label>
                      <input type="number" value={tier.rate} onChange={e => updateTier(tier.id, 'rate', parseInt(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 border rounded text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                        style={{ borderColor: 'var(--border-primary)' }} />
                    </div>
                  </div>
                  {tiers.length > 2 && (
                    <button onClick={() => removeTier(tier.id)} className="p-1.5 hover:bg-[var(--bg-secondary)] rounded transition-colors">
                      <Trash2 size={14} style={{ color: 'var(--text-tertiary)' }} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button onClick={addTier} className="w-full px-4 py-2 border-2 border-dashed rounded-lg text-sm font-semibold text-[var(--text-secondary)] hover:opacity-75 transition-opacity"
              style={{ borderColor: 'var(--border-primary)' }}>
              + Add Tier
            </button>
          </div>
        )}

        {/* Step 5: Payment Schedule */}
        {step === 5 && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Payment Schedule</h2>
            <div className="rounded-lg border p-4 space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Front/Back Split: {frontSplit}% / {100-frontSplit}%</label>
                <input type="range" min="0" max="100" value={frontSplit} onChange={e => setFrontSplit(parseInt(e.target.value))}
                  className="w-full" style={{ accentColor: 'var(--accent-blue)' }} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Pay Schedule</label>
                <select value={paySchedule} onChange={e => setPaySchedule(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                  style={{ borderColor: 'var(--border-primary)' }}>
                  <option value="semi-monthly">Semi-Monthly</option>
                  <option value="monthly">Monthly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Clawback Period (days): {clawbackDays}</label>
                <input type="number" value={clawbackDays} onChange={e => setClawbackDays(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                  style={{ borderColor: 'var(--border-primary)' }} />
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Split Deal Settings</h2>
            <div className="rounded-lg border p-4 space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={enableCanvasserCloser} onChange={e => setEnableCanvasserCloser(e.target.checked)}
                  className="w-5 h-5 rounded" style={{ accentColor: 'var(--accent-blue)' }} />
                <span className="text-sm font-semibold text-[var(--text-primary)]">Enable Canvasser/Closer Split</span>
              </label>
              {enableCanvasserCloser && (
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Canvasser Commission: {canvasserPct}%</label>
                  <input type="range" min="0" max="100" value={canvasserPct} onChange={e => setCanvasserPct(parseInt(e.target.value))}
                    className="w-full" style={{ accentColor: 'var(--accent-blue)' }} />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="max-w-2xl space-y-4">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Guardrails & Controls</h2>
            <div className="rounded-lg border p-4 space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Minimum GP% Threshold: {minGP}%</label>
                <input type="range" min="0" max="50" value={minGP} onChange={e => setMinGP(parseInt(e.target.value))}
                  className="w-full" style={{ accentColor: 'var(--accent-blue)' }} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={requireManagerApproval} onChange={e => setRequireManagerApproval(e.target.checked)}
                  className="w-5 h-5 rounded" style={{ accentColor: 'var(--accent-blue)' }} />
                <span className="text-sm font-semibold text-[var(--text-primary)]">Require Manager Approval for High Commissions</span>
              </label>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="max-w-2xl space-y-4">
            <div className="rounded-lg border p-4 space-y-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Review & Launch</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--text-secondary)] mb-2">Effective Date</label>
                  <input type="date" value={effectiveDate} onChange={e => setEffectiveDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-[var(--bg-secondary)] text-[var(--text-primary)] outline-none"
                    style={{ borderColor: 'var(--border-primary)' }} />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={notifyEmail} onChange={e => setNotifyEmail(e.target.checked)}
                    className="w-5 h-5 rounded" style={{ accentColor: 'var(--accent-blue)' }} />
                  <span className="text-sm font-semibold text-[var(--text-primary)]">Send email notification to reps</span>
                </label>
                <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.2)]">
                  <div className="text-sm font-semibold text-[var(--semantic-paid)] flex items-center gap-2">
                    <CheckCircle2 size={16} />
                    All steps complete. Ready to launch!
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 px-3 sm:px-6 py-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ borderColor: 'var(--border-primary)' }}>
        <button onClick={prev} disabled={step === 1}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-opacity disabled:opacity-50"
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <ChevronLeft size={16} />
          Back
        </button>

        <div className="text-sm text-[var(--text-secondary)]">Step {step} of 8</div>

        <button onClick={next} disabled={step === 8}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: 'var(--accent-blue)' }}>
          {step === 8 ? 'Launch' : 'Next'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
