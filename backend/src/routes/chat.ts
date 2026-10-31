import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';
import { RAGEngine } from '../ai/ragEngine.js';
import { LLMAdapter } from '../ai/llmAdapter.js';
import { LanguageCode } from '../ai/intentParser.js';

const router = Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, language, sessionId: clientSessionId } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message is required and must not be empty.' });
      return;
    }

    // Sanitize session ID or generate new
    let sessionId = clientSessionId;
    if (!sessionId || typeof sessionId !== 'string') {
      sessionId = uuidv4();
    }

    // Ensure session exists
    const sessionCheck = db.prepare('SELECT id FROM chat_sessions WHERE id = ?').get(sessionId);
    if (!sessionCheck) {
      db.prepare('INSERT INTO chat_sessions (id, language) VALUES (?, ?)').run(sessionId, language || 'en');
    }

    // Save user message
    const userMsgId = uuidv4();
    db.prepare(`
      INSERT INTO chat_messages (id, session_id, role, content, language)
      VALUES (?, ?, 'user', ?, ?)
    `).run(userMsgId, sessionId, message.trim(), language || 'en');

    // Perform RAG retrieval
    const ragContext = RAGEngine.retrieve(message.trim(), language as LanguageCode);

    // Generate Grounded AI response
    const aiPayload = await LLMAdapter.generateResponse(ragContext, language as LanguageCode);

    // Save assistant message
    const assistantMsgId = uuidv4();
    db.prepare(`
      INSERT INTO chat_messages (id, session_id, role, content, language, sources_json, metadata_json)
      VALUES (?, ?, 'assistant', ?, ?, ?, ?)
    `).run(
      assistantMsgId,
      sessionId,
      aiPayload.answer,
      aiPayload.language,
      JSON.stringify(aiPayload.sources),
      JSON.stringify({
        provider: aiPayload.provider,
        related_count: aiPayload.related_schemes.length
      })
    );

    res.json({
      sessionId,
      messageId: assistantMsgId,
      ...aiPayload
    });
  } catch (error: any) {
    console.error('[Chat API Error]:', error);
    res.status(500).json({
      error: 'An internal server error occurred while processing your request.',
      details: error.message
    });
  }
});

router.get('/chat/history/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const messages = db.prepare(`
      SELECT id, role, content, language, sources_json, created_at
      FROM chat_messages
      WHERE session_id = ?
      ORDER BY created_at ASC
    `).all(sessionId) as any[];

    const formatted = messages.map(m => ({
      id: m.id,
      role: m.role,
      content: m.content,
      language: m.language,
      sources: m.sources_json ? JSON.parse(m.sources_json) : [],
      createdAt: m.created_at
    }));

    res.json({ sessionId, messages: formatted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

