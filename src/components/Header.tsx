import React from 'react';
import { 
  ShieldCheck, 
  Database, 
  Terminal, 
  Search, 
  Sparkles, 
  HardDrive, 
  DollarSign, 
  DownloadCloud, 
  Globe, 
  BookOpen, 
  Cpu,
  Layers
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'portal' | 'catalogue' | 'odoo-schema' | 'local-llm-fleet' | 'ad-network' | 'export-toolkit';
  setActiveTab: (tab: 'portal' | 'catalogue' | 'odoo-schema' | 'local-llm-fleet' | 'ad-network' | 'export-toolkit') => void;
  openCommandPalette: () => void;
  documentCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openCommandPalette,
  documentCount,
}) => {
  return (
    <header className="bg-slate-950 border-b border-slate-800 text-slate-100 select-none sticky top-0 z-40">
      {/* Electron Desktop Window Titlebar (Cross-Platform Frame) */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 text-xs border-b border-slate-800/80 text-slate-400">
        <div className="flex items-center gap-2">
          {/* macOS Style Window Controls */}
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-600 transition-colors cursor-pointer" title="Close Frame" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-600 transition-colors cursor-pointer" title="Minimize Frame" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-600 transition-colors cursor-pointer" title="Maximize Frame" />
          </div>
          <span className="font-mono text-slate-300 font-medium">BlueFairy.ca Desktop Archival Engine v2.4 (Electron x86_64/ARM64)</span>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Air-Gap Guard: ACTIVE (Zero Outbound Packets)
          </span>
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            <Database className="w-3 h-3 text-emerald-400" />
            Odoo v19.0-CE Local DB
          </span>
          <span className="text-slate-400">
            Vault Index: <strong className="text-cyan-400">{documentCount}</strong> records
          </span>
        </div>
      </div>

      {/* Main Navbar & Navigation Tabs */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        {/* Brand & Mission Icon */}
        <div 
          onClick={() => setActiveTab('portal')}
          className="flex items-center gap-2.5 cursor-pointer group"
          id="brand-logo-button"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white font-sans">BlueFairy<span className="text-cyan-400">.ca</span></span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                Local LLMs
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Private AI & Sovereign Archival Intelligence</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto text-xs">
          <button
            id="nav-tab-portal"
            onClick={() => setActiveTab('portal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'portal'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public HTTP Portal</span>
          </button>

          <button
            id="nav-tab-catalogue"
            onClick={() => setActiveTab('catalogue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'catalogue'
                ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Knowledge Catalogue</span>
            <span className="ml-1 text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded-full text-cyan-200">
              {documentCount}
            </span>
          </button>

          <button
            id="nav-tab-local-llm"
            onClick={() => setActiveTab('local-llm-fleet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'local-llm-fleet'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Local LLM Fleet</span>
          </button>

          <button
            id="nav-tab-odoo-schema"
            onClick={() => setActiveTab('odoo-schema')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'odoo-schema'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Odoo v19 CE Backend</span>
          </button>

          <button
            id="nav-tab-ad-network"
            onClick={() => setActiveTab('ad-network')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'ad-network'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Google Ad & Revenue</span>
          </button>

          <button
            id="nav-tab-export"
            onClick={() => setActiveTab('export-toolkit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'export-toolkit'
                ? 'bg-purple-600 text-white shadow-sm shadow-purple-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Export & Packaging</span>
          </button>
        </nav>

        {/* Right Action: Quick Search Bar Command Palette Trigger */}
        <div className="flex items-center gap-2">
          <button
            id="global-search-shortcut-btn"
            onClick={openCommandPalette}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/80 rounded-lg text-xs font-mono transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Offline Search...</span>
            <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded text-[10px]">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
