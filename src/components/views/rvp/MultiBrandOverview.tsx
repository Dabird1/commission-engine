// @ts-nocheck

'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, MapPin, Users, ArrowUpDown, LayoutGrid, List, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { brandAnalytics, brands } from '@/data/sample-data';
import { formatCurrency, formatPercent } from '@/lib/utils';

// Stable sparkline data per brand (6-month trend)
const sparklineSeeds: Record<string, number[]> = {
  'brand-1': [22, 24, 23, 28, 26, 32],
  'brand-2': [14, 15, 14, 16, 15, 17],
  'brand-3': [18, 20, 19, 22, 24, 26],
  'brand-4': [10, 11, 10, 12, 11, 12],
  'brand-5': [8, 7, 8, 9, 8, 9],
  'brand-6': [16, 18, 17, 20, 19, 22],
  'brand-7': [18, 19, 18, 21, 20, 23],
  'brand-8': [9, 8, 9, 10, 9, 10],
  'brand-9': [20, 22, 21, 24, 23, 27],
  'brand-10': [12, 13, 12, 14, 13, 15],
  'brand-11': [10, 9, 10, 11, 10, 11],
  'brand-12': [15, 16, 15, 18, 17, 19],
  'brand-13': [24, 26, 25, 28, 27, 31],
  'brand-14': [11, 10, 11, 12, 11, 12],
  'brand-15': [35, 38, 40, 42, 44, 48],
  'brand-16': [14, 15, 14, 16, 15, 17],
  'brand-17': [26, 28, 27, 30, 29, 33],
  'brand-18': [18, 19, 20, 21, 22, 24],
  'brand-19': [7, 6, 7, 8, 7, 7],
  'brand-20': [22, 24, 23, 26, 25, 29],
  'brand-21': [16, 18, 17, 19, 18, 21],
  'brand-22': [12, 13, 14, 14, 15, 16],
  'brand-23': [9, 10, 9, 11, 10, 11],
  'brand-24': [13, 14, 13, 15, 14, 16],
  'brand-25': [6, 5, 6, 7, 6, 7],
};

type SortKey = 'region' | 'totalEarned' | 'costPerRep' | 'avgGP' | 'repCount' | 'avgRate';
type ViewMode = 'grid' | 'table';

const REGIONS = ['All', 'Midwest', 'Northeast', 'Mid-Atlantic', 'Pacific NW', 'Southeast & Canada'] as const;

// Cost-per-rep thresholds
const CPR_HIGH = 26000;
const CPR_MID = 19000;

// GP% thresholds
const GP_STRONG = 40;
const GP_WATCH = 36;

interface MultiBrandOverviewProps {
  selectedBrand?: string;
}

function getHealthStatus(cpr: number, gp: number, trend: number): { label: string; color: string; bgColor: string; icon: 'check' | 'alert' | 'warning' } {
  if (cpr >= CPR_HIGH && gp < GP_WATCH) return { label: 'At Risk', color: '#ef4444', bgColor: 'rgba(239,68,68,0.1)', icon: 'warning' };
  if (cpr >= CPR_HIGH || gp < GP_WATCH || trend < 5) return { label: 'Watch', color: '#f59e0b', bgColor: 'rgba(245,158,11,0.1)', icon: 'alert' };
  return { label: 'Healthy', color: '#10b981', bgColor: 'rgba(16,185,129,0.1)', icon: 'check' };
}

