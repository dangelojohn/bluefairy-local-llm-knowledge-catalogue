import React, { useState } from 'react';
import { 
  Database, 
  Layers, 
  Code, 
  Play, 
  Copy, 
  Check, 
  Table, 
  ShieldCheck, 
  DownloadCloud, 
  Sparkles,
  Server,
  FileCode,
  Terminal
} from 'lucide-react';
import { ODOO_V19_SCHEMAS } from '../data/mockData';
import { generateOdooV19ModuleFiles, downloadTextFile } from '../utils/odooBridge';
import { ArchivalDocument } from '../types';

interface OdooSchemaViewerProps {
  documents: ArchivalDocument[];
}

export const OdooSchemaViewer: React.FC<OdooSchemaViewerProps> = ({ documents }) => {
  const [selectedSchema, setSelectedSchema] = useState(ODOO_V19_SCHEMAS[0]);
  const [selectedTab, setSelectedTab] = useState<'fields' | 'python_model' | 'jsonrpc_test' | 'views_xml'>('fields');
  const [copiedFile, setCopiedFile] = useState<string | null>(null);

  // JSON-RPC Live Tester State
  const [rpcMethod, setRpcMethod] = useState('knowledge.article.search_read');
  const [rpcDomain, setRpcDomain] = useState('[["security_level", "=", "airgap_restricted"]]');
  const [rpcResponse, setRpcResponse] = useState<any>(null);
  const [rpcLoading, setRpcLoading] = useState(false);

  const moduleFiles = generateOdooV19ModuleFiles(documents);

  const handleCopyCode = (filename: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(filename);
    setTimeout(() => setCopiedFile(null), 2000);
  };

  const handleRunRpc = async () => {
    setRpcLoading(true);
    try {
      let parsedDomain = [];
      try {
        parsedDomain = JSON.parse(rpcDomain);
      } catch (e) {
        parsedDomain = [];
      }

      const res = await fetch('/api/odoo/v19/jsonrpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'call',
          params: {
            service: 'object',
            method: 'execute_kw',
            args: ['bluefairy_local_vault', 2, 'admin_token', selectedSchema.technicalName, 'search_read', [parsedDomain]],
          },
        }),
      });
      const data = await res.json();
      setRpcResponse(data);
    } catch (e: any) {
      setRpcResponse({ error: e.message });
    } finally {
      setRpcLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto bg-slate-950 text-slate-100 p-6 space-y-6 font-sans">
      {/* Header */}
      <div className="max-w-6xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-mono text-emerald-300">
          <Database className="w-3.5 h-3.5" />
          <span>Odoo v19.0 Community Edition (CE) Database Architecture</span>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Relational ORM Models & JSON-RPC 2.0 Bridge
        </h1>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
          The BlueFairy desktop archival engine maintains 1:1 database parity with Odoo v19 CE tables, storing metadata, tags, and SHA-256 cryptographically sealed blobs.
        </p>
      </div>

      {/* Main Architecture Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Model Selector */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-xs font-mono text-slate-400 uppercase px-1">
            Registered Odoo v19 Models
          </div>
          {ODOO_V19_SCHEMAS.map((schema) => {
            const isSelected = schema.technicalName === selectedSchema.technicalName;
            return (
              <div
                key={schema.technicalName}
                onClick={() => setSelectedSchema(schema)}
                className={`p-3.5 rounded-xl cursor-pointer transition-all border text-left ${
                  isSelected
                    ? 'bg-emerald-950/80 border-emerald-500 shadow-md shadow-emerald-950/40 text-white'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                }`}
              >
                <div className="font-mono text-xs font-bold text-emerald-400 mb-0.5">
                  {schema.technicalName}
                </div>
                <div className="text-xs font-medium line-clamp-1">{schema.readableName}</div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-2">
                  <span>Table: {schema.table}</span>
                  <span>{schema.fields.length} fields</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Model Details & Code Inspectors */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          {/* Top Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setSelectedTab('fields')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedTab === 'fields' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Field Dictionary</span>
              </button>

              <button
                onClick={() => setSelectedTab('python_model')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedTab === 'python_model' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>Python Model Code</span>
              </button>

              <button
                onClick={() => setSelectedTab('views_xml')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedTab === 'views_xml' ? 'bg-purple-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Odoo View XML</span>
              </button>

              <button
                onClick={() => setSelectedTab('jsonrpc_test')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  selectedTab === 'jsonrpc_test' ? 'bg-amber-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>JSON-RPC Tester</span>
              </button>
            </div>

            <div className="text-xs font-mono text-slate-400">
              PostgreSQL Schema: <code className="text-cyan-400">{selectedSchema.table}</code>
            </div>
          </div>

          {/* TAB 1: FIELD DICTIONARY */}
          {selectedTab === 'fields' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Field Name</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Required</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Relation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {selectedSchema.fields.map((field) => (
                      <tr key={field.name} className="hover:bg-slate-950/40">
                        <td className="p-3 font-bold text-emerald-400">{field.name}</td>
                        <td className="p-3 text-cyan-300">{field.type}</td>
                        <td className="p-3">
                          {field.required ? (
                            <span className="text-rose-400 font-bold">YES</span>
                          ) : (
                            <span className="text-slate-500">NO</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-300 font-sans">{field.description}</td>
                        <td className="p-3 text-indigo-300">{field.relation || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PYTHON MODEL CODE */}
          {selectedTab === 'python_model' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>File: models/knowledge_article.py</span>
                <button
                  onClick={() => handleCopyCode('models/knowledge_article.py', moduleFiles['models/knowledge_article.py'])}
                  className="text-cyan-400 hover:text-white flex items-center gap-1"
                >
                  {copiedFile === 'models/knowledge_article.py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy Python Model</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
                {moduleFiles['models/knowledge_article.py']}
              </pre>
            </div>
          )}

          {/* TAB 3: ODOO VIEWS XML */}
          {selectedTab === 'views_xml' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>File: views/knowledge_article_views.xml</span>
                <button
                  onClick={() => handleCopyCode('views/knowledge_article_views.xml', moduleFiles['views/knowledge_article_views.xml'])}
                  className="text-cyan-400 hover:text-white flex items-center gap-1"
                >
                  {copiedFile === 'views/knowledge_article_views.xml' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy XML Views</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300 overflow-x-auto leading-relaxed">
                {moduleFiles['views/knowledge_article_views.xml']}
              </pre>
            </div>
          )}

          {/* TAB 4: JSON-RPC LIVE TESTER */}
          {selectedTab === 'jsonrpc_test' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-mono text-slate-300 font-bold">
                  Simulate Odoo v19 CE JSON-RPC 2.0 Request
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Method</label>
                    <input
                      type="text"
                      value={rpcMethod}
                      onChange={(e) => setRpcMethod(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Search Domain Filter</label>
                    <input
                      type="text"
                      value={rpcDomain}
                      onChange={(e) => setRpcDomain(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRunRpc}
                  disabled={rpcLoading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5"
                >
                  <Play className="w-3 h-3" />
                  <span>Send JSON-RPC Dispatch</span>
                </button>
              </div>

              {rpcResponse && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                  {JSON.stringify(rpcResponse, null, 2)}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
