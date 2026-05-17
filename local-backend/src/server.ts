import { randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { readJsonFile, writeJsonFile } from './store.js';
import type { AdminUser, Inquiry, Service, Testimonial } from './types.js';

const app = express();
const PORT = Number(process.env.PORT || 3001);
const sessions = new Map<string, { userId: string; expiresAt: number }>();

app.use(cors());
app.use(express.json({ limit: '100kb' }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please wait and retry.' },
});

type InquiryStore = { inquiries: Inquiry[] };
type ServicesStore = { services: Service[] };
type TestimonialsStore = { testimonials: Testimonial[] };
type AdminUsersStore = { admin_users: AdminUser[] };

const stageWeights: Record<Inquiry['business_stage'], number> = {
  idea: 25,
  early: 40,
  growing: 70,
  established: 90,
};

function calculatePriorityScore(payload: Partial<Inquiry>): number {
  const stageScore = payload.business_stage ? stageWeights[payload.business_stage] : 20;
  const serviceScore = Math.min(30, (payload.services_interested?.length || 0) * 8);
  const messageScore = Math.min(25, Math.floor((payload.message?.trim().length || 0) / 12));
  const budgetScore = typeof payload.monthly_budget_inr === 'number' && payload.monthly_budget_inr > 0
    ? payload.monthly_budget_inr >= 100000
      ? 25
      : payload.monthly_budget_inr >= 50000
        ? 18
        : payload.monthly_budget_inr >= 25000
          ? 12
          : 6
    : 0;
  return Math.min(100, stageScore + serviceScore + messageScore + budgetScore);
}

function sortByScore(serviceScores: Map<string, number>, services: Service[]): Service[] {
  return services
    .slice()
    .sort((a, b) => (serviceScores.get(b.id) || 0) - (serviceScores.get(a.id) || 0));
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, expectedHash] = storedHash.split(':');
  if (!salt || !expectedHash) {
    return false;
  }

  const calculated = scryptSync(password, salt, 64).toString('hex');
  const calculatedBuf = Buffer.from(calculated, 'hex');
  const expectedBuf = Buffer.from(expectedHash, 'hex');

  if (calculatedBuf.length !== expectedBuf.length) {
    return false;
  }

  return timingSafeEqual(calculatedBuf, expectedBuf);
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const session = sessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Session expired' });
  }

  next();
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/services', async (_req, res) => {
  const db = await readJsonFile<ServicesStore>('services.json');
  res.json(db.services);
});

app.get('/api/testimonials', async (_req, res) => {
  const db = await readJsonFile<TestimonialsStore>('testimonials.json');
  res.json(db.testimonials);
});

app.post('/api/inquiries', async (req, res) => {
  const payload = req.body as Partial<Inquiry>;
  const requiredFields = ['name', 'email', 'phone', 'business_name', 'business_stage', 'message'];

  for (const field of requiredFields) {
    if (!payload[field as keyof Inquiry]) {
      return res.status(400).json({ error: `Missing field: ${field}` });
    }
  }

  const allowedStages = ['idea', 'early', 'growing', 'established'];
  if (!allowedStages.includes(String(payload.business_stage))) {
    return res.status(400).json({ error: 'Invalid business_stage' });
  }

  const now = new Date().toISOString();
  const db = await readJsonFile<InquiryStore>('inquiries.json');
  const monthlyBudget = typeof payload.monthly_budget_inr === 'number' && Number.isFinite(payload.monthly_budget_inr)
    ? Math.max(0, Math.floor(payload.monthly_budget_inr))
    : null;

  const inquiry: Inquiry = {
    id: randomUUID(),
    name: String(payload.name),
    email: String(payload.email),
    phone: String(payload.phone),
    business_name: String(payload.business_name),
    business_stage: payload.business_stage as Inquiry['business_stage'],
    services_interested: Array.isArray(payload.services_interested)
      ? payload.services_interested.map(String)
      : [],
    goals: Array.isArray(payload.goals) ? payload.goals.map(String).slice(0, 8) : [],
    monthly_budget_inr: monthlyBudget,
    source_channel:
      payload.source_channel === 'website' ||
      payload.source_channel === 'whatsapp' ||
      payload.source_channel === 'referral' ||
      payload.source_channel === 'other'
        ? payload.source_channel
        : 'website',
    preferred_contact_time: String(payload.preferred_contact_time || 'Anytime'),
    message: String(payload.message),
    status: 'new',
    priority_score: calculatePriorityScore({ ...payload, monthly_budget_inr: monthlyBudget }),
    admin_notes: '',
    created_at: now,
    updated_at: now,
  };

  db.inquiries.unshift(inquiry);
  await writeJsonFile('inquiries.json', db);
  res.status(201).json({ success: true, inquiry });
});

