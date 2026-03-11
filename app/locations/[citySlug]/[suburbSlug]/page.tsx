import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import { getAllCities, getCityWithSuburbs, getSuburbWithCity, getAllServices, getAllIndustries } from "@/lib/supabase/content";
import SuburbPage from "@/components/pages/SuburbPage";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ citySlug: string; suburbSlug: string }> };

export async function generateStaticParams() {
  const supabase = createStaticClient();
  const cities = await getAllCities(supabase);
  const withSuburbs = await Promise.all(
    cities.map((c) => getCityWithSuburbs(supabase, c.slug))
  );
  return withSuburbs.flatMap((city) =>
    (city?.location_suburbs ?? []).map((s) => ({
      citySlug:   city!.slug,
      suburbSlug: s.slug,
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { citySlug, suburbSlug } = await params;
  const supabase = await createClient();
  const result = await getSuburbWithCity(supabase, citySlug, suburbSlug);
  if (!result) return {};
  const { suburb } = result;
  return {
    title: `Commercial Refrigeration Repairs ${suburb.name}`,
    description: `24/7 emergency repairs, preventative maintenance and cold room builds in ${suburb.name} and surrounding areas. Fast response, HACCP-certified.`,
    alternates: { canonical: `https://acrorefrigeration.com.au/locations/${citySlug}/${suburbSlug}` },
    openGraph: { url: `https://acrorefrigeration.com.au/locations/${citySlug}/${suburbSlug}` },
  };
}

export default async function SuburbPageRoute({ params }: Props) {
  const { citySlug, suburbSlug } = await params;
  const supabase = await createClient();
  const result = await getSuburbWithCity(supabase, citySlug, suburbSlug);
  if (!result) notFound();
  const { city, suburb } = result;

  const [services, industries] = await Promise.all([
    getAllServices(supabase),
    getAllIndustries(supabase),
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
      <SuburbPage city={city} suburb={suburb} services={services} industries={industries} />
    </>
  );
}
