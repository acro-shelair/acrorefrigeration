# SEO Handoff — Acro Refrigeration (acrorefrigerationnext)

**Date:** 2026-05-02
**Status:** Plan agreed, no code changes made yet.

---

## Problem

Programmatic location/industry/brand pages are stuck in Google Search Console as "Discovered – currently not indexed." Google found them but decided they are not worth crawling, which is the standard signal for thin/near-duplicate content.

### Root cause

- ~50 suburb pages under `/locations/[city]/[suburb]` share ~95% identical content.
- Each has: H1 with suburb name, 2-sentence intro, ~50 words of suburb filler, then identical services grid (10 cards), identical industries grid (9 tiles), 3 nearby suburb chips, same Recent Projects section.
- Google compares pages, detects near-duplicate bodies, and deprioritises the whole tier.

---

## Architecture (as found)

- **Framework:** Next.js App Router with ISR (`revalidate = 300`)
- **Data source:** Supabase (all pages are DB-driven — no static data files used by routes)
- **Route structure:**
  - `/locations/[citySlug]/[suburbSlug]/page.tsx` — suburb detail (the problem tier)
  - `/locations/[citySlug]/page.tsx` — city hub
  - `/industries/[industrySlug]/page.tsx` — industry detail
  - `/brands/[brandSlug]/page.tsx` — brand detail
- **Sitemap:** `app/sitemap.ts` — currently includes all suburb URLs

---

## Strategic Decision (agreed in session)

**Consolidate the suburb tier. Differentiate the industry tier.**

### Why consolidate suburbs

Commercial refrigeration in QLD is B2B and reactive. Search intent is city-level ("commercial refrigeration repair Brisbane"), not suburb-level. Local pack / Google Business Profile covers the suburb proximity signal better than organic pages. Writing 50 genuine suburb content briefs has very low ROI for this business type.

### Why differentiate industries

9 industry pages, each with genuinely distinct content needs:
- Healthcare → TGA compliance, temperature logging, regulatory requirements
- Hospitality → peak-season urgency, multi-unit venues, bar/cellar equipment
- Supermarkets → uptime SLAs, scale, remote monitoring
- Convenience stores, aged care, food production, etc.

These pages can rank for high-intent queries like "healthcare refrigeration compliance QLD" and are manageable to enrich (9 pages, not 50).

---

## Action Plan

### Phase 1 — Stop the bleeding (immediate)

**1a. noindex suburb pages**
- File: `app/locations/[citySlug]/[suburbSlug]/page.tsx`
- In `generateMetadata`, add `robots: { index: false, follow: true }` to the returned metadata object.
- This emits `<meta name="robots" content="noindex, follow">` on every suburb page.
- `follow: true` keeps link equity flowing to city pages via internal links.

```ts
// Inside generateMetadata return:
robots: { index: false, follow: true },
```

**1b. Remove suburb URLs from sitemap**
- File: `app/sitemap.ts`
- The `suburbRoutes` constant (lines 73–78) builds all suburb URLs.
- Remove the `suburbRoutes` array and its spread from the final return (line 88).
- This stops submitting suburb URLs to Google — noindex alone still wastes crawl budget if Google keeps finding them via sitemap.

```ts
// DELETE lines 73–78 (suburbRoutes const)
// DELETE ...suburbRoutes from the return array
```

---

### Phase 2 — Enrich city pages (short-term, 1–2 weeks)

Make the 3–4 city pages (Brisbane, Gold Coast, Sunshine Coast, Ipswich/other) genuinely substantive. Each city page should have:

- **Project case studies by area** — pull from Supabase `projects` table filtered to that city; display with photos, business type, problem solved
- **City-specific commercial density** — e.g., "Brisbane CBD has X licensed food businesses requiring HACCP compliance" (can be written once per city, not per suburb)
- **Coastal/climate context for Gold Coast** — salt air corrosion, humidity impact on refrigeration
- **Area-specific business types** — Fortitude Valley restaurants, Surfers Paradise hospitality strip, etc.
- **Testimonials filtered to that city** (if available in DB)

File to enrich: `components/pages/CityHub.tsx` (or equivalent — check component name)

---

### Phase 3 — Differentiate industry pages (medium-term, 2–4 weeks)

For each of the 9 industries, the Supabase `industries` table already has fields for:
- `features` (array), `stats`, `challenges`, `industry_services`, `case_study`

Priority order for enrichment:
1. `healthcare-refrigeration-services` — strong compliance angle, high trust content
2. `hospitality-refrigeration-services` — large addressable market in QLD
3. `supermarket-refrigeration-services` — scale and uptime narrative
4. Remaining 6 in order of client's existing project portfolio

Each page needs:
- At least one real case study (industry-specific, not generic)
- Compliance/regulatory content specific to that industry (HACCP, TGA, food safety acts)
- Equipment types specific to that industry (not the same 10 service cards)
- FAQ section with industry-specific questions

Admin panel exists at `/admin/industries` — content can be added there without code changes.

---

### Phase 4 — Decide suburb fate (long-term)

Two options after phase 1–3 are done:

**Option A — Keep noindex permanently**
Suburbs exist as UX navigation only (nearby suburb chips, internal links). They serve users but tell Google to ignore them. City pages absorb all the SEO value.

**Option B — Redirect suburbs to city pages**
Add permanent 301 redirects from `/locations/[city]/[suburb]` → `/locations/[city]` in `next.config.ts`. Then delete the suburb route. Cleaner long-term.

> Recommendation: do Option A first (it's already done from Phase 1), monitor city page indexing and rankings for 4–6 weeks, then decide if Option B is worth the redirect overhead.

---

## Files to Change (summary)

| File | Change | Phase |
|---|---|---|
| `app/locations/[citySlug]/[suburbSlug]/page.tsx` | Add `robots: { index: false, follow: true }` in `generateMetadata` | 1a |
| `app/sitemap.ts` | Remove `suburbRoutes` const and its spread from return | 1b |
| `components/pages/CityHub.tsx` (or similar) | Enrich city page UI with case studies, local context | 2 |
| Supabase `industries` table (via admin) | Add case studies, compliance content, industry-specific FAQs | 3 |
| `next.config.ts` (optional) | Add 301 redirects from suburb → city | 4B |

---

## What Was NOT Done

No code changes have been made in this session. Everything above is agreed strategy only.

---

## Notes

- `dynamicParams = true` is set on suburb pages — do not remove this. It allows ISR fallback for any suburb slugs added to DB later. Even with noindex, you may still want the pages to render for users who land on them via direct links.
- The `data/locations.ts`, `data/industries.ts`, `data/brands.ts` files are **legacy** — not used by any app route. Don't edit these.
- Admin panel is live at `/admin` — industry/brand content can be enriched without code changes.
- Middleware only covers `/admin` routes. Public routes have no auth layer.
