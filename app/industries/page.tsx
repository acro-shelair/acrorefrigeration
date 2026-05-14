import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllIndustries } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import Industries from "@/components/pages/Industries";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Specialist commercial refrigeration repairs and maintenance for restaurants, supermarkets, pharmaceuticals, warehousing and food production. HACCP and TGA compliant. Brisbane & SE Queensland.",
  alternates: { canonical: "https://acrorefrigeration.com.au/industries" },
  openGraph: { url: "https://acrorefrigeration.com.au/industries", images: [{ url: "/api/og?title=Industries+We+Serve&type=industries", width: 1200, height: 630, alt: "Acro Refrigeration — Industries We Serve" }] },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",       item: "https://acrorefrigeration.com.au" },
    { "@type": "ListItem", position: 2, name: "Industries", item: "https://acrorefrigeration.com.au/industries" },
  ],
};

export default async function IndustriesPage() {
  const supabase = createAdminClient();
  const industries = await withRetry(() => getAllIndustries(supabase));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Industries industries={industries} />
    </>
  );
}
