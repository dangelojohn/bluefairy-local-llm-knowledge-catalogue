import React, { useState } from 'react';
import { 
  DownloadCloud, 
  Package, 
  Database, 
  FileCode, 
  Layers, 
  Copy, 
  Check, 
  HardDrive, 
  Terminal, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { ArchivalDocument } from '../types';
import { generateOdooV19ModuleFiles, generateElectronDesktopBoilerplate, downloadTextFile } from '../utils/odooBridge';

interface ExportToolkitProps {
  documents: ArchivalDocument[];
}

export const ExportToolkit: React.FC<ExportToolkitProps> = ({ documents }) => {
  const [copiedFile, setCopiedFile] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const electronFiles = generateElectronDesktopBoilerplate();
  const odooFiles = generateOdooV19ModuleFiles(documents);

  const handleCopy = (name: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedFile(name);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleDownloadFullJson = () => {
    const jsonStr = JSON.stringify(documents, null, 2);
    downloadTextFile(`bluefairy_archival_vault_${Date.now()}.json`, jsonStr, 'application/json');
    setDownloadSuccess('Exported BlueFairy Archival Vault JSON.');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-xs font-mono text-purple-300">
          <Package className="w-3.5 h-3.5" />
          <span>Cross-Platform Packaging & Odoo v19 CE Bundle Exporter</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Desktop Electron Framework & Odoo Module Generator
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          Generate standalone Electron desktop applications for macOS/Linux/Windows with embedded offline SQLite storage, or export installable Odoo v19 CE module packages.
        </p>
      </div>

      {downloadSuccess && (
        <div className="max-w-6xl mx-auto p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Main Export Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Electron Desktop App Packaging */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white font-mono">
                Electron Desktop Framework (Cross-Platform)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              macOS • Windows • Linux
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Wrap the BlueFairy Knowledge Catalogue in a native desktop shell with air-gapped IPC socket isolation, SQLite storage, and hardware acceleration.
          </p>

          <div className="space-y-3 pt-2">
            {Object.entries(electronFiles).map(([filename, content]) => (
              <div key={filename} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="font-bold text-cyan-400">{filename}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(filename, content)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copiedFile === filename ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() => downloadTextFile(filename, content)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1"
                    >
                      <DownloadCloud className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-32">
                  {content}
                </pre>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Odoo v19 CE Python Module Exporter */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white font-mono">
                Odoo v19 Community Edition Module
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              v19.0-CE Ready
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Export the complete Odoo v19 module files to install directly into your enterprise <code className="text-emerald-400">addons/</code> directory.
          </p>

          <div className="space-y-3 pt-2">
            {Object.entries(odooFiles).map(([filename, content]) => (
              <div key={filename} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                  <span className="font-bold text-emerald-400">{filename}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(filename, content)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      {copiedFile === filename ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() => downloadTextFile(filename.replace(/\//g, '_'), content)}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] flex items-center gap-1"
                    >
                      <DownloadCloud className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
                <pre className="p-2.5 rounded-lg bg-slate-900 font-mono text-[11px] text-emerald-300 overflow-x-auto max-h-32">
                  {content}
                </pre>
              </div>
            ))}
          </div>

          {/* Master Full JSON Backup Button */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleDownloadFullJson}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-purple-950"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Download Complete Archival Vault (.JSON Database)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
