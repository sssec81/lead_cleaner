# LeadCleanr Business Plan

This document captures the monetization and product direction for LeadCleanr as of 2026-06-05.

## Core Positioning

LeadCleanr is positioned as:
`Clean messy lead CSV files before CRM import`

The best initial buyers are professionals doing repeat spreadsheet cleanup work:
- Sales ops teams
- Recruiters
- Marketers
- Agencies
- Virtual assistants

## Monetization Strategy

**Model:** Freemium with one clear Pro plan.
- No ads.
- No artificial export limits.
- The upgrade trigger is **heavier usage** (larger files) and **premium value** (verification).

### Pricing & Tiers

**Free (Anonymous allowed)**
- All text extraction tools
- CSV cleaning up to **2 MB**
- Unlimited exports
- *Credit limit:* 0 verifications.

**Pro — $19/month**
- CSV cleaning up to **25 MB**
- **500** Email Verifications (MX + SMTP) per month included (No rollover, resets monthly)
- Saved workspaces & cleanup history retained for **30 days** (Requires Account)
- Export presets (HubSpot, Apollo formats)

**Pro+ Expansion (Pay-as-you-go Credits)**
- Extra verification credits at **$5 per 1,000**
- *Mechanic:* When users hit 0 credits, they hit a hard paywall prompt to top up. Free/Anonymous users cannot buy credits without upgrading to Pro first.

## Churn Prevention Strategy

The anchor for retention is **Saved Workspaces**. 
Users don't stay subscribed month-over-month for a utility tool unless their data and operational history live inside it. By automatically saving their previous CSV cleanups, deduplication rules, and verification states to their account, switching to a competitor becomes a frustrating loss of context. Saved workspaces are the primary mechanism for lowering churn.

## Phase 2 Privacy Shift

The MVP's strongest selling point is "100% browser-side privacy." Once we introduce Supabase and Saved Workspaces for Pro users, that claim fundamentally changes. 

**Requirement:** Before launching Sprint 3 (Saved Workspaces), we must update the Privacy Policy to explicitly state that Pro user data is stored server-side for 30 days to enable history features, while Free tier users remain 100% browser-side. This ensures strict GDPR compliance and maintains trust.

## Phase 2 Execution Roadmap (14-Week Plan)

**Locked Stack:**
- Next.js + Tailwind (existing MVP)
- Supabase (Auth + DB + Edge Functions)
- Stripe (Payments)
- Resend (Email)

### Build Order & Sprints

| Sprint | Goal | Duration | Success Metric (Go/No-Go) |
|--------|------|----------|---------------------------|
| **0: Distribution**| Landing page copy, 3 Reddit communities, PH draft | 1 week | Prep complete & targeted |
| **1: Auth** | Supabase auth (Google + email) + account page | 3 weeks | 50 registered users who use a tool post-signup |
| **2: Paywall** | Stripe checkout gating the 25MB file limit | 2 weeks | First 10 paying customers ($190 MRR) |
| **3: Retention** | Saved workspaces & 30-day history UI | 3 weeks | 30% of paid users returning weekly |
| **4: Verification**| Server-side MX/SMTP ping via Edge Functions | 4 weeks | Hit 50 Pro users (~$1k MRR) |
| **5: Presets** | One-click HubSpot/Apollo CSV exports | 2 weeks | 20% of exports using a preset |

*(Total expected timeline: ~14 weeks to a fully monetizable product)*
