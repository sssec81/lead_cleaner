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

## Phase 2 Execution Roadmap

Based on the V1 MVP completion, the following 4-sprint roadmap has been defined to drive the product to $10k+ MRR.

**Sprint 1: Auth + Accounts (3-4 weeks)**
- **Goal:** Start building a user base and unblock paywalls.
- **Implementation:** Integrate NextAuth or Clerk for fast Google/Email login.
- **Scope:** Free tier users can create accounts; no payment walls yet.

**Sprint 2: Stripe + Paywall (2-3 weeks)**
- **Goal:** First revenue generation.
- **Implementation:** Stripe Checkout integration with a single ~$19/month plan.
- **Gated Features:** Larger CSV file limit (50MB) + saved workspace history.

**Sprint 3: Email Verification (4-6 weeks)**
- **Goal:** The major value-add upsell.
- **Implementation:** Server-side MX lookup + SMTP ping per email.
- **Pricing:** Offer 100 free verifications/month to drive hook, then require Pro/Credits for bulk verification.
- **Constraint:** Requires strict abuse prevention and rate-limiting on the DigitalOcean backend to prevent spam-checkers from draining resources.

**Sprint 4: API Access**
- **Goal:** Capture developers, agencies, and automation pipelines.
- **Implementation:** REST API with key management.
- **Timing:** Only begin after capturing user feedback and revenue from Sprints 1-3.
