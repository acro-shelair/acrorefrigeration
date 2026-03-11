import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAllIndustries } from "@/lib/supabase/content";
import Industries from "@/components/pages/Industries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Industries We Serve",
  description:
    "Specialist commercial refrigeration repairs and maintenance for restaurants, supermarkets, pharmaceuticals, warehousing and food production. HACCP and TGA compliant. Brisbane & SE Queensland.",
  alternates: { canonical: "https://acrorefrigeration.com.au/industries" },
  openGraph: { url: "https://acrorefrigeration.com.au/industries" },
};

export default async function IndustriesPage() {
  const supabase = await createClient();
  const industries = await getAllIndustries(supabase);
  return <Industries industries={industries} />;
}