app.post('/api/strategy/recommend', async (req, res) => {
  const {
    business_stage,
    goals = [],
    monthly_budget_inr = 0,
    services_interested = [],
  } = req.body as {
    business_stage?: Inquiry['business_stage'];
    goals?: string[];
    monthly_budget_inr?: number;
    services_interested?: string[];
  };

  if (!business_stage || !['idea', 'early', 'growing', 'established'].includes(business_stage)) {
    return res.status(400).json({ error: 'Invalid business_stage' });
  }

  const db = await readJsonFile<ServicesStore>('services.json');
  const score = new Map<string, number>();
  for (const service of db.services) score.set(service.id, service.is_featured ? 8 : 0);

  for (const service of db.services) {
    if (service.category === 'ai_automation' && (business_stage === 'growing' || business_stage === 'established')) {
      score.set(service.id, (score.get(service.id) || 0) + 12);
    }
    if (service.category === 'compliance' && ['early', 'growing', 'established'].includes(business_stage)) {
      score.set(service.id, (score.get(service.id) || 0) + 9);
    }
    if (service.category === 'marketing') {
      score.set(service.id, (score.get(service.id) || 0) + 10);
    }
  }

  for (const serviceName of services_interested.map((name) => name.toLowerCase())) {
    const matched = db.services.find((service) => service.name.toLowerCase() === serviceName);
    if (matched) score.set(matched.id, (score.get(matched.id) || 0) + 15);
  }

  const goalText = goals.join(' ').toLowerCase();
  for (const service of db.services) {
    if (goalText.includes('automation') && service.category === 'ai_automation') {
      score.set(service.id, (score.get(service.id) || 0) + 15);
    }
    if ((goalText.includes('brand') || goalText.includes('position')) && service.category === 'branding') {
      score.set(service.id, (score.get(service.id) || 0) + 12);
    }
    if ((goalText.includes('compliance') || goalText.includes('gst') || goalText.includes('fssai')) && service.category === 'compliance') {
      score.set(service.id, (score.get(service.id) || 0) + 15);
    }
    if ((goalText.includes('sales') || goalText.includes('lead') || goalText.includes('conversion')) && service.category === 'marketing') {
      score.set(service.id, (score.get(service.id) || 0) + 14);
    }
  }

  const topServices = sortByScore(score, db.services).slice(0, 3);
  const budget = typeof monthly_budget_inr === 'number' && Number.isFinite(monthly_budget_inr) ? monthly_budget_inr : 0;
  const planTier =
    budget >= 100000 ? 'scale_mode'
      : budget >= 40000 ? 'growth_mode'
        : 'launch_mode';

  return res.json({
    plan_tier: planTier,
    readiness_score: calculatePriorityScore({
      business_stage,
      message: goals.join(' '),
      services_interested,
      monthly_budget_inr: budget,
    }),
    recommended_services: topServices,
  });
});

app.post('/api/admin/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  const db = await readJsonFile<AdminUsersStore>('admin_users.json');
  const user = db.admin_users.find((u) => u.username === username);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = randomUUID();
  sessions.set(token, { userId: user.id, expiresAt: Date.now() + 2 * 60 * 60 * 1000 });

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
    },
  });
});

app.get('/api/inquiries', requireAdmin, adminLimiter, async (_req, res) => {
  const db = await readJsonFile<InquiryStore>('inquiries.json');
  res.json(db.inquiries);
});

app.patch('/api/inquiries/:id', requireAdmin, adminLimiter, async (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body as { status?: Inquiry['status']; admin_notes?: string };

  const db = await readJsonFile<InquiryStore>('inquiries.json');
  const inquiry = db.inquiries.find((item) => item.id === id);

  if (!inquiry) {
    return res.status(404).json({ error: 'Inquiry not found' });
  }

  if (status && ['new', 'in_progress', 'closed'].includes(status)) {
    inquiry.status = status;
  }

  if (typeof admin_notes === 'string') {
    inquiry.admin_notes = admin_notes;
  }

  inquiry.updated_at = new Date().toISOString();
  await writeJsonFile('inquiries.json', db);
  res.json({ success: true, inquiry });
});

app.get('/api/admin/insights', requireAdmin, adminLimiter, async (_req, res) => {
  const db = await readJsonFile<InquiryStore>('inquiries.json');
  const total = db.inquiries.length;
  const byStatus = {
    new: db.inquiries.filter((item) => item.status === 'new').length,
    in_progress: db.inquiries.filter((item) => item.status === 'in_progress').length,
    closed: db.inquiries.filter((item) => item.status === 'closed').length,
  };
  const byStage = {
    idea: db.inquiries.filter((item) => item.business_stage === 'idea').length,
    early: db.inquiries.filter((item) => item.business_stage === 'early').length,
    growing: db.inquiries.filter((item) => item.business_stage === 'growing').length,
    established: db.inquiries.filter((item) => item.business_stage === 'established').length,
  };
  const serviceCounts = new Map<string, number>();
  for (const inquiry of db.inquiries) {
    for (const service of inquiry.services_interested || []) {
      serviceCounts.set(service, (serviceCounts.get(service) || 0) + 1);
    }
  }
  const topServices = Array.from(serviceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([service, count]) => ({ service, count }));

  const averagePriority = total
    ? Math.round(
      db.inquiries.reduce((sum, inquiry) => sum + (inquiry.priority_score || 0), 0) / total
    )
    : 0;

  res.json({
    total,
    by_status: byStatus,
    by_stage: byStage,
    average_priority: averagePriority,
    top_services: topServices,
  });
});

app.get('/api/admin/export', requireAdmin, adminLimiter, async (_req, res) => {
  const [inquiries, services, testimonials] = await Promise.all([
    readJsonFile<InquiryStore>('inquiries.json'),
    readJsonFile<ServicesStore>('services.json'),
    readJsonFile<TestimonialsStore>('testimonials.json'),
  ]);

  res.json({
    exported_at: new Date().toISOString(),
    inquiries,
    services,
    testimonials,
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, () => {
  console.log(`Local backend running on http://localhost:${PORT}`);
});
