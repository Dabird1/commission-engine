// @ts-nocheck
import { useState, useMemo, useEffect } from 'react'
import { Users } from 'lucide-react'
import { computeBrandPnL, getBrandName } from '@/data/brand-data'
import { formatCurrency } from '@/lib/utils'

interface CoachingNote {
  date: string
  note: string
}

export default function Coaching({ selectedBrand }: { selectedBrand?: string }) {
  const pnlData = useMemo(() => {
    const brandId = selectedBrand === 'all' ? 'brand-8' : selectedBrand
    return computeBrandPnL(brandId)
  }, [selectedBrand])
  const { repSummaries } = pnlData

  const [selectedRepId, setSelectedRepId] = useState(repSummaries[0]?.id || '')
  const [coachingNotes, setCoachingNotes] = useState<Record<string, CoachingNote[]>>({})
  const [newNoteText, setNewNoteText] = useState('')
  const [syncedNoteId, setSyncedNoteId] = useState<number | null>(null)

  // Reset selectedRepId when brand changes
  useEffect(() => {
    setSelectedRepId(repSummaries[0]?.id || '')
  }, [selectedBrand, repSummaries])

  // Get coaching priority color and status
  const getCoachingStatus = (avgGP: number) => {
    if (avgGP < 30) return { status: 'need-coaching', color: '#ef4444', label: 'Needs Coaching' }
    if (avgGP < 35) return { status: 'watch', color: '#f59e0b', label: 'Watch' }
    return { status: 'on-track', color: '#10b981', label: 'On Track' }
  }

  // Summary stats
  const priorityCounts = useMemo(() => {
    const counts = { 'need-coaching': 0, watch: 0, 'on-track': 0 }
    repSummaries.forEach((rep) => {
      const { status } = getCoachingStatus(rep.avgGP)
      counts[status]++
    })
    return counts
  }, [repSummaries])

  // Generate month-over-month GP trend from current avgGP
  const generateGPTrend = (avgGP: number) => {
    const variance = (Math.abs(avgGP - 32) / 10) * 0.8
    const janGP = Math.max(22, avgGP - variance - 2)
    const febGP = janGP + variance + 1
    const marGP = avgGP
    return [
      { month: 'Jan', gp: Math.round(janGP * 10) / 10 },
      { month: 'Feb', gp: Math.round(febGP * 10) / 10 },
      { month: 'Mar', gp: Math.round(marGP * 10) / 10 },
    ]
  }

  const getTrendArrow = (current: number, prev: number) => {
    if (current > prev) return '↑'
    if (current < prev) return '↓'
    return '→'
  }

  const selectedRep = repSummaries.find((r) => r.id === selectedRepId)
  if (!selectedRep) return null

  const { status: coachingStatus, color: statusColor } = getCoachingStatus(selectedRep.avgGP)
  const gpTrend = generateGPTrend(selectedRep.avgGP)
  const savedNotes = coachingNotes[selectedRepId] || [
    {
      date: 'Mar 15',
      note: 'Discussed pricing confidence. Targeting 38% GP on next 5 deals. Follow up mid-March.',
    },
  ]

  const handleAddNote = () => {
    if (!newNoteText.trim()) return
    const today = new Date()
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const updatedNotes = [
      { date: dateStr, note: newNoteText },
      ...(coachingNotes[selectedRepId] || []),
    ]
    setCoachingNotes({ ...coachingNotes, [selectedRepId]: updatedNotes })
    setNewNoteText('')

    // Show sync confirmation
    setSyncedNoteId(0)
    setTimeout(() => setSyncedNoteId(null), 2500)
  }

  // Tenure from joinDate
  const tenureLabel = (() => {
    const join = new Date(selectedRep.joinDate)
    const now = new Date()
    const months = (now.getFullYear() - join.getFullYear()) * 12 + (now.getMonth() - join.getMonth())
    if (months < 12) return `${months}mo`
    const years = Math.floor(months / 12)
    const rem = months % 12
    return rem > 0 ? `${years}y ${rem}mo` : `${years}y`
  })()

  return (
    <div
      style={{ backgroundColor: 'var(--bg-secondary)' }}
      className="h-[calc(100vh-3.5rem)] flex overflow-hidden"
    >
      {/* LEFT PANEL: Rep Roster (~320px) */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          borderRight: '1px solid var(--border-color)',
          width: '320px',
          marginLeft: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Summary Header */}
        <div
          style={{
            borderBottom: '1px solid var(--border-color)',
            padding: '16px',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Users size={18} style={{ color: 'var(--accent-blue)' }} />
            <h2 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '14px', margin: 0 }}>
              Rep Roster
            </h2>
          </div>
          <div style={{ fontSize: '13px', lineHeight: '1.5' }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span style={{ color: '#10b981' }}>●</span> {priorityCounts['on-track']} on track
            </div>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '4px' }}>
              <span style={{ color: '#f59e0b' }}>●</span> {priorityCounts.watch} watch
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>
              <span style={{ color: '#ef4444' }}>●</span> {priorityCounts['need-coaching']} need coaching
            </div>
          </div>
        </div>

        {/* Rep List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {repSummaries.map((rep) => {
            const { color: repStatusColor } = getCoachingStatus(rep.avgGP)
            const isSelected = rep.id === selectedRepId

            return (
              <button
                key={rep.id}
                onClick={() => setSelectedRepId(rep.id)}
                style={{
                  backgroundColor: isSelected ? 'var(--bg-secondary)' : 'transparent',
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px',
                  borderBottom: '1px solid var(--border-color)',
                  border: 'none',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s',
                  display: 'block',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '8px',
                    marginBottom: '4px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '14px',
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {rep.name}
                    </div>
                  </div>
                  <div style={{ color: repStatusColor, fontSize: '14px', flexShrink: 0 }}>●</div>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                  {rep.avgGP}% GP · {rep.dealCount} deals · {formatCurrency(rep.totalFCV)}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* RIGHT PANEL: Selected Rep Card */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '28px',
          }}
        >
          {/* SECTION 1: Rep Header */}
          <div style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                marginBottom: '6px',
              }}
            >
              <h1 style={{ color: 'var(--text-primary)', fontSize: '26px', fontWeight: 700, margin: 0 }}>
                {selectedRep.name}
              </h1>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {selectedRep.role} · {tenureLabel}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '4px',
                  backgroundColor: statusColor + '18',
                  color: statusColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px',
                }}
              >
                {getCoachingStatus(selectedRep.avgGP).label}
              </span>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              {selectedRep.dealCount} deals · {formatCurrency(selectedRep.totalFCV)} revenue ·{' '}
              {selectedRep.avgGP}% avg GP
              {selectedRep.clawbackDeals > 0 && (
                <span style={{ color: '#ef4444', fontWeight: 600 }}>
                  {' '}
                  · {selectedRep.clawbackDeals} clawback
                  {selectedRep.clawbackDeals > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>

          {/* SECTION 2: Before Your Next Ridealong */}
          <div
            style={{
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <h2
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 10px 0',
              }}
            >
              Before Your Next Ridealong
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedRep.avgGP < 30 && (
                <div
                  style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.06)',
                    borderRadius: '6px',
                    borderLeft: '3px solid #ef4444',
                  }}
                >
                  <strong>RED FLAG:</strong> GP averaging {selectedRep.avgGP}% — listen for
                  discounting, underbidding, scope creep. Ask about confidence in pricing and
                  objection handling.
                </div>
              )}
              {selectedRep.avgGP >= 30 && selectedRep.avgGP < 35 && (
                <div
                  style={{
                    color: '#f59e0b',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(245, 158, 11, 0.06)',
                    borderRadius: '6px',
                    borderLeft: '3px solid #f59e0b',
                  }}
                >
                  <strong>WATCH:</strong> GP at {selectedRep.avgGP}% — probe on pricing confidence
                  and objection handling. Is hesitation holding back higher margins?
                </div>
              )}
              {selectedRep.avgGP >= 35 && (
                <div
                  style={{
                    color: '#10b981',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(16, 185, 129, 0.06)',
                    borderRadius: '6px',
                    borderLeft: '3px solid #10b981',
                  }}
                >
                  <strong>ON TRACK:</strong> GP strong at {selectedRep.avgGP}% — focus on deal size
                  and upsell opportunities. Can we expand scope on larger accounts?
                </div>
              )}

              {selectedRep.clawbackDeals > 0 && (
                <div
                  style={{
                    color: '#ef4444',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    padding: '10px 12px',
                    backgroundColor: 'rgba(239, 68, 68, 0.06)',
                    borderRadius: '6px',
                    borderLeft: '3px solid #ef4444',
                  }}
                >
                  <strong>CLAWBACK ALERT:</strong> {selectedRep.clawbackDeals} deal
                  {selectedRep.clawbackDeals > 1 ? 's' : ''} below 24% GP threshold —{' '}
                  {formatCurrency(selectedRep.clawbackAmount)} deposit at risk. Review job costing
                  accuracy and estimate validation.
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: Financial Scorecard */}
          <div
            style={{
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <h2
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 10px 0',
              }}
            >
              Financial Scorecard
            </h2>
            <div style={{ overflowX: 'auto', fontSize: '13px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    {['Deals', 'Revenue', 'Gross Profit', 'Avg GP%', 'Commission', 'Net Contrib.'].map(
                      (h) => (
                        <th
                          key={h}
                          style={{
                            textAlign: h === 'Deals' ? 'left' : 'right',
                            padding: '8px 10px',
                            color: 'var(--text-secondary)',
                            fontWeight: 600,
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                          }}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: '10px 10px',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                      }}
                    >
                      {selectedRep.dealCount}
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(selectedRep.totalFCV)}
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(selectedRep.totalGP)}
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        color: getCoachingStatus(selectedRep.avgGP).color,
                        fontWeight: 700,
                        textAlign: 'right',
                      }}
                    >
                      {selectedRep.avgGP}%
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(selectedRep.totalCommission)}
                    </td>
                    <td
                      style={{
                        padding: '10px 10px',
                        color: selectedRep.netContribution >= 0 ? '#10b981' : '#ef4444',
                        fontWeight: 700,
                        textAlign: 'right',
                      }}
                    >
                      {formatCurrency(selectedRep.netContribution)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Deal breakdown mini-table */}
            {selectedRep.deals && selectedRep.deals.length > 0 && (
              <div style={{ marginTop: '12px' }}>
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px',
                    marginBottom: '6px',
                  }}
                >
                  Deal Breakdown
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '6px 8px',
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                          fontSize: '10px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Customer
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: '6px 8px',
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                          fontSize: '10px',
                          textTransform: 'uppercase',
                        }}
                      >
                        FCV
                      </th>
                      <th
                        style={{
                          textAlign: 'center',
                          padding: '6px 8px',
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                          fontSize: '10px',
                          textTransform: 'uppercase',
                        }}
                      >
                        GP%
                      </th>
                      <th
                        style={{
                          textAlign: 'center',
                          padding: '6px 8px',
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                          fontSize: '10px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Rate
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: '6px 8px',
                          color: 'var(--text-secondary)',
                          fontWeight: 600,
                          fontSize: '10px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Earned
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRep.deals.map((deal) => (
                      <tr
                        key={deal.id}
                        style={{
                          borderBottom: '1px solid var(--border-color)',
                          backgroundColor: deal.isClawback ? 'rgba(239,68,68,0.04)' : 'transparent',
                        }}
                      >
                        <td
                          style={{
                            padding: '6px 8px',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                          }}
                        >
                          {deal.customer}
                          {deal.isClawback && (
                            <span
                              style={{
                                color: '#ef4444',
                                fontSize: '10px',
                                fontWeight: 700,
                                marginLeft: '6px',
                              }}
                            >
                              CLAWBACK
                            </span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'right',
                            color: 'var(--text-primary)',
                            fontSize: '13px',
                          }}
                        >
                          {formatCurrency(deal.fcv)}
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            color: getCoachingStatus(deal.gpPercent).color,
                            fontWeight: 600,
                            fontSize: '13px',
                          }}
                        >
                          {deal.gpPercent}%
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'center',
                            color: 'var(--text-secondary)',
                            fontSize: '13px',
                          }}
                        >
                          {(deal.rate * 100).toFixed(0)}%
                        </td>
                        <td
                          style={{
                            padding: '6px 8px',
                            textAlign: 'right',
                            color: deal.isClawback ? '#ef4444' : 'var(--text-primary)',
                            fontWeight: deal.isClawback ? 600 : 400,
                            fontSize: '13px',
                          }}
                        >
                          {deal.isClawback
                            ? `-${formatCurrency(deal.deposit)}`
                            : formatCurrency(deal.totalEarned)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* SECTION 4: Coaching Notes */}
          <div
            style={{
              marginBottom: '24px',
              paddingBottom: '20px',
              borderBottom: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  margin: 0,
                }}
              >
                Coaching Notes → Rilla
              </h2>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#3b82f6',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2px',
                }}
              >
                Synced
              </div>
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', fontStyle: 'italic' }}>
              Notes appear in the rep's Rilla coaching feed — one place for all feedback.
            </div>

            <div style={{ marginBottom: '12px' }}>
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Add coaching note... (syncs to rep's Rilla feed)"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '4px',
                  padding: '10px',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  width: '100%',
                  resize: 'none',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
                rows={2}
                onFocus={(e) => (e.target.style.borderColor = 'var(--accent-blue)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border-color)')}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteText.trim()}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: 600,
                    backgroundColor: newNoteText.trim() ? 'var(--accent-blue)' : 'var(--border-color)',
                    color: newNoteText.trim() ? 'white' : 'var(--text-secondary)',
                    border: 'none',
                    cursor: newNoteText.trim() ? 'pointer' : 'default',
                  }}
                >
                  Save Note
                </button>
                {syncedNoteId !== null && (
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#10b981',
                      fontWeight: 600,
                      animation: 'fadeOut 2.5s forwards',
                    }}
                  >
                    Synced to Rilla ✓
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {savedNotes.map((note, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    padding: '10px',
                  }}
                >
                  <div
                    style={{
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      fontWeight: 600,
                      marginBottom: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                    }}
                  >
                    {note.date}
                  </div>
                  <div
                    style={{
                      color: 'var(--text-primary)',
                      fontSize: '14px',
                      lineHeight: '1.4',
                    }}
                  >
                    {note.note}
                  </div>
                </div>
              ))}
            </div>

            <style>{`
              @keyframes fadeOut {
                0% { opacity: 1; }
                85% { opacity: 1; }
                100% { opacity: 0; }
              }
            `}</style>
          </div>

          {/* SECTION 5: Is The Coaching Working? */}
          <div>
            <h2
              style={{
                color: 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: 600,
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                margin: '0 0 12px 0',
              }}
            >
              Is The Coaching Working?
            </h2>
            <div style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
              {gpTrend.map((point, idx) => {
                const prev = idx > 0 ? gpTrend[idx - 1].gp : point.gp
                const arrow = getTrendArrow(point.gp, prev)
                const arrowColor =
                  arrow === '↑' ? '#10b981' : arrow === '↓' ? '#ef4444' : '#9ca3af'

                return (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                        fontWeight: 600,
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {point.month}
                    </div>
                    <div
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '20px',
                        fontWeight: 700,
                        marginBottom: '2px',
                      }}
                    >
                      {point.gp}%
                    </div>
                    <div style={{ color: arrowColor, fontSize: '16px', fontWeight: 600 }}>
                      {arrow}
                    </div>
                  </div>
                )
              })}
            </div>
            <div
              style={{
                marginTop: '10px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                fontStyle: 'italic',
              }}
            >
              {gpTrend[2].gp > gpTrend[1].gp
                ? 'Trending up — coaching gains visible.'
                : gpTrend[2].gp < gpTrend[0].gp
                  ? 'Trending down — needs closer follow-up.'
                  : 'Stable trend — monitor next 2 weeks.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
