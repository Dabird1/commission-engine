'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/utils'
import { AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react'

interface PendingItem {
  id: string
  type: 'exception' | 'dispute' | 'plan_change'
  title: string
  description: string
  details: string
  repName: string
  amount: number
  recommendation: string
  status: 'pending'
}

export default function Approvals() {
  const [items, setItems] = useState<PendingItem[]>([
    {
      id: 'exception-1',
      type: 'exception',
      title: 'High Commission Alert',
      description: 'Bill Peters roofing deal',
      details: '$82K FCV deal generated $8,200 commission - exceeds typical range',
      repName: 'Bill Peters',
      amount: 8200,
      recommendation: 'Review deal terms and verify pricing accuracy. If valid, approve.',
      status: 'pending',
    },
    {
      id: 'dispute-2',
      type: 'dispute',
      title: 'Clawback Dispute',
      description: 'Maria Santos job dispute',
      details: 'Job cancelled 30 days post-installation. Policy allows 45-day clawback window.',
      repName: 'Maria Santos',
      amount: -1450,
      recommendation: 'Clawback appears valid per 30-day policy. Deny rep dispute.',
      status: 'pending',
    },
    {
      id: 'plan-change-1',
      type: 'plan_change',
      title: 'Plan Modification Request',
      description: 'Summit Windows draw increase',
      details: 'Rep requesting draw amount increase from $2K to $3K monthly. Current performance supports increase.',
      repName: 'Michael Thompson',
      amount: 1000,
      recommendation: 'Approve - rep on track for quota with strong close rate. Increase supports retention.',
      status: 'pending',
    },
  ])

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: 'pending' } : item
      )
    )
  }

  const handleDeny = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'exception':
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      case 'dispute':
        return <Clock className="h-5 w-5 text-red-500" />
      case 'plan_change':
        return <AlertCircle className="h-5 w-5 text-blue-500" />
      default:
        return null
    }
  }

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'exception':
        return 'bg-amber-100 text-amber-800'
      case 'dispute':
        return 'bg-red-100 text-red-800'
      case 'plan_change':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exception':
        return 'Exception Approval'
      case 'dispute':
        return 'Dispute Escalation'
      case 'plan_change':
        return 'Plan Change Request'
      default:
        return type
    }
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Approvals</h1>
        <p className="mt-2 text-[var(--text-secondary)]">
          {items.length} pending items requiring your review
        </p>
      </div>

      {/* Items List */}
      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-12 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-4 text-lg font-semibold text-[var(--text-primary)]">All caught up!</p>
            <p className="mt-2 text-[var(--text-secondary)]">No pending approvals at this time.</p>
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-1 gap-4">
                  <div className="flex-shrink-0 pt-1">{getIcon(item.type)}</div>
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-[var(--text-primary)]">{item.title}</h3>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getBadgeColor(item.type)}`}>
                        {getTypeLabel(item.type)}
                      </span>
                    </div>

                    {/* Rep Name */}
                    <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">{item.repName}</p>

                    {/* Details Card */}
                    <div className="mt-4 rounded-lg bg-[var(--bg-secondary)] p-4">
                      <p className="text-sm text-[var(--text-secondary)]">{item.details}</p>
                      <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                        Amount: <span className="text-lg">{formatCurrency(item.amount)}</span>
                      </p>
                    </div>

                    {/* Recommendation */}
                    <div className="mt-4 rounded-lg border-l-4 border-l-blue-500 bg-blue-50 p-4 dark:bg-blue-950">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">
                        Recommended Action
                      </p>
                      <p className="mt-2 text-sm text-blue-700 dark:text-blue-300">{item.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row">
                  <button
                    onClick={() => handleApprove(item.id)}
                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Approve</span>
                  </button>
                  <button
                    onClick={() => handleDeny(item.id)}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    <XCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Deny</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
