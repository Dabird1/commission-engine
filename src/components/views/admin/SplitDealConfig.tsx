'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Split Deal Configuration</h1>
      </div>

      {/* Brand Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-[var(--color-text-secondary)]">Brand:</label>
        <div className="flex gap-2">
          {brands.map(brand => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedBrand === brand
                  ? 'bg-[var(--color-button-primary)] text-white'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Configuration Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)] w-20">Enabled</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Split Type</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Ratio</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Tier Impact</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)]">Leaderboard Credit</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-text-secondary)] w-24">Approval</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(configs).map(([key, config]) => (
              <tr key={key} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg-hover)] transition-colors">
                <td className="py-3 px-4">
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={() => handleToggle(key)}
                    className="w-5 h-5 cursor-pointer accent-[var(--color-button-primary)]"
                  />
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-[var(--color-text-primary)]">{config.type}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.ratio1}
                      onChange={e => handleRatioChange(key, 'ratio1', parseInt(e.target.value) || 0)}
                      disabled={!config.enabled}
                      className="w-12 px-2 py-1 border border-[var(--color-border)] rounded text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] disabled:opacity-50"
                    />
                    <span className="text-[var(--color-text-secondary)]">/</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={config.ratio2}
                      onChange={e => handleRatioChange(key, 'ratio2', parseInt(e.target.value) || 0)}
                      disabled={!config.enabled}
                      className="w-12 px-2 py-1 border border-[var(--color-border)] rounded text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] disabled:opacity-50"
                    />
                  </div>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={config.tierImpact}
                    onChange={e => handleTierImpactChange(key, e.target.value)}
                    disabled={!config.enabled}
                    className="px-3 py-1 border border-[var(--color-border)] rounded text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] disabled:opacity-50"
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
                    className="px-3 py-1 border border-[var(--color-border)] rounded text-sm text-[var(--color-text-primary)] bg-[var(--color-bg-secondary)] disabled:opacity-50"
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
                    className="w-5 h-5 cursor-pointer accent-[var(--color-button-primary)] disabled:opacity-50"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-4">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">Configuration Legend</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-medium text-[var(--color-text-secondary)] mb-2">Tier Impact</div>
            <ul className="space-y-1 text-[var(--color-text-secondary)]">
              <li>• Full Credit: Applies to all tier calculations</li>
              <li>• Split Credit: Only primary rep counted for tiers</li>
              <li>• No Credit: Excluded from tier placement</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-[var(--color-text-secondary)] mb-2">Leaderboard Credit</div>
            <ul className="space-y-1 text-[var(--color-text-secondary)]">
              <li>• Full: Both get leaderboard credit</li>
              <li>• Split: Split credit on leaderboard</li>
              <li>• Closer Only: Only closer gets credit</li>
            </ul>
          </div>
          <div>
            <div className="font-medium text-[var(--color-text-secondary)] mb-2">Approval Rules</div>
            <ul className="space-y-1 text-[var(--color-text-secondary)]">
              <li>• Checked: Manager approval required</li>
              <li>• Unchecked: Auto-process splits</li>
              <li>• Applies at commission calculation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button className="px-6 py-2 bg-[var(--color-button-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-button-primary-hover)] transition-colors">
          Save Configuration
        </button>
        <button className="px-6 py-2 bg-[var(--color-button-secondary)] text-[var(--color-text-primary)] rounded-lg font-medium hover:bg-[var(--color-button-secondary-hover)] transition-colors">
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
