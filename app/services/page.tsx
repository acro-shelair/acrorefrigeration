import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAllServices } from "@/lib/supabase/content";
import Services from "@/components/pages/Services";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Commercial Refrigeration Services",
  description:
    "End-to-end commercial refrigeration services including cold room construction, system installation, HACCP compliance, smart monitoring and 24/7 emergency repairs across Brisbane & SE Queensland.",
  alternates: { canonical: "https://acrorefrigeration.com.au/services" },
  openGraph: { url: "https://acrorefrigeration.com.au/services" },
};

export default async function ServicesPage() {
  const supabase = await createClient();
  const services = await getAllServices(supabase);
  return <Services services={services} />;
}
