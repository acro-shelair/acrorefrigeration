import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllCities } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import LocationsHub from "@/components/pages/LocationsHub";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Commercial Refrigeration Repairs Near You — Service Areas",
  description:
    "24/7 emergency repairs, preventative maintenance and cold room builds across South-East Queensland. Find your local refrigeration team in Brisbane, Gold Coast and Sunshine Coast.",
  alternates: { canonical: "https://acrorefrigeration.com.au/locations" },
  openGraph: { url: "https://acrorefrigeration.com.au/locations", images: [{ url: "/og-image.jpg", alt: "Acro Refrigeration" }] },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",      item: "https://acrorefrigeration.com.au" },
    { "@type": "ListItem", position: 2, name: "Locations", item: "https://acrorefrigeration.com.au/locations" },
  ],
};

export default async function LocationsPage() {
  const supabase = createAdminClient();
  const cities = await withRetry(() => getAllCities(supabase));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <LocationsHub cities={cities} />
    </>
  );
}
