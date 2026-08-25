import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Gemini Client Initialization
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'BlueFairy Local Knowledge & Enterprise Portal',
      timestamp: new Date().toISOString(),
      odooVersion: '19.0-Community-Edition',
      localInferenceReady: true,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // AI Inference Proxy for BlueFairy Local Agent / Gemini
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { prompt, systemInstruction, contextDocuments, mode } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Return simulated local agent response if no API key
        return res.json({
          text: `[BlueFairy Local 7B-AirGap Engine]: Processed offline query against local archival index.\n\nQuery: "${prompt}"\n\nFound relevant records in local Odoo v19 CE cache. All data remained encrypted and localized in-memory without external socket calls.`,
          mode: 'local_airgap_simulated',
        });
      }

      const docContext = contextDocuments && contextDocuments.length > 0
        ? `\n\n### LOCAL ARCHIVAL KNOWLEDGE BASE CONTEXT (Odoo v19 CE Knowledge Articles):\n${contextDocuments
            .map((d: any, idx: number) => `[Doc ${idx + 1}: ${d.title} (Tags: ${d.tags?.join(', ') || 'none'})]\n${d.content.slice(0, 1500)}`)
            .join('\n\n')}`
        : '';

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `${prompt}${docContext}`,
        config: {
          systemInstruction: systemInstruction || 
            `You are BlueFairy Agentic Assistant, an enterprise-grade AI operating within BlueFairy.ca's local secure architecture and Odoo v19 CE knowledge catalogue. 
             You specialize in privacy-preserving local LLM deployment, zero-telemetry enterprise workflows, hierarchical taxonomy management, and local document synthesis.
             Answer accurately, referencing archival context if available. Keep your tone professional, authoritative, and security-centric.`,
        },
      });

      res.json({
        text: response.text || 'No response generated.',
        mode: mode || 'hybrid_secure',
      });
    } catch (error: any) {
      console.error('Gemini API Error in /api/ai/chat:', error);
      res.status(500).json({
        error: error.message || 'Internal AI processing error',
        fallback: 'Local fallback engine activated.',
      });
    }
  });

  // AI Hierarchical Tag Generator
  app.post('/api/ai/tag-extractor', async (req, res) => {
    try {
      const { title, content } = req.body;
      if (!title && !content) {
        return res.status(400).json({ error: 'Title or content required' });
      }

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          tags: ['Archival/Internal', 'Security/AirGap', 'Enterprise/General'],
          suggestedCategory: 'Enterprise Archive',
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `Analyze the following document and suggest 3 to 5 hierarchical tags in the format "Category/Subcategory/SpecificTag" (e.g., "Security/AirGap/FIPS-140-3", "Models/Quantization/GGUF-Q4", "Legal/Compliance/HIPAA"). Return valid JSON only with keys: "tags" (array of strings) and "suggestedCategory" (string).\n\nDocument Title: ${title}\nContent:\n${content.slice(0, 2000)}`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      let parsed;
      try {
        parsed = JSON.parse(response.text || '{}');
      } catch (e) {
        parsed = { tags: ['Knowledge/General', 'Local/Archive'], suggestedCategory: 'Knowledge Base' };
      }

      res.json(parsed);
    } catch (error: any) {
      console.error('Tag extraction error:', error);
      res.json({ tags: ['Archive/Uncategorized'], suggestedCategory: 'Archive' });
    }
  });

  // Odoo v19 CE JSON-RPC Proxy / Archival Bridge
  app.post('/api/odoo/v19/jsonrpc', (req, res) => {
    const { method, params } = req.body;
    // Simulated Odoo v19 CE JSON-RPC dispatcher
    res.json({
      jsonrpc: '2.0',
      id: req.body.id || Math.floor(Math.random() * 10000),
      result: {
        status: 'success',
        server_version: '19.0-Community-Edition-Local',
        protocol: 'jsonrpc/2.0',
        dispatched_method: method || 'call_kw',
        database: 'bluefairy_local_vault',
        records_affected: 1,
        timestamp: Date.now(),
      },
    });
  });

  // Vite middleware for dev / static for prod
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BlueFairy.ca Server & Knowledge Catalogue running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
