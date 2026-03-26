import axios from 'axios';

// ── Prompt template ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Nandi, the divine marketing assistant for Shree Nandi Marketing Services — a sacred, Lord Shiva-themed digital marketing agency based in Haryana, India.

Your personality: wise, helpful, concise, and inspiring. You draw metaphors from Hindu mythology (Shiva, Parvati, Ganesha, cosmic cycles).

Your expertise covers:
- Digital marketing (SEO, SEM, social media, content marketing, email)
- Brand strategy and identity
- Analytics and data-driven decisions
- Business growth strategies
- Pricing and ROI calculations

Our service plans:
- Digital Growth: ₹15,000/month (SEO, paid search, CRO)
- Brand Identity: ₹25,000/month (logo, brand book, guidelines)
- Social Media: ₹12,000/month (30 posts, reels, community)
- Analytics Pro: ₹20,000/month (GA4, dashboards, A/B testing)

Guardrails:
- Never provide legal or medical advice
- Never make promises about specific financial returns
- Always recommend consulting a professional for legal/tax matters
- Keep responses under 150 words
- If asked about competitor pricing or disparagement, deflect gracefully
- Do not discuss politics or religion beyond our brand theme`;

// Simple in-memory cache (TTL-based)
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(prompt) {
  return prompt.toLowerCase().trim().slice(0, 100);
}

// ── Provider adapter ──────────────────────────────────────────────────────────

async function callOpenAI(messages) {
  const { AI_API_KEY, AI_API_BASE } = process.env;
  const baseURL = AI_API_BASE || 'https://api.openai.com/v1';
  const model = process.env.AI_MODEL || 'gpt-3.5-turbo';

  const response = await axios.post(
    `${baseURL}/chat/completions`,
    { model, messages, max_tokens: 200, temperature: 0.7 },
    { headers: { Authorization: `Bearer ${AI_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 10000 }
  );
  return response.data.choices[0].message.content.trim();
}

// ── Public API ────────────────────────────────────────────────────────────────

export async function queryAI({ prompt, sessionId, userContext }) {
  if (!process.env.AI_API_KEY) {
    return getFallbackResponse(prompt);
  }

  const cacheKey = getCacheKey(prompt);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.response;
  }

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(userContext?.history || []).slice(-4), // last 4 exchanges for context
    { role: 'user', content: prompt.slice(0, 500) },
  ];

  try {
    const response = await callOpenAI(messages);
    cache.set(cacheKey, { response, ts: Date.now() });
    // Clean old cache entries
    if (cache.size > 500) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    return response;
  } catch (err) {
    console.error('AI provider error:', err.message);
    return getFallbackResponse(prompt);
  }
}

function getFallbackResponse(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('price') || p.includes('cost') || p.includes('₹')) {
    return 'Our sacred plans start at ₹12,000/month. The Digital Growth Plan (₹15,000/month) is most popular. Visit our Checkout page to begin your divine journey! 🙏';
  }
  if (p.includes('seo') || p.includes('search')) {
    return 'Our SEO strategy is like the river Ganga — it flows steadily and purifies your digital presence. We conduct full audits, keyword research, and build authority backlinks. Results typically show in 3-6 months. 🕉';
  }
  if (p.includes('social') || p.includes('instagram') || p.includes('facebook')) {
    return 'Our Social Media Plan creates 30 posts/month with reels, stories, and community engagement. Like Lord Ganesha removing obstacles, we clear the path to your audience. 🐘';
  }
  if (p.includes('brand') || p.includes('logo') || p.includes('identity')) {
    return "A strong brand is like Shiva's trishul — it has three prongs of visual identity, brand voice, and consistent messaging. Our Brand Identity Plan includes logo, brand book, and full guidelines. 🔱";
  }
  return 'Namaste! 🙏 I am Nandi, your divine marketing guide. I can help you with marketing strategies, pricing, and service information. What would you like to know about growing your business?';
}
