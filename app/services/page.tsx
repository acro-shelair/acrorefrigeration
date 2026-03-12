import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllServices } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import Services from "@/components/pages/Services";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Commercial Refrigeration Services",
  description:
    "End-to-end commercial refrigeration services including cold room construction, system installation, HACCP compliance, smart monitoring and 24/7 emergency repairs across Brisbane & SE Queensland.",
  alternates: { canonical: "https://acrorefrigeration.com.au/services" },
  openGraph: { url: "https://acrorefrigeration.com.au/services", images: [{ url: "/og-image.jpg", alt: "Acro Refrigeration" }] },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",     item: "https://acrorefrigeration.com.au" },
    { "@type": "ListItem", position: 2, name: "Services", item: "https://acrorefrigeration.com.au/services" },
  ],
};

export default async function ServicesPage() {
  const supabase = createAdminClient();
  const services = await withRetry(() => getAllServices(supabase));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Services services={services} />
    </>
  );
}
