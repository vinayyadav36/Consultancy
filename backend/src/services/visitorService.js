import prisma from '../lib/prisma.js';

/**
 * Register a visit idempotently (one record per IP per day).
 */
export async function registerVisit({ ip, userAgent, path }) {
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  try {
    await prisma.visitor.upsert({
      where: { ip_day: { ip, day } },
      update: {},
      create: { ip, day, userAgent: userAgent || null, path: path || '/' },
    });
  } catch (err) {
    // Unique constraint race — silently ignore
    if (err.code !== 'P2002') throw err;
  }
}

/**
 * Get visitor statistics: total unique visitors and today's unique visitors.
 */
export async function getVisitorStats() {
  const today = new Date().toISOString().slice(0, 10);
  const [total, daily] = await Promise.all([
    prisma.visitor.count(),
    prisma.visitor.count({ where: { day: today } }),
  ]);
  return { total, daily, date: today };
}

/**
 * Daily aggregation — compute unique visitors and conversion metrics per day.
 * Called by the cron job.
 */
export async function aggregateDaily() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const day = yesterday.toISOString().slice(0, 10);

  const [visitors, orders] = await Promise.all([
    prisma.visitor.count({ where: { day } }),
    prisma.order.count({ where: { status: 'paid', createdAt: { gte: new Date(day), lt: new Date(day + 'T23:59:59.999Z') } } }),
  ]);

  const conversionRate = visitors > 0 ? ((orders / visitors) * 100).toFixed(2) : '0.00';
  console.log(`[Aggregator] ${day}: ${visitors} visitors, ${orders} orders, ${conversionRate}% conversion`);
  return { day, visitors, orders, conversionRate };
}
