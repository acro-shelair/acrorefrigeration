import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllBrands, getAllOtherBrands } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import Brands from "@/components/pages/Brands";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Commercial Refrigeration Brands We Service",
  description:
    "Specialist repairs and servicing for all major commercial refrigeration brands — Bitzer, Copeland, Danfoss, Daikin, Carrier and more. Expert technicians across Brisbane & SE Queensland.",
  alternates: { canonical: "https://acrorefrigeration.com.au/brands" },
  openGraph: { url: "https://acrorefrigeration.com.au/brands", images: [{ url: "/api/og?title=Commercial+Refrigeration+Brands+We+Service&type=brands", width: 1200, height: 630, alt: "Acro Refrigeration — Brands We Service" }] },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",   item: "https://acrorefrigeration.com.au" },
    { "@type": "ListItem", position: 2, name: "Brands", item: "https://acrorefrigeration.com.au/brands" },
  ],
};

export default async function BrandsPage() {
  const supabase = createAdminClient();
  const [brands, otherBrands] = await Promise.all([
    withRetry(() => getAllBrands(supabase)),
    withRetry(() => getAllOtherBrands(supabase)),
  ]);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Brands brands={brands} otherBrands={otherBrands} />
    </>
  );
}
