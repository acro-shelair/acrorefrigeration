import type { Metadata } from "next";
import Contact from "@/components/pages/Contact";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Request a quote for emergency repairs, maintenance plans or a new cold room build. Fast response, HACCP-certified. Acro Refrigeration — Brisbane & SE Queensland.",
  alternates: { canonical: "https://acrorefrigeration.com.au/contact" },
  openGraph: { url: "https://acrorefrigeration.com.au/contact", images: [{ url: "/og-image.jpg", alt: "Acro Refrigeration" }] },
};

export default async function ContactPage() {
  const supabase = createAdminClient();
  const settings = await withRetry(() => getSiteSettings(supabase));
  return <Contact settings={settings} />;
}
