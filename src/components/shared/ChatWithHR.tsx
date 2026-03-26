'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, User, Headphones } from 'lucide-react';

interface Message {
  id: string;
  from: 'user' | 'hr';
  text: string;
  time: string;
}

const QUICK_REPLIES = [
  'I have a question about my commission plan',
  'I need help with a dispute',
  'When is my next payout?',
  'How do I read my commission statement?',
  'I want to understand my tier progression',
];

const HR_AUTO_RESPONSES: Record<string, string> = {
  'commission plan': 'Your current plan is the GP%-Based Tiered model with a 50/50 front/back split. I can walk you through the details — what specifically would you like to understand?',
  'dispute': 'I can help with that. To file a dispute, go to My Disputes from the sidebar. If you need guidance on the process, I\'m here to help you draft it.',
  'payout': 'Your next payout of $4,200 is scheduled for March 31. Payouts happen on the last business day of each month. Want me to break down how that amount was calculated?',
  'commission statement': 'Your commission statement is in the Commissions tab in the sidebar. It shows all deal-level earnings, adjustments, and payment status. Would you like me to walk you through a specific deal?',
  'tier': 'You\'re currently in the Gold tier (35-40% GP) at an 8% commission rate. You\'re just 0.7% GP away from Diamond (9% rate). Focusing on higher-margin jobs will get you there — want some tips?',
};

function getAutoResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const [key, response] of Object.entries(HR_AUTO_RESPONSES)) {
    if (lower.includes(key)) return response;
  }
  return 'Thanks for reaching out! Let me connect you with an HR specialist. In the meantime, is there anything I can help with regarding your plan, payouts, or disputes?';
}

function getTimeString(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatWithHR() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      from: 'hr',
      text: 'Hi! I\'m your IHS HR assistant. I can help with commission questions, disputes, payouts, and more. How can I help you today?',
      time: getTimeString(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      from: 'user',
      text: text.trim(),
      time: getTimeString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate HR response after brief delay
    setTimeout(() => {
      const hrMsg: Message = {
        id: `msg-${Date.now()}-hr`,
        from: 'hr',
        text: getAutoResponse(text),
        time: getTimeString(),
      };
      setMessages(prev => [...prev, hrMsg]);
    }, 800);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 w-11 h-11 rounded-full text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          boxShadow: '0 3px 12px rgba(59,130,246,0.35)',
        }}
        title="Chat with HR"
      >
        <Headphones size={18} />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full text-white text-xs font-semibold transition-all hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, #3b82f6, #6366f1)',
          boxShadow: '0 3px 12px rgba(59,130,246,0.35)',
        }}
      >
        <Headphones size={14} />
        HR (1)
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 w-full max-w-[360px] rounded-2xl overflow-hidden flex flex-col sm:w-[360px]"
      style={{
        height: '480px',
        backgroundColor: 'var(--bg-card)',
        boxShadow: '0 12px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 sm:px-4 py-3 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Headphones size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">IHS HR Support</p>
            <p className="text-[10px] text-blue-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Online now
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <Minimize2 size={14} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 space-y-3" style={{ scrollbarWidth: 'thin' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-end gap-1.5 max-w-[85%] ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.from === 'hr' && (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
                >
                  <Headphones size={11} className="text-white" />
                </div>
              )}
              <div>
                <div
                  className={`px-3 py-2 rounded-2xl text-[13px] leading-relaxed ${
                    msg.from === 'user'
                      ? 'rounded-br-sm text-white'
                      : 'rounded-bl-sm'
                  }`}
                  style={{
                    backgroundColor: msg.from === 'user' ? '#3b82f6' : 'var(--bg-secondary)',
                    color: msg.from === 'user' ? '#fff' : 'var(--text-primary)',
                  }}
                >
                  {msg.text}
                </div>
                <p
                  className={`text-[9px] mt-0.5 px-1 ${msg.from === 'user' ? 'text-right' : ''}`}
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies (only show when few messages) */}
      {messages.length <= 2 && (
        <div className="px-3 sm:px-4 pb-2 flex flex-wrap gap-1.5">
          {QUICK_REPLIES.map((reply, i) => (
            <button
              key={i}
              onClick={() => sendMessage(reply)}
              className="text-[11px] px-2.5 py-1.5 rounded-full border transition-colors hover:border-blue-300"
              style={{
                borderColor: 'var(--border-primary)',
                color: 'var(--accent-blue)',
                backgroundColor: 'transparent',
              }}
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="flex items-center gap-2 px-2 sm:px-3 py-2.5 border-t flex-shrink-0"
        style={{ borderColor: 'var(--border-primary)' }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
          placeholder="Type a message..."
          className="flex-1 text-sm px-3 py-2 rounded-lg border-0 outline-none"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className="p-2 rounded-lg text-white transition-all disabled:opacity-40"
          style={{
            background: input.trim() ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'var(--bg-tertiary)',
          }}
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
