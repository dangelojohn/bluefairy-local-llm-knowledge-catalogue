import { ArchivalDocument, TagNode, LocalLLMModel, AdUnit, OdooSchemaDefinition } from '../types';

export const INITIAL_TAG_TREE: TagNode[] = [
  {
    id: 'tag-security',
    name: 'Security',
    fullPath: 'Security',
    color: '#ef4444',
    parentId: null,
    documentCount: 6,
    children: [
      {
        id: 'tag-sec-airgap',
        name: 'AirGap',
        fullPath: 'Security/AirGap',
        color: '#dc2626',
        parentId: 'tag-security',
        documentCount: 4,
        children: [
          {
            id: 'tag-sec-airgap-fips',
            name: 'FIPS-140-3',
            fullPath: 'Security/AirGap/FIPS-140-3',
            color: '#b91c1c',
            parentId: 'tag-sec-airgap',
            documentCount: 2,
          },
          {
            id: 'tag-sec-airgap-zero-telemetry',
            name: 'Zero-Telemetry',
            fullPath: 'Security/AirGap/Zero-Telemetry',
            color: '#991b1b',
            parentId: 'tag-sec-airgap',
            documentCount: 3,
          },
        ],
      },
      {
        id: 'tag-sec-crypto',
        name: 'Encryption',
        fullPath: 'Security/Encryption',
        color: '#f87171',
        parentId: 'tag-security',
        documentCount: 3,
        children: [
          {
            id: 'tag-sec-crypto-aes',
            name: 'AES-256-GCM',
            fullPath: 'Security/Encryption/AES-256-GCM',
            color: '#ef4444',
            parentId: 'tag-sec-crypto',
            documentCount: 2,
          },
        ],
      },
    ],
  },
  {
    id: 'tag-models',
    name: 'Models',
    fullPath: 'Models',
    color: '#8b5cf6',
    parentId: null,
    documentCount: 5,
    children: [
      {
        id: 'tag-models-quant',
        name: 'Quantization',
        fullPath: 'Models/Quantization',
        color: '#7c3aed',
        parentId: 'tag-models',
        documentCount: 3,
        children: [
          {
            id: 'tag-models-gguf',
            name: 'GGUF-Q4_K_M',
            fullPath: 'Models/Quantization/GGUF-Q4_K_M',
            color: '#6d28d9',
            parentId: 'tag-models-quant',
            documentCount: 2,
          },
          {
            id: 'tag-models-awq',
            name: 'AWQ-4bit',
            fullPath: 'Models/Quantization/AWQ-4bit',
            color: '#5b21b6',
            parentId: 'tag-models-quant',
            documentCount: 1,
          },
        ],
      },
      {
        id: 'tag-models-agents',
        name: 'AutonomousAgents',
        fullPath: 'Models/AutonomousAgents',
        color: '#a78bfa',
        parentId: 'tag-models',
        documentCount: 4,
      },
    ],
  },
  {
    id: 'tag-odoo',
    name: 'Odoo-v19CE',
    fullPath: 'Odoo-v19CE',
    color: '#059669',
    parentId: null,
    documentCount: 4,
    children: [
      {
        id: 'tag-odoo-orm',
        name: 'ORM-Models',
        fullPath: 'Odoo-v19CE/ORM-Models',
        color: '#047857',
        parentId: 'tag-odoo',
        documentCount: 3,
      },
      {
        id: 'tag-odoo-jsonrpc',
        name: 'JSON-RPC-API',
        fullPath: 'Odoo-v19CE/JSON-RPC-API',
        color: '#10b981',
        parentId: 'tag-odoo',
        documentCount: 2,
      },
    ],
  },
  {
    id: 'tag-compliance',
    name: 'Compliance',
    fullPath: 'Compliance',
    color: '#d97706',
    parentId: null,
    documentCount: 3,
    children: [
      {
        id: 'tag-comp-hipaa',
        name: 'HIPAA-BAA',
        fullPath: 'Compliance/HIPAA-BAA',
        color: '#b45309',
        parentId: 'tag-compliance',
        documentCount: 2,
      },
      {
        id: 'tag-comp-soc2',
        name: 'SOC2-Type-II',
        fullPath: 'Compliance/SOC2-Type-II',
        color: '#92400e',
        parentId: 'tag-compliance',
        documentCount: 2,
      },
    ],
  },
  {
    id: 'tag-enterprise',
    name: 'Enterprise',
    fullPath: 'Enterprise',
    color: '#2563eb',
    parentId: null,
    documentCount: 5,
    children: [
      {
        id: 'tag-ent-runbooks',
        name: 'Runbooks',
        fullPath: 'Enterprise/Runbooks',
        color: '#1d4ed8',
        parentId: 'tag-enterprise',
        documentCount: 3,
      },
      {
        id: 'tag-ent-infra',
        name: 'Infrastructure',
        fullPath: 'Enterprise/Infrastructure',
        color: '#3b82f6',
        parentId: 'tag-enterprise',
        documentCount: 3,
      },
    ],
  },
];

