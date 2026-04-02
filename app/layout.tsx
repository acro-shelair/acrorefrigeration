import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { Providers } from "@/components/providers";
import Navbar from "@/components/Navbar";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteSettings } from "@/lib/supabase/content";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import NavigationProgress from "@/components/NavigationProgress";
import PublicShell from "@/components/PublicShell";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://acrorefrigeration.com.au"),
  title: {
    template: "%s | Acro Refrigeration",
    default:
      "Acro Refrigeration | Commercial Refrigeration Repair & Maintenance Brisbane",
  },
  description:
    "24/7 emergency repairs, preventative maintenance plans and cold room builds for commercial refrigeration systems. Fast response, HACCP-certified. Serving Brisbane & SE Queensland.",
  authors: [{ name: "Acro Refrigeration" }],
  openGraph: {
    type: "website",
    siteName: "Acro Refrigeration",
    images: [{ url: "/og-image.jpg", alt: "Acro Refrigeration" }],
  },
  twitter: {
    card: "summary_large_image",
    images: [{ url: "/og-image.jpg", alt: "Acro Refrigeration" }],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/auth");

  const supabase = createAdminClient();
  const [settings, navServices, navIndustries, navBrands, navCities] = isAdmin
    ? [null, [], [], [], []]
    : await Promise.all([
        getSiteSettings(supabase),
        supabase
          .from("services")
          .select("slug, title")
          .not("slug", "is", null)
          .order("position")
          .then((r) => r.data ?? []),
        supabase
          .from("industries")
          .select("slug, title")
          .order("position")
          .then((r) => r.data ?? []),
        supabase
          .from("brands")
          .select("slug, name")
          .order("position")
          .then((r) =>
            (r.data ?? []).map((b: { slug: string; name: string }) => ({
              slug: b.slug,
              title: b.name,
            }))
          ),
        supabase
          .from("location_cities")
          .select("slug, name")
          .order("position")
          .then((r) =>
            (r.data ?? []).map((c: { slug: string; name: string }) => ({
              slug: c.slug,
              title: c.name,
            }))
          ),
      ]);
  const phone = (settings as { phone?: string } | null)?.phone ?? "1300227600";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {!isAdmin && <LoadingScreen />}
          <NavigationProgress />
          <PublicShell
            navbar={
              <Navbar
                phone={phone}
                serviceItems={navServices as { slug: string; title: string }[]}
                industryItems={
                  navIndustries as { slug: string; title: string }[]
                }
                brandItems={navBrands as { slug: string; title: string }[]}
                cityItems={navCities as { slug: string; title: string }[]}
              />
            }
            footer={<Footer />}
          >
            {children}
          </PublicShell>
        </Providers>
        {!isAdmin && (
          <Script
            src="https://connect.podium.com/widget.js#ORG_TOKEN=be14e5eb-997b-49ae-8a7b-5009ff31ae98"
            id="podium-widget"
            data-organization-api-token="be14e5eb-997b-49ae-8a7b-5009ff31ae98"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
