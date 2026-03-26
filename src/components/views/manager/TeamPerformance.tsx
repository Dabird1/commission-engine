'use client'

import React, { useState } from 'react'
import { teamMembers } from '@/data/sample-data';
import { formatCurrency } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function TeamPerformance() {
  const [expandedRep, setExpandedRep] = useState<string | null>(null)

  // Calculate metrics for each team member
  const teamData = teamMembers.map((member) => {
    const jobsCount = member.ytdJobsCompleted
    const earned = member.ytdEarnings
    const closeRate = ((jobsCount / (jobsCount + 8)) * 100).toFixed(1)
    const avgGP = 38 + Math.random() * 3
    const avgDealSize = earned / jobsCount
    const quotaPercent = (earned / 180000) * 100 // Assume $180K annual quota

    let status: 'on_track' | 'watch' | 'behind'
    if (quotaPercent >= 80) status = 'on_track'
    else if (quotaPercent >= 60) status = 'watch'
    else status = 'behind'

    return {
      ...member,
      jobsCount,
      closeRate: parseFloat(closeRate),
      avgGP: avgGP.toFixed(1),
      avgDealSize: Math.round(avgDealSize),
      quotaPercent: Math.round(quotaPercent),
      status,
    }
  })

  // Mock coaching insights
  const coachingInsights = [
    'Jake Torres is 2 deals from Silver tier promotion',
    'Mike Rodriguez GP% dropped 3pts this month - review deal pricing',
    'Carlos Ruiz closing velocity improving - 48 jobs YTD shows strong momentum',
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'bg-green-100 text-green-800'
      case 'watch':
        return 'bg-amber-100 text-amber-800'
      case 'behind':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track':
        return 'On Track'
      case 'watch':
        return 'Watch'
      case 'behind':
        return 'Behind'
      default:
        return status
    }
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Team Performance</h1>
        <p className="mt-2 text-[var(--text-secondary)]">Individual metrics and quota tracking</p>
      </div>

      {/* Performance Table */}
      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--text-primary)]">Rep Name</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">Jobs</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">Total Earned</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">Close Rate</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">Avg GP%</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">Avg Deal Size</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">Quota %</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-primary)]">Status</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-[var(--text-primary)]"></th>
              </tr>
            </thead>
            <tbody>
              {teamData.map((rep) => (
                <React.Fragment key={rep.id}>
                  <tr
                    className="border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] cursor-pointer"
                    onClick={() =>
                      setExpandedRep(expandedRep === rep.id ? null : rep.id)
                    }
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--text-primary)]">{rep.name}</td>
                    <td className="px-6 py-4 text-right text-sm text-[var(--text-secondary)]">{rep.jobsCount}</td>
                    <td className="px-6 py-4 text-right text-sm font-semibold text-[var(--text-primary)]">
                      {formatCurrency(rep.ytdEarnings)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[var(--text-secondary)]">{rep.closeRate}%</td>
                    <td className="px-6 py-4 text-right text-sm text-[var(--text-secondary)]">{rep.avgGP}%</td>
                    <td className="px-6 py-4 text-right text-sm text-[var(--text-secondary)]">
                      {formatCurrency(rep.avgDealSize)}
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-[var(--text-secondary)]">{rep.quotaPercent}%</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(rep.status)}`}>
                        {getStatusLabel(rep.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {expandedRep === rep.id ? (
                        <ChevronUp className="h-4 w-4 text-[var(--text-secondary)]" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" />
                      )}
                    </td>
                  </tr>
                  {expandedRep === rep.id && (
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
                      <td colSpan={9} className="px-6 py-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-secondary)] uppercase">Tier</p>
                            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                              {rep.tier.charAt(0).toUpperCase() + rep.tier.slice(1)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-secondary)] uppercase">Quota Progress</p>
                            <div className="mt-2 h-2 w-full rounded-full bg-[var(--border-color)]">
                              <div
                                className={`h-full rounded-full ${
                                  rep.status === 'on_track'
                                    ? 'bg-green-500'
                                    : rep.status === 'watch'
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                }`}
                                style={{ width: `${Math.min(rep.quotaPercent, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-secondary)] uppercase">Email</p>
                            <p className="mt-1 text-sm text-[var(--text-primary)]">{rep.email}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coaching Insights */}
      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Coaching Insights</h2>
        <div className="mt-4 space-y-3">
          {coachingInsights.map((insight, idx) => (
            <div key={idx} className="flex gap-3 rounded-lg bg-[var(--bg-secondary)] p-4">
              <div className="flex-shrink-0 text-lg">💡</div>
              <p className="text-sm text-[var(--text-secondary)]">{insight}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
