"use client";

import Link from "next/link";
import { ArrowRight, Briefcase } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { projectsHomeSection } from "@/data/home";
import type { Project } from "@/lib/supabase/content";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.1 },
  }),
};

const ProjectsSection = ({ projects }: { projects: Project[] }) => {
  if (projects.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <Briefcase className="w-3.5 h-3.5" /> {projectsHomeSection.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {projectsHomeSection.heading}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {projectsHomeSection.subheading}
          </p>
        </motion.div>

        {/* Project cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {projects.map((p, i) => (
            <motion.div
              key={p.id}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Link
                href={`/projects/${p.slug}`}
                className="block bg-card rounded-2xl border border-border shadow-sm overflow-hidden group h-full"
              >
                <div className="h-1.5 w-full bg-primary/80" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                      {p.type}
                    </span>
                    <span className="text-xs text-muted-foreground">{p.size}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Project <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View more link */}
        <motion.div
          className="text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Link
            href={projectsHomeSection.viewMoreHref}
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all duration-200"
          >
            {projectsHomeSection.viewMoreLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
