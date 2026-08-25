export type SecurityLevel = 'airgap_restricted' | 'internal_confidential' | 'public_archival' | 'top_secret';

export type DocumentFormat = 'markdown' | 'odoo_article' | 'technical_spec' | 'system_prompt' | 'compliance_doc' | 'code_snippet';

export interface ArchivalDocument {
  id: string;
  odooId: number;
  title: string;
  summary: string;
  content: string;
  tags: string[]; // e.g. ["Security/AirGap", "Models/Quantization"]
  category: string;
  format: DocumentFormat;
  checksum: string; // SHA-256
  createdDate: string;
  modifiedDate: string;
  sizeBytes: number;
  author: string;
  securityLevel: SecurityLevel;
  odooModel: string; // e.g. "knowledge.article"
  isArchived: boolean;
  pinned: boolean;
  version: string;
  syncStatus: 'synced_local' | 'pending_odoo_sync' | 'airgapped_immutable';
  metadata?: Record<string, any>;
}

export interface TagNode {
  id: string;
  name: string;
  fullPath: string; // e.g. "Security/AirGap/FIPS-140"
  color: string;
  parentId: string | null;
  children?: TagNode[];
  documentCount: number;
}

export interface SearchFilter {
  query: string;
  selectedTags: string[];
  category: string;
  format: string;
  securityLevel: string;
  sortBy: 'relevance' | 'date_desc' | 'date_asc' | 'title_asc' | 'size_desc';
  onlyPinned: boolean;
  onlyArchived: boolean;
}

export interface LocalLLMModel {
  id: string;
  name: string;
  tagline: string;
  parameterSize: string;
  quantization: string;
  vramRequiredGb: number;
  contextTokens: number;
  tokensPerSec: number;
  airgapCertified: boolean;
  useCases: string[];
  description: string;
  deploymentCmd: string;
}

export interface AdUnit {
  id: string;
  title: string;
  sponsor: string;
  badge: string;
  description: string;
  targetUrl: string;
  cpmRate: number;
  impressions: number;
  clicks: number;
  category: 'Enterprise Cloud' | 'Hardware Accelerators' | 'Data Compliance' | 'AI Dev Tools';
  bannerBg: string;
}

export interface EnterpriseLead {
  company: string;
  email: string;
  nodesCount: number;
  useCase: string;
  estimatedBudget: string;
  timestamp: string;
}

export interface OdooModelField {
  name: string;
  type: string;
  description: string;
  required: boolean;
  relation?: string;
}

export interface OdooSchemaDefinition {
  technicalName: string;
  readableName: string;
  table: string;
  inherits: string[];
  fields: OdooModelField[];
  sampleRecordsCount: number;
}
