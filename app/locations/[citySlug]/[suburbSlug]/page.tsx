import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllCities, getCityWithSuburbs, getSuburbWithCity, getAllServices, getAllIndustries, getProjectsByLocation } from "@/lib/supabase/content";
import { getRecentPosts } from "@/lib/supabase/posts";
import { withRetry } from "@/lib/retry";
import SuburbPage from "@/components/pages/SuburbPage";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ citySlug: string; suburbSlug: string }> };

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const cities = await withRetry(() => getAllCities(supabase));
    const withSuburbs = await Promise.all(
      cities.map((c) => withRetry(() => getCityWithSuburbs(supabase, c.slug)))
    );
    return withSuburbs.flatMap((city) =>
      (city?.location_suburbs ?? []).map((s) => ({
        citySlug:   city!.slug,
        suburbSlug: s.slug,
      }))
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug, suburbSlug } = await params;
  const supabase = createAdminClient();
  const result = await withRetry(() => getSuburbWithCity(supabase, citySlug, suburbSlug));
  if (!result) return {};
  const { suburb } = result;
  return {
    title: `Commercial Refrigeration Repairs ${suburb.name}`,
    description: `24/7 emergency repairs, preventative maintenance and cold room builds in ${suburb.name} and surrounding areas. Fast response, HACCP-certified.`,
    robots: { index: false, follow: true },
    alternates: { canonical: `https://acrorefrigeration.com.au/locations/${citySlug}/${suburbSlug}` },
    openGraph: { url: `https://acrorefrigeration.com.au/locations/${citySlug}/${suburbSlug}`, images: [{ url: `/api/og?title=${encodeURIComponent('Commercial Refrigeration Repairs ' + suburb.name)}&type=location`, width: 1200, height: 630, alt: `Acro Refrigeration — ${suburb.name}` }] },
  };
}

export default async function SuburbPageRoute({ params }: Props) {
  const { citySlug, suburbSlug } = await params;
  const supabase = createAdminClient();
  const result = await withRetry(() => getSuburbWithCity(supabase, citySlug, suburbSlug));
  if (!result) notFound();
  const { city, suburb } = result;

  const [services, industries, projects, posts] = await Promise.all([
    withRetry(() => getAllServices(supabase)),
    withRetry(() => getAllIndustries(supabase)),
    withRetry(() => getProjectsByLocation(supabase, city.name)),
    withRetry(() => getRecentPosts(supabase)),
  ]);

  const localBusinessSchema = {
    "@context": "https://schema.org", "@type": "LocalBusiness",
    name: "Acro Refrigeration",
    description: `24/7 emergency refrigeration repairs and maintenance in ${suburb.name}, ${city.name}.`,
    url: "https://acrorefrigeration.com.au", telephone: "+611300227600",
    email: "service@acrorefrigeration.com.au",
    areaServed: [{ "@type": "City", name: city.name }, { "@type": "Place", name: suburb.name }],
    address: { "@type": "PostalAddress", addressLocality: suburb.name, addressRegion: "QLD", addressCountry: "AU" },
    openingHoursSpecification: { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "07:00", closes: "17:00" },
    priceRange: "$$",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",        item: "https://acrorefrigeration.com.au" },
      { "@type": "ListItem", position: 2, name: "Locations",   item: "https://acrorefrigeration.com.au/locations" },
      { "@type": "ListItem", position: 3, name: city.name,     item: `https://acrorefrigeration.com.au/locations/${citySlug}` },
      { "@type": "ListItem", position: 4, name: suburb.name,   item: `https://acrorefrigeration.com.au/locations/${citySlug}/${suburbSlug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <SuburbPage city={city} suburb={suburb} services={services} industries={industries} projects={projects} posts={posts} />
    </>
  );
}
