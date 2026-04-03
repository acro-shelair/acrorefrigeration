"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const suggestedPages = [
  { href: "/services", label: "Services", keywords: ["service", "repair", "maintenance", "emergency", "cold-room", "installation", "hvac", "refrigeration", "compliance", "monitoring", "energy", "audit"] },
  { href: "/resources", label: "Resources & Blog", keywords: ["blog", "guide", "article", "case-study", "video", "tip", "how-to", "resource"] },
  { href: "/industries", label: "Industries", keywords: ["restaurant", "hotel", "hospitality", "supermarket", "retail", "pharmacy", "medical", "healthcare", "food", "warehouse", "logistics"] },
  { href: "/brands", label: "Brands", keywords: ["bitzer", "copeland", "danfoss", "daikin", "heatcraft", "carrier", "trane", "brand"] },
  { href: "/projects", label: "Projects", keywords: ["project", "case-study", "portfolio", "work", "build"] },
  { href: "/locations", label: "Locations", keywords: ["brisbane", "gold-coast", "sunshine-coast", "toowoomba", "ipswich", "location", "area", "suburb"] },
  { href: "/pricing", label: "Pricing", keywords: ["price", "pricing", "cost", "quote", "plan"] },
  { href: "/contact", label: "Contact Us", keywords: ["contact", "call", "phone", "email", "enquiry", "quote"] },
];

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  // Extract the slug from the current path (e.g. "/old-blog-slug" → "old-blog-slug")
  const slug = pathname.replace(/^\//, "").split("/")[0];
  const isTopLevelSlug =
    slug &&
    ![
      "resources",
      "services",
      "industries",
      "brands",
      "projects",
      "locations",
      "admin",
      "contact",
      "pricing",
      "about",
      "terms",
      "privacy",
    ].includes(slug);

  // Find relevant page suggestions based on keywords in the URL
  const relevantPages = useMemo(() => {
    const pathWords = pathname.toLowerCase().replace(/[\/\-_]/g, " ").split(" ").filter(Boolean);
    const scored = suggestedPages
      .map((page) => {
        const matches = page.keywords.filter((kw) =>
          pathWords.some((word) => word.includes(kw) || kw.includes(word))
        ).length;
        return { ...page, matches };
      })
      .sort((a, b) => b.matches - a.matches);

    // Return top matches if any keyword matched, otherwise return popular pages
    const matched = scored.filter((p) => p.matches > 0).slice(0, 3);
    if (matched.length > 0) return matched;

    // Default suggestions
    return suggestedPages.filter((p) =>
      ["/services", "/resources", "/contact"].includes(p.href)
    );
  }, [pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted px-4">
      <motion.div
        className="max-w-md text-center"
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.h1
          className="mb-4 text-4xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          404
        </motion.h1>
        <motion.p
          className="mb-4 text-xl text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          Oops! Page not found
        </motion.p>

        {isTopLevelSlug && (
          <motion.div
            className="mb-6 rounded-lg border bg-background p-4 text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <p className="mb-3 text-sm text-muted-foreground">
              Our website has been updated. This page may have moved to one of
              these locations:
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/resources/${slug}`}
                  className="text-primary underline hover:text-primary/90"
                >
                  /resources/{slug}
                </Link>
              </li>
              <li>
                <Link
                  href={`/services/${slug}`}
                  className="text-primary underline hover:text-primary/90"
                >
                  /services/{slug}
                </Link>
              </li>
            </ul>
          </motion.div>
        )}

        <motion.div
          className="mb-6 rounded-lg border bg-background p-4 text-left"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: isTopLevelSlug ? 0.5 : 0.35 }}
        >
          <p className="mb-3 text-sm text-muted-foreground">
            You might be looking for:
          </p>
          <ul className="space-y-2">
            {relevantPages.map((page) => (
              <li key={page.href}>
                <Link
                  href={page.href}
                  className="text-primary underline hover:text-primary/90"
                >
                  {page.label}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: isTopLevelSlug ? 0.6 : 0.5 }}
        >
          <Link
            href="/"
            className="text-primary underline hover:text-primary/90"
          >
            Return to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
