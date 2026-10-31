# Kaizen Travel and Adventures

The official website for **Kaizen Travel and Adventures**, a bespoke safari and travel operator in Southern Africa. Built with Next.js App Router, TypeScript strict mode, and Tailwind CSS. Guests can explore destinations, activities, safari lodges, and 4x4 vehicles, assemble a custom itinerary in real time with live currency estimates (USD, EUR, GBP, ZAR), and submit a single booking request directly to the operations team with automated guest confirmations and WhatsApp integration.

---

## Quick Start

### Prerequisites
- **Node.js**: v20.x or later (v24 LTS recommended)
- **npm**: v10.x or later

### Installation & Local Development

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your local settings. In development, `MAIL_DRY_RUN=true` prints outgoing emails to your terminal console instead of connecting to an external SMTP server.

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## NPM Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev` | Starts the Next.js development server with Turbopack on port 3000. |
| `prebuild` | `npm run check:content` | Automated hook that executes prior to `npm run build` to validate catalog consistency. |
| `build` | `next build` | Compiles the production build, runs TypeScript type checks, validates production environment variables, and statically generates all pages. |
| `start` | `next start` | Starts the built production server locally (default port 3000). |
| `lint` | `eslint` | Runs ESLint with Next.js strict configuration to verify code style and hygiene. |
| `test` | `vitest run` | Runs the comprehensive Vitest unit test suite (pricing, trip state, request validation, mailers, env). |
| `test:e2e` | `playwright test` | Runs the full end-to-end Playwright test suite (flow, failure recovery, security, mobile viewports, tap targets, SEO) using a local in-memory SMTP sink. |
| `check:content` | `jiti scripts/check-content.ts` | Validates ID and slug uniqueness, mandatory fields, photo existence under `/public`, photo file sizes, alt text, and currency freshness. |
| `check:launch` | `jiti scripts/check-launch.ts` | Production readiness check. Scans for any lingering `[...]` placeholders, zero prices, unphotographed items, or stale rates. |
| `images:optimize` | `jiti scripts/optimize-images.ts` | Optimizes high-resolution source photos from `/photos-source/`, auto-rotates, strips GPS/EXIF data, resizes to 2000px max, converts to progressive JPEG at quality 78, and generates blur data URLs in `photo-meta.json`. |
| `smoke` | `jiti scripts/smoke.ts` | Non-destructive smoke test against a live deployed URL (checks 200 statuses, API validation, security headers, HTTPS redirect, canonical tags, and clean text). |

---

## Environment Variables

| Variable | Environment | Example Value | What Breaks If Missing |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production & Preview | `https://kaizentravel.co.zw` | Build fails in production. Used for canonical URLs, metadata base, sitemaps, robots.txt, and structured data. |
| `NEXT_PUBLIC_GSC_VERIFICATION` | Optional | `abc123googleVerification` | Google Search Console verification meta tag will not be injected. |
| `NEXT_PUBLIC_CONTENT_FIXTURES` | Test only | `1` | Injects test catalog fixtures for automated testing. **Forbidden in production** (build deliberately fails if active when `VERCEL_ENV=production`). |
| `SMTP_HOST` | Production & Preview | `smtp.postmarkapp.com` | Build fails in production; trip booking requests cannot be delivered via email. |
| `SMTP_PORT` | Production & Preview | `587` (or `465`) | Build fails in production; SMTP connection cannot be established. |
| `SMTP_SECURE` | Production & Preview | `false` (for 587) / `true` (465) | Build fails in production; TLS handshake negotiation mismatch. |
| `SMTP_USER` | Production & Preview | `api_token_username` | Build fails in production; SMTP authentication failure. |
| `SMTP_PASS` | Production & Preview | `secret_smtp_password` | Build fails in production; SMTP authentication failure. |
| `MAIL_FROM_NAME` | Production & Preview | `Kaizen Travel and Adventures` | Build fails in production; sender display name missing in outgoing emails. |
| `BOOKING_EMAIL` | Production & Preview | `bookings@kaizentravel.co.zw` | Build fails in production; team notification emails have no recipient address. |
| `MAIL_DRY_RUN` | Development only | `true` | When `true` in non-production, emails are logged to stdout instead of dispatched over SMTP. |

> [!IMPORTANT]
> None of the `SMTP_*` or `BOOKING_EMAIL` variables contain a `NEXT_PUBLIC_` prefix. They are exclusively imported by server-side modules and are never bundled into client browser code.

---

## Project Structure

