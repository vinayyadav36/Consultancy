# Shree Nandi Marketing Services — Deploy Notes

## Environment Variables

### Frontend (Vercel)
| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE` | Yes | Backend API URL (e.g., `https://api.yourdomain.com`) |
| `VITE_SUPABASE_URL` | No | Supabase project URL (legacy — optional) |
| `VITE_SUPABASE_ANON_KEY` | No | Supabase anon key (legacy — optional) |
| `VITE_ENABLE_ADMIN` | No | Set `true` to enable /admin route |
| `VITE_STRIPE_PUBLISHABLE` | No | Stripe publishable key for client-side checkout |

### Backend (Render / Vercel Serverless)
| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: 3001) |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | Secret for JWT signing (min 32 chars) |
| `STRIPE_SECRET_KEY` | Yes* | Stripe secret key (*for payments) |
| `STRIPE_WEBHOOK_SECRET` | Yes* | Stripe webhook signing secret |
| `EMAILJS_SERVICE_ID` | No | EmailJS service ID |
| `EMAILJS_TEMPLATE_ID` | No | EmailJS template ID |
| `EMAILJS_USER_ID` | No | EmailJS public key |
| `SMTP_HOST` | No | SMTP host for Nodemailer fallback |
| `SMTP_PORT` | No | SMTP port (default: 587) |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `SMTP_SECURE` | No | `true` for SSL (port 465) |
| `CONTACT_EMAIL` | No | Email to receive contact form submissions |
| `AI_API_KEY` | No | OpenAI API key |
| `AI_API_BASE` | No | AI API base URL (default: OpenAI) |
| `AI_MODEL` | No | AI model name (default: gpt-3.5-turbo) |
| `FRONTEND_URL` | Yes | Frontend URL for CORS (comma-separated) |
| `SENTRY_DSN` | No | Sentry DSN for error monitoring |

---

## Frontend Deployment (Vercel)

1. Import the repository at [vercel.com](https://vercel.com)
2. Set **Framework Preset** to `Vite`
3. Set **Root Directory** to `.` (repo root)
4. Add all `VITE_*` environment variables
5. Deploy — Vercel auto-deploys on every push to `main`

---

## Backend Deployment (Render)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Build Command**: `npm install && npx prisma generate && npx prisma migrate deploy`
5. Set **Start Command**: `npm start`
6. Add all backend environment variables
7. Create a **PostgreSQL** database on Render and copy the `DATABASE_URL`

### Seed the database

After deployment, run (from local with `DATABASE_URL` set):
```bash
cd backend
node src/seed.js
```

This creates the admin user and sample products.

---

## Stripe Webhook Setup

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-backend.render.com/api/payments/webhook`
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Copy the **Signing Secret** and set it as `STRIPE_WEBHOOK_SECRET`

---

## Docker Compose (Local Development)

```bash
# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend node src/seed.js
```

Services:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432

---

## Admin Access

After seeding, log in at `/admin` with:
- Email: `admin@shreenadimarketing.com`
- Password: `ShivaAdmin@2024`

**Change the password immediately after first login.**

---

## Performance Checklist

- [ ] Enable Vercel Edge Network caching for static assets
- [ ] Configure CDN for GLTF/3D model files
- [ ] Enable PostgreSQL connection pooling (PgBouncer on Render)
- [ ] Set up Sentry for error monitoring
- [ ] Configure uptime monitoring (Better Uptime or Freshping)
- [ ] Enable gzip/Brotli compression on CDN

---

## Lighthouse Targets

| Metric | Target |
|---|---|
| Performance | ≥ 60 |
| Accessibility | ≥ 80 |
| Best Practices | ≥ 80 |
| SEO | ≥ 80 |
