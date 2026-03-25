'use client';

import { useState, useMemo } from 'react';
import { handbookSections } from '@/data/sample-data';
import { cn } from '@/lib/utils';

export default function HandbookPage() {
  const [selectedSectionId, setSelectedSectionId] = useState(handbookSections[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = useMemo(() => {
    if (!searchQuery) return handbookSections;

    return handbookSections.filter(
      (section) =>
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const selectedSection = handbookSections.find((s) => s.id === selectedSectionId);

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Left Sidebar */}
      <div className="w-64 flex-shrink-0 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="border-b border-slate-200 p-4">
          <input
            type="text"
            placeholder="Search handbook..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm placeholder-slate-500 outline-none focus:border-blue-500"
          />
        </div>

        {/* Section List */}
        <div className="flex-1 overflow-y-auto">
          {filteredSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSectionId(section.id)}
              className={cn(
                'w-full text-left px-4 py-3 text-sm border-l-4 transition-colors',
                selectedSectionId === section.id
                  ? 'border-l-blue-600 bg-blue-50 text-blue-900 font-semibold'
                  : 'border-l-transparent text-slate-700 hover:bg-slate-50'
              )}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        {selectedSection ? (
          <>
            {/* Header */}
            <div className="border-b border-slate-200 bg-slate-50 px-6 py-4">
              <h1 className="text-2xl font-bold text-slate-900">{selectedSection.title}</h1>
              <div className="flex gap-4 mt-2 text-xs text-slate-600">
                <span>Last updated: {new Date(selectedSection.lastUpdated).toLocaleDateString()}</span>
                <span>By {selectedSection.updatedBy}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="prose prose-sm max-w-none text-slate-700 space-y-4">
                {selectedSection.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-xs text-slate-500">
              Version 2.1 • Last updated {new Date(selectedSection.lastUpdated).toLocaleDateString()}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No section selected</p>
          </div>
        )}
      </div>
    </div>
  );
}