```
├── app/                      # Next.js App Router routes & pages
│   ├── (offerings)/          # Category listing and [slug] detail pages
│   ├── api/request/          # Server endpoint handling booking requests & emails
│   ├── about/                # About company page
│   ├── contact/              # Contact info and direct links
│   ├── privacy/              # Privacy notice
│   ├── trip/                 # Interactive Trip Builder page
│   ├── error.tsx             # Branded error boundary page
│   ├── global-error.tsx      # Root global error fallback
│   ├── not-found.tsx         # 404 page
│   ├── icon.tsx              # Generated favicon (ImageResponse)
│   ├── apple-icon.tsx        # Generated Apple Touch Icon
│   ├── opengraph-image.tsx   # Generated social share banner
│   ├── robots.ts             # Search engine crawler directives
│   └── sitemap.ts            # Dynamic XML sitemap generator
├── components/               # React UI components
│   ├── trip/                 # Trip state components (TripBuilder, RequestForm, TripBar)
│   ├── ui/                   # Shared UI primitives (Button, Container, Section, Photo)
│   ├── CategoryPage.tsx      # Reusable offering category view
│   ├── DetailPage.tsx        # Offering detail view with gallery & breadcrumbs
│   ├── Gallery.tsx           # Touch-friendly photo carousel with thumbnails
│   ├── Header.tsx            # Navigation header with accessible mobile drawer
│   ├── Footer.tsx            # Site footer
│   └── JsonLd.tsx            # Schema.org structured data script tag
├── content/                  # Pure TypeScript content definitions
│   ├── __fixtures__/         # Static fixtures used during automated tests
│   ├── activities.ts         # Activity offerings catalog
│   ├── destinations.ts       # Destination offerings catalog
│   ├── lodges.ts             # Safari lodge offerings catalog
│   ├── vehicles.ts           # 4x4 safari vehicle offerings catalog
│   ├── categories.ts         # Category metadata and routing
│   ├── currency.ts           # Currency rates and update timestamp
│   ├── site.ts               # Brand, contact, and hours configuration
│   ├── about.ts              # Narrative content for About page
│   └── privacy.ts            # Privacy policy sections
├── lib/                      # Pure, isolated business logic & utilities
│   ├── content.ts            # Catalog accessor functions (getAll, getBySlug, getById)
│   ├── emails.ts             # Multipart HTML & plain-text email builders
│   ├── env.ts                # Production environment validation
│   ├── mail.ts               # Nodemailer SMTP transport layer
│   ├── pricing.ts            # Multi-currency price formulas & formatting
│   ├── request.ts            # Request validation, sanitation, and reference generator
│   ├── trip.ts               # Trip state reducer and derived calculations
│   └── whatsapp.ts           # WhatsApp URL builder and prefilled itinerary generator
├── photos-source/            # Source folder for original client photography (git-ignored)
├── public/                   # Static public assets, optimized images, test fixtures
├── e2e/                      # Playwright end-to-end test suite
│   ├── smtp-sink/            # In-memory SMTP server and HTTP control client
│   ├── flow.spec.ts          # End-to-end trip booking & email delivery flow
│   ├── failure.spec.ts       # SMTP failure, retention, and recovery flow
│   ├── security.spec.ts      # Honeypot, timing, price forgery, origin, and rate limiting
│   ├── seo.spec.ts           # SEO titles, meta tags, sitemap, robots, JSON-LD
│   ├── tripbar.spec.ts       # Mobile sticky trip bar behavior
│   ├── viewports.spec.ts     # Mobile layout and overflow checks across screen widths
│   └── taptargets.spec.ts    # Minimum 44px touch target compliance
└── scripts/                  # Operational CLI scripts
    ├── check-content.ts      # Validates content structure and photo references
    ├── check-launch.ts       # Validates that all launch placeholders are filled
    ├── optimize-images.ts    # Image optimization pipeline (sharp)
    └── smoke.ts              # Non-destructive post-deployment smoke tests
```

---

## Deployment Checklist (Vercel)

1. **Vercel Project Setup**:
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

2. **Environment Variables**:
   - In **Settings → Environment Variables**, add the production values for:
     - `NEXT_PUBLIC_SITE_URL` (e.g. `https://kaizentravel.co.zw`)
     - `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`
     - `MAIL_FROM_NAME`, `BOOKING_EMAIL`
     - Optional: `NEXT_PUBLIC_GSC_VERIFICATION`
   - Ensure `NEXT_PUBLIC_CONTENT_FIXTURES` is **NOT** set in production.
   - For **Preview** environments, set test SMTP credentials or set `MAIL_DRY_RUN=true` to test builds without sending live emails.

3. **Domain Configuration**:
   - Add your apex domain (`kaizentravel.co.zw`) and `www` subdomain in **Settings → Domains**.
   - Configure DNS records (A and CNAME) with your DNS registrar as guided by Vercel.
   - Configure Vercel to redirect `www` to apex (or vice versa).

4. **Post-Deployment Verification**:
   - Run the production smoke test against the live deployment:
     ```bash
     npm run smoke -- https://kaizentravel.co.zw https://www.kaizentravel.co.zw
     ```

5. **Rollback Procedure**:
   - In the event of an operational issue, open **Deployments** in the Vercel dashboard.
   - Locate the previous successful deployment and click **Promote to Production**. Instant zero-downtime rollback occurs in seconds without a rebuild.