export default function MultiBrandOverview({ selectedBrand = 'all' }: MultiBrandOverviewProps) {
  const [activeRegion, setActiveRegion] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortKey>('region');
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const generateSparkline = (brandId: string) => {
    const seeds = sparklineSeeds[brandId] || [10, 12, 11, 14, 13, 16];
    return seeds.map((val, idx) => ({ month: idx, value: val * 1000 }));
  };

  const filteredAndSorted = useMemo(() => {
    let data = brandAnalytics.map(ba => {
      const brandInfo = brands.find((b: any) => b.id === ba.brandId);
      const sparkline = generateSparkline(ba.brandId);
      const firstVal = sparkline[0]?.value || 0;
      const lastVal = sparkline[sparkline.length - 1]?.value || 0;
      const trend = firstVal > 0 ? ((lastVal - firstVal) / firstVal) * 100 : 0;
      return { ...ba, brandInfo, sparkline, trend };
    });

    if (selectedBrand !== 'all') {
      data = data.filter(d => d.brandId === selectedBrand);
    }

    if (activeRegion !== 'All') {
      data = data.filter(d => d.brandInfo?.region === activeRegion);
    }

    if (sortBy === 'region') {
      const regionOrder = ['Midwest', 'Northeast', 'Mid-Atlantic', 'Pacific NW', 'Southeast & Canada'];
      data.sort((a, b) => {
        const aIdx = regionOrder.indexOf(a.brandInfo?.region || '');
        const bIdx = regionOrder.indexOf(b.brandInfo?.region || '');
        if (aIdx !== bIdx) return sortDir === 'desc' ? aIdx - bIdx : bIdx - aIdx;
        return (b.totalEarned || 0) - (a.totalEarned || 0);
      });
    } else {
      data.sort((a, b) => {
        const aVal = a[sortBy] as number;
        const bVal = b[sortBy] as number;
        return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
      });
    }

    return data;
  }, [activeRegion, sortBy, sortDir, selectedBrand]);

  // Portfolio-level stats
  const portfolioStats = useMemo(() => {
    const data = filteredAndSorted;
    const totalEarned = data.reduce((s, b) => s + b.totalEarned, 0);
    const totalReps = data.reduce((s, b) => s + b.repCount, 0);
    const avgCPR = totalReps > 0 ? data.reduce((s, b) => s + b.costPerRep * b.repCount, 0) / totalReps : 0;
    const avgGP = totalReps > 0 ? data.reduce((s, b) => s + b.avgGP * b.repCount, 0) / totalReps : 0;
    return { totalEarned, totalReps, avgCPR, avgGP, brandCount: data.length };
  }, [filteredAndSorted]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(key); setSortDir('desc'); }
  };

  const getCPRStatus = (cpr: number): 'high' | 'mid' | 'low' => {
    if (cpr >= CPR_HIGH) return 'high';
    if (cpr <= CPR_MID) return 'low';
    return 'mid';
  };

  const getBorderColor = (cpr: number) => {
    const status = getCPRStatus(cpr);
    if (status === 'high') return '#ef4444';
    if (status === 'low') return '#10b981';
    return '#3b82f6';
  };

  const singleBrand = selectedBrand !== 'all' ? brands.find((b: any) => b.id === selectedBrand) : null;

  return (
    <div className="p-8 w-full space-y-4" style={{ maxWidth: '1400px' }}>
      {/* Header — Large and clear */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            {singleBrand ? singleBrand.name : 'Portfolio Overview'}
          </h1>
          <p className="text-14 mt-1" style={{ color: 'var(--text-secondary)' }}>
            {singleBrand
              ? `${singleBrand.location} · ${singleBrand.region} · YTD ${new Date().getFullYear()}`
              : `${portfolioStats.brandCount} brands · ${portfolioStats.totalReps} reps · YTD ${new Date().getFullYear()}`
            }
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: viewMode === 'grid' ? 'var(--accent-blue)' : 'transparent',
              color: viewMode === 'grid' ? '#fff' : 'var(--text-tertiary)',
            }}
            title="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: viewMode === 'table' ? 'var(--accent-blue)' : 'transparent',
              color: viewMode === 'table' ? '#fff' : 'var(--text-tertiary)',
            }}
            title="Table view"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* KPI Summary — PROMINENT, above the fold */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden"
        style={{ backgroundColor: 'var(--border-primary)' }}
      >
        {[
          { label: 'Total Commission', value: formatCurrency(portfolioStats.totalEarned), sub: `${portfolioStats.brandCount} brand${portfolioStats.brandCount !== 1 ? 's' : ''}`, status: 'neutral' },
          { label: 'Total Reps', value: portfolioStats.totalReps.toString(), sub: portfolioStats.brandCount > 0 ? `${Math.round(portfolioStats.totalReps / portfolioStats.brandCount)}/brand avg` : '—', status: 'neutral' },
          { label: 'Avg Cost/Rep', value: formatCurrency(portfolioStats.avgCPR), sub: portfolioStats.avgCPR >= CPR_HIGH ? 'ABOVE TARGET' : portfolioStats.avgCPR <= CPR_MID ? 'UNDER TARGET' : 'ON TARGET', status: portfolioStats.avgCPR >= CPR_HIGH ? 'warning' : portfolioStats.avgCPR <= CPR_MID ? 'healthy' : 'neutral' },
          { label: 'Avg GP%', value: formatPercent(portfolioStats.avgGP), sub: portfolioStats.avgGP >= GP_STRONG ? 'STRONG' : portfolioStats.avgGP >= GP_WATCH ? 'ON TARGET' : 'AT RISK', status: portfolioStats.avgGP >= GP_STRONG ? 'healthy' : portfolioStats.avgGP >= GP_WATCH ? 'neutral' : 'warning' },
        ].map((kpi, i) => (
          <div key={i} className="px-6 py-5" style={{ backgroundColor: 'var(--bg-card)' }}>
            <p className="text-12 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
              {kpi.label}
            </p>
            <p className="text-24 font-bold mt-2" style={{ color: 'var(--text-primary)' }}>
              {kpi.value}
            </p>
            <p className="text-12 font-semibold mt-1" style={{
              color: kpi.status === 'warning' ? 'var(--accent-red)' : kpi.status === 'healthy' ? 'var(--accent-green)' : 'var(--text-secondary)'
            }}>
              {kpi.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Region Tabs + Sort Controls — sticky filter bar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {selectedBrand === 'all' ? (
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--bg-secondary)' }}>
            {REGIONS.map(region => (
              <button
                key={region}
                onClick={() => setActiveRegion(region)}
                className="px-4 py-2 text-13 font-semibold rounded-md transition-all"
                style={{
                  backgroundColor: activeRegion === region ? 'var(--bg-card)' : 'transparent',
                  color: activeRegion === region ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  boxShadow: activeRegion === region ? 'var(--shadow-sm)' : 'none',
                }}
              >
                {region}
              </button>
            ))}
          </div>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={e => { setSortBy(e.target.value as SortKey); setSortDir('desc'); }}
            className="text-13 font-semibold px-3 py-2 rounded-md border"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              borderColor: 'var(--border-primary)',
            }}
          >
            <option value="region">Region</option>
            <option value="totalEarned">Total Earned</option>
            <option value="costPerRep">Cost/Rep</option>
            <option value="avgGP">GP%</option>
            <option value="repCount">Rep Count</option>
            <option value="avgRate">Commission Rate</option>
          </select>
          <button
            onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
            className="p-2 rounded-md"
            style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}
          >
            <ArrowUpDown size={16} />
          </button>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        sortBy === 'region' && selectedBrand === 'all' ? (
          <div className="space-y-6">
            {['Midwest', 'Northeast', 'Mid-Atlantic', 'Pacific NW', 'Southeast & Canada']
              .filter(region => activeRegion === 'All' || activeRegion === region)
              .map(region => {
                const regionBrands = filteredAndSorted.filter(b => b.brandInfo?.region === region);
                if (regionBrands.length === 0) return null;
                const regionEarned = regionBrands.reduce((s, b) => s + b.totalEarned, 0);
                const regionReps = regionBrands.reduce((s, b) => s + b.repCount, 0);
                return (
                  <div key={region}>
                    <div className="flex items-center gap-3 mb-4 pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                      <MapPin size={16} style={{ color: 'var(--accent-blue)' }} />
                      <h2 className="text-16 font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>{region}</h2>
                      <span className="text-13 font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                        {regionBrands.length} brands · {regionReps} reps · {formatCurrency(regionEarned)}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {regionBrands.map((brand) => renderBrandCard(brand))}
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAndSorted.map((brand) => renderBrandCard(brand))}
          </div>
        )
      ) : (
        /* Table View — Compact but readable */
        <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--bg-card)', boxShadow: 'var(--shadow-sm)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <th className="px-5 py-3 text-left text-13 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Brand</th>
                  <th className="px-5 py-3 text-left text-13 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Region</th>
                  <th className="px-5 py-3 text-center text-13 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Status</th>
                  <th className="px-5 py-3 text-right text-13 font-semibold uppercase tracking-wider cursor-pointer" style={{ color: sortBy === 'totalEarned' ? 'var(--accent-blue)' : 'var(--text-tertiary)' }} onClick={() => toggleSort('totalEarned')}>Earned</th>
                  <th className="px-5 py-3 text-right text-13 font-semibold uppercase tracking-wider cursor-pointer" style={{ color: sortBy === 'repCount' ? 'var(--accent-blue)' : 'var(--text-tertiary)' }} onClick={() => toggleSort('repCount')}>Reps</th>
                  <th className="px-5 py-3 text-right text-13 font-semibold uppercase tracking-wider cursor-pointer" style={{ color: sortBy === 'costPerRep' ? 'var(--accent-blue)' : 'var(--text-tertiary)' }} onClick={() => toggleSort('costPerRep')}>Cost/Rep</th>
                  <th className="px-5 py-3 text-right text-13 font-semibold uppercase tracking-wider cursor-pointer" style={{ color: sortBy === 'avgGP' ? 'var(--accent-blue)' : 'var(--text-tertiary)' }} onClick={() => toggleSort('avgGP')}>GP%</th>
                  <th className="px-5 py-3 text-right text-13 font-semibold uppercase tracking-wider cursor-pointer" style={{ color: sortBy === 'avgRate' ? 'var(--accent-blue)' : 'var(--text-tertiary)' }} onClick={() => toggleSort('avgRate')}>Rate</th>
                  <th className="px-5 py-3 text-center text-13 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSorted.map((brand, idx) => {
                  const cprStatus = getCPRStatus(brand.costPerRep);
                  const isGrowth = brand.trend >= 0;
                  const health = getHealthStatus(brand.costPerRep, brand.avgGP, brand.trend);
                  return (
                    <tr
                      key={brand.brandId}
                      className="transition-colors"
                      style={{
                        borderBottom: '1px solid var(--border-primary)',
                        borderLeft: `3px solid ${getBorderColor(brand.costPerRep)}`,
                      }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <td className="px-5 py-4">
                        <p className="text-14 font-semibold" style={{ color: 'var(--text-primary)' }}>{brand.brandName}</p>
                        <p className="text-12" style={{ color: 'var(--text-tertiary)' }}>{brand.brandInfo?.location}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-13 font-medium px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                          {brand.brandInfo?.region}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-12 font-bold" style={{ backgroundColor: health.bgColor, color: health.color }}>
                          {health.icon === 'check' && <CheckCircle size={12} />}
                          {health.icon === 'alert' && <AlertCircle size={12} />}
                          {health.icon === 'warning' && <AlertTriangle size={12} />}
                          {health.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-14 font-bold" style={{ color: 'var(--text-primary)' }}>{formatCurrency(brand.totalEarned)}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-14 font-semibold" style={{ color: 'var(--text-primary)' }}>{brand.repCount}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-14 font-bold" style={{
                          color: cprStatus === 'high' ? 'var(--accent-red)' : cprStatus === 'low' ? 'var(--accent-green)' : 'var(--text-primary)',
                        }}>
                          {formatCurrency(brand.costPerRep)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-14 font-semibold" style={{ color: brand.avgGP >= GP_STRONG ? 'var(--accent-green)' : brand.avgGP < GP_WATCH ? 'var(--accent-red)' : 'var(--text-primary)' }}>{formatPercent(brand.avgGP)}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="text-14 font-semibold" style={{ color: 'var(--text-secondary)' }}>{formatPercent(brand.avgRate * 100)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-6">
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={brand.sparkline} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
                                <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
                                <Line type="monotone" dataKey="value" stroke={isGrowth ? 'var(--accent-green)' : 'var(--accent-red)'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                          <span className="text-13 font-bold" style={{ color: isGrowth ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                            {isGrowth ? '+' : ''}{Math.round(brand.trend)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Portfolio Summary Footer */}
      <div
        className="rounded-lg p-6 flex flex-wrap items-center justify-between gap-6"
        style={{
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-sm)',
          borderTop: '2px solid var(--accent-blue)',
        }}
      >
        <div className="flex items-center gap-8 flex-wrap">
          <div>
            <p className="text-12 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Portfolio Total</p>
            <p className="text-20 font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(portfolioStats.totalEarned)}
            </p>
          </div>
          <div style={{ width: 1, height: 40, backgroundColor: 'var(--border-primary)' }} />
          <div>
            <p className="text-12 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Avg Cost/Rep</p>
            <p className="text-20 font-bold mt-1" style={{ color: portfolioStats.avgCPR >= CPR_HIGH ? 'var(--accent-red)' : 'var(--accent-green)' }}>
              {formatCurrency(portfolioStats.avgCPR)}
            </p>
          </div>
          <div style={{ width: 1, height: 40, backgroundColor: 'var(--border-primary)' }} />
          <div>
            <p className="text-12 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Avg GP%</p>
            <p className="text-20 font-bold mt-1" style={{ color: 'var(--text-primary)' }}>
              {formatPercent(portfolioStats.avgGP)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-12 font-semibold" style={{ color: 'var(--text-tertiary)' }}>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ef4444' }} />
            Cost/Rep ≥ $26K
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
            $19K–$26K
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10b981' }} />
            Cost/Rep ≤ $19K
          </span>
        </div>
      </div>
    </div>
  );

  // Brand Card — Readable and dense
  function renderBrandCard(brand: any) {
    const cprStatus = getCPRStatus(brand.costPerRep);
    const isGrowth = brand.trend >= 0;
    const health = getHealthStatus(brand.costPerRep, brand.avgGP, brand.trend);

    return (
      <div
        key={brand.brandId}
        className="rounded-lg overflow-hidden transition-all hover:translate-y-[-2px]"
        style={{
          backgroundColor: 'var(--bg-card)',
          boxShadow: 'var(--shadow-sm)',
          borderLeft: `3px solid ${getBorderColor(brand.costPerRep)}`,
        }}
      >
        {/* Card Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-14 font-bold truncate" style={{ color: 'var(--text-primary)' }}>
                {brand.brandName}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <MapPin size={12} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                <span className="text-12 truncate" style={{ color: 'var(--text-tertiary)' }}>
                  {brand.brandInfo?.location}
                </span>
              </div>
            </div>
            <span
              className="inline-flex items-center gap-0.5 px-2 py-1 rounded-full text-11 font-bold flex-shrink-0"
              style={{ backgroundColor: health.bgColor, color: health.color }}
            >
              {health.icon === 'check' && <CheckCircle size={10} />}
              {health.icon === 'alert' && <AlertCircle size={10} />}
              {health.icon === 'warning' && <AlertTriangle size={10} />}
              {health.label}
            </span>
          </div>
        </div>

        {/* Sparkline */}
        <div className="px-4 pt-1 pb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-11 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)', opacity: 0.8 }}>
              6-Mo Trend
            </span>
            <span
              className="inline-flex items-center gap-1 text-11 font-bold"
              style={{ color: isGrowth ? 'var(--accent-green)' : 'var(--accent-red)' }}
            >
              {isGrowth ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {isGrowth ? '+' : ''}{Math.round(brand.trend)}%
            </span>
          </div>
        </div>
        <div className="h-10 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={brand.sparkline} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <YAxis hide domain={['dataMin - 1000', 'dataMax + 1000']} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={isGrowth ? 'var(--accent-green)' : 'var(--accent-red)'}
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Metrics — Large readable text */}
        <div className="px-4 pb-4 pt-3 grid grid-cols-2 gap-x-4 gap-y-3">
          <div>
            <p className="text-11 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Earned</p>
            <p className="text-14 font-bold mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {formatCurrency(brand.totalEarned)}
            </p>
          </div>
          <div>
            <p className="text-11 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Cost/Rep</p>
            <p className="text-14 font-bold mt-0.5" style={{
              color: cprStatus === 'high' ? 'var(--accent-red)' : cprStatus === 'low' ? 'var(--accent-green)' : 'var(--text-primary)',
            }}>
              {formatCurrency(brand.costPerRep)}
            </p>
          </div>
          <div>
            <p className="text-11 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>GP%</p>
            <p className="text-14 font-bold mt-0.5" style={{
              color: brand.avgGP >= GP_STRONG ? 'var(--accent-green)' : brand.avgGP < GP_WATCH ? 'var(--accent-red)' : 'var(--text-primary)',
            }}>
              {formatPercent(brand.avgGP)}
            </p>
          </div>
          <div>
            <p className="text-11 font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Reps</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Users size={12} style={{ color: 'var(--text-tertiary)' }} />
              <p className="text-14 font-bold" style={{ color: 'var(--text-primary)' }}>
                {brand.repCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
