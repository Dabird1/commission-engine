// @ts-nocheck

import { useState, useMemo } from 'react'
import { formatCurrency } from '@/lib/utils'
import { Check, X, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react'
import { computeBrandPnL, getBrandName } from '@/data/brand-data'

type ItemStatus = 'pending' | 'approved' | 'denied'

interface ApprovalItem {
  id: string
  type: 'exception' | 'clawback' | 'plan_change'
  repName: string
  dealName?: string
  dealAmount: number
  gp: number
  rate: number
  commissionEarned: number
  depositPaid: number
  finalDue: number
  context: string
  recommendation: string
  status: ItemStatus
}

interface ApprovalsProps {
  selectedBrand?: string
}

export default function Approvals({ selectedBrand }: ApprovalsProps) {
  // Generate approval items dynamically from brand data
  const generatedItems = useMemo(() => {
    try {
      const brandId = selectedBrand === 'all' ? 'brand-8' : (selectedBrand || 'brand-8')
      const brandData = computeBrandPnL(brandId)
      const items: ApprovalItem[] = []
      let itemId = 0

      // Calculate team average FCV for exception detection
      const teamAvgFCV = brandData.team.avgDealFCV || 24000

      // 1. Find deals with exceptions (> 2x team average FCV)
      for (const deal of brandData.deals) {
        if (deal.fcv > teamAvgFCV * 2) {
          const repName = deal.repName || 'Unknown Rep'
          items.push({
            id: `exc-${itemId++}`,
            type: 'exception',
            repName,
            dealName: deal.customer,
            dealAmount: deal.fcv,
            gp: deal.gpPercent,
            rate: deal.rate,
            commissionEarned: deal.totalEarned,
            depositPaid: deal.deposit,
            finalDue: deal.finalAdj,
            context: `Team avg deal is ${formatCurrency(teamAvgFCV)} — this deal is ${(deal.fcv / teamAvgFCV).toFixed(1)}x larger`,
            recommendation: 'Approve — deal pricing and GP verified. Large project commission rate is standard.',
            status: 'pending',
          })
        }
      }

      // 2. Find clawback deals (GP <= 24%)
      for (const deal of brandData.deals) {
        if (deal.isClawback) {
          const repName = deal.repName || 'Unknown Rep'
          items.push({
            id: `claw-${itemId++}`,
            type: 'clawback',
            repName,
            dealName: deal.customer,
            dealAmount: deal.fcv,
            gp: deal.gpPercent,
            rate: deal.rate,
            commissionEarned: deal.totalEarned,
            depositPaid: deal.deposit,
            finalDue: deal.finalAdj,
            context: `GP below 24% threshold at ${deal.gpPercent}%. Per policy, deposit commission is deducted.`,
            recommendation: `Process clawback — GP% verified at ${deal.gpPercent}%. Review pricing with rep.`,
            status: 'pending',
          })
        }
      }

      // 3. Optionally add a plan change request for a rep with low GP
      const repsWithLowGP = brandData.repSummaries.filter(rep => rep.avgGP < 30 && rep.dealCount >= 2)
      if (repsWithLowGP.length > 0) {
        const lowRep = repsWithLowGP[0]
        items.push({
          id: `plan-${itemId++}`,
          type: 'plan_change',
          repName: lowRep.name,
          dealAmount: 0,
          gp: lowRep.avgGP,
          rate: lowRep.avgRate,
          commissionEarned: 0,
          depositPaid: 0,
          finalDue: 0,
          context: `Current avg GP: ${lowRep.avgGP}% → earning ${lowRep.avgRate}% avg. Requesting consideration for GP% threshold adjustment.`,
          recommendation: 'Deny — plan structure is company-wide. Focus coaching on improving GP%.',
          status: 'pending',
        })
      }

      return items
    } catch (error) {
      console.error('Error generating approval items:', error)
      return []
    }
  }, [selectedBrand])

  const [items, setItems] = useState<ApprovalItem[]>(generatedItems)

  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleAction = (id: string, action: 'approved' | 'denied') => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: action } : item
      )
    )
    setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, 1200)
  }

  const pendingCount = items.filter((i) => i.status === 'pending').length

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exception':
        return { border: '#f59e0b', bg: 'rgba(245, 158, 11, 0.05)' }
      case 'clawback':
        return { border: '#ef4444', bg: 'rgba(239, 68, 68, 0.05)' }
      case 'plan_change':
        return { border: '#3b82f6', bg: 'rgba(59, 130, 246, 0.05)' }
      default:
        return { border: 'var(--border-color)', bg: 'var(--card-bg)' }
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exception':
        return 'Exception'
      case 'clawback':
        return 'Clawback'
      case 'plan_change':
        return 'Plan Change'
      default:
        return type
    }
  }

  return (
    <div style={{ padding: '1.5rem', maxWidth: '1200px' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
          Approvals
        </h1>
        <p style={{ marginTop: '0.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {pendingCount === 0
            ? 'No items need your attention'
            : `${pendingCount} item${pendingCount !== 1 ? 's' : ''} need${pendingCount === 1 ? 's' : ''} your attention`}
        </p>
      </div>

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.length === 0 ? (
          <div
            style={{
              borderRadius: '0.5rem',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--card-bg)',
              padding: '3rem',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>
              All caught up
            </p>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              No pending approvals right now.
            </p>
          </div>
        ) : (
          items.map((item) => {
            const isResolved = item.status !== 'pending'
            const typeColor = getTypeColor(item.type)
            const isExpanded = expandedId === item.id

            return (
              <div
                key={item.id}
                style={{
                  borderRadius: '0.5rem',
                  border: `1px solid var(--border-color)`,
                  borderLeft: `4px solid ${typeColor.border}`,
                  backgroundColor: isResolved ? 'var(--card-bg)' : typeColor.bg,
                  opacity: isResolved ? 0.6 : 1,
                  transform: isResolved ? 'scale(0.99)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  overflow: 'hidden',
                }}
              >
                {/* Resolved overlay */}
                {isResolved ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.75rem',
                      padding: '2rem',
                    }}
                  >
                    {item.status === 'approved' ? (
                      <>
                        <Check style={{ width: '1.25rem', height: '1.25rem', color: '#22c55e' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#16a34a' }}>
                          Approved — removing from queue
                        </span>
                      </>
                    ) : (
                      <>
                        <X style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} />
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#dc2626' }}>
                          Denied — removing from queue
                        </span>
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ padding: '1.25rem' }}>
                    {/* Top line: type · rep · amount */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <AlertTriangle style={{ width: '1rem', height: '1rem', color: typeColor.border }} />
                        <span
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>·</span>
                        <span style={{ fontSize: '0.9375rem', fontWeight: '500', color: 'var(--text-primary)' }}>
                          {item.repName}
                        </span>
                      </div>
                      {item.dealAmount > 0 && (
                        <span
                          style={{
                            fontSize: '1.25rem',
                            fontWeight: 'bold',
                            color: item.finalDue >= 0 ? 'var(--text-primary)' : '#ef4444',
                          }}
                        >
                          {formatCurrency(item.finalDue)}
                        </span>
                      )}
                    </div>

                    {/* Deal name (if applicable) */}
                    {item.dealName && (
                      <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                        {item.dealName} — {formatCurrency(item.dealAmount)}
                      </p>
                    )}

                    {/* Expandable calculation trace */}
                    {item.type !== 'plan_change' && (
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.75rem',
                          padding: '0.25rem 0',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--text-secondary)',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          textTransform: 'uppercase',
                        }}
                      >
                        {isExpanded ? (
                          <ChevronDown style={{ width: '1rem', height: '1rem' }} />
                        ) : (
                          <ChevronRight style={{ width: '1rem', height: '1rem' }} />
                        )}
                        Calculation Trace
                      </button>
                    )}

                    {/* Calculation trace (expanded) */}
                    {isExpanded && item.type !== 'plan_change' && (
                      <div
                        style={{
                          backgroundColor: 'var(--bg-secondary)',
                          borderRadius: '0.375rem',
                          padding: '0.75rem',
                          marginBottom: '0.75rem',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {`Contract: ${formatCurrency(item.dealAmount)}
GP%: ${item.gp.toFixed(1)}% → Tier Rate: ${item.rate}%
Commission: ${formatCurrency(item.dealAmount)} × ${item.rate}% = ${formatCurrency(item.commissionEarned)}
Deposit paid (4%): ${formatCurrency(item.depositPaid)}
Final due: ${formatCurrency(item.commissionEarned)} - ${formatCurrency(item.depositPaid)} = ${formatCurrency(item.finalDue)}`}
                      </div>
                    )}

                    {/* Context */}
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                      {item.context}
                    </p>

                    {/* Recommendation + Actions */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        gap: '1.5rem',
                        marginTop: '1rem',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            fontSize: '0.8125rem',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            color: 'var(--text-secondary)',
                            marginBottom: '0.25rem',
                          }}
                        >
                          Recommended
                        </p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                          {item.recommendation}
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button
                          onClick={() => handleAction(item.id, 'approved')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            borderRadius: '0.375rem',
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                        >
                          <Check style={{ width: '0.875rem', height: '0.875rem' }} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(item.id, 'denied')}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            borderRadius: '0.375rem',
                            backgroundColor: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-color)',
                            padding: '0.5rem 1rem',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--border-color)')}
                          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                        >
                          <X style={{ width: '0.875rem', height: '0.875rem' }} />
                          Deny
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
