import type { NextConfig } from "next";
import { createClient } from "@supabase/supabase-js";

type RedirectRule = {
  source: string;
  destination: string;
  permanent: boolean;
};

/**
 * Helper that creates a permanent (308) redirect which matches both
 * trailing-slash and non-trailing-slash variants of the source path.
 * This prevents extra hops in the redirect chain for legacy WordPress
 * URLs (which always have trailing slashes).
 */
function redirect(source: string, destination: string): RedirectRule {
  return {
    source: `${source}{/}?`,
    destination,
    permanent: true,
  };
}

async function getOldSiteRedirects(): Promise<RedirectRule[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);
  const redirects: RedirectRule[] = [];

  // Redirect old blog URLs: /blog-slug → /resources/blog-slug
  const { data: posts } = await supabase
    .from("posts")
    .select("slug")
    .eq("published", true);

  if (posts) {
    for (const post of posts) {
      redirects.push(redirect(`/${post.slug}`, `/resources/${post.slug}`));
    }
  }

  // Redirect old service URLs: /service-slug → /services/service-slug
  const { data: services } = await supabase
    .from("services")
    .select("slug")
    .not("slug", "is", null);

  if (services) {
    for (const service of services) {
      redirects.push(redirect(`/${service.slug}`, `/services/${service.slug}`));
    }
  }

  return redirects;
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Cache transformed images for 30 days regardless of source Cache-Control headers.
    // Prevents re-transforming the same Supabase image URLs on every ISR cycle.
    minimumCacheTTL: 2592000,
    // Limit the size ladder to reduce the number of unique transformations generated.
    deviceSizes: [640, 828, 1080, 1200, 1920],
    imageSizes: [32, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "esmmbokesamphdtwnoxu.supabase.co",
        pathname: "/storage/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "framer-motion",
      "lucide-react",
      "@radix-ui/react-accordion",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-tooltip",
    ],
  },
  async headers() {
    return [
      {
        // Static assets (images, fonts, icons)
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next.js hashed static chunks (JS/CSS)
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next.js image optimisation endpoint
        source: "/_next/image/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Dynamic OG images — cache for 1 day, SWR for 7 days
        source: "/api/og",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async redirects() {
    const oldSiteRedirects = await getOldSiteRedirects();

    return [
      // ── Manual redirects for renamed pages ────────────────────────────────
      redirect("/process", "/services"),
      redirect("/contact-us", "/contact"),
      redirect("/blog", "/resources"),
      redirect("/about-us", "/"),

      // ── Old service pages → related current services ──────────────────────
      redirect(
        "/commercial-airconditioning",
        "/services/emergency-refrigeration-repairs"
      ),
      redirect(
        "/emergency-commercial-refrigeration-repairs",
        "/services/emergency-refrigeration-repairs"
      ),
      redirect(
        "/commercial-refrigeration-repairs",
        "/services/emergency-refrigeration-repairs"
      ),
      redirect(
        "/services/commercial-refrigeration-maintenance",
        "/services/refrigeration-preventive-maintenance-qld"
      ),
      redirect(
        "/services/emergency-commercial-refrigeration-repairs",
        "/services/emergency-refrigeration-repairs"
      ),
      redirect(
        "/commercial-refrigeration-installation",
        "/services/cold-room-builder-qld"
      ),
      redirect(
        "/commercial-refrigeration-maintenance",
        "/services/refrigeration-preventive-maintenance-qld"
      ),
      redirect(
        "/commercial-refrigeration-maintenance/cold-room-maintenance",
        "/services/refrigeration-preventive-maintenance-qld"
      ),
      redirect(
        "/commercial-refrigeration-hygiene-inspection",
        "/services/haccp-compliance-certification"
      ),
      redirect(
        "/equipment-replacement-consulting",
        "/services/refrigeration-energy-audits"
      ),
      redirect(
        "/electrical-contractors-brisbane",
        "/services/emergency-refrigeration-repairs"
      ),
      redirect(
        "/electrical-contractors-brisbane/commercial-air-conditioning-brisbane-gold-coast",
        "/services/emergency-refrigeration-repairs"
      ),

      // ── Old product pages → related services or services index ────────────
      redirect("/commercial-refrigeration-products", "/services"),
      redirect("/commercial-refrigeration-products/chillers", "/services"),
      redirect("/refrigerated-display-cabinets-and-fridges", "/services"),
      redirect(
        "/fridge-freezer-cold-room-seals",
        "/services/cold-room-builder-qld"
      ),
      redirect(
        "/ice-machines-brisbane-gold-coast-sunshine-coast-qld",
        "/services"
      ),
      redirect(
        "/skid-mount-cold-room-sales-hire",
        "/services/mobile-cold-rooms"
      ),
      redirect(
        "/wine-rooms-and-wine-storage",
        "/services/cold-room-builder-qld"
      ),

      // ── Old content/resource pages ────────────────────────────────────────
      redirect("/cold-room-faq", "/services/cold-room-builder-qld"),
      redirect("/cold-room-gallery", "/projects"),
      redirect("/commercial-refrigeration-faq", "/services"),
      redirect("/commercial-refrigeration-book", "/resources"),
      redirect(
        "/air-conditioning-calculator",
        "/services/refrigeration-energy-audits"
      ),
      redirect("/need-finance", "/contact"),
      redirect("/careers", "/contact"),

      // ── Old legal pages ───────────────────────────────────────────────────
      redirect("/privacy-policy", "/privacy"),
      redirect("/terms-and-conditions", "/terms"),
      redirect("/refund_returns", "/terms"),
      redirect("/shipping-policy", "/terms"),

      // ── Auto-generated redirects from old site URLs ───────────────────────
      ...oldSiteRedirects,
    ];
  },
};

export default nextConfig;
