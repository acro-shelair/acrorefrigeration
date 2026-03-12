import type { Metadata } from "next";
import CTABanner from "@/components/home/CTABanner";
import FAQSection from "@/components/home/FAQSection";
import Layout from "@/components/Layout";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllPricingTiers } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import PricingCards from "./PricingCards";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Commercial Refrigeration Pricing",
  description:
    "Transparent pricing for commercial cold rooms and refrigeration systems. Standard cold rooms from $15,000. Get a custom quote for your project.",
  alternates: { canonical: "https://acrorefrigeration.com.au/pricing" },
  openGraph: { url: "https://acrorefrigeration.com.au/pricing", images: [{ url: "/og-image.jpg", alt: "Acro Refrigeration" }] },
};

export default async function PricingPage() {
  const supabase = createAdminClient();
  const tiers = await withRetry(() => getAllPricingTiers(supabase));

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <PricingCards tiers={tiers} />
        </div>
      </section>
      <CTABanner />
      <FAQSection />
    </Layout>
  );
}
