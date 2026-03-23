"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CheckCircle, MapPin, Users, Briefcase } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Project } from "@/lib/supabase/content";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.1 },
  }),
};

const ProjectPage = ({ project, related }: { project: Project; related: Project[] }) => (
  <Layout>
    {/* Breadcrumb */}
    <section className="bg-secondary px-6 py-4 border-b border-border">
      <div className="container-narrow">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link href="/projects">Projects</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </section>

    {/* Hero */}
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div className="max-w-3xl" variants={fadeUp} initial="hidden" animate="visible">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
            {project.type}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-6">{project.description}</p>

          {/* Meta */}
          <div className="flex flex-wrap gap-5 mb-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary" /> {project.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4 text-primary" /> {project.client}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="w-4 h-4 text-primary" /> {project.size}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="cursor-pointer">
              <Link href="/contact">
                Discuss a Similar Project <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="destructive" className="gradient-cta border-0 cursor-pointer">
              <a href="tel:1300227600">
                <Phone className="w-4 h-4 mr-2" /> 1300 227 600
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Hero image */}
        {project.image_url && (
          <motion.div
            className="mt-12 rounded-xl overflow-hidden shadow-lg"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <img
              src={project.image_url}
              alt={project.title}
              className="w-full h-72 md:h-96 object-cover"
            />
          </motion.div>
        )}
      </div>
    </section>

    {/* Challenge + Solution */}
    <section className="section-padding bg-secondary">
      <div className="container-narrow grid lg:grid-cols-2 gap-12">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h2 className="text-2xl font-extrabold mb-4">The Challenge</h2>
          <p className="text-muted-foreground leading-relaxed">{project.challenge}</p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-extrabold mb-4">Our Solution</h2>
          <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
        </motion.div>
      </div>
    </section>

    {/* Outcomes */}
    {project.outcomes?.length > 0 && (
      <section className="section-padding bg-background">
        <div className="container-narrow max-w-3xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold mb-8">Results & Outcomes</h2>
            <div className="bg-card rounded-xl border border-border p-7 space-y-4">
              {project.outcomes.map((outcome, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{outcome}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    )}

    {/* Related Projects */}
    {related.length > 0 && (
      <section className="section-padding bg-secondary">
        <div className="container-narrow">
          <motion.div className="mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold">More Projects</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {related.map((p, i) => (
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
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        {p.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{p.size}</span>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-200">
                      {p.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                      View Project <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    )}

    <CTABanner />
  </Layout>
);

export default ProjectPage;
