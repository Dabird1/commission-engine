// @ts-nocheck
'use client';

import { useState } from 'react';
import { Info, RotateCcw, Save } from 'lucide-react';

interface SplitConfig {
  type: string;
  enabled: boolean;
  ratio1: number;
  ratio2: number;
  tierImpact: string;
  leaderboardCredit: string;
  requiresApproval: boolean;
}

export default function SplitDealConfig() {
  const [configs, setConfigs] = useState<Record<string, SplitConfig>>({
    canvasser_closer: {
      type: 'Canvasser/Closer',
      enabled: true,
      ratio1: 30,
      ratio2: 70,
      tierImpact: 'full_credit',
      leaderboardCredit: 'full',
      requiresApproval: false
    },
    training: {
      type: 'Training',
      enabled: true,
      ratio1: 20,
      ratio2: 80,
      tierImpact: 'split_credit',
      leaderboardCredit: 'split',
      requiresApproval: true
    },
    co_sell: {
      type: 'Co-Sell',
      enabled: true,
      ratio1: 50,
      ratio2: 50,
      tierImpact: 'split_credit',
      leaderboardCredit: 'split',
      requiresApproval: true
    },
    referral: {
      type: 'Referral',
      enabled: true,
      ratio1: 10,
      ratio2: 90,
      tierImpact: 'no_credit',
      leaderboardCredit: 'closer_only',
      requiresApproval: false
    },
    manager_override: {
      type: 'Manager Override',
      enabled: true,
      ratio1: 0,
      ratio2: 100,
      tierImpact: 'full_credit',
      leaderboardCredit: 'full',
      requiresApproval: true
    },
    reassigned: {
      type: 'Reassigned',
      enabled: true,
      ratio1: 50,
      ratio2: 50,
      tierImpact: 'full_credit',
      leaderboardCredit: 'full',
      requiresApproval: false
    }
  });

  const brands = ['Brand A', 'Brand B', 'Brand C'];
  const [selectedBrand, setSelectedBrand] = useState(brands[0]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [resetStatus, setResetStatus] = useState<'idle' | 'reset'>('idle');

  const handleToggle = (key: string) => {
    setConfigs(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled }
    }));
  };

  const handleRatioChange = (key: string, field: 'ratio1' | 'ratio2', value: number) => {
    setConfigs(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const handleTierImpactChange = (key: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [key]: { ...prev[key], tierImpact: value }
    }));
  };

  const handleLeaderboardChange = (key: string, value: string) => {
    setConfigs(prev => ({
      ...prev,
      [key]: { ...prev[key], leaderboardCredit: value }
    }));
  };

  const handleApprovalChange = (key: string) => {
    setConfigs(prev => ({
      ...prev,
      [key]: { ...prev[key], requiresApproval: !prev[key].requiresApproval }
    }));
  };

  const getTierLabel = (value: string) => {
    switch (value) {
      case 'full_credit':
        return 'Full Credit';
      case 'split_credit':
        return 'Split Credit';
      case 'no_credit':
        return 'No Credit';
      default:
        return value;
    }
  };

  const getLeaderboardLabel = (value: string) => {
    switch (value) {
      case 'full':
        return 'Full';
      case 'split':
        return 'Split';
      case 'closer_only':
        return 'Closer Only';
      default:
        return value;
    }
  };

  return (
    <div className="p-3 sm:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Split Deal Configuration</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Configure how commission is split between reps on multi-party deals</p>
      </div>

      {/* Brand Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Brand:</span>
        <div className="flex gap-2">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className="px-4 py-2 rounded-lg font-medium transition-colors text-sm"
              style={{
                backgroundColor: selectedBrand === brand ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                color: selectedBrand === brand ? 'white' : 'var(--text-primary)'
              }}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Table */}
      <div className="rounded-lg border overflow-x-auto" style={{ borderColor: 'var(--border-primary)' }}>
        <table className="w-full min-w-max">
          <thead className="border-b" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
            <tr>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-secondary)] w-16">On</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">Ratio</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">Tier Impact</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-secondary)]">Leaderboard</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--text-secondary)] w-20">Requires Approval</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(configs).map(([key, config], idx) => (
              <tr key={key} className="border-b hover:opacity-75 transition-opacity" style={{ borderColor: 'var(--border-primary)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--bg-secondary)' }}>
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => handleToggle(key)}
                    className="w-5 h-5 cursor-pointer rounded"
                    style={{ accentColor: 'var(--accent-blue)' }}
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="text-sm font-semibold text-[var(--text-primary)]">{config.type}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.ratio1}
                      onChange={e => handleRatioChange(key, 'ratio1', parseInt(e.target.value) || 0)}
                      disabled={!config.enabled}
                      className="w-10 px-2 py-1 border rounded text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] disabled:opacity-50 outline-none"
                      style={{ borderColor: 'var(--border-primary)' }}
                    />
                    <span className="text-[var(--text-tertiary)]">/</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.ratio2}
                      onChange={e => handleRatioChange(key, 'ratio2', parseInt(e.target.value) || 0)}
                      disabled={!config.enabled}
                      className="w-10 px-2 py-1 border rounded text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] disabled:opacity-50 outline-none"
                      style={{ borderColor: 'var(--border-primary)' }}
                    />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={config.tierImpact}
                    onChange={e => handleTierImpactChange(key, e.target.value)}
                    disabled={!config.enabled}
                    className="px-2 py-1.5 border rounded text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] disabled:opacity-50 outline-none"
                    style={{ borderColor: 'var(--border-primary)' }}
                  >
                    <option value="full_credit">Full Credit</option>
                    <option value="split_credit">Split Credit</option>
                    <option value="no_credit">No Credit</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={config.leaderboardCredit}
                    onChange={e => handleLeaderboardChange(key, e.target.value)}
                    disabled={!config.enabled}
                    className="px-2 py-1.5 border rounded text-sm text-[var(--text-primary)] bg-[var(--bg-secondary)] disabled:opacity-50 outline-none"
                    style={{ borderColor: 'var(--border-primary)' }}
                  >
                    <option value="full">Full</option>
                    <option value="split">Split</option>
                    <option value="closer_only">Closer Only</option>
                  </select>
                </td>
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={config.requiresApproval}
                    onChange={() => handleApprovalChange(key)}
                    disabled={!config.enabled}
                    className="w-5 h-5 cursor-pointer rounded disabled:opacity-50"
                    style={{ accentColor: 'var(--accent-blue)' }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="rounded-lg border p-3 sm:p-4" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)' }}>
        <div className="flex items-start gap-2 mb-3">
          <Info size={16} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent-blue)' }} />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Configuration Reference</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 text-sm">
          <div>
            <div className="font-semibold text-[var(--text-primary)] mb-2">Tier Impact</div>
            <ul className="space-y-1 text-[var(--text-secondary)] text-sm">
              <li><strong>Full Credit:</strong> Both reps count toward tier thresholds</li>
              <li><strong>Split Credit:</strong> Only primary rep counts for tiers</li>
              <li><strong>No Credit:</strong> Rep not credited toward any tier</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[var(--text-primary)] mb-2">Leaderboard Credit</div>
            <ul className="space-y-1 text-[var(--text-secondary)] text-sm">
              <li><strong>Full:</strong> Both reps get leaderboard credit</li>
              <li><strong>Split:</strong> Reps split leaderboard credit</li>
              <li><strong>Closer Only:</strong> Only closer gets credit</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold text-[var(--text-primary)] mb-2">Approval Requirements</div>
            <ul className="space-y-1 text-[var(--text-secondary)] text-sm">
              <li><strong>Checked:</strong> Manager must approve each split deal</li>
              <li><strong>Unchecked:</strong> Splits auto-process without approval</li>
              <li>Checked = slower, safer; unchecked = faster, automated</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={() => { setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); }}
          className="flex-1 px-6 py-2.5 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          style={{ backgroundColor: saveStatus === 'saved' ? 'var(--accent-green)' : 'var(--accent-blue)' }}>
          <Save size={16} />
          {saveStatus === 'saved' ? 'Saved ✓' : 'Save Configuration'}
        </button>
        <button onClick={() => { setResetStatus('reset'); setTimeout(() => setResetStatus('idle'), 2000); }}
          className="px-6 py-2.5 rounded-lg font-semibold hover:opacity-75 transition-opacity flex items-center justify-center gap-2"
          style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          <RotateCcw size={16} />
          {resetStatus === 'reset' ? 'Reset ✓' : 'Reset'}
        </button>
      </div>
    </div>
  );
}
