'use client'

import { useState } from 'react'
import { monthlyTrends, brandAnalytics } from '@/data/sample-data'
import { formatCurrency } from '@/lib/utils'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function CostAnalysis() {
  const [newHires, setNewHires] = useState(2)

  // Calculate commission cost as % of revenue
  const totalRevenue = 4800000 // Mock annual revenue
  const costPercentageData = monthlyTrends.map((trend) => ({
    month: trend.month,
    costPercent: ((trend.earnings * 12) / totalRevenue) * 100, // Annualized
    costAmount: trend.earnings,
  }))

  // Cost per rep (mock data from team earnings)
  const costPerRepData = [
    { name: 'Aaron Bagurdes', cost: 148000 },
    { name: 'Sarah Mitchell', cost: 112000 },
    { name: 'Jake Torres', cost: 95000 },
    { name: 'Lisa Chen', cost: 88000 },
    { name: 'Mike Rodriguez', cost: 72000 },
    { name: 'Emma Wilson', cost: 68000 },
    { name: 'Carlos Ruiz', cost: 54000 },
    { name: 'Nina Patel', cost: 41000 },
  ]

  // Cost by project type (mock breakdown)
  const costByProjectData = [
    { name: 'Roofing', value: 285000, percentage: 38 },
    { name: 'Windows', value: 164000, percentage: 22 },
    { name: 'Siding', value: 98000, percentage: 13 },
    { name: 'Gutters', value: 52000, percentage: 7 },
    { name: 'Exteriors', value: 148000, percentage: 20 },
  ]

  // Simulator calculation
  const currentTeamSize = 8
  const currentTotalCost = 678000 // YTD sum
  const costPerRep = currentTotalCost / currentTeamSize
  const projectedCost = currentTotalCost + newHires * costPerRep
  const costIncrease = projectedCost - currentTotalCost

  // Color scheme for pie chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Cost Analysis</h1>
        <p className="mt-2 text-[var(--text-secondary)]">Commission expenses and cost optimization</p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Commission Cost as % of Revenue */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Commission Cost % of Revenue (12M)</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={costPercentageData}>
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
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                  }}
                  formatter={(value) => `${(value as number).toFixed(2)}%`}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Line
                  type="monotone"
                  dataKey="costPercent"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Cost %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost per Rep Bar Chart */}
        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cost per Rep (YTD)</h2>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costPerRepData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis
                  type="number"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: 'var(--text-secondary)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--border-color)' }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Bar dataKey="cost" fill="#10b981" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cost by Project Type */}
      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Cost by Project Type</h2>
        <div className="mt-6 flex flex-col gap-8 lg:flex-row">
          <div className="h-80 flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={costByProjectData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costByProjectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-3">
            {costByProjectData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                ></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{item.name}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{formatCurrency(item.value)}</p>
                </div>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cost Simulator */}
      <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">Hiring Impact Simulator</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Estimate cost increases with new team members
        </p>

        <div className="mt-6 space-y-6">
          {/* Slider Control */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-primary)]">
              Number of New Hires: <span className="text-lg font-bold text-blue-600">{newHires}</span>
            </label>
            <div className="mt-3 flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                value={newHires}
                onChange={(e) => setNewHires(parseInt(e.target.value))}
                className="flex-1 h-2 bg-[var(--border-color)] rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNewHires(num)}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      newHires === num
                        ? 'bg-blue-600 text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--border-color)]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Current Cost */}
            <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
              <p className="text-xs font-semibold text-[var(--text-secondary)] uppercase">Current Annual Cost</p>
              <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                {formatCurrency(currentTotalCost)}
              </p>
            </div>

            {/* Projected Cost */}
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                Projected Cost (+{newHires})
              </p>
              <p className="mt-2 text-2xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(projectedCost)}
              </p>
            </div>

            {/* Cost Increase */}
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <p className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase">Cost Increase</p>
              <p className="mt-2 text-2xl font-bold text-red-700 dark:text-red-300">
                +{formatCurrency(costIncrease)}
              </p>
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                ({((costIncrease / currentTotalCost) * 100).toFixed(1)}% increase)
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-[var(--bg-secondary)] p-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Adding <span className="font-semibold text-[var(--text-primary)]">{newHires} new rep{newHires !== 1 ? 's' : ''}</span> at
              average cost of <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(costPerRep)}</span> per
              rep would increase your annual commission expense to{' '}
              <span className="font-semibold text-[var(--text-primary)]">{formatCurrency(projectedCost)}</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
