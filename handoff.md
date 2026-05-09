# SEO Handoff — Acro Refrigeration (acrorefrigerationnext)

**Date:** 2026-05-02
**Status:** Phase 1 complete. Phase 2 complete (code done, DB migration pending).

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
- **Sitemap:** `app/sitemap.ts` — suburb URLs removed

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

### Phase 1 — Stop the bleeding ✅ COMPLETE

**1a. noindex suburb pages** ✅ Already present in code
- `app/locations/[citySlug]/[suburbSlug]/page.tsx` line 42
- `robots: { index: false, follow: true }` in `generateMetadata`

**1b. Remove suburb URLs from sitemap** ✅ Done 2026-05-02
- `app/sitemap.ts` — removed `suburbRoutes` const and its spread
- Trimmed the `cities` query to remove the `location_suburbs` join (no longer needed)

---

### Phase 2 — Enrich city pages ✅ Code complete, DB migration pending

**Goal:** Make the 3–4 city pages genuinely substantive so Google indexes and ranks them.

**What was already in CityHub (no changes needed):**
- Projects/case studies filtered by city (with photos)
- City stats bar
- Coverage zones grid with suburb business types
- Helpful resources / posts section

**What was added (2026-05-02):**

**2a. Testimonials section**
- Route `app/locations/[citySlug]/page.tsx` now fetches `getAllTestimonials` and passes to `CityHub`
- `CityHub.tsx` renders `<Testimonials>` (reuses existing home component) between Case Studies and Resources
- Renders all testimonials — no city filtering since `testimonials` table has no `city_id`

**2b. City Content Sections (rich blocks)**
- New `city_sections` jsonb field on `location_cities` table — array of `{heading, blocks[]}` using the same block schema as `post_sections` (paragraph, image, blockquote, list, faq)
- `CityHub.tsx` renders sections with H2 headings and `ContentBlockRenderer` (shared with ResourcePage)
- Section hidden if array is empty — safe to deploy before content is written

**2c. Key Business Areas section**
- New `key_areas` jsonb field on `location_cities` table (`[{name, description}]`)
- `CityHub.tsx` renders after city sections: grid of named precinct cards (e.g. Fortitude Valley, South Bank)
- Section hidden if array is empty — safe to deploy before content is written

**2d. Admin editor for city content**
- New full-page editor at `/admin/locations/[id]/edit` — same sections/blocks pattern as PostEditor
- Handles all city fields: name, slug, region description, zones, sample suburbs, stats, key areas, content sections
- Pencil icon on each city row in `/admin/locations` now navigates to this editor instead of a modal
- `CityDialog` kept for creating new cities only

**Migration to run:**
```
supabase/migrations/20260502000029_city_seo_fields.sql
```
Run this against Supabase before using the editor. Fields default to `[]` so no existing rows break.

**Content to write (via `/admin/locations` → pencil icon → city editor):**

For each city:
- **Key Areas**: add 4–8 precinct cards (name + 1-sentence description)
- **Content Sections**: add 2–3 sections with H2 headings. Example for Brisbane:
  - "Brisbane's Commercial Refrigeration Market" → paragraphs about CBD density, food business count, HACCP compliance
  - "Climate & Compliance" → subtropical heat, humidity, cold chain requirements
  - "Frequently Asked Questions" → FAQ block with 3–4 city-specific questions

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

## Files Changed (summary)

| File | Change | Phase | Status |
|---|---|---|---|
| `app/locations/[citySlug]/[suburbSlug]/page.tsx` | `robots: { index: false, follow: true }` in `generateMetadata` | 1a | ✅ Was already present |
| `app/sitemap.ts` | Removed `suburbRoutes` const, spread, and suburbs join from cities query | 1b | ✅ Done |
| `lib/supabase/content.ts` | Added `local_context` and `key_areas` to `LocationCity` interface | 2 | ✅ Done |
| `app/locations/[citySlug]/page.tsx` | Fetch `getAllTestimonials`, pass to `CityHub` | 2 | ✅ Done |
| `components/pages/CityHub.tsx` | Added City Sections, Key Areas, Testimonials sections | 2 | ✅ Done |
| `components/ContentBlockRenderer.tsx` | Extracted from ResourcePage — shared by CityHub and ResourcePage | 2 | ✅ Done |
| `components/pages/ResourcePage.tsx` | Updated to import ContentBlockRenderer from shared file | 2 | ✅ Done |
| `app/admin/locations/CityEditor.tsx` | New full-page city editor (metadata + key areas + sections/blocks) | 2 | ✅ Done |
| `app/admin/locations/[id]/edit/page.tsx` | New edit route for cities | 2 | ✅ Done |
| `app/admin/locations/LocationsClient.tsx` | Pencil icon now links to `/admin/locations/[id]/edit` | 2 | ✅ Done |
| `supabase/migrations/20260502000029_city_seo_fields.sql` | Adds `city_sections` and `key_areas` columns | 2 | ⏳ Run against Supabase |
| Supabase `location_cities` table | Fill `city_sections` and `key_areas` per city via `/admin/locations` | 2 | ⏳ Content to write |
| Supabase `industries` table (via admin) | Add case studies, compliance content, industry-specific FAQs | 3 | ⏳ Pending |
| `next.config.ts` (optional) | Add 301 redirects from suburb → city | 4B | ⏳ Pending decision |

---

## Notes

- `dynamicParams = true` is set on suburb pages — do not remove this. It allows ISR fallback for any suburb slugs added to DB later. Even with noindex, you may still want the pages to render for users who land on them via direct links.
- The `data/locations.ts`, `data/industries.ts`, `data/brands.ts` files are **legacy** — not used by any app route. Don't edit these.
- Admin panel is live at `/admin` — industry/brand content can be enriched without code changes.
- Middleware only covers `/admin` routes. Public routes have no auth layer.
- Testimonials have no `city_id` — all testimonials show on all city pages. If city-specific filtering is needed later, add a `city_id` FK column to the `testimonials` table.
