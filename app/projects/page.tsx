import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAllProjects } from "@/lib/supabase/content";
import { withRetry } from "@/lib/retry";
import Projects from "@/components/pages/Projects";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Featured Projects",
  description:
    "Browse our portfolio of commercial cold room and refrigeration projects across Brisbane, SE Queensland and Australia — from restaurant coolrooms to large-scale pharmaceutical cold storage.",
  alternates: { canonical: "https://acrorefrigeration.com.au/projects" },
  openGraph: { url: "https://acrorefrigeration.com.au/projects", images: [{ url: "/api/og?title=Featured+Projects&description=Commercial+cold+room+and+refrigeration+projects+across+Brisbane+%26+SE+Queensland.&type=projects", width: 1200, height: 630, alt: "Acro Refrigeration — Featured Projects" }] },
};

export default async function ProjectsPage() {
  const supabase = createAdminClient();
  const projects = await withRetry(() => getAllProjects(supabase)).catch(() => []);
  return <Projects projects={projects} />;
}
