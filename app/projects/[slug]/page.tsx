import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProjectBySlug, getAllProjects } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import ProjectPage from "@/components/pages/ProjectPage";

export const revalidate = 3600;
export const dynamicParams = true;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    const supabase = createAdminClient();
    const projects = await withRetry(() => getAllProjects(supabase));
    return projects.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createAdminClient();
  const project = await withRetry(() => getProjectBySlug(supabase, slug)).catch(() => null);
  if (!project) return {};
  return {
    title: `${project.title} — Case Study`,
    description: project.description,
    alternates: { canonical: `https://acrorefrigeration.com.au/projects/${slug}` },
    openGraph: {
      url: `https://acrorefrigeration.com.au/projects/${slug}`,
      images: [{ url: project.image_url ?? `/api/og?title=${encodeURIComponent(project.title)}&type=project`, width: 1200, height: 630, alt: project.title }],
    },
  };
}

export default async function ProjectPageRoute({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();
  const [project, related] = await Promise.all([
    withRetry(() => getProjectBySlug(supabase, slug)).catch(() => null),
    withRetry(() =>
      supabase
        .from("projects")
        .select("id, slug, title, description, type, size")
        .neq("slug", slug)
        .order("position")
        .limit(3)
    ).then((r) => r.data ?? []).catch(() => []),
  ]);
  if (!project) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://acrorefrigeration.com.au" },
      { "@type": "ListItem", position: 2, name: "Projects", item: "https://acrorefrigeration.com.au/projects" },
      { "@type": "ListItem", position: 3, name: project.title, item: `https://acrorefrigeration.com.au/projects/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectPage project={project} related={related} />
    </>
  );
}
