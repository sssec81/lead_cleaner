# LeadCleanr Deployment Checklist

This is the current deployment guide for `lead_cleaner` / LeadCleanr as of 2026-06-14.

Use this file as the final pre-launch checklist.

For DigitalOcean + PM2 + Nginx server setup details, also see [DEPLOYMENT_DO_DROPLET.md](./DEPLOYMENT_DO_DROPLET.md).

## Status

The app currently passes:

```bash
npm run lint
NEXT_PUBLIC_SITE_URL=https://leadcleanr.com npm run build
npm test
```

## Required Production Environment Variables

Set these before launch:

```env
NEXT_PUBLIC_SITE_URL=https://leadcleanr.com
WAITLIST_WEBHOOK_URL=https://your-endpoint.example.com/waitlist
```

## Optional Environment Variables

Set these only if you use them:

```env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
ERROR_TRACKING_WEBHOOK_URL=https://your-endpoint.example.com/errors
WAITLIST_FILE_PATH=/absolute/path/to/waitlist.txt
```

Notes:

- `NEXT_PUBLIC_SITE_URL` is required for production builds. The build will fail if it is missing.
- `WAITLIST_WEBHOOK_URL` is the recommended production path for waitlist signups.
- `WAITLIST_FILE_PATH` is only for single-server deployments with persistent disk. Do not rely on it for serverless hosting.
- If both `WAITLIST_WEBHOOK_URL` and `WAITLIST_FILE_PATH` are unset in production, waitlist signups will fail intentionally instead of pretending they were saved.

## What the Current Production Setup Assumes

- Main domain: `https://leadcleanr.com`
- Next.js 16 app
- Node.js runtime
- Browser-side CSV/text processing
- Optional Google Analytics
- Optional error webhook for client-side error reporting

## Pre-Deploy Checklist

1. Pull latest `main`.
2. Install dependencies:

```bash
npm install
```

3. Set production environment variables.
4. Run verification:

```bash
npm run lint
NEXT_PUBLIC_SITE_URL=https://leadcleanr.com npm run build
npm test
```

5. Confirm the following production paths:
   - `/`
   - `/tools`
   - `/tools/csv-lead-cleaner`
   - `/tools/extract-emails-from-csv`
   - `/tools/extract-phone-numbers-from-csv`
   - `/pricing`
   - `/privacy`
   - `/contact`

6. Confirm these dynamic/server paths behave correctly:
   - `POST /api/waitlist`
   - `POST /api/telemetry/error`

## Waitlist Behavior

Current behavior:

- In production, LeadCleanr prefers `WAITLIST_WEBHOOK_URL`.
- If `WAITLIST_WEBHOOK_URL` is set, the app sends:

```json
{
  "email": "person@example.com",
  "source": "homepage",
  "receivedAt": "2026-06-14T12:00:00.000Z"
}
```

- If the webhook returns non-2xx, the signup fails.
- If no webhook is configured, the app only falls back to file storage when `WAITLIST_FILE_PATH` is explicitly set or when running outside production.

Recommended:

- Use a real webhook destination backed by a database, Airtable automation, SheetDB, Zapier, Make, Supabase Edge Function, or your own API.

## Analytics Behavior

Current behavior:

- Google Analytics is optional.
- Initial pageview delivery now retries briefly so first-load visits are less likely to be dropped while scripts are still loading.

## Error Reporting Behavior

Current behavior:

- Client errors are sanitized before sending.
- If `ERROR_TRACKING_WEBHOOK_URL` is configured, LeadCleanr posts sanitized error payloads there.
- Non-2xx webhook responses are treated as failures.
- If no webhook is configured, the server logs the error payload instead.

## Build Notes

- `next-env.d.ts` may change after builds because Next.js regenerates it. This is normal and usually should not be committed unless you intentionally want that generated diff.
- Production build command:

```bash
NEXT_PUBLIC_SITE_URL=https://leadcleanr.com npm run build
```

## Recommended Launch Order

1. Set env vars in the hosting platform.
2. Deploy the app.
3. Open the live site and verify key pages.
4. Submit a test waitlist signup.
5. Confirm the waitlist webhook received the payload.
6. Trigger one analytics pageview and confirm it appears in Google Analytics.
7. Trigger one test client error in a safe environment and confirm the error webhook or logs receive it.

## Go / No-Go

Go live when all of these are true:

- Build passes
- Tests pass
- `NEXT_PUBLIC_SITE_URL` is set
- waitlist storage is configured
- analytics envs are set if you want analytics
- error webhook is set if you want remote error reporting
- domain and SSL are working
