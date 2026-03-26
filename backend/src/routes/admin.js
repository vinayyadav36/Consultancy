import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import prisma from '../lib/prisma.js';
import { getVisitorStats } from '../services/visitorService.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';

// ── Auth middleware ───────────────────────────────────────────────────────────

function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const token = header.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ── Login ─────────────────────────────────────────────────────────────────────

router.post('/login',
  [
    body('email').trim().isEmail().normalizeEmail(),
    body('password').notEmpty().isLength({ min: 6, max: 64 }),
  ],
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) {
      return res.status(400).json({ errors: errs.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
    } catch (err) {
      console.error('login error:', err);
      res.status(500).json({ error: 'Login failed' });
    }
  }
);

// ── Stats ─────────────────────────────────────────────────────────────────────

router.get('/stats', requireAuth, async (_req, res) => {
  try {
    const [visitorStats, orderCount, revenue, productCount] = await Promise.all([
      getVisitorStats(),
      prisma.order.count({ where: { status: 'paid' } }),
      prisma.order.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
      prisma.product.count({ where: { isActive: true } }),
    ]);
    res.json({ visitors: visitorStats, orders: orderCount, revenue: revenue._sum.amount || 0, products: productCount });
  } catch (err) {
    console.error('stats error:', err);
    res.status(500).json({ error: 'Failed to load stats' });
  }
});

// ── Products CRUD ─────────────────────────────────────────────────────────────

router.get('/products', requireAuth, async (_req, res) => {
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(products);
});

router.post('/products', requireAuth,
  [
    body('slug').trim().notEmpty().isSlug(),
    body('name').trim().notEmpty().isLength({ max: 120 }).escape(),
    body('price').isFloat({ min: 0 }),
    body('description').trim().isLength({ max: 1000 }).escape(),
  ],
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    try {
      const product = await prisma.product.create({
        data: {
          slug: req.body.slug,
          name: req.body.name,
          price: req.body.price,
          description: req.body.description,
          features: req.body.features || [],
          badge: req.body.badge || null,
        },
      });
      res.status(201).json(product);
    } catch (err) {
      if (err.code === 'P2002') return res.status(409).json({ error: 'Slug already exists' });
      res.status(500).json({ error: 'Failed to create product' });
    }
  }
);

router.put('/products/:id', requireAuth, async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        features: req.body.features,
        badge: req.body.badge,
        isActive: req.body.isActive,
      },
    });
    res.json(product);
  } catch {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/products/:id', requireAuth, async (req, res) => {
  try {
    await prisma.product.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ── Certifications CRUD ───────────────────────────────────────────────────────

router.get('/certifications', requireAuth, async (_req, res) => {
  const certs = await prisma.certification.findMany({ orderBy: { year: 'desc' } });
  res.json(certs);
});

router.post('/certifications', requireAuth,
  [
    body('slug').trim().notEmpty(),
    body('title').trim().notEmpty().isLength({ max: 120 }).escape(),
    body('issuer').trim().notEmpty().escape(),
    body('year').isInt({ min: 2000, max: 2030 }),
  ],
  async (req, res) => {
    const errs = validationResult(req);
    if (!errs.isEmpty()) return res.status(400).json({ errors: errs.array() });
    try {
      const cert = await prisma.certification.create({ data: req.body });
      res.status(201).json(cert);
    } catch {
      res.status(500).json({ error: 'Failed to create certification' });
    }
  }
);

router.delete('/certifications/:id', requireAuth, async (req, res) => {
  try {
    await prisma.certification.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete certification' });
  }
});

// ── Orders view ───────────────────────────────────────────────────────────────

router.get('/orders', requireAuth, async (req, res) => {
  try {
    const page = parseInt(String(req.query.page || '1'), 10);
    const limit = Math.min(parseInt(String(req.query.limit || '20'), 10), 100);
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.order.count(),
    ]);
    res.json({ orders, total, page, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ error: 'Failed to load orders' });
  }
});

// ── Visitor analytics ─────────────────────────────────────────────────────────

router.get('/visitors', requireAuth, async (req, res) => {
  try {
    const days = parseInt(String(req.query.days || '30'), 10);
    const since = new Date();
    since.setDate(since.getDate() - days);
    const raw = await prisma.visitor.groupBy({
      by: ['day'],
      _count: { id: true },
      where: { createdAt: { gte: since } },
      orderBy: { day: 'asc' },
    });
    res.json(raw.map((r) => ({ day: r.day, count: r._count.id })));
  } catch {
    res.status(500).json({ error: 'Failed to load visitor data' });
  }
});

// ── CSV Export ────────────────────────────────────────────────────────────────

router.get('/export/orders', requireAuth, async (_req, res) => {
  try {
    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    const headers = ['orderId', 'customerName', 'customerEmail', 'amount', 'status', 'createdAt'];
    const rows = orders.map((o) =>
      headers.map((h) => JSON.stringify(String(o[h] ?? ''))).join(',')
    );
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send([headers.join(','), ...rows].join('\n'));
  } catch {
    res.status(500).json({ error: 'Failed to export orders' });
  }
});

export default router;
