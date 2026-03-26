import express from 'express';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import { registerVisit, getVisitorStats } from '../services/visitorService.js';
import { sendContactEmail } from '../services/emailService.js';
import { queryAI } from '../services/aiService.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

// ── Visitor analytics ────────────────────────────────────────────────────────

router.get('/visitor-count', async (_req, res) => {
  try {
    const stats = await getVisitorStats();
    res.json(stats);
  } catch (err) {
    console.error('visitor-count error:', err);
    res.status(500).json({ error: 'Failed to retrieve visitor stats' });
  }
});

router.post('/visit', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.toString().split(',')[0].trim()
      || req.socket.remoteAddress
      || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || '';
    const path = req.body?.path || '/';
    await registerVisit({ ip, userAgent, path });
    res.status(204).end();
  } catch (err) {
    console.error('visit error:', err);
    res.status(500).json({ error: 'Failed to register visit' });
  }
});

// ── Contact ───────────────────────────────────────────────────────────────────

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hr
  max: 5,
  message: { error: 'Too many contact requests, please wait an hour.' },
});

router.post('/contact',
  contactLimiter,
  [
    body('name').trim().notEmpty().isLength({ max: 120 }).escape(),
    body('email').trim().isEmail().normalizeEmail(),
    body('message').trim().notEmpty().isLength({ max: 2000 }).escape(),
  ],
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() });
    }
    const { name, email, message } = req.body;
    try {
      await sendContactEmail({ name, email, message });
      res.json({ success: true, message: 'Message sent successfully.' });
    } catch (err) {
      console.error('contact error:', err);
      res.status(500).json({ error: 'Failed to send message. Please try again.' });
    }
  }
);

// ── AI proxy ──────────────────────────────────────────────────────────────────

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 15,
  message: { error: 'AI rate limit exceeded. Please wait a moment.' },
});

router.post('/ai/query',
  aiLimiter,
  [
    body('prompt').trim().notEmpty().isLength({ max: 500 }).escape(),
    body('sessionId').trim().optional().isLength({ max: 64 }),
    body('userContext').optional().isObject(),
  ],
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() });
    }
    const { prompt, sessionId, userContext } = req.body;
    try {
      const response = await queryAI({ prompt, sessionId, userContext });
      res.json({ response });
    } catch (err) {
      console.error('ai query error:', err);
      res.status(500).json({ error: 'AI service temporarily unavailable.' });
    }
  }
);

// ── Products ──────────────────────────────────────────────────────────────────

router.get('/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ where: { isActive: true }, orderBy: { createdAt: 'asc' } });
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Failed to load products' });
  }
});

router.get('/products/:slug', async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { slug: req.params.slug } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch {
    res.status(500).json({ error: 'Failed to load product' });
  }
});

// ── Certifications ────────────────────────────────────────────────────────────

router.get('/certifications', async (_req, res) => {
  try {
    const certs = await prisma.certification.findMany({ where: { isActive: true }, orderBy: { year: 'desc' } });
    res.json(certs);
  } catch {
    res.status(500).json({ error: 'Failed to load certifications' });
  }
});

router.get('/certifications/:slug', async (req, res) => {
  try {
    const cert = await prisma.certification.findUnique({ where: { slug: req.params.slug } });
    if (!cert) return res.status(404).json({ error: 'Certification not found' });
    res.json(cert);
  } catch {
    res.status(500).json({ error: 'Failed to load certification' });
  }
});

// ── Orders ────────────────────────────────────────────────────────────────────

router.post('/orders',
  [
    body('orderId').trim().notEmpty().isLength({ max: 64 }),
    body('customer.name').trim().notEmpty().isLength({ max: 120 }).escape(),
    body('customer.email').trim().isEmail().normalizeEmail(),
    body('total').isFloat({ min: 0 }),
  ],
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() });
    }
    const { orderId, customer, cart, total } = req.body;
    try {
      const productSlug = cart?.[0]?.id || 'unknown';
      let product = await prisma.product.findUnique({ where: { slug: productSlug } });
      if (!product) {
        // Product slug not found — reject the order to maintain data integrity
        return res.status(400).json({ error: `Product '${productSlug}' not found. Please select a valid plan.` });
      }
      const order = await prisma.order.create({
        data: {
          orderId,
          productId: product.id,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone || null,
          company: customer.company || null,
          gst: customer.gst || null,
          amount: total,
          status: 'paid',
        },
      });
      res.status(201).json({ id: order.id, orderId: order.orderId });
    } catch (err) {
      console.error('order error:', err);
      res.status(500).json({ error: 'Failed to create order' });
    }
  }
);

// ── NPS ───────────────────────────────────────────────────────────────────────

router.post('/nps',
  [
    body('orderId').trim().notEmpty(),
    body('score').isInt({ min: 0, max: 10 }),
    body('comment').optional().trim().isLength({ max: 500 }).escape(),
  ],
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() });
    }
    const { orderId, score, comment } = req.body;
    try {
      await prisma.order.update({
        where: { orderId },
        data: { npsScore: score, npsComment: comment || null },
      });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: 'Failed to save NPS' });
    }
  }
);

export default router;
