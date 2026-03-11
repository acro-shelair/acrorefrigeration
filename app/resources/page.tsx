import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getPublishedPosts } from "@/lib/supabase/posts";
import Resources from "@/components/pages/Resources";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Guides, Articles & Resources",
  description:
    "Expert guides and articles on commercial refrigeration, HACCP compliance, energy efficiency and cold room maintenance. Free resources from Acro Refrigeration.",
  alternates: { canonical: "https://acrorefrigeration.com.au/resources" },
  openGraph: { url: "https://acrorefrigeration.com.au/resources" },
};

export default async function ResourcesPage() {
  const supabase = await createClient();
  const posts = await getPublishedPosts(supabase);
  return <Resources posts={posts} />;
}
