import type { Metadata } from "next";
import Index from "@/components/pages/Index";

export const metadata: Metadata = {
  title: "Commercial Refrigeration Repair & Maintenance Brisbane",
  description:
    "24/7 emergency repairs, preventative maintenance plans and cold room builds for commercial refrigeration systems. Fast response, HACCP-certified. Serving Brisbane & SE Queensland.",
  alternates: {
    canonical: "https://acrorefrigeration.com.au/",
  },
  openGraph: {
    url: "https://acrorefrigeration.com.au/",
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Acro Refrigeration",
  description:
    "Australia's trusted commercial refrigeration contractor. 24/7 emergency repairs, preventative maintenance plans and custom cold room builds. HACCP-certified.",
  url: "https://acrorefrigeration.com.au",
  telephone: "1300227600",
  email: "info@acrorefrigeration.com.au",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
  openingHours: "Mo-Fr 07:00-17:00",
  areaServed: ["Brisbane", "Gold Coast", "Sunshine Coast", "SE Queensland", "Australia"],
  priceRange: "$$",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <Index />
    </>
  );
}
