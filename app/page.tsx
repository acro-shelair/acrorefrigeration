import type { Metadata } from "next";
import Index from "@/components/pages/Index";
import { createAdminClient } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/retry";
import { faqSection, testimonialsSection } from "@/data/home";
import { getAllIndustries } from "@/lib/supabase/content";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Commercial Refrigeration Repair & Maintenance Brisbane",
  description:
    "24/7 emergency repairs, preventative maintenance plans and cold room builds for commercial refrigeration systems. Fast response, HACCP-certified. Serving Brisbane & SE Queensland.",
  alternates: {
    canonical: "https://acrorefrigeration.com.au/",
  },
  openGraph: {
    url: "https://acrorefrigeration.com.au/",
    images: [{ url: "/og-image.jpg", alt: "Acro Refrigeration" }],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Acro Refrigeration",
  description:
    "Australia's trusted commercial refrigeration contractor. 24/7 emergency repairs, preventative maintenance plans and custom cold room builds. HACCP-certified.",
  url: "https://acrorefrigeration.com.au",
  logo: "https://acrorefrigeration.com.au/icon.png",
  image: "https://acrorefrigeration.com.au/og-image.jpg",
  telephone: "1300227600",
  email: "info@acrorefrigeration.com.au",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Brisbane",
    addressRegion: "QLD",
    addressCountry: "AU",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "1300227600",
    contactType: "customer service",
    availableLanguage: "English",
    areaServed: "AU",
  },
  openingHours: "Mo-Fr 07:00-17:00",
  areaServed: ["Brisbane", "Gold Coast", "Sunshine Coast", "SE Queensland"],
  priceRange: "$$",
  sameAs: [
    "https://www.facebook.com/acrorefrigeration/",
    "https://www.linkedin.com/company/acro-refrigeration-qld/",
  ],
};

export default async function Home() {
  const supabase = createAdminClient();
  const [{ data: faqs }, { data: testimonials }, { data: pricingTiersData }, featuredProjects, industries] =
    await Promise.all([
      withRetry(() => supabase.from("faqs").select("*").order("position")),
      withRetry(() => supabase.from("testimonials").select("*").order("position")),
      withRetry(() => supabase.from("pricing_tiers").select("*").order("position")),
      withRetry(() =>
        supabase.from("projects").select("*").eq("featured", true).order("position").limit(3)
      ).then((r) => r.data ?? []).catch(() => []),
      withRetry(() => getAllIndustries(supabase)).catch(() => []),
    ]);

  const faqItems = faqs?.length
    ? faqs.map((f) => ({ q: f.question, a: f.answer }))
    : faqSection.faqs;

  const reviewItems = testimonials?.length
    ? testimonials.map((t) => ({ name: t.name, role: t.role, quote: t.quote, rating: t.rating ?? 5 }))
    : testimonialsSection.testimonials.map((t) => ({ ...t, rating: 5 }));

  const avgRating = reviewItems.reduce((sum, t) => sum + t.rating, 0) / reviewItems.length;

  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Acro Refrigeration",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviewItems.length,
      bestRating: 5,
    },
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
      <Index
        faqItems={faqItems}
        reviewItems={reviewItems}
        pricingTiers={pricingTiersData ?? []}
        featuredProjects={featuredProjects}
        industries={industries}
      />
    </>
  );
}
