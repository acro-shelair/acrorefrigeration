import type { Metadata } from "next";
import TermsOfService from "@/components/pages/TermsOfService";

export const metadata: Metadata = {
  title: "Terms of Service | Acro Refrigeration – Brisbane Commercial Refrigeration",
  description:
    "Read Acro Refrigeration's Terms of Service governing the use of our website and commercial refrigeration services across Brisbane, Gold Coast and SE Queensland.",
  alternates: { canonical: "https://acrorefrigeration.com.au/terms" },
  openGraph: { url: "https://acrorefrigeration.com.au/terms" },
};

export default function TermsOfServicePage() {
  return <TermsOfService />;
}
