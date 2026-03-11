import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { getAllBrands, getBrandBySlug } from "@/lib/supabase/content";
import BrandPage from "@/components/pages/BrandPage";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ brandSlug: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const brands = await getAllBrands(supabase);
  return brands.map((b) => ({ brandSlug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brandSlug } = await params;
  const supabase = await createClient();
  const brand = await getBrandBySlug(supabase, brandSlug);
  if (!brand) return {};
  return {
    title: `${brand.name} Compressor Repairs & Servicing`,
    description: brand.description,
    alternates: { canonical: `https://acrorefrigeration.com.au/brands/${brandSlug}` },
    openGraph: { url: `https://acrorefrigeration.com.au/brands/${brandSlug}` },
  };
}

export default async function BrandPageRoute({ params }: Props) {
  const { brandSlug } = await params;
  const supabase = await createClient();
  const brand = await getBrandBySlug(supabase, brandSlug);
  if (!brand) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",   item: "https://acrorefrigeration.com.au" },
      { "@type": "ListItem", position: 2, name: "Brands", item: "https://acrorefrigeration.com.au/brands" },
      { "@type": "ListItem", position: 3, name: brand.name, item: `https://acrorefrigeration.com.au/brands/${brandSlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <BrandPage brand={brand} />
    </>
  );
}
