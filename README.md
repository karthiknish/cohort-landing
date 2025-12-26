# Cohorts.team Website

Marketing website + admin dashboard built with Next.js (App Router), Tailwind CSS, Firebase (Auth + Firestore), and Brevo for brochure email delivery.

## What’s in here

### Website
- Landing page composed from section components (Hero/About/Ethos/Features/CTA).
- “Download Brochure” modal that captures lead details.
- Spam protections in the modal (honeypot + minimum fill time).
- Lead submission hits a server route that:
	- Writes the lead to Firestore
	- Emails the brochure PDF via Brevo
	- Sends an admin notification email

### Admin
- Firebase Auth email/password login.
- Leads dashboard:
	- Search + status filter
	- Click a lead row to open a details modal
	- Update lead status (e.g. new/contacted/converted/spam)
	- Export the current filtered list to CSV

### Analytics
- Client events are logged (and skipped for `/admin/*`).
- Server-side ingest endpoint stores raw events + daily aggregates in Firestore.
- Optional GA4 reporting endpoints (requires a Google service account and GA4 property id).

## Tech stack
- Next.js 16 (App Router) + React 19
- Tailwind CSS v4
- Radix UI (Dialog)
- Firebase:
	- Client SDK for Auth
	- Admin SDK for Firestore / token verification
- Brevo (Sendinblue) SMTP API for brochure + notifications

## Project structure

- `src/app/*` – routes (public site, admin pages, API routes)
- `src/components/*` – UI + sections (landing page + modal)
- `src/components/ui/*` – reusable UI primitives (shadcn-style)
- `src/lib/*` – Firebase clients, admin setup, email + analytics helpers
- `public/*` – static assets (including `public/Brochure.pdf`)

## Local development

1) Install deps

```bash
npm install
```

2) Create `.env.local`

Required (Firebase client)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Required (server / Firebase Admin)

```bash
FIREBASE_SERVICE_ACCOUNT_BASE64=
```

Required (brochure email)

```bash
BREVO_API_KEY=
```

Optional (GA4 admin analytics)

```bash
GA4_PROPERTY_ID=
GOOGLE_SERVICE_ACCOUNT_BASE64=
```

3) Run dev server

```bash
npm run dev
```

Open http://localhost:3000

## Firebase setup notes

### Firestore
- The app uses the Firebase Admin SDK on the server for Firestore access.
- `firebase.json`, `firestore.rules`, and `firestore.indexes.json` are included for rules/index management.

### Creating `FIREBASE_SERVICE_ACCOUNT_BASE64`

1) Download a Firebase service account JSON from Google Cloud / Firebase console.
2) Base64 encode it (macOS):

```bash
base64 -i path/to/serviceAccount.json | tr -d '\n'
```

Paste the output into `FIREBASE_SERVICE_ACCOUNT_BASE64`.

## Key routes

### Public
- `/` – website
- `POST /api/leads` – accepts brochure form submissions and sends the brochure via email

### Admin
- `/admin/login` – Firebase Auth login
- `/admin/leads` – leads dashboard
- `GET/PATCH/DELETE /api/leads` – admin-only (requires `Authorization: Bearer <firebase-id-token>`)
- `POST /api/analytics/event` – server-side analytics ingest
- `/api/analytics/ga4/*` – GA4 reporting (admin-only)

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```
