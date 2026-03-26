// @ts-nocheck
'use client'

import React, { useMemo } from 'react'
import { computeBrandPnL, getBrandName } from '@/data/brand-data'
import { formatCurrency } from '@/lib/utils'
import { AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react'

interface ScoreboardProps {
  selectedBrand?: string
}

export default function Scoreboard({ selectedBrand }: ScoreboardProps) {
  const pnlData = useMemo(() => {
    const brandId = selectedBrand === 'all' ? 'brand-8' : selectedBrand
    return computeBrandPnL(brandId)
  }, [selectedBrand])

  const { team, repSummaries } = pnlData
  const targetProgress = 75 // 75% of quota progress for prototype

  // Generate alerts based on data
  const alerts = useMemo(() => {
    const alertList = []

    // Flag reps with avgGP < 30%
    repSummaries.forEach((rep) => {
      if (rep.avgGP < 30) {
        alertList.push({
          type: 'warning',
          icon: AlertCircle,
          color: '#f59e0b',
          text: `${rep.name} — GP% at ${rep.avgGP.toFixed(1)}%, needs pricing review`,
        })
      }
    })

    // Flag reps with clawback deals
    repSummaries.forEach((rep) => {
      if (rep.clawbackDeals > 0) {
        alertList.push({
          type: 'warning',
          icon: AlertCircle,
          color: '#f59e0b',
          text: `${rep.name} — ${rep.clawbackDeals} deal(s) flagged for clawback`,
        })
      }
    })

    // Celebrate reps with avgGP > 40%
    repSummaries.forEach((rep) => {
      if (rep.avgGP > 40) {
        alertList.push({
          type: 'success',
          icon: CheckCircle2,
          color: '#10b981',
          text: `${rep.name} — Outstanding pricing: ${rep.avgGP.toFixed(1)}%`,
        })
      }
    })

    return alertList
  }, [repSummaries])

  const getGPColor = (gp: number) => {
    if (gp >= 35) return '#10b981' // green
    if (gp >= 30) return '#f59e0b' // amber
    return '#ef4444' // red
  }

  const getContributionColor = (contribution: number) => {
    return contribution >= 0 ? '#10b981' : '#ef4444'
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-secondary)',
        minHeight: '100vh',
        padding: '16px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* ===== HERO STRIP ===== */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px',
          }}
        >
          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Game Day — Q1 2026
            </div>
            <h1
              style={{
                color: 'var(--text-primary)',
                fontSize: '20px',
                fontWeight: '700',
                margin: '0 0 12px 0',
              }}
            >
              {getBrandName(selectedBrand === 'all' ? 'brand-8' : selectedBrand)}
            </h1>
          </div>

          {/* Hero metrics grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Team Revenue
              </div>
              <div
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  fontWeight: '700',
                }}
              >
                {formatCurrency(team.totalFCV)}
              </div>
            </div>

            <div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Team GP
              </div>
              <div
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  fontWeight: '700',
                }}
              >
                {formatCurrency(team.totalGP)}{' '}
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}
                >
                  ({team.gpPercent.toFixed(1)}%)
                </span>
              </div>
            </div>

            <div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                Deals Closed
              </div>
              <div
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  fontWeight: '700',
                }}
              >
                {team.dealCount}
              </div>
            </div>

            <div>
              <div
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '11px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                vs Quota
              </div>
              <div
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '18px',
                  fontWeight: '700',
                }}
              >
                {targetProgress}%
              </div>
            </div>
          </div>

          {/* Mini Game ticker */}
          <div
            style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '8px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              Q1 GP% Challenge
            </div>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <div
                style={{
                  height: '4px',
                  backgroundColor: 'var(--border-color)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min((team.gpPercent / 36) * 100, 100)}%`,
                    backgroundColor: '#10b981',
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
            <div
              style={{
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              {team.gpPercent.toFixed(1)}% → 36% target
            </div>
          </div>
        </div>

        {/* ===== STANDINGS TABLE ===== */}
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-secondary)',
            }}
          >
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Team Standings — Ranked by Net Contribution
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '13px',
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderBottom: '1px solid var(--border-color)',
                  }}
                >
                  <th
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Rank
                  </th>
                  <th
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Rep
                  </th>
                  <th
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textAlign: 'left',
                      padding: '8px 12px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Role
                  </th>
                  <th
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textAlign: 'center',
                      padding: '8px 12px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Deals
                  </th>
                  <th
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textAlign: 'right',
                      padding: '8px 12px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Revenue
                  </th>
                  <th
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textAlign: 'center',
                      padding: '8px 12px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Avg GP%
                  </th>
                  <th
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textAlign: 'right',
                      padding: '8px 12px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Commission
                  </th>
                  <th
                    style={{
                      color: 'var(--text-secondary)',
                      fontWeight: '600',
                      textAlign: 'right',
                      padding: '8px 12px',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                    }}
                  >
                    Net Contrib.
                  </th>
                </tr>
              </thead>
              <tbody>
                {repSummaries.map((rep, idx) => (
                  <tr
                    key={rep.name}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: idx % 2 === 0 ? 'transparent' : 'var(--bg-secondary)',
                    }}
                  >
                    <td
                      style={{
                        padding: '8px 12px',
                        color: 'var(--text-secondary)',
                        fontWeight: '700',
                      }}
                    >
                      #{idx + 1}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                      }}
                    >
                      {rep.name}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        color: 'var(--text-secondary)',
                        fontSize: '12px',
                      }}
                    >
                      {rep.role}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        textAlign: 'center',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {rep.dealCount}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        textAlign: 'right',
                        color: 'var(--text-primary)',
                        fontWeight: '600',
                      }}
                    >
                      {formatCurrency(rep.totalFCV)}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        textAlign: 'center',
                        color: getGPColor(rep.avgGP),
                        fontWeight: '600',
                      }}
                    >
                      {rep.avgGP.toFixed(1)}%
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        textAlign: 'right',
                        color: 'var(--text-primary)',
                      }}
                    >
                      {formatCurrency(rep.totalCommission)}
                    </td>
                    <td
                      style={{
                        padding: '8px 12px',
                        textAlign: 'right',
                        color: getContributionColor(rep.netContribution),
                        fontWeight: '600',
                      }}
                    >
                      {formatCurrency(rep.netContribution)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== NEEDS ATTENTION ===== */}
        {alerts.length > 0 && (
          <div
            style={{
              backgroundColor: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '12px 16px',
            }}
          >
            <div
              style={{
                color: 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              Needs Attention
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '8px',
              }}
            >
              {alerts.slice(0, 3).map((alert, idx) => {
                const Icon = alert.icon
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--bg-secondary)',
                      borderLeft: `3px solid ${alert.color}`,
                    }}
                  >
                    <Icon
                      size={16}
                      style={{
                        color: alert.color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '12px',
                        lineHeight: '1.4',
                      }}
                    >
                      {alert.text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
