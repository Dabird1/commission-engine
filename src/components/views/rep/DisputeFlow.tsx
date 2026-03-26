// @ts-nocheck
'use client';

import { useState } from 'react';
import { disputes, sampleDeals } from '@/data/sample-data';
import { formatCurrency, cn } from '@/lib/utils';
import { MessageSquare, ChevronDown, ChevronRight, CheckCircle, Clock, AlertTriangle, Send } from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  open: { label: 'Open', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: Clock },
  under_review: { label: 'Under Review', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: AlertTriangle },
  resolved: { label: 'Resolved', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle },
  escalated: { label: 'Escalated', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: AlertTriangle },
};

export default function DisputeFlow() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<Record<string, string>>({});
  const [showNewDisputeForm, setShowNewDisputeForm] = useState(false);

  const allDisputes = disputes || [];

  const handleSend = (id: string) => {
    if (newMessage[id]?.trim()) {
      setNewMessage(prev => ({ ...prev, [id]: '' }));
    }
  };

  const statusCounts = {
    open: allDisputes.filter((d: any) => d.status === 'open' || d.status === 'under_review').length,
    under_review: allDisputes.filter((d: any) => d.status === 'under_review').length,
    resolved: allDisputes.filter((d: any) => d.status === 'resolved').length,
  };

  // Total at stake (non-resolved)
  const totalAtStake = allDisputes
    .filter((d: any) => d.status !== 'resolved')
    .reduce((sum: number, d: any) => {
      const deal = sampleDeals.find((sd: any) => sd.id === d.dealId);
      return sum + (deal?.totalCommission || 0);
    }, 0);

  // Days since opened
  const getDaysOpen = (createdAt: string) => {
    const now = new Date();
    const opened = new Date(createdAt);
    return Math.floor((now.getTime() - opened.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>My Disputes</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {allDisputes.length} total · {statusCounts.open} active · {statusCounts.resolved} resolved
              {totalAtStake > 0 && (
                <span> · <strong style={{ color: 'var(--semantic-pending)' }}>{formatCurrency(totalAtStake)}</strong> at stake</span>
              )}
            </p>
          </div>
          <button onClick={() => setShowNewDisputeForm(!showNewDisputeForm)}
            className="px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
            style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
            + New Dispute
          </button>
        </div>

        {showNewDisputeForm && (
          <div className="mt-3 p-4 rounded-lg border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--accent-blue)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Select a deal to dispute</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Choose from your recent deals or search to file a new dispute.</p>
          </div>
        )}

        {/* Status pills + SLA note */}
        <div className="flex items-center gap-2">
          {Object.entries(statusConfig).map(([key, cfg]) => {
            const count = allDisputes.filter((d: any) => d.status === key).length;
            if (count === 0) return null;
            return (
              <span key={key} className="flex items-center gap-1 px-2 py-1 rounded text-[14px] font-bold"
                style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cfg.color }} />
                {cfg.label} ({count})
              </span>
            );
          })}
          <span className="ml-auto text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
            <Clock size={10} className="inline mr-1" style={{ verticalAlign: '-1px' }} />
            SLA: responses within 3 business days
          </span>
        </div>
      </div>

      {/* Disputes List */}
      <div className="flex-1 overflow-y-auto px-6 pb-4" style={{ scrollbarWidth: 'thin' }}>
        <div className="space-y-2">
          {allDisputes.map((dispute: any) => {
            const deal = sampleDeals.find((d: any) => d.id === dispute.dealId);
            const isExpanded = expandedId === dispute.id;
            const cfg = statusConfig[dispute.status] || statusConfig.open;
            const StatusIcon = cfg.icon;

            return (
              <div key={dispute.id} className="rounded-lg border overflow-hidden transition-all"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: isExpanded ? cfg.color : 'var(--border-primary)',
                  boxShadow: isExpanded ? `0 0 0 1px ${cfg.color}` : 'none',
                }}>
                {/* Header */}
                <button onClick={() => setExpandedId(isExpanded ? null : dispute.id)}
                  className="w-full text-left px-4 py-3 transition-colors"
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div className="flex items-center gap-3">
                    <div style={{ color: 'var(--text-tertiary)' }}>
                      {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </div>
                    <div className="w-7 h-7 rounded flex items-center justify-center" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                      <StatusIcon size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {deal?.customerName || 'Unknown'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                          style={{ backgroundColor: cfg.bg, color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div className="text-[14px] flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
                        <span>{dispute.reason}</span>
                        <span>·</span>
                        <span>Opened {new Date(dispute.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        {dispute.status !== 'resolved' && (
                          <>
                            <span>·</span>
                            <span className="font-semibold" style={{ color: getDaysOpen(dispute.createdAt) > 14 ? '#ef4444' : getDaysOpen(dispute.createdAt) > 7 ? '#f59e0b' : 'var(--text-tertiary)' }}>
                              {getDaysOpen(dispute.createdAt)}d open
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        {formatCurrency(deal?.totalCommission || 0)}
                      </div>
                      <div className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>at stake</div>
                    </div>
                  </div>
                </button>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t" style={{ borderColor: 'var(--border-primary)' }}>
                    {/* Deal Info */}
                    {deal && (
                      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)', backgroundColor: 'var(--bg-secondary)' }}>
                        <div className="grid grid-cols-4 gap-3">
                          {[
                            { label: 'Customer', value: deal.customerName },
                            { label: 'Type', value: deal.projectType },
                            { label: 'FCV', value: formatCurrency(deal.fcv) },
                            { label: 'Commission', value: formatCurrency(deal.totalCommission) },
                          ].map(f => (
                            <div key={f.label}>
                              <div className="text-[9px] font-bold uppercase" style={{ color: 'var(--text-tertiary)' }}>{f.label}</div>
                              <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{f.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Status Timeline */}
                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-primary)' }}>
                      <div className="flex items-center gap-4">
                        {[
                          { label: 'Opened', done: true },
                          { label: 'Under Review', done: dispute.status !== 'open' },
                          { label: 'Resolved', done: dispute.status === 'resolved' },
                        ].map((step, i) => (
                          <div key={i} className="flex items-center gap-1.5">
                            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                              style={{
                                backgroundColor: step.done ? 'rgba(16,185,129,0.15)' : 'var(--bg-secondary)',
                                color: step.done ? '#10b981' : 'var(--text-tertiary)',
                              }}>
                              {step.done ? '✓' : i + 1}
                            </div>
                            <span className="text-[14px] font-medium" style={{ color: step.done ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>
                              {step.label}
                            </span>
                            {i < 2 && <span className="text-[14px] mx-1" style={{ color: 'var(--text-tertiary)' }}>→</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex flex-col" style={{ maxHeight: 280 }}>
                      <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ scrollbarWidth: 'thin' }}>
                        {(dispute.messages || []).map((msg: any) => {
                          const isMe = msg.authorRole === 'rep';
                          return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className="max-w-[70%] rounded-lg px-3 py-2" style={{
                                backgroundColor: isMe ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                                color: isMe ? 'white' : 'var(--text-primary)',
                              }}>
                                <div className="text-[9px] font-bold mb-0.5" style={{ opacity: 0.7 }}>{msg.author}</div>
                                <div className="text-sm">{msg.content}</div>
                                <div className="text-[9px] mt-0.5" style={{ opacity: 0.5 }}>
                                  {new Date(msg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Input */}
                      <div className="flex-shrink-0 px-4 py-2 border-t flex gap-2" style={{ borderColor: 'var(--border-primary)' }}>
                        <input type="text" placeholder="Add a message..."
                          value={newMessage[dispute.id] || ''}
                          onChange={e => setNewMessage(prev => ({ ...prev, [dispute.id]: e.target.value }))}
                          onKeyDown={e => { if (e.key === 'Enter') handleSend(dispute.id); }}
                          className="flex-1 bg-transparent border rounded-lg px-3 py-1.5 text-sm outline-none"
                          style={{ borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }} />
                        <button onClick={() => handleSend(dispute.id)}
                          className="px-3 py-1.5 rounded-lg text-sm font-bold"
                          style={{ backgroundColor: 'var(--accent-blue)', color: 'white' }}>
                          <Send size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {allDisputes.length === 0 && (
            <div className="py-12 text-center">
              <CheckCircle size={24} style={{ color: 'var(--accent-green)', margin: '0 auto' }} />
              <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>No disputes at this time.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
