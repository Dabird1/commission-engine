'use client';

import { useState } from 'react';
import { disputes, sampleDeals } from '@/data/sample-data';
import { formatCurrency, cn } from '@/lib/utils';

export default function DisputeFlow() {
  const [expandedDisputeId, setExpandedDisputeId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState<Record<string, string>>({});

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'bg-amber-100 text-amber-900',
      under_review: 'bg-blue-100 text-blue-900',
      resolved: 'bg-green-100 text-green-900',
      escalated: 'bg-red-100 text-red-900',
    };
    return colors[status] || 'bg-gray-100 text-gray-900';
  };

  const handleAddMessage = (disputeId: string) => {
    if (newMessage[disputeId]?.trim()) {
      // In a real app, this would submit to an API
      setNewMessage((prev) => ({ ...prev, [disputeId]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">My Disputes</h1>
        <p className="mt-2 text-slate-600">
          {disputes.length} total dispute{disputes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Disputes List */}
      <div className="space-y-4">
        {disputes.map((dispute) => {
          const deal = sampleDeals.find((d) => d.id === dispute.dealId);
          const isExpanded = expandedDisputeId === dispute.id;

          return (
            <div
              key={dispute.id}
              className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden"
            >
              {/* List Item */}
              <button
                onClick={() =>
                  setExpandedDisputeId(isExpanded ? null : dispute.id)
                }
                className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {deal?.customerName || 'Unknown Customer'}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">{dispute.reason}</p>
                    <div className="flex gap-3 mt-2">
                      <span
                        className={cn(
                          'inline-block rounded-md px-2 py-1 text-xs font-medium',
                          getStatusColor(dispute.status)
                        )}
                      >
                        {dispute.status === 'under_review'
                          ? 'Under Review'
                          : dispute.status.charAt(0).toUpperCase() +
                            dispute.status.slice(1)}
                      </span>
                      <span className="text-xs text-slate-500">
                        Opened {new Date(dispute.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {formatCurrency(deal?.totalCommission || 0)}
                    </p>
                    <p className="text-xs text-slate-500">Commission</p>
                  </div>
                </div>
              </button>

              {/* Expanded View */}
              {isExpanded && (
                <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-6">
                  {/* Deal Info */}
                  {deal && (
                    <div className="rounded-lg bg-white p-4 border border-slate-200">
                      <h4 className="font-semibold text-slate-900 mb-3">Deal Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-600">Customer</p>
                          <p className="text-sm font-medium text-slate-900">
                            {deal.customerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Job Type</p>
                          <p className="text-sm font-medium text-slate-900">
                            {deal.projectType.charAt(0).toUpperCase() + deal.projectType.slice(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Deal Amount</p>
                          <p className="text-sm font-medium text-slate-900">
                            {formatCurrency(deal.fcv)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-600">Commission</p>
                          <p className="text-sm font-medium text-slate-900">
                            {formatCurrency(deal.totalCommission)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Status Timeline */}
                  <div className="rounded-lg bg-white p-4 border border-slate-200">
                    <h4 className="font-semibold text-slate-900 mb-4">Status Timeline</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Opened', status: 'done' },
                        { label: 'Under Review', status: dispute.status !== 'open' ? 'done' : 'pending' },
                        { label: 'Resolved', status: dispute.status === 'resolved' ? 'done' : 'pending' },
                      ].map((step, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                              step.status === 'done'
                                ? 'bg-green-100 text-green-900'
                                : 'bg-slate-200 text-slate-600'
                            )}
                          >
                            {step.status === 'done' ? '✓' : idx + 1}
                          </div>
                          <span
                            className={cn(
                              'text-sm',
                              step.status === 'done' ? 'text-slate-900 font-medium' : 'text-slate-600'
                            )}
                          >
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Message Thread */}
                  <div className="rounded-lg bg-white border border-slate-200 overflow-hidden flex flex-col h-96">
                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {dispute.messages.map((msg) => {
                        const isUser = msg.authorRole === 'rep';
                        return (
                          <div
                            key={msg.id}
                            className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
                          >
                            <div
                              className={cn(
                                'max-w-xs rounded-lg px-4 py-2 text-sm',
                                isUser
                                  ? 'bg-blue-500 text-white rounded-br-none'
                                  : 'bg-slate-200 text-slate-900 rounded-bl-none'
                              )}
                            >
                              <p className="font-medium text-xs opacity-75 mb-1">
                                {msg.author}
                              </p>
                              <p>{msg.content}</p>
                              <p className="text-xs opacity-60 mt-1">
                                {new Date(msg.timestamp).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Message Input */}
                    <div className="border-t border-slate-200 bg-slate-50 p-4 flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a message..."
                        value={newMessage[dispute.id] || ''}
                        onChange={(e) =>
                          setNewMessage((prev) => ({
                            ...prev,
                            [dispute.id]: e.target.value,
                          }))
                        }
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddMessage(dispute.id);
                          }
                        }}
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-500 outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => handleAddMessage(dispute.id)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {disputes.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">No disputes at this time.</p>
        </div>
      )}
    </div>
  );
}
