import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublishedPosts } from "@/lib/supabase/posts";
import { withRetry } from "@/lib/retry";
import Resources from "@/components/pages/Resources";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Guides, Articles & Resources",
  description:
    "Expert guides and articles on commercial refrigeration, HACCP compliance, energy efficiency and cold room maintenance. Free resources from Acro Refrigeration.",
  alternates: { canonical: "https://acrorefrigeration.com.au/resources" },
  openGraph: { url: "https://acrorefrigeration.com.au/resources", images: [{ url: "/api/og?title=Guides%2C+Articles+%26+Resources&type=resources", width: 1200, height: 630, alt: "Acro Refrigeration — Guides, Articles & Resources" }] },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",      item: "https://acrorefrigeration.com.au" },
    { "@type": "ListItem", position: 2, name: "Resources", item: "https://acrorefrigeration.com.au/resources" },
  ],
};

export default async function ResourcesPage() {
  const supabase = createAdminClient();
  const posts = await withRetry(() => getPublishedPosts(supabase));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Resources posts={posts} />
    </>
  );
}
