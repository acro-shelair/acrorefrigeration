import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublishedPostsPaginated, RESOURCES_PAGE_SIZE } from "@/lib/supabase/posts";
import { withRetry } from "@/lib/retry";
import Resources from "@/components/pages/Resources";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Guides, Articles & Resources",
  description:
    "Expert guides and articles on commercial refrigeration, HACCP compliance, energy efficiency and cold room maintenance. Free resources from Acro Refrigeration.",
  alternates: { canonical: "https://acrorefrigeration.com.au/resources" },
  openGraph: { url: "https://acrorefrigeration.com.au/resources", images: [{ url: "/og-image.jpg", alt: "Acro Refrigeration" }] },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",      item: "https://acrorefrigeration.com.au" },
    { "@type": "ListItem", position: 2, name: "Resources", item: "https://acrorefrigeration.com.au/resources" },
  ],
};

type Props = { searchParams: Promise<{ page?: string }> };

export default async function ResourcesPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const supabase = createAdminClient();
  const { posts, total } = await withRetry(() => getPublishedPostsPaginated(supabase, page));
  const totalPages = Math.ceil(total / RESOURCES_PAGE_SIZE);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <Resources posts={posts} page={page} totalPages={totalPages} />
    </>
  );
}
