import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { getAllIndustries, getIndustryBySlug } from "@/lib/supabase/content";
import IndustryPage from "@/components/pages/IndustryPage";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ industrySlug: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const industries = await getAllIndustries(supabase);
  return industries.map((i) => ({ industrySlug: i.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industrySlug } = await params;
  const supabase = await createClient();
  const industry = await getIndustryBySlug(supabase, industrySlug);
  if (!industry) return {};
  return {
    title: industry.title,
    description: industry.meta_description || industry.description,
    alternates: { canonical: `https://acrorefrigeration.com.au/industries/${industrySlug}` },
    openGraph: { url: `https://acrorefrigeration.com.au/industries/${industrySlug}` },
  };
}

export default async function IndustryPageRoute({ params }: Props) {
  const { industrySlug } = await params;
  const supabase = await createClient();
  const industry = await getIndustryBySlug(supabase, industrySlug);
  if (!industry) notFound();

  const relatedIndustries = industry.related_industry_slugs?.length > 0
    ? (await supabase.from("industries").select("slug, title, description")
        .in("slug", industry.related_industry_slugs)).data ?? []
    : [];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",       item: "https://acrorefrigeration.com.au" },
      { "@type": "ListItem", position: 2, name: "Industries", item: "https://acrorefrigeration.com.au/industries" },
      { "@type": "ListItem", position: 3, name: industry.title, item: `https://acrorefrigeration.com.au/industries/${industrySlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <IndustryPage industry={industry} relatedIndustries={relatedIndustries} />
    </>
  );
}
