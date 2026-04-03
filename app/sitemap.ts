import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { withRetry } from "@/lib/retry";

const BASE_URL = "https://acrorefrigeration.com.au";

export const revalidate = 3600; // regenerate sitemap hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createAdminClient();

  // Fetch all dynamic data from Supabase in parallel
  const [
    { data: posts },
    { data: services },
    { data: industries },
    { data: brands },
    { data: projects },
    { data: cities },
  ] = await Promise.all([
    withRetry(() =>
      supabase.from("posts").select("slug, updated_at").eq("published", true)
    ),
    withRetry(() =>
      supabase.from("services").select("slug, updated_at").not("slug", "is", null)
    ),
    withRetry(() =>
      supabase.from("industries").select("slug, updated_at")
    ),
    withRetry(() =>
      supabase.from("brands").select("slug, updated_at")
    ),
    withRetry(() =>
      supabase.from("projects").select("slug, updated_at")
    ),
    withRetry(() =>
      supabase
        .from("location_cities")
        .select("slug, location_suburbs(slug)")
        .order("position")
    ),
  ]);

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

  const serviceRoutes = (services ?? []).map((s: any) => ({
    url: `${BASE_URL}/services/${s.slug}`,
    lastModified: s.updated_at,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const industryRoutes = (industries ?? []).map((i: any) => ({
    url: `${BASE_URL}/industries/${i.slug}`,
    lastModified: i.updated_at,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const brandRoutes = (brands ?? []).map((b: any) => ({
    url: `${BASE_URL}/brands/${b.slug}`,
    lastModified: b.updated_at,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const resourceRoutes = (posts ?? []).map((p: any) => ({
    url: `${BASE_URL}/resources/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const projectRoutes = (projects ?? []).map((p: any) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: p.updated_at,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const cityRoutes = (cities ?? []).map((city: any) => ({
    url: `${BASE_URL}/locations/${city.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
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
    ...projectRoutes,
    ...cityRoutes,
    ...suburbRoutes,
  ];
}
