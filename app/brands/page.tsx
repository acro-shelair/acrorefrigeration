import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAllBrands, getAllOtherBrands } from "@/lib/supabase/content";
import Brands from "@/components/pages/Brands";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Commercial Refrigeration Brands We Service",
  description:
    "Specialist repairs and servicing for all major commercial refrigeration brands — Bitzer, Copeland, Danfoss, Daikin, Carrier and more. Expert technicians across Brisbane & SE Queensland.",
  alternates: { canonical: "https://acrorefrigeration.com.au/brands" },
  openGraph: { url: "https://acrorefrigeration.com.au/brands" },
};

export default async function BrandsPage() {
  const supabase = await createClient();
  const [brands, otherBrands] = await Promise.all([
    getAllBrands(supabase),
    getAllOtherBrands(supabase),
  ]);
  return <Brands brands={brands} otherBrands={otherBrands} />;
}
