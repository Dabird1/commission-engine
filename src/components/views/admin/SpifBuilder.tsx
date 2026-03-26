// @ts-nocheck
'use client';

import { useState } from 'react';
import { Zap, TrendingUp, Users, DollarSign, Calendar, Play, Pause, ChevronDown, X } from 'lucide-react';

interface SPIFProgram {
  id: string;
  name: string;
  objective: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  spent: number;
  participatingReps: number;
  totalEarned: number;
  status: 'active' | 'paused' | 'expired';
  brands: string[];
  rewardType: string;
}

interface FormData {
  name: string;
  objective: string;
  startDate: string;
  endDate: string;
  budget: string;
  brands: string[];
  rewardType: string;
  targetMetric: string;
}

export default function SpifBuilder() {
  const [showNewSpifModal, setShowNewSpifModal] = useState(false);
  const [expandPastPrograms, setExpandPastPrograms] = useState(false);
  const [expandedDetailId, setExpandedDetailId] = useState<string | null>(null);
  const [pausedPrograms, setPausedPrograms] = useState<Record<string, boolean>>({});
  const [extendedPrograms, setExtendedPrograms] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<FormData>({
    name: '',
    objective: '',
    startDate: '',
    endDate: '',
    budget: '',
    brands: [],
    rewardType: 'per-job',
    targetMetric: ''
  });

  const today = new Date('2026-03-26');

  const activeSPIFs: SPIFProgram[] = [
    {
      id: 'spif-001',
      name: 'Q1 Enterprise Push',
      objective: 'Every roofing job sold in Q1',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
      budget: 300000,
      spent: 187500,
      participatingReps: 42,
      totalEarned: 187500,
      status: 'active',
      brands: ['Roofing Pro', 'SkyShield'],
      rewardType: 'per-job'
    },
    {
      id: 'spif-002',
      name: 'Product Launch Incentive',
      objective: 'Close 10+ deals with new XYZ platform',
      startDate: new Date('2026-02-15'),
      endDate: new Date('2026-04-15'),
      budget: 150000,
      spent: 95000,
      participatingReps: 38,
      totalEarned: 95000,
      status: 'active',
      brands: ['XYZ Platform'],
      rewardType: 'percentage'
    },
    {
      id: 'spif-003',
      name: 'Territory Expansion Bonus',
      objective: 'Expand into 5 new markets',
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-05-31'),
      budget: 200000,
      spent: 62500,
      participatingReps: 25,
      totalEarned: 62500,
      status: 'active',
      brands: ['All Brands'],
      rewardType: 'flat'
    }
  ];

  const pastSPIFs: SPIFProgram[] = [
    {
      id: 'spif-004',
      name: 'Holiday Sales Push 2025',
      objective: 'Drive Q4 revenue surge',
      startDate: new Date('2025-11-01'),
      endDate: new Date('2025-12-31'),
      budget: 250000,
      spent: 235000,
      participatingReps: 47,
      totalEarned: 235000,
      status: 'expired',
      brands: ['All Brands'],
      rewardType: 'per-job'
    },
    {
      id: 'spif-005',
      name: 'Winter Retention Campaign',
      objective: 'Retain top customers through Q1',
      startDate: new Date('2025-12-15'),
      endDate: new Date('2026-01-31'),
      budget: 100000,
      spent: 87500,
      participatingReps: 35,
      totalEarned: 87500,
      status: 'expired',
      brands: ['All Brands'],
      rewardType: 'flat'
    }
  ];

  const calculateDaysRemaining = (endDate: Date): number => {
    const diff = endDate.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateROI = (totalEarned: number, spent: number): number => {
    return spent > 0 ? (totalEarned / spent).toFixed(2) as any : 0;
  };

  const calculateAvgParticipation = (): number => {
    if (activeSPIFs.length === 0) return 0;
    const totalParticipants = activeSPIFs.reduce((sum, s) => sum + s.participatingReps, 0);
    return Math.round(totalParticipants / activeSPIFs.length);
  };

  const calculateTotalBudget = (): number => {
    return activeSPIFs.reduce((sum, s) => sum + s.budget, 0);
  };

  const calculateTotalEarned = (): number => {
    return activeSPIFs.reduce((sum, s) => sum + s.totalEarned, 0);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLaunchProgram = () => {
    setShowNewSpifModal(false);
    setFormData({
      name: '',
      objective: '',
      startDate: '',
      endDate: '',
      budget: '',
      brands: [],
      rewardType: 'per-job',
      targetMetric: ''
    });
  };

  const totalBudget = calculateTotalBudget();
  const totalEarned = calculateTotalEarned();
  const avgParticipation = calculateAvgParticipation();
  const portfolioROI = totalEarned > 0 ? (totalEarned / totalBudget).toFixed(2) : '0';

  return (
    <div className="p-8 h-[calc(100vh-3.5rem)] overflow-hidden flex flex-col" style={{ backgroundColor: 'var(--bg-secondary)' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[28px] font-bold" style={{ color: 'var(--text-primary)' }}>SPIF Programs</h1>
        <button
          onClick={() => setShowNewSpifModal(true)}
          className="px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 text-white"
          style={{ backgroundColor: 'var(--accent-blue)' }}
        >
          <Zap size={18} />
          + New SPIF
        </button>
      </div>

      {/* Portfolio KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-primary)` }}>
          <div className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Total Active Budget</div>
          <div className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>${(totalBudget / 1000).toFixed(0)}K</div>
        </div>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-primary)` }}>
          <div className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Total Earned This Period</div>
          <div className="text-[22px] font-bold" style={{ color: 'var(--accent-green)' }}>${(totalEarned / 1000).toFixed(0)}K</div>
        </div>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-primary)` }}>
          <div className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>Avg Participation Rate</div>
          <div className="text-[22px] font-bold" style={{ color: 'var(--text-primary)' }}>{avgParticipation} reps</div>
        </div>
        <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-primary)` }}>
          <div className="text-sm font-semibold uppercase mb-2" style={{ color: 'var(--text-secondary)' }}>ROI</div>
          <div className="text-[22px] font-bold" style={{ color: 'var(--accent-green)' }}>${portfolioROI}/incentive</div>
        </div>
      </div>

      {/* Active Programs Section (Scrollable) */}
      <div className="flex-1 overflow-hidden flex flex-col mb-8">
        <h2 className="text-[18px] font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Active Programs ({activeSPIFs.length})</h2>
        <div className="overflow-y-auto flex-1">
          <div className="space-y-4 pr-4">
            {activeSPIFs.map(program => {
              const daysRemaining = calculateDaysRemaining(program.endDate);
              const progressPercent = (program.spent / program.budget) * 100;
              const avgPerRep = program.participatingReps > 0 ? Math.round(program.totalEarned / program.participatingReps) : 0;

              return (
                <div key={program.id} className="rounded-lg p-6" style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-primary)` }}>
                  {/* Title and Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>{program.name}</h3>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{program.objective}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 text-sm font-semibold rounded-full text-white" style={{ backgroundColor: 'var(--accent-green)' }}>
                        Live
                      </span>
                      <span className="text-sm font-semibold px-2 py-1 rounded" style={{ color: 'var(--accent-amber)', backgroundColor: 'rgba(217, 119, 6, 0.1)' }}>
                        {daysRemaining}d left
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
                      <span>Budget Used</span>
                      <span>${program.spent.toLocaleString()} / ${program.budget.toLocaleString()}</span>
                    </div>
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ backgroundColor: 'var(--accent-blue)', width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Inline Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-4 pb-4" style={{ borderBottom: `1px solid var(--border-primary)` }}>
                    <div className="flex items-center gap-2">
                      <Users size={16} style={{ color: 'var(--text-secondary)' }} />
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Participating</div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{program.participatingReps} reps</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} style={{ color: 'var(--text-secondary)' }} />
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Total Earned</div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>${(program.totalEarned / 1000).toFixed(0)}K</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={16} style={{ color: 'var(--text-secondary)' }} />
                      <div>
                        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Avg per Rep</div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>${avgPerRep.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => setExpandedDetailId(expandedDetailId === program.id ? null : program.id)}
                      className="flex-1 px-3 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-75" style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
                      {expandedDetailId === program.id ? 'Hide Details' : 'View Details'}
                    </button>
                    <button onClick={() => setPausedPrograms(prev => ({ ...prev, [program.id]: !prev[program.id] }))}
                      className="flex-1 px-3 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-75" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      <Pause size={14} className="inline mr-1" /> {pausedPrograms[program.id] ? 'Resume' : 'Pause'}
                    </button>
                    <button onClick={() => { setExtendedPrograms(prev => ({ ...prev, [program.id]: !prev[program.id] })); setTimeout(() => setExtendedPrograms(prev => ({ ...prev, [program.id]: false })), 2000); }}
                      className="flex-1 px-3 py-2 rounded text-sm font-semibold transition-opacity hover:opacity-75" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                      <Calendar size={14} className="inline mr-1" /> {extendedPrograms[program.id] ? '+30 days ✓' : 'Extend'}
                    </button>
                  </div>

                  {/* Expanded Detail View */}
                  {expandedDetailId === program.id && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="space-y-3 text-sm">
                        <div>
                          <p style={{ color: 'var(--text-secondary)' }}>Start Date</p>
                          <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{program.startDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--text-secondary)' }}>End Date</p>
                          <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{program.endDate.toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p style={{ color: 'var(--text-secondary)' }}>Reward Type</p>
                          <p style={{ color: 'var(--text-primary)' }} className="font-semibold">{program.rewardType}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Past Programs (Collapsible) */}
      <div className="rounded-lg" style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-primary)` }}>
        <button
          onClick={() => setExpandPastPrograms(!expandPastPrograms)}
          className="w-full p-4 flex items-center justify-between hover:opacity-75 transition-opacity"
        >
          <h2 className="text-[16px] font-bold" style={{ color: 'var(--text-primary)' }}>Past Programs ({pastSPIFs.length})</h2>
          <ChevronDown size={20} style={{ color: 'var(--text-secondary)', transform: expandPastPrograms ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
        </button>

        {expandPastPrograms && (
          <div className="space-y-2 px-4 pb-4" style={{ borderTop: `1px solid var(--border-primary)` }}>
            {pastSPIFs.map(program => (
              <div key={program.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{program.name}</div>
                  <div style={{ color: 'var(--text-secondary)' }}>{program.startDate.toLocaleDateString()} – {program.endDate.toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div style={{ color: 'var(--text-secondary)' }}>${program.totalEarned.toLocaleString()} paid</div>
                  <div className="font-semibold" style={{ color: 'var(--accent-green)' }}>ROI: ${calculateROI(program.totalEarned, program.spent)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New SPIF Modal */}
      {showNewSpifModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'var(--bg-card)', border: `1px solid var(--border-primary)` }}>
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--border-primary)' }}>
              <h2 className="text-[20px] font-bold" style={{ color: 'var(--text-primary)' }}>Create New SPIF</h2>
              <button
                onClick={() => setShowNewSpifModal(false)}
                className="p-1 rounded hover:opacity-75 transition-opacity"
              >
                <X size={24} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Program Name */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Program Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleFormChange('name', e.target.value)}
                  placeholder="e.g., Q2 Enterprise Push"
                  className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', border: `1px solid var(--border-primary)`, color: 'var(--text-primary)' }}
                />
              </div>

              {/* Objective */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Objective *</label>
                <input
                  type="text"
                  value={formData.objective}
                  onChange={e => handleFormChange('objective', e.target.value)}
                  placeholder="e.g., Every roofing job sold in March"
                  className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', border: `1px solid var(--border-primary)`, color: 'var(--text-primary)' }}
                />
              </div>

              {/* Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={e => handleFormChange('startDate', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', border: `1px solid var(--border-primary)`, color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>End Date *</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={e => handleFormChange('endDate', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', border: `1px solid var(--border-primary)`, color: 'var(--text-primary)' }}
                  />
                </div>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Total Budget *</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={e => handleFormChange('budget', e.target.value)}
                  placeholder="e.g., 100000"
                  className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', border: `1px solid var(--border-primary)`, color: 'var(--text-primary)' }}
                />
              </div>

              {/* Eligible Brands */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Eligible Brands</label>
                <div className="space-y-2">
                  {['Roofing Pro', 'SkyShield', 'XYZ Platform', 'All Brands'].map(brand => (
                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.brands.includes(brand)}
                        onChange={e => {
                          const updated = e.target.checked
                            ? [...formData.brands, brand]
                            : formData.brands.filter(b => b !== brand);
                          handleFormChange('brands', updated);
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span style={{ color: 'var(--text-primary)' }}>{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reward Type */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Reward Type *</label>
                <select
                  value={formData.rewardType}
                  onChange={e => handleFormChange('rewardType', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', border: `1px solid var(--border-primary)`, color: 'var(--text-primary)' }}
                >
                  <option value="per-job">Per Job Bonus</option>
                  <option value="percentage">Percentage of Deal</option>
                  <option value="flat">Flat Bonus</option>
                </select>
              </div>

              {/* Target Metric */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>Target Metric *</label>
                <input
                  type="text"
                  value={formData.targetMetric}
                  onChange={e => handleFormChange('targetMetric', e.target.value)}
                  placeholder="e.g., Total Revenue, Number of Deals, Customer Count"
                  className="w-full px-4 py-2 rounded-lg text-sm outline-none"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', border: `1px solid var(--border-primary)`, color: 'var(--text-primary)' }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-primary)' }}>
                <button
                  onClick={handleLaunchProgram}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: 'var(--accent-blue)' }}
                >
                  Launch SPIF
                </button>
                <button
                  onClick={() => setShowNewSpifModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg font-semibold hover:opacity-75 transition-opacity"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
