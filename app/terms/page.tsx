import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getLegalPage } from "@/lib/supabase/legal";
import TermsOfService from "@/components/pages/TermsOfService";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Terms & Conditions | Acro Refrigeration – Brisbane Commercial Refrigeration",
  description:
    "Terms & Conditions for all quotations, work orders, repairs, maintenance, and installations performed by HVACR Pty Ltd trading as ACRO Refrigeration and Shelair Group. QBCC #15413155.",
  alternates: { canonical: "https://acrorefrigeration.com.au/terms" },
  openGraph: { url: "https://acrorefrigeration.com.au/terms", images: [{ url: "/og-image.jpg", alt: "Acro Refrigeration" }] },
};

export default async function TermsOfServicePage() {
  const supabase = await createClient();
  const legalData = await getLegalPage(supabase, "terms");
  return <TermsOfService legalData={legalData} />;
}
