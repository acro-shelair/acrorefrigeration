import type { NextConfig } from "next";
import { createClient } from "@supabase/supabase-js";

async function getOldSiteRedirects() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) return [];

  const supabase = createClient(supabaseUrl, supabaseKey);
  const redirects: {
    source: string;
    destination: string;
    permanent: boolean;
  }[] = [];

  // Redirect old blog URLs: /blog-slug → /resources/blog-slug
  const { data: posts } = await supabase
    .from("posts")
    .select("slug")
    .eq("published", true);

  if (posts) {
    for (const post of posts) {
      redirects.push({
        source: `/${post.slug}`,
        destination: `/resources/${post.slug}`,
        permanent: true,
      });
    }
  }

  // Redirect old service URLs: /service-slug → /services/service-slug
  const { data: services } = await supabase
    .from("services")
    .select("slug")
    .not("slug", "is", null);

  if (services) {
    for (const service of services) {
      redirects.push({
        source: `/${service.slug}`,
        destination: `/services/${service.slug}`,
        permanent: true,
      });
    }
  }

  return redirects;
}

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
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
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Next.js hashed static chunks (JS/CSS)
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        // Next.js image optimisation endpoint
        source: "/_next/image/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        // Dynamic OG images — cache for 1 day, SWR for 7 days
        source: "/api/og",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
  async redirects() {
    const oldSiteRedirects = await getOldSiteRedirects();

    return [
      // Manual redirects for renamed pages
      {
        source: "/process",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },

      {
        source: "/blog",
        destination: "/resources",
        permanent: true,
      },

      {
        source: "/about-us",
        destination: "/",
        permanent: true,
      },

      // ── Old service pages → related current services ──────────────────────
      {
        source: "/commercial-airconditioning",
        destination: "/services/24-7-commercial-air-conditioning-repairs",
        permanent: true,
      },
      {
        source: "/commercial-refrigeration-installation",
        destination: "/services/cold-room-builder-qld",
        permanent: true,
      },
      {
        source: "/commercial-refrigeration-maintenance",
        destination: "/services/refrigeration-preventive-maintenance-qld",
        permanent: true,
      },
      {
        source: "/commercial-refrigeration-maintenance/cold-room-maintenance",
        destination: "/services/refrigeration-preventive-maintenance-qld",
        permanent: true,
      },
      {
        source: "/commercial-refrigeration-hygiene-inspection",
        destination: "/services/haccp-compliance-certification",
        permanent: true,
      },
      {
        source: "/equipment-replacement-consulting",
        destination: "/services/refrigeration-energy-audits",
        permanent: true,
      },
      {
        source: "/electrical-contractors-brisbane",
        destination: "/services/24-7-commercial-air-conditioning-repairs",
        permanent: true,
      },
      {
        source:
          "/electrical-contractors-brisbane/commercial-air-conditioning-brisbane-gold-coast",
        destination: "/services/24-7-commercial-air-conditioning-repairs",
        permanent: true,
      },

      // ── Old product pages → related services or services index ────────────
      {
        source: "/commercial-refrigeration-products",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/commercial-refrigeration-products/chillers",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/refrigerated-display-cabinets-and-fridges",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/fridge-freezer-cold-room-seals",
        destination: "/services/cold-room-builder-qld",
        permanent: true,
      },
      {
        source: "/ice-machines-brisbane-gold-coast-sunshine-coast-qld",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/skid-mount-cold-room-sales-hire",
        destination: "/services/mobile-cold-rooms",
        permanent: true,
      },
      {
        source: "/wine-rooms-and-wine-storage",
        destination: "/services/cold-room-builder-qld",
        permanent: true,
      },

      // ── Old content/resource pages ────────────────────────────────────────
      {
        source: "/about-us",
        destination: "/",
        permanent: true,
      },
      {
        source: "/blog",
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/cold-room-faq",
        destination: "/services/cold-room-builder-qld",
        permanent: true,
      },
      {
        source: "/cold-room-gallery",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/commercial-refrigeration-faq",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/commercial-refrigeration-book",
        destination: "/resources",
        permanent: true,
      },
      {
        source: "/air-conditioning-calculator",
        destination: "/services/refrigeration-energy-audits",
        permanent: true,
      },
      {
        source: "/need-finance",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/careers",
        destination: "/contact",
        permanent: true,
      },

      // ── Old legal pages ───────────────────────────────────────────────────
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/refund_returns",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/shipping-policy",
        destination: "/terms",
        permanent: true,
      },

      // Auto-generated redirects from old site URLs
      ...oldSiteRedirects,
    ];
  },
};

export default nextConfig;