export const INITIAL_DOCUMENTS: ArchivalDocument[] = [
  {
    id: 'doc-bf-001',
    odooId: 101,
    title: 'BlueFairy.ca Core Mission & Local LLM Architecture Spec',
    summary: 'Master blueprint of BlueFairy.ca private on-premise local LLM fleet, zero-telemetry guarantees, and business infrastructure agent adapters.',
    category: 'Architecture',
    format: 'technical_spec',
    checksum: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    createdDate: '2026-02-14',
    modifiedDate: '2026-08-20',
    sizeBytes: 18450,
    author: 'Chief AI Architect @ BlueFairy.ca',
    securityLevel: 'airgap_restricted',
    odooModel: 'knowledge.article',
    isArchived: false,
    pinned: true,
    version: '2.4.0',
    syncStatus: 'synced_local',
    tags: ['Security/AirGap/Zero-Telemetry', 'Models/AutonomousAgents', 'Enterprise/Infrastructure'],
    content: `# BlueFairy.ca: Sovereign Local AI & Archival Intelligence

## 1. Executive Summary & Core Mission
**BlueFairy.ca** is a Canadian artificial intelligence engineering firm dedicated to building **100% private, sovereign, local large language models (LLMs)** and autonomous AI agents designed to execute directly within existing enterprise on-premise hardware and private cloud clusters.

Unlike conventional SaaS AI providers whose commercial models require streaming proprietary corporate data across public network hops to external hyperscaler clusters, BlueFairy models operate behind your enterprise perimeter with **guaranteed zero-telemetry** and full air-gapped cryptographic integrity.

---

## 2. The BlueFairy Enterprise Pillars

| Pillar | Technical Implementation | Enterprise Guarantee |
| :--- | :--- | :--- |
| **Zero External Telemetry** | Socket binding limited to \`127.0.0.1\` or private subnet; no phone-home pings | Zero data leakage risk |
| **Odoo v19 CE Native Backend** | Automated synchronization with Odoo ORM knowledge & document repositories | Unified corporate memory |
| **Electron Cross-Platform Engine** | Native desktop client for macOS, Linux, and Windows with offline full-text vector index | Persistent offline archival |
| **Deterministic Business Agents** | Custom fine-tuned weights for ERP transaction parsing, PDF redaction, and SQL generation | Seamless integration |

---

## 3. High-Security Local Model Fleet

1. **BlueFairy-7B-Secure**: Optimized for edge servers and workstations with 12GB VRAM. Fast query routing and confidential record indexing.
2. **BlueFairy-14B-Agentic**: Multi-step tool use, SQL queries against local PostgreSQL/Odoo DB, and automated document synthesis.
3. **BlueFairy-Coder-32B**: On-premise air-gapped code auditor, patch generator, and infrastructure-as-code planner.

\`\`\`bash
# Local Execution Command (Air-Gapped Node)
./bluefairy-engine serve --model ./models/bf-14b-agentic-q4_k_m.gguf \\
  --host 127.0.0.1 --port 8080 --threads 16 --airgap-strict
\`\`\`
`,
  },
  {
    id: 'doc-bf-002',
    odooId: 102,
    title: 'Odoo v19 Community Edition Schema Integration Guide',
    summary: 'Technical specification for bridging the local Electron knowledge catalogue with Odoo v19 CE knowledge.article and ir.attachment models via JSON-RPC.',
    category: 'Backend Architecture',
    format: 'odoo_article',
    checksum: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    createdDate: '2026-03-01',
    modifiedDate: '2026-08-18',
    sizeBytes: 14200,
    author: 'Enterprise Systems Lead',
    securityLevel: 'internal_confidential',
    odooModel: 'knowledge.article',
    isArchived: false,
    pinned: true,
    version: '1.9.0',
    syncStatus: 'synced_local',
    tags: ['Odoo-v19CE/ORM-Models', 'Odoo-v19CE/JSON-RPC-API', 'Enterprise/Runbooks'],
    content: `# Odoo v19 CE: Knowledge Catalogue Data Schema

## 1. Relational Model Blueprint (\`bluefairy_knowledge\`)

The local catalogue maintains bidirectional parity with the **Odoo 19.0 Community Edition** ORM. Every local record is mapped directly to a persistent database tuple within PostgreSQL via the standard Odoo business framework.

### Model Definition: \`knowledge.article\`
\`\`\`python
# -*- coding: utf-8 -*-
from odoo import models, fields, api

class BlueFairyKnowledgeArticle(models.Model):
    _name = 'knowledge.article'
    _description = 'BlueFairy Sovereign Knowledge Record'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char(string='Article Title', required=True, index=True)
    summary = fields.Text(string='Executive Abstract')
    body = fields.Html(string='Rich Content & Markdown Payload')
    tag_ids = fields.Many2many('mail.tag', string='Hierarchical Tags')
    security_level = fields.Selection([
        ('airgap_restricted', 'Air-Gap Restricted'),
        ('internal_confidential', 'Internal Confidential'),
        ('public_archival', 'Public Archival'),
        ('top_secret', 'Top Secret (FIPS)')
    ], default='internal_confidential', required=True)
    checksum_sha256 = fields.Char(string='Integrity SHA-256 Checksum', readonly=True)
    attachment_ids = fields.One2many('ir.attachment', 'res_id', string='Archival Binaries')
    is_airgap_verified = fields.Boolean(string='Air-Gap Sealed', default=True)
\`\`\`

---

## 2. JSON-RPC Local Protocol
The Electron frontend communicates with the local Odoo v19 instance using atomic JSON-RPC payloads over Unix Domain Sockets or localhost loopback:

\`\`\`json
{
  "jsonrpc": "2.0",
  "method": "call",
  "params": {
    "service": "object",
    "method": "execute_kw",
    "args": [
      "bluefairy_local_vault",
      2,
      "admin_airgap_token",
      "knowledge.article",
      "search_read",
      [[["security_level", "=", "airgap_restricted"]]],
      {"fields": ["name", "summary", "checksum_sha256", "tag_ids"]}
    ]
  },
  "id": 19024
}
\`\`\`
`,
  },
  {
    id: 'doc-bf-003',
    odooId: 103,
    title: 'FIPS-140-3 Cryptographic Integrity & Offline Vaulting Protocol',
    summary: 'Zero-knowledge encryption standards, SHA-256 content verification, and local SQLite/IndexedDB vault storage specifications.',
    category: 'Security',
    format: 'compliance_doc',
    checksum: '6dcd4ce23d88e2ee9568ba546c007c63d9131c1b',
    createdDate: '2026-04-10',
    modifiedDate: '2026-08-15',
    sizeBytes: 11300,
    author: 'Security Officer #04',
    securityLevel: 'airgap_restricted',
    odooModel: 'knowledge.article',
    isArchived: false,
    pinned: false,
    version: '3.1.2',
    syncStatus: 'airgapped_immutable',
    tags: ['Security/AirGap/FIPS-140-3', 'Security/Encryption/AES-256-GCM', 'Compliance/SOC2-Type-II'],
    content: `# FIPS-140-3 Archival Cryptography & Verification

## 1. Tamper-Proof Document Hashing
Each archival entry in the BlueFairy Knowledge Catalogue computes a deterministic SHA-256 integrity hash across:
- Normalized UTF-8 document content
- Ordered hierarchical tag array
- Author identity & timestamp
- Odoo v19 record revision

If a single byte is modified outside the authenticated Electron session, the checksum validator trips and flags the document as \`MUTATION_UNVERIFIED\`.

\`\`\`typescript
export function computeArchivalChecksum(content: string, tags: string[], author: string): string {
  const payload = [content.trim(), tags.sort().join('|'), author].join('::');
  return crypto.createHash('sha256').update(payload, 'utf8').digest('hex');
}
\`\`\`

## 2. On-Disk At-Rest Encryption
Documents stored in the local SQLite replica utilize **AES-256-GCM** with Argon2id key derivation using the workstation's local hardware enclave or TPM chip.
`,
  },
  {
    id: 'doc-bf-004',
    odooId: 104,
    title: 'Autonomous AI Agents: ERP & Business Workflow Integration',
    summary: 'Standard operating procedure for deploying BlueFairy agentic workers into existing Odoo, SAP, Salesforce, and local filesystem infrastructure.',
    category: 'AI Agents',
    format: 'technical_spec',
    checksum: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
    createdDate: '2026-05-12',
    modifiedDate: '2026-08-22',
    sizeBytes: 16900,
    author: 'Enterprise Solutions Engineer',
    securityLevel: 'internal_confidential',
    odooModel: 'knowledge.article',
    isArchived: false,
    pinned: false,
    version: '2.0.1',
    syncStatus: 'synced_local',
    tags: ['Models/AutonomousAgents', 'Enterprise/Infrastructure', 'Enterprise/Runbooks'],
    content: `# Autonomous AI Agents in Enterprise Business Infrastructure

## 1. Architecture Overview
BlueFairy agents operate as stateless or stateful daemon processes inside the enterprise local intranet. They consume read/write permissions via localized RBAC (Role-Based Access Control) defined in Odoo v19 CE.

\`\`\`
  [Enterprise User / ERP Trigger]
                 │
                 ▼
  [BlueFairy Agentic Gateway (Local)]
                 │
  ┌──────────────┼──────────────┐
  ▼              ▼              ▼
[Odoo v19 DB] [Local Docs] [Local 14B LLM]
  │              │              │
  └──────────────┴──────────────┘
                 │
                 ▼
[Deterministic Business Action Executed]
\`\`\`

### Supported Native Integrations:
1. **Odoo v19 CE**: Automated PO matching, invoice validation, inventory anomaly flags, and draft support ticket responses.
2. **Local Archival File Shares (NFS/SMB)**: OCR extraction and automatic hierarchical tagging into the Knowledge Catalogue.
3. **Internal PostgreSQL Data Warehouses**: Natural-language to secure read-only SQL queries with zero cloud transmission.
`,
  },
  {
    id: 'doc-bf-005',
    odooId: 105,
    title: 'HIPAA & BAA Compliance Certification for Private Local LLM Inference',
    summary: 'Legal and technical audit framework ensuring that protected health information (PHI) processed by BlueFairy local engines satisfies all HIPAA Title II requirements.',
    category: 'Compliance',
    format: 'compliance_doc',
    checksum: '11a4b5680104a3eb3b99912061aaab9b642e4785',
    createdDate: '2026-06-05',
    modifiedDate: '2026-08-10',
    sizeBytes: 9800,
    author: 'Chief Compliance Counsel',
    securityLevel: 'public_archival',
    odooModel: 'knowledge.article',
    isArchived: false,
    pinned: false,
    version: '1.1.0',
    syncStatus: 'synced_local',
    tags: ['Compliance/HIPAA-BAA', 'Compliance/SOC2-Type-II', 'Security/AirGap/Zero-Telemetry'],
    content: `# HIPAA Compliance & On-Premise AI Safeguards

## 1. The Legal Rationale for Local LLMs in Healthcare
Under HIPAA Security Rule 45 CFR Part 160 and Part 164, transmitting ePHI (electronic Protected Health Information) to cloud LLM providers requires signed Business Associate Agreements (BAAs) and introduces third-party audit liabilities.

**BlueFairy.ca eliminates cloud BAAs** because zero tokens leave hospital premises:
- Inference runs in the on-site server rack.
- Memory context buffers are purged via zeroize-RAM calls after each completion.
- Vector embeddings reside exclusively in local encrypted SQLite/Odoo storage.
`,
  },
  {
    id: 'doc-bf-006',
    odooId: 106,
    title: 'GGUF-Q4_K_M Quantization Benchmark & Inference Latency Study',
    summary: 'Comparative benchmark of 7B and 14B parameter models running on NVIDIA RTX 4090, Apple Silicon M3/M4 Max, and AMD EPYC CPU nodes.',
    category: 'Benchmarks',
    format: 'markdown',
    checksum: 'a89f95781a95e2694a10787e97426b3f79435b68',
    createdDate: '2026-07-19',
    modifiedDate: '2026-08-24',
    sizeBytes: 12500,
    author: 'ML Systems Engineer',
    securityLevel: 'public_archival',
    odooModel: 'knowledge.article',
    isArchived: false,
    pinned: false,
    version: '1.4.0',
    syncStatus: 'synced_local',
    tags: ['Models/Quantization/GGUF-Q4_K_M', 'Models/Quantization', 'Enterprise/Infrastructure'],
    content: `# GGUF-Q4_K_M Quantization Benchmark Study

## Hardware Performance Matrix

| Hardware Target | Model Spec | VRAM / RAM | Tokens/Sec | TTFT (ms) |
| :--- | :--- | :--- | :--- | :--- |
| **NVIDIA RTX 4090 (24GB)** | BlueFairy-14B-Q4_K_M | 9.2 GB | **84.2 tok/s** | 120 ms |
| **Apple M4 Max (64GB)** | BlueFairy-14B-Q4_K_M | 10.1 GB | **68.5 tok/s** | 145 ms |
| **AMD Threadripper (CPU)** | BlueFairy-7B-Q4_K_M | 6.5 GB | **29.8 tok/s** | 290 ms |
| **Dual NVIDIA A100 (80GB)** | BlueFairy-Coder-32B-Q8 | 36.4 GB | **112.4 tok/s** | 85 ms |

### Quality Retention:
MMLU benchmark score drops by less than **0.8%** compared to FP16 weights while reducing memory footprint by **73%**.
`,
  },
];

