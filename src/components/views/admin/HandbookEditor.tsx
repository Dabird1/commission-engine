'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
  content: string;
}

interface HistoryEntry {
  version: number;
  date: Date;
  author: string;
}

export default function HandbookEditor() {
  const [sections, setSections] = useState<Section[]>([
    {
      id: 'sec-1',
      title: 'Introduction',
      content: '# Commission Plan Overview\n\nWelcome to the commission plan handbook. This document outlines the commission structure, eligibility requirements, and payment terms.'
    },
    {
      id: 'sec-2',
      title: 'Compensation Structure',
      content: '## GP% Tiered Commission\n\n- Tier 1 (0-10% GP): 2% commission\n- Tier 2 (11-25% GP): 5% commission\n- Tier 3 (25%+ GP): 8% commission'
    },
    {
      id: 'sec-3',
      title: 'Split Deals',
      content: '## Split Deal Guidelines\n\n### Canvasser/Closer Splits\n- Canvasser: 30% of commission\n- Closer: 70% of commission\n\n### Co-Sell Splits\n- Each party: 50% of commission'
    },
    {
      id: 'sec-4',
      title: 'Clawback Policy',
      content: '## Clawback Terms\n\nCommissions are subject to clawback if:\n- Customer cancels within 90 days\n- Contract is terminated\n- Negative margin is discovered'
    },
    {
      id: 'sec-5',
      title: 'Frequently Asked Questions',
      content: '## FAQ\n\nQ: When are commissions paid?\nA: Commissions are processed monthly within 5 business days of month-end close.\n\nQ: How do I dispute a commission?\nA: Submit disputes within 30 days of the payment date.'
    }
  ]);

  const [selectedSection, setSelectedSection] = useState<Section | null>(sections[0]);
  const [editContent, setEditContent] = useState(sections[0].content);
  const [previewMode, setPreviewMode] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const history: HistoryEntry[] = [
    { version: 5, date: new Date('2026-03-24T14:30:00'), author: 'Sarah Admin' },
    { version: 4, date: new Date('2026-03-20T09:15:00'), author: 'Robert Kim' },
    { version: 3, date: new Date('2026-03-15T16:45:00'), author: 'Jennifer Lee' },
    { version: 2, date: new Date('2026-03-10T11:20:00'), author: 'Sarah Admin' },
    { version: 1, date: new Date('2026-03-01T08:00:00'), author: 'Robert Kim' }
  ];

  const handleSelectSection = (section: Section) => {
    setSelectedSection(section);
    setEditContent(section.content);
  };

  const handleUpdateSection = () => {
    if (selectedSection) {
      setSections(prev => prev.map(s =>
        s.id === selectedSection.id
          ? { ...s, content: editContent }
          : s
      ));
    }
  };

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;

    const draggedIdx = sections.findIndex(s => s.id === draggedItem);
    const targetIdx = sections.findIndex(s => s.id === targetId);

    const newSections = [...sections];
    const [dragged] = newSections.splice(draggedIdx, 1);
    newSections.splice(targetIdx, 0, dragged);

    setSections(newSections);
    setDraggedItem(null);
  };

  const renderMarkdownPreview = (content: string) => {
    // Simple markdown rendering
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl font-bold text-[var(--color-text-primary)] mt-4 mb-2">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={idx} className="text-xl font-bold text-[var(--color-text-primary)] mt-3 mb-2">{line.slice(3)}</h2>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="text-sm text-[var(--color-text-primary)] ml-4">{line.slice(2)}</li>;
      }
      if (line.startsWith('Q: ')) {
        return <div key={idx} className="text-sm font-semibold text-[var(--color-text-primary)] mt-2">{line}</div>;
      }
      if (line.startsWith('A: ')) {
        return <div key={idx} className="text-sm text-[var(--color-text-secondary)] ml-4 mb-2">{line.slice(3)}</div>;
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      return <p key={idx} className="text-sm text-[var(--color-text-primary)]">{line}</p>;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Handbook Editor</h1>
        <button className="px-4 py-2 bg-[var(--color-button-primary)] text-white rounded-lg font-medium hover:bg-[var(--color-button-primary-hover)] transition-colors">
          Publish
        </button>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={previewMode}
            onChange={e => setPreviewMode(e.target.checked)}
            className="w-4 h-4 accent-[var(--color-button-primary)]"
          />
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">Preview Mode</span>
        </label>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Section List */}
        <div className="col-span-1">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 px-2">Sections</h2>
          <div className="space-y-2">
            {sections.map((section, idx) => (
              <div
                key={section.id}
                draggable
                onDragStart={() => handleDragStart(section.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(section.id)}
                onClick={() => handleSelectSection(section)}
                className={`p-3 rounded-lg cursor-move transition-colors ${
                  selectedSection?.id === section.id
                    ? 'bg-[var(--color-button-primary)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">::</div>
                  <div className="text-sm">{section.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor/Preview */}
        <div className="col-span-2">
          <div className="bg-[var(--color-bg-primary)] border border-[var(--color-border)] rounded-lg overflow-hidden">
            <div className="border-b border-[var(--color-border)] p-4">
              <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                {selectedSection?.title || 'Select a section'}
              </h3>
            </div>
            <div className="p-4">
              {previewMode ? (
                <div className="prose prose-sm max-w-none space-y-3">
                  {selectedSection && renderMarkdownPreview(selectedSection.content)}
                </div>
              ) : (
                <textarea
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full h-96 p-4 border border-[var(--color-border)] rounded-lg bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] font-mono text-sm resize-none"
                  placeholder="Enter markdown content here..."
                />
              )}
            </div>
            {!previewMode && (
              <div className="border-t border-[var(--color-border)] p-4 flex gap-2">
                <button
                  onClick={handleUpdateSection}
                  className="px-4 py-2 text-sm bg-[var(--color-button-primary)] text-white rounded-lg hover:bg-[var(--color-button-primary-hover)] transition-colors"
                >
                  Save Section
                </button>
                <button className="px-4 py-2 text-sm bg-[var(--color-button-secondary)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-button-secondary-hover)] transition-colors">
                  Add New Section
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Version History */}
        <div className="col-span-1">
          <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 px-2">Version History</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {history.map(entry => (
              <div key={entry.version} className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg p-3 cursor-pointer hover:border-[var(--color-border-hover)] transition-colors">
                <div className="text-xs font-semibold text-[var(--color-text-primary)]">v{entry.version}</div>
                <div className="text-xs text-[var(--color-text-secondary)] mt-1">
                  {entry.date.toLocaleDateString()} {entry.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-xs text-[var(--color-text-secondary)]">{entry.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
