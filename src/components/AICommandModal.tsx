import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Cpu, 
  Layers, 
  DollarSign, 
  DownloadCloud, 
  Globe, 
  Tag, 
  Lock, 
  ArrowRight,
  Sparkles,
  X
} from 'lucide-react';
import { ArchivalDocument } from '../types';

interface AICommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: ArchivalDocument[];
  onSelectDoc: (id: string) => void;
  setActiveTab: (tab: 'portal' | 'catalogue' | 'odoo-schema' | 'local-llm-fleet' | 'ad-network' | 'export-toolkit') => void;
}

export const AICommandModal: React.FC<AICommandModalProps> = ({
  isOpen,
  onClose,
  documents,
  onSelectDoc,
  setActiveTab,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredDocs = query
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(query.toLowerCase()) ||
          d.tags.some((t) => t.toLowerCase().includes(query.toLowerCase())) ||
          d.summary.toLowerCase().includes(query.toLowerCase())
      )
    : documents.slice(0, 5);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden font-sans">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search archival records, switch views, or launch local agent..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
          />
          <kbd className="px-2 py-0.5 bg-slate-800 text-slate-400 border border-slate-700 rounded text-[11px] font-mono">
            ESC
          </kbd>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick View Switches */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 text-xs font-mono grid grid-cols-3 gap-1.5 text-slate-300">
          <button
            onClick={() => {
              setActiveTab('catalogue');
              onClose();
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 text-left border border-slate-800"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Catalogue</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('local-llm-fleet');
              onClose();
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 text-left border border-slate-800"
          >
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>Local LLMs</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('odoo-schema');
              onClose();
            }}
            className="p-2 bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 text-left border border-slate-800"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Odoo v19 DB</span>
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-72 overflow-y-auto p-2 divide-y divide-slate-800/60">
          <div className="text-[10px] uppercase font-mono text-slate-500 px-3 py-1">
            Archival Records ({filteredDocs.length})
          </div>
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                onSelectDoc(doc.id);
                setActiveTab('catalogue');
                onClose();
              }}
              className="p-3 hover:bg-slate-800/80 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-left group"
            >
              <div>
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 font-sans">
                  {doc.title}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mt-1">
                  <span>🏷️ {doc.tags[0] || 'Uncategorized'}</span>
                  <span>•</span>
                  <span>{doc.securityLevel.toUpperCase()}</span>
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
