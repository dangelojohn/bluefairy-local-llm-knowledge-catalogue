import { ArchivalDocument, SearchFilter, TagNode } from '../types';

export interface SearchResult {
  document: ArchivalDocument;
  score: number;
  matchedFields: string[];
  snippet: string;
}

/**
 * Checks if a document tag satisfies a hierarchical tag filter.
 * e.g., if filter is "Security", it matches "Security", "Security/AirGap", "Security/AirGap/FIPS-140"
 */
export function matchesHierarchicalTag(docTag: string, filterTag: string): boolean {
  if (docTag === filterTag) return true;
  if (docTag.startsWith(filterTag + '/')) return true;
  return false;
}

/**
 * Offline fast full-text indexing & multi-attribute ranking engine
 */
export function executeOfflineSearch(
  documents: ArchivalDocument[],
  filter: SearchFilter
): SearchResult[] {
  const query = filter.query.trim().toLowerCase();
  const queryTokens = query ? query.split(/\s+/).filter(Boolean) : [];

  let results: SearchResult[] = [];

  for (const doc of documents) {
    // 1. Archival & Pinned Filters
    if (filter.onlyPinned && !doc.pinned) continue;
    if (filter.onlyArchived && !doc.isArchived) continue;
    if (!filter.onlyArchived && doc.isArchived) continue;

    // 2. Category Filter
    if (filter.category && filter.category !== 'all' && doc.category !== filter.category) {
      continue;
    }

    // 3. Format Filter
    if (filter.format && filter.format !== 'all' && doc.format !== filter.format) {
      continue;
    }

    // 4. Security Level Filter
    if (filter.securityLevel && filter.securityLevel !== 'all' && doc.securityLevel !== filter.securityLevel) {
      continue;
    }

    // 5. Hierarchical Tags Matching
    if (filter.selectedTags.length > 0) {
      const hasAllSelectedTags = filter.selectedTags.every(selectedTag =>
        doc.tags.some(docTag => matchesHierarchicalTag(docTag, selectedTag))
      );
      if (!hasAllSelectedTags) continue;
    }

    // 6. Text Query Matching & Scoring
    let score = 0;
    const matchedFields: string[] = [];
    let snippet = doc.summary;

    if (queryTokens.length === 0) {
      // Base score when no query typed
      score = doc.pinned ? 100 : 10;
      results.push({ document: doc, score, matchedFields, snippet });
      continue;
    }

    const titleLower = doc.title.toLowerCase();
    const summaryLower = doc.summary.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const tagsCombined = doc.tags.join(' ').toLowerCase();
    const authorLower = doc.author.toLowerCase();
    const checksumLower = doc.checksum.toLowerCase();

    let allTokensMatched = true;

    for (const token of queryTokens) {
      let tokenMatched = false;

      // Exact title match (highest weight)
      if (titleLower.includes(token)) {
        score += 50;
        tokenMatched = true;
        if (!matchedFields.includes('title')) matchedFields.push('title');
      }

      // Tag match (high weight for hierarchical discovery)
      if (tagsCombined.includes(token)) {
        score += 35;
        tokenMatched = true;
        if (!matchedFields.includes('tags')) matchedFields.push('tags');
      }

      // Summary match
      if (summaryLower.includes(token)) {
        score += 20;
        tokenMatched = true;
        if (!matchedFields.includes('summary')) matchedFields.push('summary');
      }

      // Author / Checksum match
      if (authorLower.includes(token) || checksumLower.includes(token)) {
        score += 15;
        tokenMatched = true;
        if (!matchedFields.includes('metadata')) matchedFields.push('metadata');
      }

      // Content match
      if (contentLower.includes(token)) {
        score += 10;
        tokenMatched = true;
        if (!matchedFields.includes('content')) matchedFields.push('content');

        // Extract excerpt around first token occurrence
        const index = contentLower.indexOf(token);
        const start = Math.max(0, index - 60);
        const end = Math.min(doc.content.length, index + token.length + 80);
        snippet = (start > 0 ? '...' : '') + doc.content.substring(start, end).replace(/[#*`_]/g, '') + (end < doc.content.length ? '...' : '');
      }

      if (!tokenMatched) {
        allTokensMatched = false;
        break;
      }
    }

    if (allTokensMatched && score > 0) {
      if (doc.pinned) score += 25;
      results.push({ document: doc, score, matchedFields, snippet });
    }
  }

  // Sorting
  results.sort((a, b) => {
    switch (filter.sortBy) {
      case 'relevance':
        return b.score - a.score;
      case 'date_desc':
        return new Date(b.document.modifiedDate).getTime() - new Date(a.document.modifiedDate).getTime();
      case 'date_asc':
        return new Date(a.document.modifiedDate).getTime() - new Date(b.document.modifiedDate).getTime();
      case 'title_asc':
        return a.document.title.localeCompare(b.document.title);
      case 'size_desc':
        return b.document.sizeBytes - a.document.sizeBytes;
      default:
        return b.score - a.score;
    }
  });

  return results;
}

/**
 * Calculates document counts across hierarchical tag tree
 */
export function recalculateTagTreeCounts(tree: TagNode[], documents: ArchivalDocument[]): TagNode[] {
  return tree.map(node => {
    const docCount = documents.filter(doc =>
      doc.tags.some(docTag => matchesHierarchicalTag(docTag, node.fullPath))
    ).length;

    const children = node.children ? recalculateTagTreeCounts(node.children, documents) : undefined;

    return {
      ...node,
      documentCount: docCount,
      children,
    };
  });
}