export const LOCAL_LLM_FLEET: LocalLLMModel[] = [
  {
    id: 'bf-7b-secure',
    name: 'BlueFairy-7B-Secure',
    tagline: 'Ultra-fast, air-gapped local workstation inference model',
    parameterSize: '7.2 Billion',
    quantization: 'GGUF-Q4_K_M / AWQ-4bit',
    vramRequiredGb: 6,
    contextTokens: 32768,
    tokensPerSec: 92,
    airgapCertified: true,
    useCases: ['Desktop Archival Search', 'Document Redaction', 'Local Note Summarization', 'Zero-Telemetry Copilot'],
    description: 'Designed to run smoothly on modern laptops and edge workstations. Processes confidential text without GPU clusters.',
    deploymentCmd: 'ollama run bluefairy/7b-secure:latest --airgap',
  },
  {
    id: 'bf-14b-agentic',
    name: 'BlueFairy-14B-Agentic',
    tagline: 'Multi-tool enterprise agent with Odoo v19 ORM and SQL integration',
    parameterSize: '14.8 Billion',
    quantization: 'GGUF-Q4_K_M / EXL2-4.5bpw',
    vramRequiredGb: 10,
    contextTokens: 65536,
    tokensPerSec: 74,
    airgapCertified: true,
    useCases: ['Autonomous ERP Workflows', 'Odoo v19 Database Queries', 'Complex Contract Analysis', 'Multi-step Reasoning'],
    description: 'The flagship enterprise workhorse. Fine-tuned with rigorous function-calling schemas for ERP, CRM, and internal databases.',
    deploymentCmd: 'bluefairy-agent init --model bf-14b-agentic --odoo-endpoint 127.0.0.1:8069',
  },
  {
    id: 'bf-32b-coder',
    name: 'BlueFairy-Coder-32B',
    tagline: 'On-premise secure software engineer and infrastructure auditor',
    parameterSize: '32.5 Billion',
    quantization: 'GGUF-Q4_K_M / FP8',
    vramRequiredGb: 22,
    contextTokens: 131072,
    tokensPerSec: 48,
    airgapCertified: true,
    useCases: ['Air-Gapped Code Reviews', 'Odoo Custom Module Generation', 'Security Vulnerability Audits', 'API Synthesis'],
    description: 'Specialized for proprietary codebase indexing, refactoring, and automated test synthesis behind corporate firewalls.',
    deploymentCmd: 'docker compose -f docker-compose.bluefairy-coder.yml up -d',
  },
  {
    id: 'bf-embed-v3',
    name: 'BlueFairy-Embed-v3',
    tagline: 'High-density multilingual embedding engine for local vector search',
    parameterSize: '560 Million',
    quantization: 'FP16 / INT8',
    vramRequiredGb: 2,
    contextTokens: 8192,
    tokensPerSec: 320,
    airgapCertified: true,
    useCases: ['Offline Semantic Search', 'Hierarchical Tag Matching', 'Deduplication', 'Odoo Knowledge Indexing'],
    description: 'Ultra-low latency vector generator for building lightning-fast local vector archives and hybrid BM25 + vector search.',
    deploymentCmd: 'bluefairy-embed --port 8000 --device cuda:0',
  },
];

