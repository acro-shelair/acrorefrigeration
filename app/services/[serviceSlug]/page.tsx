import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServiceBySlug, getPublishedServiceSlugs } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import ServicePage from "@/components/pages/ServicePage";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ serviceSlug: string }> };

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const slugs = await withRetry(() => getPublishedServiceSlugs(supabase));
    return slugs.map((slug) => ({ serviceSlug: slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceSlug } = await params;
  const supabase = createAdminClient();
  const service = await withRetry(() => getServiceBySlug(supabase, serviceSlug));
  if (!service) return {};
  return {
    title: service.title,
    description: service.meta_description || service.description,
    alternates: { canonical: `https://acrorefrigeration.com.au/services/${serviceSlug}` },
    openGraph: { url: `https://acrorefrigeration.com.au/services/${serviceSlug}`, images: [{ url: `/api/og?title=${encodeURIComponent(service.title)}&type=service`, width: 1200, height: 630, alt: `Acro Refrigeration — ${service.title}` }] },
  };
}

export default async function ServicePageRoute({ params }: Props) {
  const { serviceSlug } = await params;
  const supabase = createAdminClient();
  const service = await withRetry(() => getServiceBySlug(supabase, serviceSlug));
  if (!service) notFound();

  // Fetch related services
  const relatedSlugs = service.related_service_slugs ?? [];
  const relatedServices = relatedSlugs.length > 0
    ? (await withRetry(() =>
        supabase
          .from("services")
          .select("slug, title, description")
          .in("slug", relatedSlugs)
      )).data ?? []
    : [];

  // Fetch related posts
  const relatedPostSlugs = service.related_post_slugs ?? [];
  const relatedPosts = relatedPostSlugs.length > 0
    ? (await withRetry(() =>
        supabase
          .from("posts")
          .select("slug, title, description, type, date, image_url")
          .in("slug", relatedPostSlugs)
          .eq("published", true)
      )).data ?? []
    : [];

  // Fetch related projects
  const relatedProjectSlugs = service.related_project_slugs ?? [];
  const relatedProjects = relatedProjectSlugs.length > 0
    ? (await withRetry(() =>
        supabase
          .from("projects")
          .select("slug, title, description, type, location, image_url")
          .in("slug", relatedProjectSlugs)
      )).data ?? []
    : [];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `https://acrorefrigeration.com.au/services/${serviceSlug}`,
    provider: {
      "@type": "LocalBusiness",
      name: "Acro Refrigeration",
      url: "https://acrorefrigeration.com.au",
      telephone: "1300227600",
    },
    areaServed: { "@type": "State", name: "Queensland", addressCountry: "AU" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: service.faqs?.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://acrorefrigeration.com.au" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://acrorefrigeration.com.au/services" },
      { "@type": "ListItem", position: 3, name: service.title, item: `https://acrorefrigeration.com.au/services/${serviceSlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ServicePage
        service={service}
        relatedServices={relatedServices}
        relatedPosts={relatedPosts}
        relatedProjects={relatedProjects}
      />
    </>
  );
}
