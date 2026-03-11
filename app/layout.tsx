import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { headers } from "next/headers";
import { Providers } from "@/components/providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import NavigationProgress from "@/components/NavigationProgress";

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
    default: "Acro Refrigeration | Commercial Refrigeration Repair & Maintenance Brisbane",
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
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          {!isAdmin && <LoadingScreen />}
          {!isAdmin && <NavigationProgress />}
          <div className="min-h-screen flex flex-col">
            {!isAdmin && <Navbar />}
            <main className={isAdmin ? "flex-1" : "flex-1 pt-16 md:pt-20"}>{children}</main>
            {!isAdmin && <Footer />}
          </div>
        </Providers>
      </body>
    </html>
  );
}
