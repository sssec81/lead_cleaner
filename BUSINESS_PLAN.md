# LeadCleanr Business Plan

This document captures the current monetization and product direction for LeadCleanr as of 2026-06-05.

## Core Positioning

LeadCleanr should be positioned as:

`Clean messy lead CSV files before CRM import`

Not as:

- generic email extractor
- ad-supported utility site
- verification platform on day one

The best initial buyer is someone doing repeat spreadsheet cleanup work:

- agencies
- recruiters
- sales ops teams
- marketers
- freelancers and virtual assistants

## Product Strategy

The product should follow a:

- free entry point for light use
- Pro upgrade for heavier CSV workflows
- later expansion into verification, saved workflows, and integrations

This should be a workflow-first SaaS, not a content site with ads.

## Monetization Strategy

## Recommended Model

Use:

- freemium
- one clear Pro plan

Do not start with:

- ads
- multiple confusing paid tiers
- enterprise sales positioning
- artificial export limits

## Why No Export Limit

The app is browser-first:

- CSV parsing happens in the browser
- exports happen in the browser
- the app does not incur meaningful server cost per export in the current MVP

Because of that, limiting exports such as:

- `1 CSV export per day`

is a weak monetization lever.

It creates friction without matching actual cost.

## Better Upgrade Trigger

The right paid trigger is heavier usage, not export clicks.

Charge for:

- larger CSV files
- heavier operational use
- future premium workflow features

That means the main free vs Pro boundary should be:

- file size limits
- possibly larger workflow complexity later

## Recommended Plans

## Free

Free should be generous enough to prove the product works.

Suggested Free plan:

- all text tools free
- browser-side CSV cleanup
- unlimited exports
- CSV uploads up to `2 MB`
- no account required during MVP

Why:

- easy to try
- strong SEO entry point
- low friction
- aligned with actual infra cost

## Pro

Pro should be for heavier spreadsheet work.

Suggested Pro plan:

- price target: `$12/month`
- larger CSV upload limit, such as `10 MB` or `25 MB`
- future advanced workflow features
- future saved cleanup history
- future faster support / support priority

Positioning:

`Free for lightweight browser-side cleanup. Pro for larger CSV files and heavier operational use.`

## Phase 2 Execution Roadmap (14-Week Plan)

**Locked Stack for Phase 2:**
- Next.js + Tailwind (existing)
- Supabase (auth + db + edge functions)
- Stripe (payments)
- Resend (email)

### Features by Tier

**Free (Stays as-is)**
- All existing text tools (extract emails, phones, URLs, domains)
- CSV cleaning up to 2MB
- Browser-side only, no account needed

**Pro — $19/mo**
- CSV up to 50MB
- Email verification (MX + SMTP) — 500/mo included
- Saved workspaces (access across devices)
- Export presets (HubSpot, Apollo, CSV formats)
- Workspace history (last 30 days)

**Pro+ / Credits Expansion**
- Extra verification credits ($5 per 1000) — pay as you go on top of Pro
- Drives expansion revenue without raising the base subscription price

### Build Order & Sprints

| Sprint | Goal | Duration |
|--------|------|----------|
| **1** | Supabase auth (Google + magic link) + basic account page | 3 weeks |
| **2** | Stripe checkout + paywall (file size gate first, easiest) | 2 weeks |
| **3** | Saved workspaces (biggest retention driver) | 3 weeks |
| **4** | Email verification via Edge Functions | 4 weeks |
| **5** | Export presets | 2 weeks |

*(Total expected timeline: ~14 weeks to a fully monetizable product)*
