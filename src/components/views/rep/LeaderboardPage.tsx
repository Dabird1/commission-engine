'use client';

import { useState, useMemo } from 'react';
import { leaderboardData, sampleDeals, currentUser } from '@/data/sample-data';
import { formatPercent, cn } from '@/lib/utils';

type Period = 'mtd' | 'qtd' | 'ytd';

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>('ytd');

  const podium = useMemo(() => {
    // Top 3 for the period (simplified - in real app would filter by period)
    return leaderboardData.slice(0, 3);
  }, []);

  const fullTable = useMemo(() => {
    return leaderboardData.slice(3);
  }, []);

  const categoryLeaders = useMemo(() => {
    const allDeals = sampleDeals;

    // Calculate metrics for all reps
    const repMetrics: Record<
      string,
      { avgGP: number; dealCount: number; largestDeal: number; closeRate: number }
    > = {};

    allDeals.forEach((deal) => {
      if (!repMetrics[deal.repId]) {
        repMetrics[deal.repId] = { avgGP: 0, dealCount: 0, largestDeal: 0, closeRate: 0 };
      }
      repMetrics[deal.repId].dealCount++;
      repMetrics[deal.repId].largestDeal = Math.max(
        repMetrics[deal.repId].largestDeal,
        deal.fcv
      );
      repMetrics[deal.repId].avgGP += deal.gpPercent;
      if (deal.stage === 'paid') {
        repMetrics[deal.repId].closeRate++;
      }
    });

    // Calculate averages
    Object.keys(repMetrics).forEach((repId) => {
      if (repMetrics[repId].dealCount > 0) {
        repMetrics[repId].avgGP = repMetrics[repId].avgGP / repMetrics[repId].dealCount;
        repMetrics[repId].closeRate =
          (repMetrics[repId].closeRate / repMetrics[repId].dealCount) * 100;
      }
    });

    return {
      highestGP: Object.entries(repMetrics)
        .sort(([, a], [, b]) => b.avgGP - a.avgGP)[0],
      mostDeals: Object.entries(repMetrics)
        .sort(([, a], [, b]) => b.dealCount - a.dealCount)[0],
      largestDeal: Object.entries(repMetrics)
        .sort(([, a], [, b]) => b.largestDeal - a.largestDeal)[0],
      bestCloseRate: Object.entries(repMetrics)
        .sort(([, a], [, b]) => b.closeRate - a.closeRate)[0],
    };
  }, []);

  const getMedalColor = (position: 0 | 1 | 2) => {
    if (position === 0) return 'bg-yellow-50 border-yellow-200';
    if (position === 1) return 'bg-slate-50 border-slate-200';
    return 'bg-orange-50 border-orange-200';
  };

  const getMedalIcon = (position: 0 | 1 | 2) => {
    if (position === 0) return '🥇';
    if (position === 1) return '🥈';
    return '🥉';
  };

  return (
    <div className="space-y-6">
      {/* Period Toggle */}
      <div className="flex gap-2 rounded-lg border border-slate-200 bg-white p-4 shadow-sm w-fit">
        {(['mtd', 'qtd', 'ytd'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              period === p
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            )}
          >
            {p === 'mtd' ? 'MTD' : p === 'qtd' ? 'QTD' : 'YTD'}
          </button>
        ))}
      </div>

      {/* Podium - Top 3 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {podium.map((rep, index) => {
          const isCurrentUser = rep.repId === currentUser.id;
          return (
            <div
              key={rep.id}
              className={cn(
                'rounded-lg border-2 p-6 shadow-sm',
                getMedalColor(index as 0 | 1 | 2),
                isCurrentUser && 'ring-2 ring-blue-500'
              )}
            >
              <div className="text-center">
                <div className="text-5xl mb-4">{getMedalIcon(index as 0 | 1 | 2)}</div>
                <p className="text-sm font-semibold text-slate-600">Rank #{index + 1}</p>
                <p className="mt-2 text-lg font-bold text-slate-900">{rep.repName}</p>
                <p className="text-sm text-slate-600 mt-1">{rep.brandName}</p>
                <div className="mt-4 space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Deals</span>
                    <span className="text-sm font-semibold text-slate-900">{rep.deals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-600">Avg GP%</span>
                    <span className="text-sm font-semibold text-slate-900">
                      {formatPercent(rep.avgGP)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Table - 4th+ */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Full Rankings</h2>
        </div>
        <table className="w-full">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Rank</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600">Change</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Name</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600">Brand</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-slate-600">Deals</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600">Avg GP%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {fullTable.map((rep) => {
              const isCurrentUser = rep.repId === currentUser.id;
              const rankChange = rep.rank - rep.prevRank;
              const changeIcon = rankChange < 0 ? '↑' : rankChange > 0 ? '↓' : '→';
              const changeColor =
                rankChange < 0 ? 'text-green-600' : rankChange > 0 ? 'text-red-600' : 'text-slate-600';

              return (
                <tr
                  key={rep.id}
                  className={cn('hover:bg-slate-50', isCurrentUser && 'bg-blue-50')}
                >
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    #{rep.rank}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn('text-sm font-medium', changeColor)}>
                      {changeIcon}
                      {Math.abs(rankChange)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {rep.repName}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{rep.brandName}</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-900">
                    {rep.deals}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-slate-900">
                    {formatPercent(rep.avgGP)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Category Leaders */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Category Leaders</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryLeaders.highestGP && categoryLeaders.highestGP[1] && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 uppercase">Highest GP%</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {formatPercent(categoryLeaders.highestGP[1].avgGP)}
              </p>
              <p className="text-sm text-slate-600 truncate">
                {leaderboardData.find((r) => r.repId === categoryLeaders.highestGP![0])?.repName || '—'}
              </p>
            </div>
          )}

          {categoryLeaders.mostDeals && categoryLeaders.mostDeals[1] && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 uppercase">Most Deals</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {categoryLeaders.mostDeals[1].dealCount}
              </p>
              <p className="text-sm text-slate-600 truncate">
                {leaderboardData.find((r) => r.repId === categoryLeaders.mostDeals![0])?.repName || '—'}
              </p>
            </div>
          )}

          {categoryLeaders.largestDeal && categoryLeaders.largestDeal[1] && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 uppercase">Largest Deal</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                ${(categoryLeaders.largestDeal[1].largestDeal / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-slate-600 truncate">
                {leaderboardData.find((r) => r.repId === categoryLeaders.largestDeal![0])?.repName || '—'}
              </p>
            </div>
          )}

          {categoryLeaders.bestCloseRate && categoryLeaders.bestCloseRate[1] && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-600 uppercase">Close Rate</p>
              <p className="mt-2 text-lg font-bold text-slate-900">
                {formatPercent(categoryLeaders.bestCloseRate[1].closeRate)}
              </p>
              <p className="text-sm text-slate-600 truncate">
                {leaderboardData.find((r) => r.repId === categoryLeaders.bestCloseRate![0])?.repName || '—'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
