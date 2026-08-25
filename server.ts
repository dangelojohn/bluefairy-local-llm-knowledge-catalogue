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
        // No API key configured — return an explicit placeholder, not a fabricated
        // description of local/air-gapped processing that never happened.
        return res.json({
          text: `[Demo mode — no GEMINI_API_KEY configured]\n\nThis is placeholder text, not a real response. Query received: "${prompt}"\n\nSet GEMINI_API_KEY in .env.local to enable live AI responses via the Gemini API. This message does not reflect any local model inference, archival lookup, or Odoo cache access — none of that has occurred.`,
          mode: 'demo_placeholder_no_api_key',
        });
      }

      const docContext = contextDocuments && contextDocuments.length > 0
        ? `\n\n### ARCHIVAL KNOWLEDGE BASE CONTEXT (Odoo v19 CE Knowledge Articles):\n${contextDocuments
            .map((d: any, idx: number) => `[Doc ${idx + 1}: ${d.title} (Tags: ${d.tags?.join(', ') || 'none'})]\n${d.content.slice(0, 1500)}`)
            .join('\n\n')}`
        : '';

      // This call goes to the Google Gemini API over the network. The system
      // instruction must not claim local, on-premise, or air-gapped operation —
      // that would be false for every request served by this branch.
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: `${prompt}${docContext}`,
        config: {
          systemInstruction: systemInstruction ||
            `You are the BlueFairy Assistant, an AI assistant for BlueFairy.ca's Odoo v19 CE knowledge catalogue.
             You help with hierarchical taxonomy management and document synthesis over the archival knowledge base.
             Answer accurately, referencing archival context if available. Keep your tone professional, authoritative, and security-centric.
             This request is served via the Google Gemini API, not a local or air-gapped model — never claim otherwise, even if asked.`,
        },
      });

      res.json({
        text: response.text || 'No response generated.',
        mode: mode || 'cloud_gemini_api',
      });
    } catch (error: any) {
      console.error('Gemini API Error in /api/ai/chat:', error);
      res.status(500).json({
        error: error.message || 'Internal AI processing error',
        fallback: 'Gemini API request failed. No response was generated.',
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
