import type { Metadata } from "next";
import { createStaticClient } from "@/lib/supabase/static";
import { getAllCities } from "@/lib/supabase/content";
import LocationsHub from "@/components/pages/LocationsHub";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Commercial Refrigeration Repairs Near You — Service Areas",
  description:
    "24/7 emergency repairs, preventative maintenance and cold room builds across South-East Queensland. Find your local refrigeration team in Brisbane, Gold Coast and Sunshine Coast.",
  alternates: { canonical: "https://acrorefrigeration.com.au/locations" },
  openGraph: { url: "https://acrorefrigeration.com.au/locations" },
};

export default async function LocationsPage() {
  const supabase = createStaticClient();
  const cities = await getAllCities(supabase);
  return <LocationsHub cities={cities} />;
}
