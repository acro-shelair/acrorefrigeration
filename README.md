# Acro Refrigeration Website

Commercial refrigeration services website with a full admin CMS, built on Next.js 16 (App Router).

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 3, shadcn/ui (Radix primitives), Framer Motion
- **Database & Auth:** Supabase (PostgreSQL, Auth, Storage)
- **Forms:** React Hook Form + Zod validation
- **Package Manager:** Yarn

## Prerequisites

- Node.js >= 20
- Yarn
- A Supabase project

## Getting Started

1. **Install dependencies:**

   ```bash
   yarn install
   ```

2. **Set up environment variables:**

   Create a `.env.local` file in the project root with:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_ROLE_KEY=<your-supabase-service-role-key>
   ```

3. **Set up the database:**

   Run the SQL files in your Supabase SQL Editor in this order:
   - `supabase/setup.sql` -- creates tables, RLS policies, and storage buckets
   - `supabase/seed.sql` -- populates initial data (optional)

4. **Run the dev server:**

   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command      | Description                |
|--------------|----------------------------|
| `yarn dev`   | Start development server   |
| `yarn build` | Production build           |
| `yarn start` | Start production server    |
| `yarn lint`  | Run ESLint                 |

## Project Structure

```
app/                        # Next.js route pages (thin wrappers, metadata)
  admin/                    # Admin CMS routes (login, posts, services, etc.)
  brands/                   # Public brand pages
  industries/               # Public industry pages
  services/                 # Public service pages
  resources/                # Blog / resources pages
  locations/                # Service area pages
  ...                       # Other public routes

components/
  home/                     # Home page section components
  pages/                    # Full page components (public + admin)
  ui/                       # shadcn/ui components
  Footer.tsx, Navbar.tsx    # Shared layout components
  Layout.tsx                # Public page layout wrapper
  PublicShell.tsx            # Public shell with nav + footer

data/                       # Static content data files (CMS-ready)
  home.ts                   # Hero, trust bar, capabilities, FAQ, etc.
  services.ts               # Service definitions + detail pages
  industries.ts             # Industry verticals
  brands.ts                 # Brand/manufacturer data
  pricing.ts                # Pricing tiers
  contact.ts                # Contact page content
  process.ts                # Process steps
  projects.ts               # Portfolio/case study content
  locations.ts              # Cities and suburbs

lib/
  supabase/                 # Supabase client and query helpers
    client.ts               # Browser client
    server.ts               # Server/SSR client
    posts.ts                # Post queries and types
    content.ts              # Dynamic content queries
    static.ts               # Static content queries
    legal.ts                # Legal page queries
    admin.ts                # Admin-specific queries
    logging.ts              # Activity log queries
  seo/                      # SEO utilities and metadata
  rbac.ts                   # Role-based access control helpers
  convertToWebp.ts          # Client-side image conversion
  utils.ts                  # General utilities (cn, etc.)

middleware.ts               # Auth middleware (protects /admin/*)
supabase/
  setup.sql                 # Database schema, RLS, storage buckets
  seed.sql                  # Seed data
  migrations/               # Database migrations
```

## Architecture

### Public Site

Route pages in `app/` are thin wrappers that define metadata and render components from `components/pages/`. Static content comes from `data/` files, while dynamic content (posts, services, industries, etc.) is fetched from Supabase with ISR (`revalidate = 300`).

### Admin CMS

The admin dashboard at `/admin` is a full content management system with:

- **Content management** for posts, services, industries, brands, projects, testimonials, locations, FAQs, pricing, and legal pages
- **Rich post editor** with multi-section support and block types (paragraph, image, blockquote, list, FAQ)
- **Image uploads** to Supabase Storage with automatic WebP conversion
- **Employee portal** for shared documents and forms
- **User management** with role-based access (Admin / Employee)
- **Activity logging** for audit trails
- **Cache revalidation** controls for ISR

See [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) for end-user documentation.

### Auth & Permissions

- `middleware.ts` protects all `/admin/*` routes, redirecting unauthenticated users to `/admin/login`
- Two roles: **Admin** (full access) and **Employee** (permission-based)
- Permissions are defined in `lib/rbac.ts` and control sidebar visibility and page access
- Supabase RLS ensures public users can only read published content

### Data Flow

- **Static content** (`data/*.ts`) -- edit these files to update content that doesn't change often (hero section, capabilities grid, etc.)
- **Dynamic content** (Supabase) -- managed through the admin CMS. Served to the public site via ISR.
- **Images** -- uploaded to Supabase Storage buckets (`post-images`, `project-images`, `portal-files`)

## Supabase Storage Buckets

| Bucket           | Purpose                        |
|------------------|--------------------------------|
| `post-images`    | Blog post cover and inline images |
| `project-images` | Project gallery and industry cover images |
| `portal-files`   | Employee portal documents      |

## Deployment

The site is deployed on [Vercel](https://vercel.com). Push to `main` to trigger a production deployment.

Ensure the environment variables listed above are configured in Vercel's project settings.
