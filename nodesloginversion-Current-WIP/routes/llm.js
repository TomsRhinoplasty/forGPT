// routes/llm.js

const express = require('express');
const router  = express.Router();
const { nodeMapToText } = require('../utils/mapToText');
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * POST /api/llm/query
 * Streams a friendly, conversational answer token‑by‑token.
 * If role updates are needed, append ONE LINE:
 *   UPDATE_MAP_ROLES:{"nodeId":"ai",…}
 * (No numbering, no JSON envelope, no extra text.)
 */
router.post('/query', async (req, res) => {
  const { question, mapData } = req.body;

  // Simple validation
  if (!question || typeof question !== 'string') {
    return res.status(400).send('Error: question is required.');
  }

  // Convert mapData to plain text context
  let mapText = '';
  if (Array.isArray(mapData)) {
    try {
      mapText = nodeMapToText(mapData);
    } catch (e) {
      console.error('mapToText failed:', e);
    }
  }

  // Build a conversational prompt
  const prompt = `
You are a helpful AI collaborator.  Speak naturally—no numbered lists, no bullet points.
Answer in plain English as if you were a colleague sitting next to me.
If you want to change any node’s role, add exactly one line at the very end:
UPDATE_MAP_ROLES:{"nodeId1":"ai","nodeId2":"human",...}
Do not output any JSON object or envelope—only the raw text, then that one line if needed.

Here is the current map context:
${mapText || '(no map data provided)'}

Question: ${question}
`;

  // Prepare for streaming
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.flushHeaders && res.flushHeaders();
  res.flush && res.flush();

  try {
    // Kick off the OpenAI stream
    const completion = await openai.chat.completions.create({
      model:  'gpt-4o-mini',
      stream: true,
      messages: [{ role: 'user', content: prompt }]
    });

    // Stream back each token as soon as it arrives
    for await (const part of completion) {
      const token = part.choices?.[0]?.delta?.content;
      if (token) {
        res.write(token);
        res.flush && res.flush();
      }
    }
  } catch (err) {
    console.error('LLM streaming error:', err);
    // On error, send a brief message rather than JSON
    res.write(`Oops, something went wrong: ${err.message}`);
  } finally {
    res.end();
  }
});

module.exports = router;
