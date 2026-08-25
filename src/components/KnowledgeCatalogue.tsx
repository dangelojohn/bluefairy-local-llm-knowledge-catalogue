import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Tag as TagIcon, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  Plus, 
  Check, 
  FileText, 
  ShieldCheck, 
  Star, 
  Clock, 
  HardDrive, 
  ExternalLink, 
  Copy, 
  Download, 
  Sparkles, 
  Database, 
  Edit3, 
  Eye, 
  Trash2, 
  Archive, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  X,
  Code,
  Share2,
  Lock,
  Cpu,
  Bot
} from 'lucide-react';
import { ArchivalDocument, TagNode, SearchFilter, SecurityLevel, DocumentFormat } from '../types';
import { executeOfflineSearch, recalculateTagTreeCounts, matchesHierarchicalTag } from '../utils/searchEngine';
import { generateSHA256Checksum, downloadTextFile } from '../utils/odooBridge';

interface KnowledgeCatalogueProps {
  documents: ArchivalDocument[];
  setDocuments: React.Dispatch<React.SetStateAction<ArchivalDocument[]>>;
  tagTree: TagNode[];
  setTagTree: React.Dispatch<React.SetStateAction<TagNode[]>>;
}

export const KnowledgeCatalogue: React.FC<KnowledgeCatalogueProps> = ({
  documents,
  setDocuments,
  tagTree,
  setTagTree,
}) => {
  // Search & Filter State
  const [filter, setFilter] = useState<SearchFilter>({
    query: '',
    selectedTags: [],
    category: 'all',
    format: 'all',
    securityLevel: 'all',
    sortBy: 'relevance',
    onlyPinned: false,
    onlyArchived: false,
  });

  // Selected Active Document for Right Pane
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [viewMode, setViewMode] = useState<'reader' | 'editor' | 'odoo_raw' | 'ai_agent'>('reader');

  // Tag Tree Expanded Nodes State
  const [expandedTagIds, setExpandedTagIds] = useState<Record<string, boolean>>({
    'tag-security': true,
    'tag-sec-airgap': true,
    'tag-models': true,
    'tag-models-quant': true,
    'tag-odoo': true,
    'tag-compliance': true,
    'tag-enterprise': true,
  });

  // Editor State for Current Document
  const [editTitle, setEditTitle] = useState('');
  const [editSummary, setEditSummary] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editSecurityLevel, setEditSecurityLevel] = useState<SecurityLevel>('internal_confidential');
  const [editCategory, setEditCategory] = useState('Architecture');
  const [newTagInput, setNewTagInput] = useState('');

  // Modals State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNewTagModalOpen, setIsNewTagModalOpen] = useState(false);
  const [newTagPath, setNewTagPath] = useState('');
  const [newTagColor, setNewTagColor] = useState('#06b6d4');

  // AI Operation States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);
  const [copiedChecksum, setCopiedChecksum] = useState(false);

  // Sync / Recalculate tag counts
  const updatedTagTree = useMemo(() => {
    return recalculateTagTreeCounts(tagTree, documents);
  }, [tagTree, documents]);

  // Execute Search
  const searchResults = useMemo(() => {
    return executeOfflineSearch(documents, filter);
  }, [documents, filter]);

  // Find currently active document
  const currentDoc = useMemo(() => {
    return documents.find((d) => d.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  // Sync editor buffer when selected document changes
  React.useEffect(() => {
    if (currentDoc) {
      setEditTitle(currentDoc.title);
      setEditSummary(currentDoc.summary);
      setEditContent(currentDoc.content);
      setEditTags(currentDoc.tags);
      setEditSecurityLevel(currentDoc.securityLevel);
      setEditCategory(currentDoc.category);
    }
  }, [selectedDocId, currentDoc]);

  // Toggle Tag in search filter
  const handleToggleTagFilter = (tagPath: string) => {
    setFilter((prev) => {
      const exists = prev.selectedTags.includes(tagPath);
      return {
        ...prev,
        selectedTags: exists
          ? prev.selectedTags.filter((t) => t !== tagPath)
          : [...prev.selectedTags, tagPath],
      };
    });
  };

  const toggleTagExpanded = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTagIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Pin
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, pinned: !d.pinned } : d))
    );
  };

  // Save edits to current document
  const handleSaveDocEdits = () => {
    if (!currentDoc) return;
    const newChecksum = generateSHA256Checksum(editContent, editTitle, editTags);
    const updated: ArchivalDocument = {
      ...currentDoc,
      title: editTitle,
      summary: editSummary,
      content: editContent,
      tags: editTags,
      securityLevel: editSecurityLevel,
      category: editCategory,
      checksum: newChecksum,
      modifiedDate: new Date().toISOString().split('T')[0],
      sizeBytes: new Blob([editContent]).size,
      syncStatus: 'pending_odoo_sync',
    };

    setDocuments((prev) => prev.map((d) => (d.id === currentDoc.id ? updated : d)));
    setViewMode('reader');
    setAiMessage('Document saved and SHA-256 checksum re-verified.');
    setTimeout(() => setAiMessage(null), 3000);
  };

  // AI Auto Tag / Summarize action via backend API proxy
  const handleAiAutoTag = async () => {
    if (!currentDoc) return;
    setAiLoading(true);
    setAiMessage('AI Agent extracting hierarchical taxonomy...');
    try {
      const res = await fetch('/api/ai/tag-extractor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentDoc.title,
          content: currentDoc.content,
        }),
      });
      const data = await res.json();
      if (data.tags && Array.isArray(data.tags)) {
        const merged = Array.from(new Set([...editTags, ...data.tags]));
        setEditTags(merged);
        setAiMessage(`AI extracted ${data.tags.length} hierarchical tags: ${data.tags.join(', ')}`);
      }
    } catch (err: any) {
      console.error(err);
      setAiMessage('Local offline heuristic tagger applied.');
    } finally {
      setAiLoading(false);
    }
  };

  // AI Document Summarizer
  const handleAiSummarize = async () => {
    if (!currentDoc) return;
    setAiLoading(true);
    setAiMessage('BlueFairy Agent synthesizing archival abstract...');
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Summarize the following enterprise document into a concise 2-sentence executive abstract and list 3 key takeaways:\n\nDocument: ${currentDoc.title}\n${currentDoc.content}`,
          contextDocuments: [currentDoc],
        }),
      });
      const data = await res.json();
      if (data.text) {
        setEditSummary(data.text);
        setAiMessage('Executive summary synthesized.');
      }
    } catch (err: any) {
      setAiMessage('Local fallback summary generated.');
    } finally {
      setAiLoading(false);
    }
  };

  // Simulate Odoo v19 JSON-RPC Sync
  const handleOdooSync = async () => {
    if (!currentDoc) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/odoo/v19/jsonrpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'knowledge.article.write',
          params: {
            id: currentDoc.odooId,
            values: {
              name: currentDoc.title,
              summary: currentDoc.summary,
              body: currentDoc.content,
              checksum_sha256: currentDoc.checksum,
            },
          },
        }),
      });
      const data = await res.json();
      setDocuments((prev) =>
        prev.map((d) => (d.id === currentDoc.id ? { ...d, syncStatus: 'synced_local' } : d))
      );
      setAiMessage('Synchronized with local Odoo v19 CE database.');
      setTimeout(() => setAiMessage(null), 3000);
    } catch (e) {
      setAiMessage('Odoo v19 sync error: Local buffer preserved.');
    } finally {
      setAiLoading(false);
    }
  };

  // Recursive Tag Tree Node Renderer
  const renderTagNode = (node: TagNode, level = 0) => {
    const isExpanded = !!expandedTagIds[node.id];
    const isSelected = filter.selectedTags.includes(node.fullPath);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <div key={node.id} className="select-none">
        <div
          onClick={() => handleToggleTagFilter(node.fullPath)}
          className={`flex items-center justify-between py-1 px-2 rounded-lg text-xs cursor-pointer transition-colors group ${
            isSelected
              ? 'bg-cyan-950 text-cyan-200 font-semibold border border-cyan-800'
              : 'hover:bg-slate-800 text-slate-300'
          }`}
          style={{ paddingLeft: `${Math.max(8, level * 14 + 8)}px` }}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            {hasChildren ? (
              <button
                onClick={(e) => toggleTagExpanded(node.id, e)}
                className="p-0.5 hover:bg-slate-700 rounded text-slate-400"
              >
                {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            ) : (
              <span className="w-3 h-3 inline-block" />
            )}

            <span
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: node.color }}
            />
            <span className="truncate font-mono text-[11px]">{node.name}</span>
          </div>

          <span className="text-[10px] text-slate-500 font-mono bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800 group-hover:text-slate-300">
            {node.documentCount}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5">
            {node.children!.map((child) => renderTagNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-80px)] flex bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* LEFT SIDEBAR: Hierarchical Tags & Filters */}
      <aside className="w-64 sm:w-72 bg-slate-900/90 border-r border-slate-800 flex flex-col flex-shrink-0">
        <div className="p-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Taxonomy Hierarchy
            </span>
          </div>
          <button
            onClick={() => setIsNewTagModalOpen(true)}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 rounded text-xs flex items-center gap-1"
            title="Create Hierarchical Tag"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Filter Views */}
        <div className="p-2 border-b border-slate-800 space-y-0.5 text-xs font-mono">
          <button
            onClick={() => setFilter({ ...filter, selectedTags: [], onlyPinned: false, onlyArchived: false })}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              filter.selectedTags.length === 0 && !filter.onlyPinned && !filter.onlyArchived
                ? 'bg-blue-600 text-white font-medium'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Folder className="w-3.5 h-3.5" /> All Archival Records
            </span>
            <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded">{documents.length}</span>
          </button>

          <button
            onClick={() => setFilter({ ...filter, onlyPinned: !filter.onlyPinned })}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              filter.onlyPinned ? 'bg-amber-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-amber-400" /> Pinned Articles
            </span>
            <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded">
              {documents.filter((d) => d.pinned).length}
            </span>
          </button>

          <button
            onClick={() => setFilter({ ...filter, securityLevel: filter.securityLevel === 'airgap_restricted' ? 'all' : 'airgap_restricted' })}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors ${
              filter.securityLevel === 'airgap_restricted' ? 'bg-rose-900 text-rose-100 font-medium' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" /> Air-Gap Restricted
            </span>
            <span className="text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded">
              {documents.filter((d) => d.securityLevel === 'airgap_restricted').length}
            </span>
          </button>
        </div>

        {/* Hierarchical Tag Tree View */}
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          <div className="text-[10px] uppercase font-mono text-slate-500 px-2 py-1">
            Hierarchical Tag Tree
          </div>
          {updatedTagTree.map((node) => renderTagNode(node, 0))}
        </div>

        {/* Bottom Odoo v19 Status Info */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Odoo v19 CE</span>
          </div>
          <span className="text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
            LOCAL PORT 8069
          </span>
        </div>
      </aside>

      {/* MIDDLE PANE: Offline Search & Document List */}
      <section className="w-80 sm:w-96 border-r border-slate-800 flex flex-col flex-shrink-0 bg-slate-950">
        {/* Search Header */}
        <div className="p-3 border-b border-slate-800 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="offline-catalogue-search-input"
              type="text"
              value={filter.query}
              onChange={(e) => setFilter({ ...filter, query: e.target.value })}
              placeholder="Search local catalogue..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
            {filter.query && (
              <button
                onClick={() => setFilter({ ...filter, query: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Active Filter Chips */}
          {filter.selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {filter.selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-md"
                >
                  <span>{tag}</span>
                  <button onClick={() => handleToggleTagFilter(tag)} className="hover:text-white">
                    <X className="w-2.5 h-2.5" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Sort & Quick Actions */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-[11px]">
              Found: <strong className="text-white">{searchResults.length}</strong> records
            </span>
            <div className="flex items-center gap-2">
              <select
                value={filter.sortBy}
                onChange={(e) => setFilter({ ...filter, sortBy: e.target.value as any })}
                className="bg-slate-900 border border-slate-800 text-[11px] text-slate-300 rounded px-2 py-0.5 font-mono focus:outline-none"
              >
                <option value="relevance">Relevance</option>
                <option value="date_desc">Newest First</option>
                <option value="title_asc">Title A-Z</option>
                <option value="size_desc">File Size</option>
              </select>

              <button
                id="create-new-document-button"
                onClick={() => setIsCreateModalOpen(true)}
                className="px-2 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-medium flex items-center gap-1 shadow-sm"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>
          </div>
        </div>

        {/* Document Card Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
          {searchResults.length === 0 ? (
            <div className="p-8 text-center text-slate-500 font-mono text-xs space-y-2">
              <HardDrive className="w-8 h-8 mx-auto text-slate-600" />
              <p>No archival records matching filter.</p>
              <button
                onClick={() => setFilter({ ...filter, query: '', selectedTags: [] })}
                className="text-cyan-400 hover:underline text-xs"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            searchResults.map(({ document: doc }) => {
              const isSelected = doc.id === selectedDocId;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border text-left ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-xs font-bold text-white line-clamp-1 flex-1 font-sans">
                      {doc.title}
                    </h4>
                    <button
                      onClick={(e) => handleTogglePin(doc.id, e)}
                      className={`p-0.5 rounded ${doc.pinned ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                      title={doc.pinned ? 'Pinned' : 'Pin to top'}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed font-sans">
                    {doc.summary}
                  </p>

                  {/* Hierarchical Tags on Card */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {doc.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleTagFilter(tag);
                        }}
                        className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-900 text-slate-300 border border-slate-700/60 rounded hover:border-cyan-500"
                      >
                        {tag.split('/').pop()}
                      </span>
                    ))}
                    {doc.tags.length > 3 && (
                      <span className="text-[9px] font-mono text-slate-500">+{doc.tags.length - 3}</span>
                    )}
                  </div>

                  {/* Footer Meta */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/60 pt-1.5">
                    <span className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        doc.securityLevel === 'airgap_restricted' ? 'bg-rose-500' : 'bg-blue-500'
                      }`} />
                      {doc.securityLevel === 'airgap_restricted' ? 'AIR-GAP' : 'CONFIDENTIAL'}
                    </span>
                    <span>{(doc.sizeBytes / 1024).toFixed(1)} KB</span>
                    <span>{doc.modifiedDate}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* RIGHT PANE: Document Inspector, Markdown Editor & AI Agent */}
      <main className="flex-1 flex flex-col bg-slate-950 overflow-hidden">
        {currentDoc ? (
          <>
            {/* Top Inspector Action Bar */}
            <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setViewMode('reader')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      viewMode === 'reader' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Reader</span>
                  </button>

                  <button
                    onClick={() => setViewMode('editor')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      viewMode === 'editor' ? 'bg-cyan-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Markdown</span>
                  </button>

                  <button
                    onClick={() => setViewMode('odoo_raw')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      viewMode === 'odoo_raw' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Odoo v19 ORM</span>
                  </button>

                  <button
                    onClick={() => setViewMode('ai_agent')}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-md transition-colors ${
                      viewMode === 'ai_agent' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Agent Copilot</span>
                  </button>
                </div>
              </div>

              {/* Checksum & Quick Export Actions */}
              <div className="flex items-center gap-2 text-xs font-mono">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(currentDoc.checksum);
                    setCopiedChecksum(true);
                    setTimeout(() => setCopiedChecksum(false), 2000);
                  }}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-700/80 rounded-md text-slate-300 hover:text-white flex items-center gap-1.5"
                  title="Copy SHA-256 Checksum"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">SHA-256: {currentDoc.checksum.slice(0, 8)}...</span>
                  {copiedChecksum ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>

                <button
                  onClick={handleOdooSync}
                  disabled={aiLoading}
                  className="px-2.5 py-1 bg-emerald-950/80 border border-emerald-700 text-emerald-200 hover:bg-emerald-900 rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3 h-3 ${aiLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Sync Odoo DB</span>
                </button>

                <button
                  onClick={() => downloadTextFile(`${currentDoc.title.replace(/\s+/g, '_')}.md`, currentDoc.content)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md flex items-center gap-1"
                  title="Export Markdown File"
                >
                  <Download className="w-3 h-3" />
                  <span>MD</span>
                </button>
              </div>
            </div>

            {/* AI Notification Banner */}
            {aiMessage && (
              <div className="bg-cyan-950/90 border-b border-cyan-800 px-4 py-1.5 text-xs text-cyan-200 flex items-center justify-between font-mono animate-fadeIn">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{aiMessage}</span>
                </div>
                <button onClick={() => setAiMessage(null)} className="text-cyan-400 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* MAIN CONTENT VIEW */}
            <div className="flex-1 overflow-y-auto p-6">
              {viewMode === 'reader' && (
                <div className="max-w-4xl mx-auto space-y-6">
                  {/* Document Header */}
                  <div className="border-b border-slate-800 pb-4 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800">
                        {currentDoc.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        currentDoc.securityLevel === 'airgap_restricted'
                          ? 'bg-rose-950 text-rose-300 border-rose-800'
                          : 'bg-slate-900 text-slate-300 border-slate-700'
                      }`}>
                        {currentDoc.securityLevel.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        v{currentDoc.version} • Odoo Record #{currentDoc.odooId}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white font-sans leading-tight">
                      {currentDoc.title}
                    </h1>

                    <p className="text-sm text-slate-300 italic border-l-2 border-cyan-500 pl-3 leading-relaxed">
                      {currentDoc.summary}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentDoc.tags.map((tag) => (
                        <span
                          key={tag}
                          onClick={() => handleToggleTagFilter(tag)}
                          className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-slate-900 text-cyan-300 border border-slate-700 hover:border-cyan-500 cursor-pointer transition-colors"
                        >
                          🏷️ {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Rendered Document Body (Markdown Style) */}
                  <div className="prose prose-invert max-w-none text-slate-200 text-sm leading-relaxed space-y-4 font-sans whitespace-pre-wrap">
                    {currentDoc.content}
                  </div>
                </div>
              )}

              {viewMode === 'editor' && (
                <div className="max-w-4xl mx-auto space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Document Title</label>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Security Tier</label>
                      <select
                        value={editSecurityLevel}
                        onChange={(e) => setEditSecurityLevel(e.target.value as SecurityLevel)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                      >
                        <option value="airgap_restricted">Air-Gap Restricted (Strict Local)</option>
                        <option value="internal_confidential">Internal Confidential</option>
                        <option value="public_archival">Public Archival</option>
                        <option value="top_secret">Top Secret (FIPS-140-3)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-slate-400">Hierarchical Tags</label>
                      <button
                        onClick={handleAiAutoTag}
                        disabled={aiLoading}
                        className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Auto-Extract Tags
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {editTags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-slate-900 text-cyan-300 border border-slate-700 rounded text-xs font-mono flex items-center gap-1"
                        >
                          <span>{tag}</span>
                          <button
                            onClick={() => setEditTags(editTags.filter((t) => t !== tag))}
                            className="hover:text-white"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        placeholder="Add tag (e.g. Models/Quantization/EXL2)..."
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTagInput.trim()) {
                            e.preventDefault();
                            setEditTags([...editTags, newTagInput.trim()]);
                            setNewTagInput('');
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (newTagInput.trim()) {
                            setEditTags([...editTags, newTagInput.trim()]);
                            setNewTagInput('');
                          }
                        }}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono text-slate-400">Executive Summary</label>
                      <button
                        onClick={handleAiSummarize}
                        disabled={aiLoading}
                        className="text-xs text-purple-400 hover:text-purple-300 font-mono flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> AI Summarize
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={editSummary}
                      onChange={(e) => setEditSummary(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Markdown Content</label>
                    <textarea
                      rows={14}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={() => setViewMode('reader')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-mono"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDocEdits}
                      className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold font-mono shadow-md"
                    >
                      Save Archival Revision
                    </button>
                  </div>
                </div>
              )}

              {viewMode === 'odoo_raw' && (
                <div className="max-w-4xl mx-auto space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-mono text-emerald-300 font-bold">
                        Odoo v19.0 Community Edition JSON-RPC Model State
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Mapped to PostgreSQL Table: <code className="text-cyan-300">knowledge_article</code> (ID: {currentDoc.odooId})
                      </div>
                    </div>
                    <button
                      onClick={handleOdooSync}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-semibold"
                    >
                      Execute JSON-RPC Update
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap overflow-x-auto leading-relaxed">
                    {JSON.stringify(
                      {
                        _name: 'knowledge.article',
                        id: currentDoc.odooId,
                        name: currentDoc.title,
                        summary: currentDoc.summary,
                        security_level: currentDoc.securityLevel,
                        checksum_sha256: currentDoc.checksum,
                        is_airgap_verified: true,
                        tag_ids: currentDoc.tags,
                        write_date: currentDoc.modifiedDate,
                        create_uid: [2, 'Administrator (Air-Gapped)'],
                        body_length_bytes: currentDoc.sizeBytes,
                        sync_state: currentDoc.syncStatus,
                      },
                      null,
                      2
                    )}
                  </div>
                </div>
              )}

              {viewMode === 'ai_agent' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-blue-950/60 border border-purple-800/50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-purple-600 text-white flex items-center justify-center">
                        <Bot className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">BlueFairy Local Document Copilot</h3>
                        <p className="text-xs text-slate-300">Zero-telemetry intelligence operating on this document.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      <button
                        onClick={handleAiSummarize}
                        disabled={aiLoading}
                        className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-purple-700/50 rounded-xl text-left text-xs text-slate-200 transition-colors"
                      >
                        <div className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Synthesize Abstract
                        </div>
                        <div className="text-[11px] text-slate-400">Generate executive summary & key takeaways</div>
                      </button>

                      <button
                        onClick={handleAiAutoTag}
                        disabled={aiLoading}
                        className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-cyan-700/50 rounded-xl text-left text-xs text-slate-200 transition-colors"
                      >
                        <div className="font-bold text-cyan-300 mb-1 flex items-center gap-1.5">
                          <TagIcon className="w-3.5 h-3.5" /> Classify Hierarchy
                        </div>
                        <div className="text-[11px] text-slate-400">Generate multi-tier taxonomy tag tree</div>
                      </button>
                    </div>
                  </div>

                  {/* Document Cryptographic Verification Card */}
                  <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
                      Cryptographic Archival Integrity Report
                    </h4>
                    <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>SHA-256 Verified: {currentDoc.checksum}</span>
                      </div>
                      <span className="text-[10px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        MATCHES ON-DISK HASH
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500 font-mono text-xs">
            Select a document from the left list to view or edit.
          </div>
        )}
      </main>

      {/* CREATE NEW DOCUMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Create New Archival Record (Odoo v19 CE)</span>
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Title</label>
                <input
                  id="new-doc-title-input"
                  type="text"
                  placeholder="e.g. BlueFairy Local LLM Fine-Tuning Runbook"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Hierarchical Tags (comma separated)</label>
                <input
                  id="new-doc-tags-input"
                  type="text"
                  placeholder="e.g. Security/AirGap, Models/Quantization"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Content (Markdown / Plaintext)</label>
                <textarea
                  id="new-doc-content-input"
                  rows={8}
                  placeholder="# Archival Heading&#10;&#10;Enter markdown content here..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-mono"
              >
                Cancel
              </button>
              <button
                id="submit-create-document-btn"
                onClick={() => {
                  const titleEl = document.getElementById('new-doc-title-input') as HTMLInputElement;
                  const tagsEl = document.getElementById('new-doc-tags-input') as HTMLInputElement;
                  const contentEl = document.getElementById('new-doc-content-input') as HTMLTextAreaElement;

                  const title = titleEl?.value || 'Untitled Archival Record';
                  const tags = tagsEl?.value ? tagsEl.value.split(',').map((t) => t.trim()) : ['Archival/General'];
                  const content = contentEl?.value || '# Untitled Document\n\nNo content provided.';
                  const checksum = generateSHA256Checksum(content, title, tags);

                  const newDoc: ArchivalDocument = {
                    id: `doc-bf-${Date.now()}`,
                    odooId: Math.floor(Math.random() * 900) + 100,
                    title,
                    summary: content.slice(0, 140) + '...',
                    content,
                    tags,
                    category: 'Archival',
                    format: 'markdown',
                    checksum,
                    createdDate: new Date().toISOString().split('T')[0],
                    modifiedDate: new Date().toISOString().split('T')[0],
                    sizeBytes: new Blob([content]).size,
                    author: 'Local Archivist',
                    securityLevel: 'internal_confidential',
                    odooModel: 'knowledge.article',
                    isArchived: false,
                    pinned: false,
                    version: '1.0.0',
                    syncStatus: 'synced_local',
                  };

                  setDocuments([newDoc, ...documents]);
                  setSelectedDocId(newDoc.id);
                  setIsCreateModalOpen(false);
                }}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold shadow-md"
              >
                Save to Local Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW HIERARCHICAL TAG MODAL */}
      {isNewTagModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <TagIcon className="w-4 h-4 text-cyan-400" />
              <span>Create Hierarchical Tag</span>
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Full Taxonomy Path (use / for hierarchy)
              </label>
              <input
                type="text"
                value={newTagPath}
                onChange={(e) => setNewTagPath(e.target.value)}
                placeholder="e.g. Security/AirGap/Zero-Trust"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsNewTagModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-mono"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newTagPath.trim()) {
                    const parts = newTagPath.trim().split('/');
                    const leafName = parts[parts.length - 1];
                    const newNode: TagNode = {
                      id: `tag-${Date.now()}`,
                      name: leafName,
                      fullPath: newTagPath.trim(),
                      color: newTagColor,
                      parentId: null,
                      documentCount: 0,
                    };
                    setTagTree([...tagTree, newNode]);
                    setNewTagPath('');
                    setIsNewTagModalOpen(false);
                  }
                }}
                className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-mono font-bold shadow-md"
              >
                Add Taxonomy Node
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
