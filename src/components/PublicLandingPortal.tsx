import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Lock, 
  Server, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Zap, 
  Bot, 
  ExternalLink, 
  FileText, 
  Terminal, 
  Calculator, 
  Award,
  Send,
  Building,
  TrendingUp,
  HardDrive
} from 'lucide-react';
import { LOCAL_LLM_FLEET, ENTERPRISE_AD_UNITS } from '../data/mockData';
import { EnterpriseLead } from '../types';

interface PublicLandingPortalProps {
  onOpenCatalogue: () => void;
  onSelectModel: (modelId: string) => void;
}

export const PublicLandingPortal: React.FC<PublicLandingPortalProps> = ({
  onOpenCatalogue,
  onSelectModel,
}) => {
  // Interactive ROI Calculator State
  const [monthlyTokensMillions, setMonthlyTokensMillions] = useState<number>(50);
  const [enterpriseNodes, setEnterpriseNodes] = useState<number>(4);
  const [selectedAgentDomain, setSelectedAgentDomain] = useState<'odoo' | 'legal' | 'finance' | 'code'>('odoo');

  // Enterprise Lead Form State
  const [leadForm, setLeadForm] = useState({
    company: '',
    email: '',
    nodesCount: 4,
    useCase: 'Odoo v19 ERP & Archival Intelligence',
  });
  const [submittedLead, setSubmittedLead] = useState<boolean>(false);

  // Live Agent Simulation State
  const [agentInput, setAgentInput] = useState('Verify PO #8892 in Odoo v19 and check supplier compliance against local HIPAA archive.');
  const [agentOutput, setAgentOutput] = useState<string | null>(null);
  const [agentProcessing, setAgentProcessing] = useState(false);

  // Cost calculations
  const cloudMonthlyCost = (monthlyTokensMillions * 1000000 / 1000) * 0.03; // Typical cloud model cost
  const bluefairyAnnualSavings = cloudMonthlyCost * 12 - (enterpriseNodes * 2500);

  const handleSimulateAgent = () => {
    setAgentProcessing(true);
    setTimeout(() => {
      setAgentOutput(`[BlueFairy-14B-Agentic @ 127.0.0.1:8069]
✓ Executed local Odoo v19 JSON-RPC call: purchase.order.search_read(id=8892)
✓ Scanned local SQLite Archival Catalogue (Doc #doc-bf-005: HIPAA & BAA Protocol)
✓ Result: PO #8892 matches Vendor #V-409 (Valid BAA on-file in local vault).
✓ Network Telemetry: 0 outbound packets. All weights executed in local GPU VRAM.`);
      setAgentProcessing(false);
    }, 650);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.company || !leadForm.email) return;
    setSubmittedLead(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Notification / Ad Notice Bar */}
      <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border-b border-blue-800/40 px-4 py-2 text-center text-xs text-blue-200 flex items-center justify-center gap-2">
        <span className="bg-blue-500/20 text-blue-300 font-mono text-[10px] px-2 py-0.5 rounded-full border border-blue-400/30">
          ENTERPRISE RELEASE 2026
        </span>
        <span>
          BlueFairy.ca is now certified for <strong>Zero-Telemetry Air-Gapped Odoo v19 CE & ERP Deployments</strong>.
        </span>
        <button 
          onClick={onOpenCatalogue}
          className="text-cyan-400 hover:text-cyan-300 underline font-semibold flex items-center gap-1 ml-1"
        >
          Explore Archival Vault <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center space-y-5 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% On-Premise Sovereign Intelligence • FIPS-140-3 Sealed</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Local AI Models Engineered for <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Private & Secure Enterprise Data
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed font-light">
              <strong className="text-white font-semibold">BlueFairy.ca</strong> builds proprietary, high-throughput Local LLMs and deterministic AI Agents tailored to integrate directly into your corporate ERP, Odoo v19 CE databases, and air-gapped archival vaults.
            </p>

            {/* CTA Buttons */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
              <button
                id="hero-launch-catalogue-btn"
                onClick={onOpenCatalogue}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <Database className="w-4 h-4" />
                <span>Launch Local Knowledge Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#enterprise-calculator"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold flex items-center gap-2 transition-colors"
              >
                <Calculator className="w-4 h-4 text-amber-400" />
                <span>Calculate On-Premise ROI</span>
              </a>

              <a
                href="#enterprise-quote-section"
                className="px-5 py-3.5 rounded-xl bg-indigo-950/70 hover:bg-indigo-900/90 text-indigo-200 border border-indigo-700/60 font-semibold flex items-center gap-2 transition-colors"
              >
                <Building className="w-4 h-4 text-indigo-400" />
                <span>Request Enterprise SLA</span>
              </a>
            </div>

            {/* Key Trust Badges */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-cyan-400 font-mono text-xs mb-0.5">TELEMETRY</div>
                <div className="text-white font-semibold text-sm">0 Outbound Hops</div>
                <div className="text-slate-400 text-xs">Air-gapped localhost loop</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-emerald-400 font-mono text-xs mb-0.5">BACKEND</div>
                <div className="text-white font-semibold text-sm">Odoo v19 CE Native</div>
                <div className="text-slate-400 text-xs">JSON-RPC & ORM Sync</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-amber-400 font-mono text-xs mb-0.5">FRAMEWORK</div>
                <div className="text-white font-semibold text-sm">Electron Cross-Platform</div>
                <div className="text-slate-400 text-xs">macOS, Linux & Windows</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
                <div className="text-purple-400 font-mono text-xs mb-0.5">COMPLIANCE</div>
                <div className="text-white font-semibold text-sm">HIPAA & SOC2 Ready</div>
                <div className="text-slate-400 text-xs">FIPS-140-3 Cryptography</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Ad & Sponsored Partner Showcase (Monetization Engine) */}
      <section className="py-8 bg-slate-900/40 border-b border-slate-800 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-700/50">
                High-CPM Sponsored Grid
              </span>
              <span className="text-xs text-slate-400">
                BlueFairy.ca Enterprise Technology Partners & Hardware Ecosystem
              </span>
            </div>
            <span className="text-xs font-mono text-slate-500">Ad Traffic Monetization v2.4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ENTERPRISE_AD_UNITS.map((ad) => (
              <div
                key={ad.id}
                className={`p-4 rounded-xl bg-gradient-to-br ${ad.bannerBg} border border-slate-700/80 hover:border-cyan-500/60 transition-all group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-2 font-mono">
                    <span className="text-cyan-300 font-semibold">{ad.sponsor}</span>
                    <span className="text-slate-400 text-[10px] bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-700">
                      {ad.badge}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-sm group-hover:text-cyan-200 transition-colors mb-1.5 leading-snug">
                    {ad.title}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {ad.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-mono">{ad.category}</span>
                  <a
                    href={ad.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-cyan-400 font-semibold group-hover:underline text-xs"
                  >
                    <span>Deploy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Enterprise AI Capabilities */}
      <section className="py-16 px-4 max-w-6xl mx-auto border-b border-slate-800">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            Seamless Infrastructure Integration
          </h2>
          <h3 className="text-3xl font-bold text-white">
            Custom AI Agents for Existing Enterprise Stacks
          </h3>
          <p className="text-slate-300 text-sm mt-3">
            BlueFairy models do not require rebuilding your backend. They connect to your existing Odoo v19 CE ERP, PostgreSQL databases, and document file systems as autonomous, zero-trust workers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center mb-4 border border-blue-800/40">
              <Bot className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Deterministic Business Agents</h4>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              Fine-tuned on structured enterprise JSON schemas, SQL dialect constraints, and role-based workflows to guarantee hallucination-free outputs.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated Purchase Order Matching</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Sensitive PII/PHI Redaction</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Local CRM Ticket Triage</li>
            </ul>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-800/40">
              <Database className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Odoo v19 CE Native Memory</h4>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              Direct mapping between local Electron catalogue articles and Odoo v19 CE <code className="text-cyan-300 font-mono">knowledge.article</code> and <code className="text-cyan-300 font-mono">ir.attachment</code>.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> JSON-RPC 2.0 Local Bridge</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Automated Model Migrations</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Granular Access Control Rules</li>
            </ul>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center mb-4 border border-purple-800/40">
              <HardDrive className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-bold text-white mb-2">Air-Gapped Archival Vault</h4>
            <p className="text-slate-300 text-xs leading-relaxed mb-4">
              Cryptographic SHA-256 verification and hierarchical tag trees keep your historical corporate memory instantly searchable without cloud dependencies.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Instant Offline BM25 Search</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-Tier Tag Taxonomy</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Standalone Electron Bundler</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Live Agent Interactive Playground */}
      <section className="py-16 px-4 max-w-6xl mx-auto border-b border-slate-800">
        <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                Interactive Agent Sandbox
              </span>
              <h3 className="text-2xl font-bold text-white mt-1">
                Test BlueFairy's Local Business Agent
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Model: BlueFairy-14B-Agentic
              </span>
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                Air-Gap: ENFORCED
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-mono text-slate-400">
              Enter Enterprise Prompt / Action Command:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="agent-sandbox-prompt-input"
                type="text"
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                placeholder="e.g. Ingest new compliance memo and generate Odoo v19 tag hierarchy..."
              />
              <button
                id="agent-sandbox-execute-btn"
                onClick={handleSimulateAgent}
                disabled={agentProcessing}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors font-mono"
              >
                {agentProcessing ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Inference Running...</span>
                  </>
                ) : (
                  <>
                    <Terminal className="w-4 h-4" />
                    <span>Run Local Agent</span>
                  </>
                )}
              </button>
            </div>

            {agentOutput && (
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 whitespace-pre-wrap leading-relaxed shadow-inner">
                {agentOutput}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Enterprise ROI & Token Savings Calculator */}
      <section id="enterprise-calculator" className="py-16 px-4 max-w-6xl mx-auto border-b border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 border border-amber-800/60 text-xs font-mono text-amber-300 mb-3">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Enterprise Cost & Privacy Comparison</span>
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Stop Paying Per-Token Cloud Taxes on Confidential Data
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              When processing millions of enterprise records, ERP transactions, and compliance archives, public cloud API bills escalate exponentially while exposing internal corporate memory.
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>Monthly Enterprise Token Volume:</span>
                  <strong className="text-cyan-400">{monthlyTokensMillions} Million Tokens/mo</strong>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={monthlyTokensMillions}
                  onChange={(e) => setMonthlyTokensMillions(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1 text-slate-300">
                  <span>Local On-Premise GPU Nodes:</span>
                  <strong className="text-indigo-400">{enterpriseNodes} High-Throughput Nodes</strong>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={enterpriseNodes}
                  onChange={(e) => setEnterpriseNodes(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/40">
                <div className="text-[11px] font-mono text-rose-400 uppercase">Cloud API Est. (Annual)</div>
                <div className="text-2xl font-bold text-white mt-1">
                  ${(cloudMonthlyCost * 12).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">+ High Telemetry Risk</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40">
                <div className="text-[11px] font-mono text-emerald-400 uppercase">BlueFairy Local (Annual)</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  ${(enterpriseNodes * 2500).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-[10px] text-emerald-500/80 mt-1">Fixed Flat Rate • 0 Telemetry</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-700/50 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono text-emerald-300">ESTIMATED ANNUAL SAVINGS</div>
                <div className="text-3xl font-extrabold text-white">
                  ${Math.max(0, bluefairyAnnualSavings).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('enterprise-quote-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-colors text-center"
            >
              Lock in Sovereign SLA Pricing
            </button>
          </div>
        </div>
      </section>

      {/* Enterprise Lead Capture Form */}
      <section id="enterprise-quote-section" className="py-16 px-4 max-w-4xl mx-auto">
        <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Schedule an Enterprise Architecture Audit
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-6">
            Let BlueFairy's systems engineers evaluate your existing Odoo, ERP, and local archival workloads to design an air-gapped LLM deployment blueprint.
          </p>

          {submittedLead ? (
            <div className="p-6 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-sm space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="font-bold text-base text-white">Audit Request Received</div>
              <p>A BlueFairy.ca enterprise solutions engineer will contact <strong>{leadForm.email}</strong> with a customized Odoo v19 local LLM architecture plan.</p>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-4 text-left max-w-lg mx-auto">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Company / Organization Name</label>
                <input
                  id="lead-company-input"
                  type="text"
                  required
                  value={leadForm.company}
                  onChange={(e) => setLeadForm({ ...leadForm, company: e.target.value })}
                  placeholder="Acme Enterprise Ltd."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Corporate Email Address</label>
                <input
                  id="lead-email-input"
                  type="email"
                  required
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  placeholder="lead-architect@company.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Target Nodes</label>
                  <select
                    value={leadForm.nodesCount}
                    onChange={(e) => setLeadForm({ ...leadForm, nodesCount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value={2}>2 Nodes (Pilot)</option>
                    <option value={4}>4 Nodes (Departmental)</option>
                    <option value={8}>8 Nodes (Enterprise Cluster)</option>
                    <option value={16}>16+ Nodes (High Throughput)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Primary Integration</label>
                  <select
                    value={leadForm.useCase}
                    onChange={(e) => setLeadForm({ ...leadForm, useCase: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="Odoo v19 ERP">Odoo v19 CE ERP</option>
                    <option value="Document Archival">Document Archival</option>
                    <option value="Private Legal/Medical">HIPAA / Legal</option>
                    <option value="Air-Gapped Code Copilot">Air-Gapped Code</option>
                  </select>
                </div>
              </div>

              <button
                id="submit-lead-form-btn"
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-sm shadow-md transition-all mt-2"
              >
                Submit Architecture Inquiry
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 border-t border-slate-800 text-xs text-slate-500 text-center px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">BlueFairy.ca AI Systems</span>
            <span>• Sovereign Local Large Language Models</span>
          </div>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>Odoo v19 CE Compatible</span>
            <span>Electron Desktop Native</span>
            <span>FIPS-140-3 Cryptography</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
