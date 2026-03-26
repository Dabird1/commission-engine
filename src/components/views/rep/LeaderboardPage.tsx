// @ts-nocheck
'use client';

import { useState, useMemo } from 'react';
import { brands, brandTeams, achievements } from '@/data/sample-data';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';
import { Trophy, TrendingUp, TrendingDown, Minus, Award, Filter, MapPin, Building2, Users, ChevronDown, Medal, Flame, Star, Crown, Search } from 'lucide-react';

type Period = 'mtd' | 'qtd' | 'ytd';
type Category = 'overall' | 'gp' | 'deals' | 'earnings';
type Scope = 'all' | 'brand' | 'region';

// Seeded pseudo-random for consistent per-rep variation
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// Build the full leaderboard from brandTeams data
function buildBaseReps() {
  const allReps: any[] = [];

  for (const brand of brands) {
    const team = brandTeams[brand.id] || [];
    for (const rep of team) {
      allReps.push({
        id: rep.id,
        name: rep.name,
        brand: brand.name,
        brandId: brand.id,
        region: brand.region,
        ytdDeals: rep.ytdJobs || 0,
        ytdGP: rep.avgGP || 0,
        ytdEarnings: rep.ytdEarnings || 0,
        tier: rep.tier || 'bronze',
        role: rep.role || 'Sales Rep',
      });
    }
  }
  return allReps;
}

const baseReps = buildBaseReps();

// Apply period scaling — each rep gets slightly different monthly performance
// so rankings shuffle realistically between periods
function getLeaderboard(period: string) {
  const reps = baseReps.map((rep, idx) => {
    // Each rep has a unique "hot streak" factor per period
    const seed = idx + 1;
    const mtdHeat = 0.6 + seededRandom(seed * 31) * 0.8;   // 0.6-1.4x variation
    const qtdHeat = 0.75 + seededRandom(seed * 17) * 0.5;   // 0.75-1.25x variation

    let deals: number, earnings: number, avgGP: number;

    if (period === 'mtd') {
      // ~1 month = roughly YTD/5 (we're in month ~5-6) with per-rep variation
      const factor = (1 / 5.5) * mtdHeat;
      deals = Math.max(1, Math.round(rep.ytdDeals * factor));
      earnings = Math.round(rep.ytdEarnings * factor);
      // GP% shifts slightly — hot reps do better on GP too
      avgGP = Math.max(25, Math.min(48, rep.ytdGP + (mtdHeat - 1) * 6));
    } else if (period === 'qtd') {
      // ~3 months = roughly YTD/2 with per-rep variation
      const factor = (1 / 2) * qtdHeat;
      deals = Math.max(2, Math.round(rep.ytdDeals * factor));
      earnings = Math.round(rep.ytdEarnings * factor);
      avgGP = Math.max(25, Math.min(48, rep.ytdGP + (qtdHeat - 1) * 4));
    } else {
      // YTD — base data as-is
      deals = rep.ytdDeals;
      earnings = rep.ytdEarnings;
      avgGP = rep.ytdGP;
    }

    return {
      ...rep,
      deals,
      earnings,
      avgGP: Math.round(avgGP * 10) / 10,
    };
  });

  // Sort by earnings
  reps.sort((a, b) => b.earnings - a.earnings);

  // Assign ranks and prevRank
  return reps.map((rep, idx) => {
    const jitter = Math.floor(Math.sin(idx * 7.3) * 3);
    return {
      ...rep,
      rank: idx + 1,
      prevRank: Math.max(1, idx + 1 + jitter),
    };
  });
}