export const ENTERPRISE_AD_UNITS: AdUnit[] = [
  {
    id: 'ad-gpu-01',
    title: 'Enterprise Air-Gapped GPU Clusters (H100 / RTX 6000 Ada)',
    sponsor: 'Nordic AI Silicon Solutions',
    badge: 'Sponsored Infrastructure',
    description: 'Pre-configured on-premise hardware appliances certified for BlueFairy Local LLM deployment with zero network ingress.',
    targetUrl: 'https://bluefairy.ca/enterprise/hardware-partners',
    cpmRate: 48.50,
    impressions: 14250,
    clicks: 684,
    category: 'Hardware Accelerators',
    bannerBg: 'from-blue-900/60 to-slate-900/80',
  },
  {
    id: 'ad-odoo-02',
    title: 'Odoo v19 Enterprise Cloud & On-Premise High Availability Hosting',
    sponsor: 'OpenSys Enterprise ERP',
    badge: 'Verified ERP Partner',
    description: 'Deploy mission-critical Odoo v19 CE/EE clusters with automated PostgreSQL replication and NVMe backup vaults.',
    targetUrl: 'https://bluefairy.ca/enterprise/odoo-solutions',
    cpmRate: 52.00,
    impressions: 11980,
    clicks: 532,
    category: 'Enterprise Cloud',
    bannerBg: 'from-emerald-950/60 to-slate-900/80',
  },
  {
    id: 'ad-sec-03',
    title: 'Automated SOC2 & HIPAA Compliance Readiness Toolkit',
    sponsor: 'ShieldGuard Cybersecurity',
    badge: 'Compliance Sponsor',
    description: 'Continuous audit evidence collection for air-gapped LLM deployments, cryptographic storage, and staff access control.',
    targetUrl: 'https://bluefairy.ca/enterprise/compliance',
    cpmRate: 64.20,
    impressions: 9840,
    clicks: 471,
    category: 'Data Compliance',
    bannerBg: 'from-amber-950/60 to-slate-900/80',
  },
  {
    id: 'ad-dev-04',
    title: 'Electron Desktop & Local Vector Database Acceleration SDK',
    sponsor: 'VectorEdge Systems',
    badge: 'Developer SDK',
    description: 'Embed BM25 indexing and SQLite vector acceleration directly into your cross-platform desktop Electron applications.',
    targetUrl: 'https://bluefairy.ca/sdk/desktop-acceleration',
    cpmRate: 38.00,
    impressions: 16400,
    clicks: 712,
    category: 'AI Dev Tools',
    bannerBg: 'from-purple-950/60 to-slate-900/80',
  },
];

