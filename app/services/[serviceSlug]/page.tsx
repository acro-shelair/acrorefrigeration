import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { getServiceBySlug, getPublishedServiceSlugs } from "@/lib/supabase/content";
import ServicePage from "@/components/pages/ServicePage";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ serviceSlug: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const slugs = await getPublishedServiceSlugs(supabase);
  return slugs.map((slug) => ({ serviceSlug: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { serviceSlug } = await params;
  const supabase = await createClient();
  const service = await getServiceBySlug(supabase, serviceSlug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.meta_description || service.description,
    alternates: { canonical: `https://acrorefrigeration.com.au/services/${serviceSlug}` },
    openGraph: { url: `https://acrorefrigeration.com.au/services/${serviceSlug}` },
  };
}

export default async function ServicePageRoute({ params }: Props) {
  const { serviceSlug } = await params;
  const supabase = await createClient();
  const service = await getServiceBySlug(supabase, serviceSlug);
  if (!service) notFound();

  // Fetch related services
  const relatedServices =
    service.related_service_slugs?.length > 0
      ? (await supabase
          .from("services")
          .select("slug, title, description")
          .in("slug", service.related_service_slugs)
        ).data ?? []
      : [];

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <ServicePage service={service} relatedServices={relatedServices} />
    </>
  );
}
