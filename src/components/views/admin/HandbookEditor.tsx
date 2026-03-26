// @ts-nocheck
'use client';

import { useState } from 'react';
import { handbookSections } from '@/data/sample-data';
import { cn } from '@/lib/utils';
import {
  FileText, Edit3, Eye, Save, Upload, Clock, User, GripVertical,
  CheckCircle, AlertTriangle, ChevronDown, ChevronRight, Plus, Trash2,
  Users, BarChart3, Send, History, Shield
} from 'lucide-react';

// Simulated acknowledgement data
const acknowledgements = [
  { name: 'Sarah Chen', role: 'Sales Rep', signedAt: '2026-03-24T10:30:00', version: 5 },
  { name: 'Mike Johnson', role: 'Sales Rep', signedAt: '2026-03-23T14:15:00', version: 5 },
  { name: 'Chris Martinez', role: 'Sales Rep', signedAt: '2026-03-22T09:00:00', version: 4 },
  { name: 'Emily Davis', role: 'Sales Rep', signedAt: null, version: null },
  { name: 'Alex Thompson', role: 'Sales Rep', signedAt: null, version: null },
  { name: 'Jordan Lee', role: 'Sales Rep', signedAt: '2026-03-25T11:45:00', version: 5 },
  { name: 'Taylor Brown', role: 'Sales Rep', signedAt: null, version: null },
  { name: 'Ryan Wilson', role: 'Sales Rep', signedAt: '2026-03-21T16:20:00', version: 4 },
];

const versionHistory = [
  { version: 5, date: '2026-03-24', author: 'Sarah Admin', changes: 'Updated clawback policy, added glossary terms', status: 'published' },
  { version: 4, date: '2026-03-20', author: 'Robert Kim', changes: 'Revised split deal guidelines', status: 'published' },
  { version: 3, date: '2026-03-15', author: 'Jennifer Lee', changes: 'Added dispute process section', status: 'published' },
  { version: 2, date: '2026-03-10', author: 'Sarah Admin', changes: 'Updated commission tiers', status: 'published' },
  { version: 1, date: '2026-03-01', author: 'Robert Kim', changes: 'Initial handbook creation', status: 'published' },
];

type TabId = 'editor' | 'acknowledgements' | 'history';

