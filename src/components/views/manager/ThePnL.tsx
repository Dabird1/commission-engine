// @ts-nocheck
import React, { useMemo } from 'react';
import { computeBrandPnL, getBrandName } from '@/data/brand-data';
import { formatCurrency, formatPercent } from '@/lib/utils';

export default function ThePnL({ selectedBrand }: { selectedBrand?: string }) {
  const pnl = useMemo(() => {
    const brand = selectedBrand === 'all' ? 'brand-8' : selectedBrand;
    return computeBrandPnL(brand);
  }, [selectedBrand]);

  const { team, repSummaries, teachingMoment, tiers } = pnl;
  const brandName = getBrandName(selectedBrand === 'all' ? 'brand-8' : selectedBrand);

  // Target is 3 points higher than current (or 43% max)
  const currentGP = team.gpPercent;
  const targetGP = teachingMoment.targetGP;
  const gpProgress = ((currentGP - 33) / (targetGP - 33)) * 100; // Baseline ~33% at start of Q1

  // GP color coding for the table
  const getGPColor = (gp: number) => {
    if (gp >= 35) return 'var(--accent-green)';
    if (gp >= 30) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-secondary)',
      color: 'var(--text-primary)',
      padding: '20px 16px',
      fontSize: '13px',
      lineHeight: '1.5',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
      }}>
        {/* ===== HERO STRIP ===== */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '16px',
        }}>
          {/* Brand + Subtitle */}
          <div style={{ marginBottom: '12px' }}>
            <h1 style={{
              fontSize: '20px',
              fontWeight: '700',
              margin: '0 0 2px 0',
              color: 'var(--text-primary)',
            }}>
              {brandName}
            </h1>
            <p style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              margin: '0',
              fontWeight: '500',
            }}>
              How Your Team Makes Money — The Great Game of Business
            </p>
          </div>

          {/* 5 Key Numbers Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '12px',
            marginBottom: '12px',
          }}>
            {/* Revenue */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '8px 10px',
              borderRadius: '4px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                marginBottom: '2px',
                textTransform: 'uppercase',
              }}>Revenue</div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#3b82f6',
              }}>{formatCurrency(team.totalFCV)}</div>
            </div>

            {/* Gross Profit */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '8px 10px',
              borderRadius: '4px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                marginBottom: '2px',
                textTransform: 'uppercase',
              }}>Gross Profit</div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#22c55e',
              }}>
                {formatCurrency(team.totalGP)}
                <span style={{
                  fontSize: '12px',
                  marginLeft: '2px',
                  color: 'var(--text-secondary)',
                }}>({team.gpPercent}%)</span>
              </div>
            </div>

            {/* Commission Cost */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '8px 10px',
              borderRadius: '4px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                marginBottom: '2px',
                textTransform: 'uppercase',
              }}>Commission</div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#f59e0b',
              }}>{formatCurrency(team.totalCommission)}</div>
            </div>

            {/* Net Contribution */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '8px 10px',
              borderRadius: '4px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                marginBottom: '2px',
                textTransform: 'uppercase',
              }}>Net Contribution</div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#10b981',
              }}>{formatCurrency(team.netContribution)}</div>
            </div>

            {/* Return on Commission */}
            <div style={{
              backgroundColor: 'var(--bg-secondary)',
              padding: '8px 10px',
              borderRadius: '4px',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: '11px',
                color: 'var(--text-secondary)',
                fontWeight: '600',
                marginBottom: '2px',
                textTransform: 'uppercase',
              }}>Return on Comm</div>
              <div style={{
                fontSize: '16px',
                fontWeight: '700',
                color: '#06b6d4',
              }}>{team.returnOnCommission}x</div>
            </div>
          </div>

          {/* Q1 MiniGame inline */}
          {team.clawbackCount > 0 && (
            <div style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-color)',
            }}>
              Q1 MiniGame: Push team GP from {currentGP}% → {targetGP}%
              <span style={{ marginLeft: '6px', color: '#10b981', fontWeight: '600' }}>
                Prize: Team dinner when we hit target
              </span>
              <div style={{
                height: '4px',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: '2px',
                marginTop: '3px',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  backgroundColor: '#22c55e',
                  width: `${Math.min(gpProgress, 100)}%`,
                }} />
              </div>
            </div>
          )}
        </div>

        {/* ===== TWO-COLUMN SECTION ===== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginBottom: '16px',
        }}>
          {/* LEFT: THE WATERFALL */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '14px',
          }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '700',
              marginBottom: '10px',
              margin: '0 0 10px 0',
              color: 'var(--text-primary)',
            }}>
              The Waterfall
            </h2>

            {/* Revenue bar */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                marginBottom: '2px',
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Revenue</span>
                <span style={{ fontWeight: '600', color: '#3b82f6' }}>
                  {formatCurrency(team.totalFCV)}
                </span>
              </div>
              <div style={{
                height: '14px',
                backgroundColor: '#3b82f6',
                borderRadius: '2px',
                width: '100%',
              }} />
            </div>

            {/* COGS bar (as % of revenue) */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                marginBottom: '2px',
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>COGS</span>
                <span style={{ fontWeight: '600', color: '#ef4444' }}>
                  {formatCurrency(team.totalCOGS)}
                </span>
              </div>
              <div style={{
                height: '14px',
                backgroundColor: '#ef4444',
                borderRadius: '2px',
                width: `${(team.totalCOGS / team.totalFCV) * 100}%`,
              }} />
            </div>

            {/* GP bar */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                marginBottom: '2px',
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Gross Profit</span>
                <span style={{ fontWeight: '600', color: '#22c55e' }}>
                  {formatCurrency(team.totalGP)}
                </span>
              </div>
              <div style={{
                height: '14px',
                backgroundColor: '#22c55e',
                borderRadius: '2px',
                width: `${(team.totalGP / team.totalFCV) * 100}%`,
              }} />
            </div>

            {/* Commission bar */}
            <div style={{ marginBottom: '8px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                marginBottom: '2px',
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Commission</span>
                <span style={{ fontWeight: '600', color: '#f59e0b' }}>
                  {formatCurrency(team.totalCommission)}
                </span>
              </div>
              <div style={{
                height: '14px',
                backgroundColor: '#f59e0b',
                borderRadius: '2px',
                width: `${(team.totalCommission / team.totalFCV) * 100}%`,
              }} />
            </div>

            {/* Net Contribution bar */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                marginBottom: '2px',
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Net Contribution</span>
                <span style={{ fontWeight: '600', color: '#10b981' }}>
                  {formatCurrency(team.netContribution)}
                </span>
              </div>
              <div style={{
                height: '14px',
                backgroundColor: '#10b981',
                borderRadius: '2px',
                width: `${(team.netContribution / team.totalFCV) * 100}%`,
              }} />
            </div>
          </div>

          {/* RIGHT: THE TEACHING MOMENT */}
          <div style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '14px',
          }}>
            <h2 style={{
              fontSize: '14px',
              fontWeight: '700',
              margin: '0 0 10px 0',
              color: 'var(--text-primary)',
            }}>
              The Teaching Moment
            </h2>

            <div style={{
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '8px',
              fontWeight: '500',
            }}>
              On a {formatCurrency(teachingMoment.avgDealFCV)} deal:
            </div>

            {/* Two scenarios side by side */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              marginBottom: '10px',
            }}>
              {/* Current GP */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  marginBottom: '4px',
                }}>
                  At {teachingMoment.currentGP}% GP
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div>GP: {formatCurrency(teachingMoment.current.grossProfit)}</div>
                  <div>Rate: {formatPercent(teachingMoment.current.rate * 100)}</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    Earned: {formatCurrency(teachingMoment.current.totalEarned)}
                  </div>
                  <div style={{ color: '#10b981' }}>
                    Co: {formatCurrency(teachingMoment.current.netToCompany)}
                  </div>
                </div>
              </div>

              {/* Target GP */}
              <div style={{
                backgroundColor: 'var(--bg-secondary)',
                padding: '8px',
                borderRadius: '4px',
                border: '2px solid #10b981',
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#10b981',
                  marginBottom: '4px',
                }}>
                  At {teachingMoment.targetGP}% GP
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  <div>GP: {formatCurrency(teachingMoment.target.grossProfit)}</div>
                  <div>Rate: {formatPercent(teachingMoment.target.rate * 100)}</div>
                  <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>
                    Earned: {formatCurrency(teachingMoment.target.totalEarned)}
                  </div>
                  <div style={{ color: '#10b981' }}>
                    Co: {formatCurrency(teachingMoment.target.netToCompany)}
                  </div>
                </div>
              </div>
            </div>

            {/* Callout */}
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #bfdbfe',
              borderRadius: '4px',
              padding: '8px',
              marginBottom: '10px',
              fontSize: '11px',
              lineHeight: '1.4',
            }}>
              <strong style={{ color: '#0284c7' }}>Push GP from {teachingMoment.currentGP}% to {teachingMoment.targetGP}%:</strong>
              <div style={{ color: 'var(--text-secondary)', marginTop: '2px' }}>
                Rep earns <strong>{formatCurrency(teachingMoment.repGain)}</strong> more,
                Company keeps <strong>{formatCurrency(teachingMoment.companyGain)}</strong> more.
              </div>
              {teachingMoment.everyoneWins && (
                <div style={{ color: '#16a34a', fontWeight: '600', marginTop: '2px' }}>
                  Everyone wins!
                </div>
              )}
            </div>

            {/* Tier table (compact) */}
            <div style={{
              fontSize: '10px',
              maxHeight: '90px',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '4px',
              padding: '4px',
              border: '1px solid var(--border-color)',
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '60px 40px',
                gap: '4px',
                marginBottom: '3px',
                fontWeight: '600',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '2px',
              }}>
                <div>GP%</div>
                <div style={{ textAlign: 'right' }}>Rate</div>
              </div>
              {tiers.map((tier, idx) => (
                <div key={idx} style={{
                  display: 'grid',
                  gridTemplateColumns: '60px 40px',
                  gap: '4px',
                  color: 'var(--text-secondary)',
                  paddingBottom: '1px',
                }}>
                  <div>{tier.label}</div>
                  <div style={{ textAlign: 'right', fontWeight: '600' }}>
                    {formatPercent(tier.rate * 100)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== PER-REP TABLE ===== */}
        <div style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          padding: '14px',
          marginBottom: '16px',
        }}>
          <h2 style={{
            fontSize: '14px',
            fontWeight: '700',
            margin: '0 0 10px 0',
            color: 'var(--text-primary)',
          }}>
            Per-Rep Economics
          </h2>

          <div style={{ overflowX: 'auto', fontSize: '12px' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-secondary)',
                  fontSize: '11px',
                }}>
                  <th style={{
                    textAlign: 'left',
                    padding: '4px 6px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}>Rep</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '4px 6px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}>Deals</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '4px 6px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}>Revenue</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '4px 6px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}>GP</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '4px 6px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}>GP%</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '4px 6px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}>Commission</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '4px 6px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}>Avg Rate</th>
                  <th style={{
                    textAlign: 'right',
                    padding: '4px 6px',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                  }}>Net Contrib</th>
                </tr>
              </thead>
              <tbody>
                {repSummaries.map((rep, idx) => (
                  <tr
                    key={rep.id}
                    style={{
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: idx % 2 === 0 ? 'var(--bg-secondary)' : 'transparent',
                    }}
                  >
                    <td style={{
                      padding: '4px 6px',
                      color: 'var(--text-primary)',
                      fontWeight: '500',
                    }}>
                      {rep.name}
                      {rep.clawbackDeals > 0 && (
                        <span style={{
                          display: 'inline-block',
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#ef4444',
                          borderRadius: '3px',
                          marginLeft: '4px',
                        }} title={`${rep.clawbackDeals} clawback deal(s)`} />
                      )}
                    </td>
                    <td style={{
                      padding: '4px 6px',
                      textAlign: 'right',
                      color: 'var(--text-secondary)',
                    }}>
                      {rep.dealCount}
                    </td>
                    <td style={{
                      padding: '4px 6px',
                      textAlign: 'right',
                      color: 'var(--text-secondary)',
                    }}>
                      {formatCurrency(rep.totalFCV)}
                    </td>
                    <td style={{
                      padding: '4px 6px',
                      textAlign: 'right',
                      color: 'var(--text-secondary)',
                    }}>
                      {formatCurrency(rep.totalGP)}
                    </td>
                    <td style={{
                      padding: '4px 6px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: getGPColor(rep.avgGP),
                    }}>
                      {formatPercent(rep.avgGP)}
                    </td>
                    <td style={{
                      padding: '4px 6px',
                      textAlign: 'right',
                      color: 'var(--text-secondary)',
                    }}>
                      {formatCurrency(rep.totalCommission)}
                    </td>
                    <td style={{
                      padding: '4px 6px',
                      textAlign: 'right',
                      color: 'var(--text-secondary)',
                    }}>
                      {formatPercent(rep.avgRate * 100)}
                    </td>
                    <td style={{
                      padding: '4px 6px',
                      textAlign: 'right',
                      fontWeight: '600',
                      color: rep.netContribution > 0 ? '#10b981' : '#ef4444',
                    }}>
                      {formatCurrency(rep.netContribution)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Clawback note */}
          {team.clawbackCount > 0 && (
            <div style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-color)',
            }}>
              <span style={{ color: '#ef4444', fontWeight: '600' }}>
                {team.clawbackCount} deal(s) triggered clawback
              </span>
              (GP ≤ 24%) —{' '}
              <span style={{ fontWeight: '600' }}>
                {formatCurrency(team.clawbackTotal)} in deposits deducted per policy
              </span>
            </div>
          )}
        </div>

        {/* Footer spacer */}
        <div style={{ height: '8px' }} />
      </div>
    </div>
  );
}