// Unique regions from brands
const regions = [...new Set(brands.map(b => b.region))];

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('ytd');
  const [category, setCategory] = useState<Category>('overall');
  const [scope, setScope] = useState<Scope>('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCount, setShowCount] = useState(25);

  // Current user is Aaron Bagurdes
  const currentUserId = 'ie-1';

  // Get period-specific leaderboard
  const periodLeaderboard = useMemo(() => getLeaderboard(period), [period]);

  // Filter leaderboard
  const filtered = useMemo(() => {
    let data = [...periodLeaderboard];

    // Brand filter
    if (selectedBrand !== 'all') {
      data = data.filter(r => r.brandId === selectedBrand);
    }

    // Region filter
    if (selectedRegion !== 'all') {
      data = data.filter(r => r.region === selectedRegion);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.brand.toLowerCase().includes(q)
      );
    }

    return data;
  }, [periodLeaderboard, selectedBrand, selectedRegion, searchQuery]);

  // Sort by category
  const sorted = useMemo(() => {
    const data = [...filtered];
    switch (category) {
      case 'gp': data.sort((a, b) => b.avgGP - a.avgGP); break;
      case 'deals': data.sort((a, b) => b.deals - a.deals); break;
      case 'earnings': data.sort((a, b) => b.earnings - a.earnings); break;
      default: data.sort((a, b) => b.earnings - a.earnings); break;
    }
    // Reassign display rank within filtered set
    return data.map((rep, idx) => ({ ...rep, displayRank: idx + 1 }));
  }, [filtered, category]);

  // Find current user in the sorted list
  const myEntry = sorted.find(r => r.id === currentUserId);
  const myGlobalRank = periodLeaderboard.findIndex(r => r.id === currentUserId) + 1;

  const topThree = sorted.slice(0, 3);
  const rest = sorted.slice(3, showCount);
  const totalReps = sorted.length;
  const hasMore = sorted.length > showCount;

  const getRankChange = (rep: any) => {
    return (rep.prevRank || rep.rank) - rep.rank;
  };

  const unlockedAchievements = (achievements || []).filter((a: any) => a.unlocked);
  const lockedAchievements = (achievements || []).filter((a: any) => !a.unlocked);

  // Stats summary
  const avgEarnings = sorted.length > 0 ? sorted.reduce((s, r) => s + r.earnings, 0) / sorted.length : 0;
  const topGP = sorted.length > 0 ? Math.max(...sorted.map(r => r.avgGP)) : 0;

  const filterLabel = selectedBrand !== 'all'
    ? brands.find(b => b.id === selectedBrand)?.name
    : selectedRegion !== 'all'
      ? selectedRegion
      : 'All Brands';

  const tierColors: Record<string, string> = {
    platinum: '#a78bfa',
    diamond: '#38bdf8',
    gold: '#f59e0b',
    silver: '#94a3b8',
    bronze: '#d97706',
  };

  // Tier thresholds for progression context
  const tierThresholds = [
    { tier: 'bronze', label: 'Bronze', minEarnings: 0, minGP: 0 },
    { tier: 'silver', label: 'Silver', minEarnings: 80000, minGP: 35 },
    { tier: 'gold', label: 'Gold', minEarnings: 120000, minGP: 37 },
    { tier: 'platinum', label: 'Platinum', minEarnings: 160000, minGP: 40 },
    { tier: 'diamond', label: 'Diamond', minEarnings: 200000, minGP: 42 },
  ];

  const getNextTier = (currentTier: string, earnings: number) => {
    const currentIdx = tierThresholds.findIndex(t => t.tier === currentTier);
    if (currentIdx < 0 || currentIdx >= tierThresholds.length - 1) return null;
    const next = tierThresholds[currentIdx + 1];
    const gap = next.minEarnings - earnings;
    return { ...next, gap: Math.max(0, gap) };
  };

  // Gap to next rank
  const getGapToNextRank = () => {
    if (!myEntry || myEntry.displayRank <= 1) return null;
    const above = sorted.find(r => r.displayRank === myEntry.displayRank - 1);
    if (!above) return null;
    return { name: above.name, gap: above.earnings - myEntry.earnings };
  };

  const nextTier = myEntry ? getNextTier(myEntry.tier, myEntry.earnings) : null;
  const rankGap = getGapToNextRank();

  const periodLabels: Record<string, string> = { mtd: 'this month', qtd: 'this quarter', ytd: 'this year' };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-3 pb-2">
        {/* My Position Sticky Bar */}
        {myEntry && (
          <div className="rounded-2xl p-3 mb-2.5"
            style={{ backgroundColor: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)', boxShadow: '0 0 0 1px rgba(59,130,246,0.15), 0 4px 12px rgba(59,130,246,0.08)' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                  style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
                  #{myEntry.displayRank}
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {myEntry.name} — Your Position
                  </div>
                  <div className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
                    {myEntry.deals} deals · {formatPercent(myEntry.avgGP)} avg GP · {formatCurrency(myEntry.earnings)} earned
                    {selectedBrand === 'all' && selectedRegion === 'all' && (
                      <span> · Top {Math.round((myGlobalRank / periodLeaderboard.length) * 100)}% company-wide</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase"
                  style={{
                    backgroundColor: `${tierColors[myEntry.tier] || '#94a3b8'}20`,
                    color: tierColors[myEntry.tier] || '#94a3b8',
                    border: `1px solid ${tierColors[myEntry.tier] || '#94a3b8'}40`,
                  }}>
                  {myEntry.tier}
                </div>
                {getRankChange(myEntry) > 0 ? (
                  <span className="flex items-center gap-0.5 text-sm font-bold" style={{ color: 'var(--semantic-paid)' }}>
                    <TrendingUp size={12} /> Up {getRankChange(myEntry)}
                  </span>
                ) : getRankChange(myEntry) < 0 ? (
                  <span className="flex items-center gap-0.5 text-sm font-bold" style={{ color: 'var(--semantic-risk)' }}>
                    <TrendingDown size={12} /> Down {Math.abs(getRankChange(myEntry))}
                  </span>
                ) : (
                  <span className="flex items-center gap-0.5 text-sm font-bold" style={{ color: 'var(--text-tertiary)' }}>
                    <Minus size={12} /> Holding
                  </span>
                )}
              </div>
            </div>
            {/* Contextual nudges — what does it take to move up? */}
            <div className="flex items-center gap-4 mt-2 pt-2" style={{ borderTop: '1px solid rgba(59,130,246,0.1)' }}>
              {rankGap && (
                <div className="flex items-center gap-1.5 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                  <Crown size={10} style={{ color: 'var(--accent-blue)' }} />
                  <span><strong>{formatCurrency(rankGap.gap)}</strong> more to pass {rankGap.name} for #{myEntry.displayRank - 1}</span>
                </div>
              )}
              {nextTier && nextTier.gap > 0 && (
                <div className="flex items-center gap-1.5 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                  <Star size={10} style={{ color: tierColors[nextTier.tier] || '#94a3b8' }} />
                  <span><strong>{formatCurrency(nextTier.gap)}</strong> to reach <span className="font-bold uppercase" style={{ color: tierColors[nextTier.tier] }}>{nextTier.label}</span> tier</span>
                </div>
              )}
              {nextTier && nextTier.gap <= 0 && (
                <div className="flex items-center gap-1.5 text-[14px]" style={{ color: tierColors[nextTier.tier] }}>
                  <Star size={10} />
                  <span className="font-semibold">You qualify for {nextTier.label} — promotion pending!</span>
                </div>
              )}
              <div className="text-[9px] ml-auto" style={{ color: 'var(--text-tertiary)' }}>
                rank change vs last {period === 'mtd' ? 'month' : period === 'qtd' ? 'quarter' : 'year'}
              </div>
            </div>
          </div>
        )}

        {/* Period + Category + Filters */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex gap-1 rounded-lg p-0.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              {(['mtd', 'qtd', 'ytd'] as Period[]).map(p => (
                <button key={p} onClick={() => setPeriod(p)}
                  className="px-3 py-1 rounded-md text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: period === p ? 'var(--bg-card)' : 'transparent',
                    color: period === p ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    boxShadow: period === p ? 'var(--shadow-sm)' : 'none',
                  }}>
                  {p.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Scope Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all border"
              style={{
                borderColor: (selectedBrand !== 'all' || selectedRegion !== 'all') ? 'var(--accent-blue)' : 'var(--border-primary)',
                backgroundColor: (selectedBrand !== 'all' || selectedRegion !== 'all') ? 'rgba(59,130,246,0.06)' : 'var(--bg-card)',
                color: (selectedBrand !== 'all' || selectedRegion !== 'all') ? 'var(--accent-blue)' : 'var(--text-secondary)',
              }}>
              <Filter size={12} />
              {filterLabel}
              <ChevronDown size={10} />
            </button>

            {/* Reps Count */}
            <span className="text-[14px] font-semibold px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)' }}>
              <Users size={10} className="inline mr-1" style={{ verticalAlign: '-1px' }} />
              {totalReps} reps
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Find rep..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-3 py-1.5 rounded-lg text-sm border outline-none w-36 focus:w-48 transition-all"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-primary)',
                  color: 'var(--text-primary)',
                }}
              />
            </div>

            <div className="flex gap-1 rounded-lg p-0.5" style={{ backgroundColor: 'var(--bg-secondary)' }}>
              {([
                { key: 'overall', label: 'Overall' },
                { key: 'earnings', label: 'Earnings' },
                { key: 'deals', label: 'Deals' },
                { key: 'gp', label: 'GP%' },
              ] as { key: Category; label: string }[]).map(c => (
                <button key={c.key} onClick={() => setCategory(c.key)}
                  className="px-3 py-1 rounded-md text-sm font-semibold transition-all"
                  style={{
                    backgroundColor: category === c.key ? 'var(--bg-card)' : 'transparent',
                    color: category === c.key ? 'var(--text-primary)' : 'var(--text-tertiary)',
                    boxShadow: category === c.key ? 'var(--shadow-sm)' : 'none',
                  }}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Dropdown */}
        {showFilters && (
          <div className="mt-2 p-3 rounded-xl border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[14px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>
                  <Building2 size={10} className="inline mr-1" style={{ verticalAlign: '-1px' }} />
                  Brand
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => { setSelectedBrand(e.target.value); setSelectedRegion('all'); setShowFilters(false); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-sm border"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}>
                  <option value="all">All Brands</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[14px] font-bold uppercase tracking-wider mb-1.5 block" style={{ color: 'var(--text-tertiary)' }}>
                  <MapPin size={10} className="inline mr-1" style={{ verticalAlign: '-1px' }} />
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => { setSelectedRegion(e.target.value); setSelectedBrand('all'); setShowFilters(false); }}
                  className="w-full px-2.5 py-1.5 rounded-lg text-sm border"
                  style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}>
                  <option value="all">All Regions</option>
                  {regions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            {(selectedBrand !== 'all' || selectedRegion !== 'all') && (
              <button
                onClick={() => { setSelectedBrand('all'); setSelectedRegion('all'); setShowFilters(false); }}
                className="mt-2 text-[14px] font-semibold px-2 py-1 rounded"
                style={{ color: 'var(--accent-blue)' }}>
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: 'thin' }}>
        {/* Podium - Top 3 */}
        {topThree.length >= 3 && (
          <div className="grid grid-cols-3 gap-3 mb-3">
            {topThree.map((rep: any, idx: number) => {
              const medals = ['🥇', '🥈', '🥉'];
              const medalBg = [
                'linear-gradient(135deg, rgba(234,179,8,0.12), rgba(234,179,8,0.04))',
                'linear-gradient(135deg, rgba(148,163,184,0.12), rgba(148,163,184,0.04))',
                'linear-gradient(135deg, rgba(217,119,6,0.12), rgba(217,119,6,0.04))',
              ];
              const medalBorder = ['rgba(234,179,8,0.3)', 'rgba(148,163,184,0.3)', 'rgba(217,119,6,0.3)'];
              const isMe = rep.id === currentUserId;

              return (
                <div key={rep.id} className="rounded-2xl p-3.5 text-center transition-all duration-300"
                  style={{
                    background: medalBg[idx],
                    border: `1px solid ${medalBorder[idx]}`,
                    boxShadow: isMe ? '0 0 0 2px var(--accent-blue)' : 'var(--shadow-card)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isMe ? '0 0 0 2px var(--accent-blue)' : 'var(--shadow-card)'; }}>
                  <div className="text-2xl mb-0.5">{medals[idx]}</div>
                  <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{rep.name}</div>
                  <div className="text-[14px] flex items-center justify-center gap-1" style={{ color: 'var(--text-tertiary)' }}>
                    {rep.brand}
                    <span className="inline-block w-1 h-1 rounded-full" style={{ backgroundColor: tierColors[rep.tier] || '#94a3b8' }} />
                    <span className="uppercase text-[8px] font-bold" style={{ color: tierColors[rep.tier] || '#94a3b8' }}>{rep.tier}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-1">
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{rep.deals}</div>
                      <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Deals</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--accent-green)' }}>{formatPercent(rep.avgGP)}</div>
                      <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>GP%</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold" style={{ color: 'var(--accent-blue)' }}>{formatCurrency(rep.earnings)}</div>
                      <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>Earned</div>
                    </div>
                  </div>
                  {isMe && (
                    <div className="mt-1.5 text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-blue)' }}>
                      You
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Rankings Table */}
        <div className="rounded-2xl border overflow-hidden mb-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div className="px-4 py-2 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <span className="text-sm font-bold tracking-[0.12em]" style={{ color: 'var(--text-tertiary)' }}>FULL RANKINGS</span>
            <span className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
              Showing {Math.min(showCount, sorted.length)} of {sorted.length}
            </span>
          </div>
          {rest.map((rep: any, idx: number) => {
            const change = getRankChange(rep);
            const isMe = rep.id === currentUserId;
            const displayRank = rep.displayRank;

            return (
              <div key={rep.id}
                className="flex items-center gap-3 px-4 py-2 border-b transition-colors duration-200"
                style={{
                  borderColor: 'var(--border-primary)',
                  backgroundColor: isMe ? 'rgba(59,130,246,0.06)' : 'transparent',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isMe ? 'rgba(59,130,246,0.08)' : 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isMe ? 'rgba(59,130,246,0.06)' : 'transparent'}>
                {/* Rank */}
                <div className="w-8 text-center">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>#{displayRank}</span>
                </div>
                {/* Change */}
                <div className="w-8 text-center">
                  {change > 0 ? (
                    <span className="text-[14px] font-bold" style={{ color: 'var(--semantic-paid)' }}>▲{change}</span>
                  ) : change < 0 ? (
                    <span className="text-[14px] font-bold" style={{ color: 'var(--semantic-risk)' }}>▼{Math.abs(change)}</span>
                  ) : (
                    <span className="text-[14px] font-bold" style={{ color: 'var(--text-tertiary)' }}>—</span>
                  )}
                </div>
                {/* Name + Brand */}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <div className="min-w-0">
                    <span className="text-sm font-semibold" style={{ color: isMe ? 'var(--accent-blue)' : 'var(--text-primary)' }}>{rep.name}</span>
                    {isMe && <span className="text-[9px] font-bold ml-1.5 px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)' }}>YOU</span>}
                  </div>
                  <span className="text-[14px] whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>{rep.brand}</span>
                </div>
                {/* Tier */}
                <div className="w-14 text-center">
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${tierColors[rep.tier] || '#94a3b8'}15`,
                      color: tierColors[rep.tier] || '#94a3b8',
                    }}>
                    {rep.tier}
                  </span>
                </div>
                {/* Stats */}
                <div className="flex items-center gap-4 text-right">
                  <div className="w-10">
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{rep.deals}</div>
                    <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>deals</div>
                  </div>
                  <div className="w-12">
                    <div className="text-sm font-semibold" style={{ color: 'var(--accent-green)' }}>{formatPercent(rep.avgGP)}</div>
                    <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>GP%</div>
                  </div>
                  <div className="w-16">
                    <div className="text-sm font-semibold" style={{ color: 'var(--accent-blue)' }}>{formatCurrency(rep.earnings)}</div>
                    <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>earned</div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Load More */}
          {hasMore && (
            <button
              onClick={() => setShowCount(prev => prev + 25)}
              className="w-full py-2.5 text-sm font-semibold transition-colors"
              style={{ color: 'var(--accent-blue)', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
              Show More ({sorted.length - showCount} remaining)
            </button>
          )}
        </div>

        {/* Achievements */}
        <div className="rounded-2xl border p-3" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-2 mb-2.5">
            <Award size={14} style={{ color: 'var(--accent-blue)' }} />
            <span className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>Achievements</span>
            <span className="text-[14px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--accent-blue-light)', color: 'var(--accent-blue)' }}>
              {unlockedAchievements.length}/{(achievements || []).length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {unlockedAchievements.map((a: any) => (
              <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg transition-all duration-200 hover:shadow-md"
                style={{ backgroundColor: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                <span className="text-lg">{a.icon}</span>
                <div>
                  <div className="text-[14px] font-bold" style={{ color: 'var(--text-primary)' }}>{a.name}</div>
                  <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>{a.description}</div>
                </div>
              </div>
            ))}
            {lockedAchievements.map((a: any) => (
              <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg"
                style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-primary)', opacity: a.progress > 0 ? 0.8 : 0.45 }}>
                <span className="text-lg grayscale">{a.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-[14px] font-bold" style={{ color: 'var(--text-secondary)' }}>{a.name}</div>
                    {a.progress > 0 && (
                      <span className="text-[9px] font-bold" style={{ color: 'var(--accent-blue)' }}>{a.progress}%</span>
                    )}
                  </div>
                  {a.progress > 0 ? (
                    <div className="h-1.5 rounded-full mt-1" style={{ backgroundColor: 'var(--border-primary)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${a.progress}%`, backgroundColor: 'var(--accent-blue)' }} />
                    </div>
                  ) : (
                    <div className="text-[9px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{a.description}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