export default function HandbookEditor() {
  const [activeTab, setActiveTab] = useState<TabId>('editor');
  const [sections, setSections] = useState(
    (handbookSections || []).map((s: any) => ({ ...s }))
  );
  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id || '');
  const [editContent, setEditContent] = useState(sections[0]?.content || '');
  const [editTitle, setEditTitle] = useState(sections[0]?.title || '');
  const [previewMode, setPreviewMode] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'publishing' | 'published'>('idle');
  const [showAddSection, setShowAddSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [reminderSent, setReminderSent] = useState(false);

  const selectedSection = sections.find((s: any) => s.id === selectedSectionId);

  const signed = acknowledgements.filter(a => a.signedAt);
  const unsigned = acknowledgements.filter(a => !a.signedAt);
  const signRate = Math.round((signed.length / acknowledgements.length) * 100);
  const currentVersionSigned = signed.filter(a => a.version === 5).length;

  const handleSelectSection = (section: any) => {
    setSelectedSectionId(section.id);
    setEditContent(section.content);
    setEditTitle(section.title);
    setHasUnsaved(false);
  };

  const handleSave = () => {
    setSections((prev: any[]) => prev.map((s: any) =>
      s.id === selectedSectionId
        ? { ...s, content: editContent, title: editTitle, lastUpdated: new Date().toISOString(), updatedBy: 'You' }
        : s
    ));
    setHasUnsaved(false);
  };

  const handlePublish = () => {
    setPublishStatus('publishing');
    setTimeout(() => setPublishStatus('published'), 1500);
    setTimeout(() => setPublishStatus('idle'), 4000);
  };

  const handleDragStart = (id: string) => setDraggedItem(id);
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (targetId: string) => {
    if (!draggedItem || draggedItem === targetId) return;
    const draggedIdx = sections.findIndex((s: any) => s.id === draggedItem);
    const targetIdx = sections.findIndex((s: any) => s.id === targetId);
    const newSections = [...sections];
    const [dragged] = newSections.splice(draggedIdx, 1);
    newSections.splice(targetIdx, 0, dragged);
    setSections(newSections);
    setDraggedItem(null);
  };

  const tabs: { id: TabId; label: string; icon: any; count?: number }[] = [
    { id: 'editor', label: 'Edit Sections', icon: Edit3 },
    { id: 'acknowledgements', label: 'Acknowledgements', icon: Users, count: unsigned.length },
    { id: 'history', label: 'Version History', icon: History },
  ];

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Handbook Editor</h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
              {sections.length} sections · v5 (current) · {signRate}% of reps have signed
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasUnsaved && (
              <span className="text-[14px] font-bold px-2 py-1 rounded" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                Unsaved Changes
              </span>
            )}
            <button onClick={handlePublish}
              className="px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
              style={{
                backgroundColor: publishStatus === 'published' ? 'var(--accent-green)' : 'var(--accent-blue)',
                color: 'white',
                opacity: publishStatus === 'publishing' ? 0.7 : 1,
              }}>
              {publishStatus === 'publishing' && <span className="animate-spin">⟳</span>}
              {publishStatus === 'published' && <CheckCircle size={12} />}
              {publishStatus === 'idle' && <Upload size={12} />}
              {publishStatus === 'publishing' ? 'Publishing...' : publishStatus === 'published' ? 'Published!' : 'Publish to Reps'}
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-3 mb-3">
          {[
            { label: 'Sections', value: sections.length, icon: FileText, color: 'var(--accent-blue)' },
            { label: 'Signed (Current)', value: `${currentVersionSigned}/${acknowledgements.length}`, icon: CheckCircle, color: 'var(--accent-green)' },
            { label: 'Pending Signatures', value: unsigned.length, icon: AlertTriangle, color: unsigned.length > 0 ? '#f59e0b' : 'var(--accent-green)' },
            { label: 'Current Version', value: 'v5', icon: Shield, color: 'var(--accent-blue)' },
          ].map((stat, i) => (
            <div key={i} className="rounded-lg border px-3 py-2 flex items-center gap-3"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}12` }}>
                <stat.icon size={14} style={{ color: stat.color }} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div className="text-[9px] uppercase tracking-wider font-bold" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--accent-blue-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--text-tertiary)',
                border: activeTab === tab.id ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
              }}>
              <tab.icon size={12} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'editor' && (
          <div className="h-full flex">
            {/* Section sidebar */}
            <div className="w-56 flex-shrink-0 border-r flex flex-col"
              style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
              <div className="flex-1 overflow-y-auto py-1" style={{ scrollbarWidth: 'thin' }}>
                {sections.map((section: any, idx: number) => (
                  <div key={section.id}
                    draggable
                    onDragStart={() => handleDragStart(section.id)}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(section.id)}
                    onClick={() => handleSelectSection(section)}
                    className="flex items-center gap-2 px-3 py-2.5 cursor-pointer transition-colors"
                    style={{
                      backgroundColor: selectedSectionId === section.id ? 'var(--accent-blue-light)' : 'transparent',
                      borderLeft: selectedSectionId === section.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
                    }}
                    onMouseEnter={e => { if (selectedSectionId !== section.id) e.currentTarget.style.backgroundColor = 'var(--bg-hover)'; }}
                    onMouseLeave={e => { if (selectedSectionId !== section.id) e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    <GripVertical size={12} style={{ color: 'var(--text-tertiary)', cursor: 'grab', flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate" style={{
                        color: selectedSectionId === section.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                        fontWeight: selectedSectionId === section.id ? 600 : 400,
                      }}>
                        {section.title}
                      </div>
                      {section.lastUpdated && (
                        <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(section.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border-primary)' }}>
                {showAddSection && (
                  <input
                    type="text"
                    value={newSectionName}
                    onChange={e => setNewSectionName(e.target.value)}
                    placeholder="New section name..."
                    className="w-full px-2 py-1.5 rounded-lg text-sm border outline-none"
                    style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-primary)', color: 'var(--text-primary)' }}
                  />
                )}
                <button onClick={() => setShowAddSection(!showAddSection)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-[14px] font-bold transition-all"
                  style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-tertiary)', border: '1px dashed var(--border-primary)' }}>
                  <Plus size={10} /> Add Section
                </button>
              </div>
            </div>

            {/* Editor main area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {selectedSection ? (
                <>
                  {/* Editor toolbar */}
                  <div className="flex-shrink-0 px-6 py-3 border-b flex items-center justify-between"
                    style={{ borderColor: 'var(--border-primary)' }}>
                    <div className="flex-1 mr-4">
                      <input type="text" value={editTitle}
                        onChange={e => { setEditTitle(e.target.value); setHasUnsaved(true); }}
                        className="text-lg font-bold bg-transparent border-0 outline-none w-full"
                        style={{ color: 'var(--text-primary)' }}
                      />
                      <div className="flex items-center gap-3 mt-0.5">
                        {selectedSection.lastUpdated && (
                          <span className="flex items-center gap-1 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
                            <Clock size={10} /> {new Date(selectedSection.lastUpdated).toLocaleDateString()}
                          </span>
                        )}
                        {selectedSection.updatedBy && (
                          <span className="flex items-center gap-1 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
                            <User size={10} /> {selectedSection.updatedBy}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPreviewMode(!previewMode)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                        style={{
                          backgroundColor: previewMode ? 'rgba(59,130,246,0.06)' : 'var(--bg-secondary)',
                          color: previewMode ? 'var(--accent-blue)' : 'var(--text-tertiary)',
                          border: previewMode ? '1px solid rgba(59,130,246,0.2)' : '1px solid var(--border-primary)',
                        }}>
                        {previewMode ? <Eye size={12} /> : <Edit3 size={12} />}
                        {previewMode ? 'Preview' : 'Edit'}
                      </button>
                      <button onClick={handleSave}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold transition-all"
                        style={{
                          backgroundColor: hasUnsaved ? 'var(--accent-blue)' : 'var(--bg-secondary)',
                          color: hasUnsaved ? 'white' : 'var(--text-tertiary)',
                        }}>
                        <Save size={12} /> Save
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                    {previewMode ? (
                      <div className="px-6 py-4 max-w-3xl">
                        <div className="rounded-xl border p-5" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                          <div className="flex items-center gap-2 mb-3">
                            <Eye size={12} style={{ color: 'var(--accent-blue)' }} />
                            <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: 'var(--accent-blue)' }}>Rep Preview</span>
                          </div>
                          <div className="space-y-3">
                            {editContent.split('\n\n').map((paragraph: string, idx: number) => (
                              <p key={idx} className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{paragraph}</p>
                            ))}
                          </div>
                        </div>
                        <p className="text-[14px] mt-3 text-center" style={{ color: 'var(--text-tertiary)' }}>
                          This is the legal text reps see when they click "Read Full Text" beneath the visual section.
                        </p>
                      </div>
                    ) : (
                      <div className="px-6 py-4">
                        <textarea
                          value={editContent}
                          onChange={e => { setEditContent(e.target.value); setHasUnsaved(true); }}
                          className="w-full border rounded-xl p-5 text-sm leading-relaxed resize-none font-mono outline-none"
                          style={{
                            minHeight: 400,
                            backgroundColor: 'var(--bg-secondary)',
                            borderColor: 'var(--border-primary)',
                            color: 'var(--text-primary)',
                          }}
                          placeholder="Enter the section content..."
                        />
                        <p className="text-[14px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
                          This is the legal text backing this section. Reps see a visual summary by default, with a "Read Full Text" button to view this content.
                        </p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FileText size={24} style={{ color: 'var(--text-tertiary)', margin: '0 auto' }} />
                    <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>Select a section to edit</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'acknowledgements' && (
          <div className="h-full overflow-y-auto px-6 py-4" style={{ scrollbarWidth: 'thin' }}>
            <div className="max-w-4xl">
              {/* Sign rate overview */}
              <div className="grid grid-cols-3 gap-4 mb-5">
                <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent-green)' }}>{signRate}%</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Overall sign rate</div>
                  <div className="h-2 rounded-full mt-2" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                    <div className="h-full rounded-full" style={{ width: `${signRate}%`, backgroundColor: 'var(--accent-green)' }} />
                  </div>
                </div>
                <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                  <div className="text-2xl font-bold" style={{ color: 'var(--accent-blue)' }}>{currentVersionSigned}</div>
                  <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Signed current version (v5)</div>
                  <div className="text-[14px] mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    {signed.length - currentVersionSigned} signed older version
                  </div>
                </div>
                <div className="rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold" style={{ color: unsigned.length > 0 ? '#f59e0b' : 'var(--accent-green)' }}>
                        {unsigned.length}
                      </div>
                      <div className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>Pending signatures</div>
                    </div>
                    {unsigned.length > 0 && (
                      <button onClick={() => { setReminderSent(true); setTimeout(() => setReminderSent(false), 2000); }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[14px] font-bold transition-all"
                        style={{ backgroundColor: reminderSent ? 'var(--accent-green)' : 'var(--accent-blue)', color: 'white' }}>
                        <Send size={10} /> {reminderSent ? 'Reminder Sent ✓' : 'Send Reminder'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Unsigned (top priority) */}
              {unsigned.length > 0 && (
                <div className="mb-5">
                  <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: '#f59e0b' }}>
                    Pending ({unsigned.length})
                  </div>
                  <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
                    {unsigned.map((person, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
                        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{person.name}</div>
                            <div className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>{person.role}</div>
                          </div>
                        </div>
                        <span className="text-[14px] font-bold px-2 py-1 rounded" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                          Not Signed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Signed */}
              <div>
                <div className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--accent-green)' }}>
                  Signed ({signed.length})
                </div>
                <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-primary)' }}>
                  {signed.map((person, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 border-b last:border-b-0"
                      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-primary)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                          style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                          {person.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{person.name}</div>
                          <div className="text-[14px]" style={{ color: 'var(--text-tertiary)' }}>{person.role}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-[14px] font-bold" style={{ color: 'var(--accent-green)' }}>
                          <CheckCircle size={10} /> v{person.version}
                        </div>
                        <div className="text-[9px]" style={{ color: 'var(--text-tertiary)' }}>
                          {new Date(person.signedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="h-full overflow-y-auto px-6 py-4" style={{ scrollbarWidth: 'thin' }}>
            <div className="max-w-3xl">
              <div className="relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5" style={{ backgroundColor: 'var(--border-primary)' }} />
                {versionHistory.map((entry, i) => (
                  <div key={entry.version} className="flex items-start gap-4 mb-5 last:mb-0 relative">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 z-10 text-sm font-bold"
                      style={{
                        backgroundColor: i === 0 ? 'rgba(59,130,246,0.1)' : 'var(--bg-secondary)',
                        color: i === 0 ? 'var(--accent-blue)' : 'var(--text-tertiary)',
                        border: i === 0 ? '2px solid rgba(59,130,246,0.3)' : '2px solid var(--border-primary)',
                      }}>
                      v{entry.version}
                    </div>
                    <div className="flex-1 rounded-xl border p-4" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{entry.changes}</span>
                        {i === 0 && (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                            Current
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
                        <span className="flex items-center gap-1"><User size={10} /> {entry.author}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
