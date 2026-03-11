import type { Metadata } from "next";
import Index from "@/components/pages/Index";
import { createClient } from "@/lib/supabase/server";
import { faqSection, testimonialsSection } from "@/data/home";

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

export default async function Home() {
  const supabase = await createClient();
  const [{ data: faqs }, { data: testimonials }] = await Promise.all([
    supabase.from("faqs").select("*").order("position"),
    supabase.from("testimonials").select("*").order("position"),
  ]);

  const faqItems = faqs?.length
    ? faqs.map((f) => ({ q: f.question, a: f.answer }))
    : faqSection.faqs;

  const reviewItems = testimonials?.length
    ? testimonials.map((t) => ({ name: t.name, role: t.role, quote: t.quote, rating: t.rating ?? 5 }))
    : testimonialsSection.testimonials.map((t) => ({ ...t, rating: 5 }));

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Acro Refrigeration",
    review: reviewItems.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewBody: t.quote,
      reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Index />
    </>
  );
}
