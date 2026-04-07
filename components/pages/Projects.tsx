"use client";

import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CTABanner from "@/components/home/CTABanner";
import heroImg from "@/assets/hero-coldroom.jpg";
import { motion, Variants } from "framer-motion";
import { projectsPage } from "@/data/projects";
import type { Project } from "@/lib/supabase/content";
import { useDebounce } from "@/hooks/use-debounce";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.08 },
  }),
};

const Projects = ({ projects }: { projects: Project[] }) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const filtered = useMemo(() => {
    if (!debouncedQuery.trim()) return projects;
    const q = debouncedQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q)
    );
  }, [projects, debouncedQuery]);

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div
            className="max-w-3xl mb-14"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            <motion.span
              variants={fadeUp}
              className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4"
            >
              {projectsPage.badge}
            </motion.span>
            <motion.h1
              variants={fadeUp}
              className="text-4xl md:text-5xl font-extrabold mb-6"
            >
              {projectsPage.heading}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              className="text-lg text-muted-foreground"
            >
              {projectsPage.subheading}
            </motion.p>
          </motion.div>

          {/* Search */}
          <div className="relative max-w-md mb-10">
            <Search className="absolute left-4 top-1/2 ml-3 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects..."
              style={{ paddingLeft: "2.75rem" }}
              className="w-full pr-10 py-2.5 rounded-lg border border-border bg-card text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {filtered.length === 0 ? (
            <p className="text-muted-foreground">
              {debouncedQuery
                ? "No projects match your search."
                : "No projects available."}
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <Link
                    href={`/projects/${p.slug}`}
                    className="block bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 overflow-hidden group h-full"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={p.image_url ?? heroImg.src}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                          {p.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {p.size}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                        {p.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {p.description}
                      </p>
                      <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                        View Case Study <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Button asChild size="lg" className="text-base px-8 cursor-pointer">
              <Link href={projectsPage.cta.href}>
                {projectsPage.cta.label} <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
      <CTABanner />
    </Layout>
  );
};

export default Projects;
