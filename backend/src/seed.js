import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🕉 Seeding Shree Nandi Marketing database...');

  // Admin user
  const passwordHash = await bcrypt.hash('ShivaAdmin@2024', 12);
  await prisma.user.upsert({
    where: { email: 'admin@shreenadimarketing.com' },
    update: {},
    create: {
      email: 'admin@shreenadimarketing.com',
      passwordHash,
      role: 'admin',
      name: 'Vinay Yadav',
    },
  });
  console.log('✓ Admin user created: admin@shreenadimarketing.com');

  // Products
  const products = [
    {
      slug: 'digital-growth',
      name: 'Digital Growth Plan',
      price: 15000,
      description: 'SEO, paid search & conversion optimisation for rapid online growth',
      features: ['SEO Audit & Strategy', 'Paid Search Campaigns', 'Conversion Optimisation', 'Monthly Reports', 'Dedicated Manager'],
      badge: 'Most Popular',
    },
    {
      slug: 'brand-identity',
      name: 'Brand Identity Plan',
      price: 25000,
      description: 'Complete visual & messaging framework to build a memorable brand',
      features: ['Logo Design', 'Brand Voice Guidelines', 'Social Media Kit', 'Business Stationery', 'Brand Book'],
      badge: 'Foundation',
    },
    {
      slug: 'social-media',
      name: 'Social Media Plan',
      price: 12000,
      description: 'Community growth on every major platform',
      features: ['30 Posts / Month', 'Story & Reel Production', 'Hashtag Research', 'Influencer Outreach', 'Weekly Analytics'],
      badge: 'High Engagement',
    },
    {
      slug: 'analytics-pro',
      name: 'Analytics Pro Plan',
      price: 20000,
      description: 'Custom dashboards, funnel analysis & predictive reporting',
      features: ['GA4 & Tag Manager', 'Custom KPI Dashboards', 'Monthly Deep-Dive', 'A/B Testing Framework', 'Quarterly Reviews'],
      badge: 'Data-Driven',
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: {}, create: p });
    console.log(`✓ Product: ${p.name}`);
  }

  // Certifications
  const certs = [
    { slug: 'google-digital-marketing', title: 'Google Digital Marketing', issuer: 'Google', year: 2023, description: 'Comprehensive digital marketing certification.', url: 'https://skillshop.google.com', icon: '🎓', color: '#4285F4' },
    { slug: 'meta-social-media', title: 'Meta Social Media Marketing', issuer: 'Meta', year: 2023, description: 'Professional social media marketing certification.', url: 'https://www.facebook.com/business/learn', icon: '📱', color: '#1877F2' },
    { slug: 'hubspot-content', title: 'HubSpot Content Marketing', issuer: 'HubSpot', year: 2022, description: 'Content strategy and marketing certification.', url: 'https://academy.hubspot.com', icon: '✍️', color: '#FF7A59' },
    { slug: 'semrush-seo', title: 'SEMrush SEO Toolkit', issuer: 'SEMrush', year: 2023, description: 'Advanced SEO certification.', url: 'https://www.semrush.com/academy', icon: '🔍', color: '#FF642D' },
  ];

  for (const c of certs) {
    await prisma.certification.upsert({ where: { slug: c.slug }, update: {}, create: c });
    console.log(`✓ Certification: ${c.title}`);
  }

  console.log('\n🙏 Seeding complete! Har Har Mahadev!');
  console.log('Admin login: admin@shreenadimarketing.com / ShivaAdmin@2024');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
