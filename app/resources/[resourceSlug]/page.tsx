import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublishedPosts, getPostBySlug } from "@/lib/supabase/posts";
import { withRetry } from "@/lib/retry";
import ResourcePage from "@/components/pages/ResourcePage";

export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: Promise<{ resourceSlug: string }> };

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const posts = await withRetry(() => getPublishedPosts(supabase));
    return posts.map((p) => ({ resourceSlug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { resourceSlug } = await params;
  const supabase = createAdminClient();
  const post = await withRetry(() => getPostBySlug(supabase, resourceSlug));
  if (!post) return {};
  return {
    title: post.title,
    description: post.meta_description,
    alternates: {
      canonical: `https://acrorefrigeration.com.au/resources/${resourceSlug}`,
    },
    openGraph: {
      url: `https://acrorefrigeration.com.au/resources/${resourceSlug}`,
      type: "article",
      images: [{ url: post.image_url ?? "/og-image.jpg", alt: post.title }],
    },
  };
}

export default async function ResourcePageRoute({ params }: Props) {
  const { resourceSlug } = await params;
  const supabase = createAdminClient();
  const post = await withRetry(() => getPostBySlug(supabase, resourceSlug));
  if (!post) notFound();

  const relatedPosts =
    post.related_slugs?.length > 0
      ? (
          await withRetry(() =>
            supabase
              .from("posts")
              .select("id, slug, type, title, description, date")
              .in("slug", post.related_slugs)
              .eq("published", true)
          )
        ).data ?? []
      : [];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.meta_description,
    url: `https://acrorefrigeration.com.au/resources/${resourceSlug}`,
    datePublished: post.date,
    dateModified: post.updated_at ?? post.date,
    author: {
      "@type": "Organization",
      name: "Acro Refrigeration",
      url: "https://acrorefrigeration.com.au",
    },
    publisher: {
      "@type": "Organization",
      name: "Acro Refrigeration",
      url: "https://acrorefrigeration.com.au",
      logo: { "@type": "ImageObject", url: "https://acrorefrigeration.com.au/icon.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://acrorefrigeration.com.au/resources/${resourceSlug}`,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://acrorefrigeration.com.au",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Resources",
        item: "https://acrorefrigeration.com.au/resources",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `https://acrorefrigeration.com.au/resources/${resourceSlug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ResourcePage post={post} relatedPosts={relatedPosts} />
    </>
  );
}
