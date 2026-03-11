import type { MetadataRoute } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { resourcesData } from "@/lib/seo/resources";
import { servicesData } from "@/lib/seo/services";
import { industriesData } from "@/lib/seo/industries";
import { brandsData } from "@/lib/seo/brands";

const BASE_URL = "https://acrorefrigeration.com.au";

export const revalidate = 3600; // regenerate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient();

  // Fetch dynamic location data from Supabase
  const { data: cities } = await supabase
    .from("location_cities")
    .select("slug, location_suburbs(slug)")
    .order("position");

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`,           changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/services`,   changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/industries`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/projects`,   changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/process`,    changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/pricing`,    changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/resources`,  changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/contact`,    changeFrequency: "yearly",  priority: 0.9 },
    { url: `${BASE_URL}/brands`,     changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/locations`,  changeFrequency: "monthly", priority: 0.8 },
  ];

  const serviceRoutes = Object.keys(servicesData).map((slug) => ({
    url: `${BASE_URL}/services/${slug}`, changeFrequency: "monthly" as const, priority: 0.8,
  }));

  const industryRoutes = Object.keys(industriesData).map((slug) => ({
    url: `${BASE_URL}/industries/${slug}`, changeFrequency: "monthly" as const, priority: 0.7,
  }));

  const brandRoutes = Object.keys(brandsData).map((slug) => ({
    url: `${BASE_URL}/brands/${slug}`, changeFrequency: "monthly" as const, priority: 0.7,
  }));

  const resourceRoutes = Object.keys(resourcesData).map((slug) => ({
    url: `${BASE_URL}/resources/${slug}`, changeFrequency: "weekly" as const, priority: 0.6,
  }));

  const cityRoutes = (cities ?? []).map((city: any) => ({
    url: `${BASE_URL}/locations/${city.slug}`, changeFrequency: "monthly" as const, priority: 0.8,
  }));

  const suburbRoutes = (cities ?? []).flatMap((city: any) =>
    (city.location_suburbs ?? []).map((suburb: any) => ({
      url: `${BASE_URL}/locations/${city.slug}/${suburb.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }))
  );

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...industryRoutes,
    ...brandRoutes,
    ...resourceRoutes,
    ...cityRoutes,
    ...suburbRoutes,
  ];
}
