'use client'

import { useState } from 'react'
import { teamMembers, monthlyTrends } from '@/data/sample-data'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function TeamOverview() {
  const [hoveredRep, setHoveredRep] = useState<string | null>(null)

  // Calculate team metrics
  const teamEarnings = teamMembers.reduce((sum, m) => sum + m.ytdEarnings, 0)
  const teamJobs = teamMembers.reduce((sum, m) => sum + m.ytdJobsCompleted, 0)
  const avgCloseRate = ((teamJobs / (teamJobs + 45)) * 100).toFixed(1) // Mock conversion estimate
  const companyAvgCloseRate = 35.1
  const avgDealSize = teamEarnings / teamJobs
  const companyAvgDealSize = 7200
  const avgGP = 38.9
  const companyAvgGP = 36.5

  // Prepare team earnings chart data
  const teamEarningsData = teamMembers.map((m) => ({
    name: m.name.split(' ')[0],
    earnings: m.ytdEarnings,
    jobs: m.ytdJobsCompleted,
  }))

  // Top performer
  const topPerformer = teamMembers[0]
  const topPerformerCloseRate = ((topPerformer.ytdJobsCompleted / (topPerformer.ytdJobsCompleted + 10)) * 100).toFixed(1)

  // Stat card component
  const StatCard = ({
    label,
    value,
    comparison,
    isAbove,
  }: {
    label: string
    value: string
    comparison: string
    isAbove: boolean
  }) => (
    <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
      <div className="text-sm font-medium text-[var(--text-secondary)]">{label}</div>
      <div className="mt-2 text-2xl font-bold text-[var(--text-primary)]">{value}</div>
      <div className="mt-3 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
        {isAbove ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
        <span className={isAbove ? 'text-green-600' : 'text-red-600'}>{comparison}</span>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 p-3 sm:space-y-8 sm:p-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Team Overview</h1>
        <p className="mt-2 text-sm sm:text-base text-[var(--text-secondary)]">March 2026 Performance Summary</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Team Total Earned"
          value={formatCurrency(teamEarnings)}
          comparison="YTD earnings"
          isAbove={true}
        />
        <StatCard
          label="Avg Close Rate"
          value={`${avgCloseRate}%`}
          comparison={`+${(parseFloat(avgCloseRate) - companyAvgCloseRate).toFixed(1)}% vs company`}
          isAbove={parseFloat(avgCloseRate) > companyAvgCloseRate}
        />
        <StatCard
          label="Avg Deal Size"
          value={formatCurrency(avgDealSize)}
          comparison={`+${formatCurrency(avgDealSize - companyAvgDealSize)} vs company`}
          isAbove={avgDealSize > companyAvgDealSize}
        />
        <StatCard
          label="Avg GP%"
          value={`${avgGP}%`}
          comparison={`+${(avgGP - companyAvgGP).toFixed(1)}% vs company`}
          isAbove={avgGP > companyAvgGP}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-2">
        {/* Team Earnings Bar Chart */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-3 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Team Earnings by Rep</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamEarningsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                />
                <YAxis
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="earnings" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Commission Cost Trend */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-3 sm:p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">12-Month Commission Trend</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line
                  type="monotone"
                  dataKey="earnings"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Performer Card */}
      <div className="rounded-lg border-l-4 border-l-amber-500 border border-[var(--border-color)] bg-[var(--card-bg)] p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-0">
          <div>
            <h3 className="text-sm font-medium text-[var(--text-secondary)]">Top Performer</h3>
            <p className="mt-2 text-xl font-bold text-[var(--text-primary)]">
              {topPerformer.name} — {formatCurrency(topPerformer.ytdEarnings)},
              {topPerformerCloseRate}% close rate
            </p>
            <p className="mt-3 text-sm text-[var(--text-secondary)]">
              {topPerformer.ytdJobsCompleted} completed jobs | {topPerformer.tier.toUpperCase()} tier
            </p>
          </div>
          <div className="rounded-full bg-amber-100 p-4">
            <div className="text-2xl">⭐</div>
          </div>
        </div>
      </div>
    </div>
  )
}
