import React, { useState } from 'react';
import { Header } from './components/Header';
import { PublicLandingPortal } from './components/PublicLandingPortal';
import { KnowledgeCatalogue } from './components/KnowledgeCatalogue';
import { LocalLLMFleet } from './components/LocalLLMFleet';
import { OdooSchemaViewer } from './components/OdooSchemaViewer';
import { AdRevenueDashboard } from './components/AdRevenueDashboard';
import { ExportToolkit } from './components/ExportToolkit';
import { AICommandModal } from './components/AICommandModal';
import { INITIAL_DOCUMENTS, INITIAL_TAG_TREE } from './data/mockData';
import { ArchivalDocument, TagNode } from './types';

export default function App() {
  // Main Navigation View
  const [activeTab, setActiveTab] = useState<'portal' | 'catalogue' | 'odoo-schema' | 'local-llm-fleet' | 'ad-network' | 'export-toolkit'>('portal');

  // Application Data States
  const [documents, setDocuments] = useState<ArchivalDocument[]>(INITIAL_DOCUMENTS);
  const [tagTree, setTagTree] = useState<TagNode[]>(INITIAL_TAG_TREE);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Global keyboard shortcut for Cmd/Ctrl + K
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Desktop Frame & Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openCommandPalette={() => setCommandPaletteOpen(true)}
        documentCount={documents.length}
      />

      {/* Main Content Area */}
      <div className="flex-1">
        {activeTab === 'portal' && (
          <PublicLandingPortal
            onOpenCatalogue={() => setActiveTab('catalogue')}
            onSelectModel={() => setActiveTab('local-llm-fleet')}
          />
        )}

        {activeTab === 'catalogue' && (
          <KnowledgeCatalogue
            documents={documents}
            setDocuments={setDocuments}
            tagTree={tagTree}
            setTagTree={setTagTree}
          />
        )}

        {activeTab === 'local-llm-fleet' && <LocalLLMFleet />}

        {activeTab === 'odoo-schema' && <OdooSchemaViewer documents={documents} />}

        {activeTab === 'ad-network' && <AdRevenueDashboard />}

        {activeTab === 'export-toolkit' && <ExportToolkit documents={documents} />}
      </div>

      {/* Global Command Palette Modal */}
      <AICommandModal
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        documents={documents}
        onSelectDoc={() => {
          setActiveTab('catalogue');
        }}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}