export const ODOO_V19_SCHEMAS: OdooSchemaDefinition[] = [
  {
    technicalName: 'knowledge.article',
    readableName: 'Knowledge Article & Archival Record',
    table: 'knowledge_article',
    inherits: ['mail.thread', 'mail.activity.mixin'],
    sampleRecordsCount: 6,
    fields: [
      { name: 'name', type: 'char', description: 'Article Title', required: true },
      { name: 'summary', type: 'text', description: 'Short summary or executive abstract', required: false },
      { name: 'body', type: 'html', description: 'Main markdown / rich HTML text payload', required: true },
      { name: 'tag_ids', type: 'many2many', description: 'Hierarchical taxonomy tags', required: false, relation: 'mail.tag' },
      { name: 'security_level', type: 'selection', description: 'Air-Gap security authorization tier', required: true },
      { name: 'checksum_sha256', type: 'char', description: 'SHA-256 cryptographic verification checksum', required: true },
      { name: 'is_airgap_verified', type: 'boolean', description: 'Immutable local archive flag', required: true },
      { name: 'write_date', type: 'datetime', description: 'Last modification timestamp', required: false },
    ],
  },
  {
    technicalName: 'ir.attachment',
    readableName: 'Binary Archival Attachment',
    table: 'ir_attachment',
    inherits: [],
    sampleRecordsCount: 14,
    fields: [
      { name: 'name', type: 'char', description: 'Filename of the archival asset', required: true },
      { name: 'res_model', type: 'char', description: 'Parent model (knowledge.article)', required: true },
      { name: 'res_id', type: 'integer', description: 'ID of parent document', required: true },
      { name: 'mimetype', type: 'char', description: 'MIME format (application/pdf, text/markdown)', required: true },
      { name: 'file_size', type: 'integer', description: 'Size on disk in bytes', required: true },
      { name: 'checksum', type: 'char', description: 'SHA-1 / SHA-256 hash', required: true },
    ],
  },
  {
    technicalName: 'mail.tag',
    readableName: 'Hierarchical Taxonomy Tag',
    table: 'mail_tag',
    inherits: [],
    sampleRecordsCount: 18,
    fields: [
      { name: 'name', type: 'char', description: 'Tag label or category node', required: true },
      { name: 'full_path', type: 'char', description: 'Slash-delimited taxonomy hierarchy', required: true },
      { name: 'parent_id', type: 'many2one', description: 'Parent category tag', required: false, relation: 'mail.tag' },
      { name: 'color', type: 'integer', description: 'UI Color index (0-11)', required: false },
    ],
  },
  {
    technicalName: 'bluefairy.agent.log',
    readableName: 'Local Agent Execution Log',
    table: 'bluefairy_agent_log',
    inherits: [],
    sampleRecordsCount: 42,
    fields: [
      { name: 'agent_id', type: 'char', description: 'Local model identifier (e.g. bf-14b-agentic)', required: true },
      { name: 'action_type', type: 'selection', description: 'Action dispatched (search, tag, summarize, audit)', required: true },
      { name: 'latency_ms', type: 'integer', description: 'Local execution latency in milliseconds', required: true },
      { name: 'airgap_enforced', type: 'boolean', description: 'Guaranteed zero outbound packets', required: true },
    ],
  },
];
