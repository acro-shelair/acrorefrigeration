import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getLegalPage } from "@/lib/supabase/legal";
import TermsOfService from "@/components/pages/TermsOfService";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "5-Year Workmanship Guarantee | Acro Refrigeration",
  description:
    "Full terms of Acro Refrigeration's 5-Year Workmanship Guarantee. Covers labour faults on all commercial refrigeration and HVAC installations across SE Queensland.",
  alternates: {
    canonical:
      "https://acrorefrigeration.com.au/acro-refrigeration-5-year-workmanship-guarantee",
  },
  openGraph: {
    url: "https://acrorefrigeration.com.au/acro-refrigeration-5-year-workmanship-guarantee",
  },
};

export default async function WorkmanshipGuaranteePage() {
  const supabase = createAdminClient();
  const legalData = await getLegalPage(supabase, "guarantee");
  return <TermsOfService legalData={legalData} />;
}
