# Marketing Agency Website

A production-focused React + TypeScript single-page site for Shree Nandi Marketing Services, built with Vite, Tailwind CSS, Framer Motion, Supabase, and Leaflet.

## Project Analysis

This codebase is a frontend-heavy marketing website with:

- Multi-page SPA routing via React Router (`/`, `/about`, `/services`, `/contact`, `/admin`)
- Contact inquiry submission to Supabase (`inquiries` table)
- Admin dashboard for inquiry triage (`status`, `admin_notes`, and email reply)
- Animated UX patterns via Framer Motion and Intersection Observer
- Embedded map via React Leaflet

### Architecture Summary

- Framework: React 18 + TypeScript + Vite 5
- Styling: Tailwind CSS + utility component classes in `src/index.css`
- Data layer: Supabase JS client (`src/lib/supabase.ts`)
- Routing shell: `src/App.tsx`
- Pages: `src/pages/*`
- Shared layout: `src/components/Navbar.tsx`, `src/components/Footer.tsx`

### Production Hardening Applied

The following readiness updates were made:

- Added safe Supabase configuration handling so the app no longer crashes if env vars are missing.
- Added optional admin route feature gate (`VITE_ENABLE_ADMIN`) to avoid accidental public exposure.
- Refactored admin notes workflow to avoid database writes on every keystroke.
- Added stronger user feedback for unavailable backend integrations.
- Defined root-level CSS accent token and baseline body/root styles.
- Improved document metadata/title in `index.html`.
- Added `.env` hygiene (`.gitignore`) and an `.env.example` template.
- Removed unused React imports to satisfy strict TypeScript/lint expectations.

## Tech Stack

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS 3
- Framer Motion
- React Router 6
- Supabase JS
- React Leaflet + Leaflet

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill values:

```bash
cp .env.example .env
```

Required variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Optional:

- `VITE_ENABLE_ADMIN=true` to enable `/admin`

### 3. Start development server

```bash
npm run dev
```

### 4. Quality checks

```bash
npm run lint
npm run build
```

## Supabase Setup

Apply the migration in `supabase/migrations/20250130054447_lucky_lab.sql` to create the `inquiries` table and RLS policy.

Table fields:

- `id` (uuid, PK)
- `name` (text)
- `email` (text)
- `message` (text)
- `status` (`new`, `in_progress`, `completed`)
- `created_at` (timestamp)
- `admin_notes` (text, nullable)

Important:

- Review and tighten the included RLS policy before production use.
- Use organization-controlled authentication and role mapping for admin operations.

## Deployment Guide

This app is suitable for static hosting (Vercel, Netlify, Cloudflare Pages, GitHub Pages with SPA fallback).

### Build command

```bash
npm run build
```

### Output directory

- `dist`

### Required hosting configuration

- Configure environment variables from `.env.example` in the host dashboard.
- Add SPA rewrite/fallback so non-root routes resolve to `index.html`.
	- Example: `/about` should serve the SPA entry, not 404.

### Recommended production checks before release

- `npm run lint` passes with zero errors.
- `npm run build` completes successfully.
- Contact form works with real Supabase project.
- `/admin` is disabled by default or access-controlled.
- RLS policies are validated with least-privilege access.

## Operational Notes

- If Supabase env vars are missing, contact/admin features are intentionally disabled and the app remains usable.
- Admin dashboard currently relies on Supabase authorization + policy enforcement.
- Do not commit real environment values to git.

## Scripts

- `npm run dev` - Start Vite dev server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Future Improvements

- Add authenticated admin login flow in the UI.
- Add server-side validation/rate limiting for inquiries.
- Add unit/integration tests (Vitest + React Testing Library).
- Add CI pipeline for lint/build checks on pull requests.