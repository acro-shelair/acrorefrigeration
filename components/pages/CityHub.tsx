"use client";

import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import {
  MapPin,
  ArrowRight,
  Phone,
  Clock,
  Wrench,
  Users,
  CheckCircle,
  BookOpen,
  FileText,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CTABanner from "@/components/home/CTABanner";
import Testimonials from "@/components/home/Testimonials";
import { motion, Variants } from "framer-motion";
import type {
  LocationCity,
  Project,
  Testimonial,
} from "@/lib/supabase/content";
import { normalizeContent } from "@/lib/supabase/posts";
import { ContentBlockRenderer } from "@/components/ContentBlockRenderer";
import type { Post } from "@/lib/supabase/posts";
import heroImg from "@/assets/hero-coldroom.webp";

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

const statIcons = [Clock, CheckCircle, Wrench, Users];

function TypeIcon({ type }: { type: string }) {
  if (type === "Guide") return <BookOpen className="w-3 h-3" />;
  if (type === "Video") return <Video className="w-3 h-3" />;
  return <FileText className="w-3 h-3" />;
}

const CityHub = ({
  city,
  projects,
  posts,
  testimonials,
}: {
  city: LocationCity;
  projects: Project[];
  posts: Post[];
  testimonials: Testimonial[];
}) => {
  const suburbs = city.location_suburbs ?? [];
  const grouped = city.zones.map((zone) => ({
    zone,
    suburbs: suburbs.filter((s) => s.zone === zone),
  }));

  return (
    <Layout>
      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div
            className="max-w-3xl"
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
              <MapPin className="w-3 h-3" /> {city.name}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Commercial Refrigeration Repairs {city.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {city.region_description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="cursor-pointer">
                <a href="tel:1300227600">
                  <Phone className="w-4 h-4 mr-2" /> 1300 227 600
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="cursor-pointer"
              >
                <Link href="/contact">
                  Get a Quote <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {city.stats?.length > 0 && (
        <section className="bg-foreground text-background py-7 px-6">
          <div className="container-narrow">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {(city.stats as { label: string; value: string }[]).map(
                (stat, i) => {
                  const Icon = statIcons[i] ?? Clock;
                  return (
                    <motion.div
                      key={stat.label}
                      custom={i}
                      variants={cardVariant}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-background" />
                      </div>
                      <div>
                        <div className="font-extrabold text-lg text-background leading-tight">
                          {stat.value}
                        </div>
                        <div className="text-xs text-background/55">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}

      {/* City Content Sections */}
      {(city.city_sections ?? []).length > 0 && (
        <section className="section-padding bg-secondary w-full">
          <div className="container-narrow">
            <div className="space-y-10">
              {(city.city_sections ?? []).map((section, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
                    {section.heading}
                  </h2>
                  <div className="space-y-4">
                    {normalizeContent(section.blocks).map((block, j) => (
                      <ContentBlockRenderer key={j} block={block} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coverage Zones */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div
            className="text-center mb-12"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              {city.name} Coverage Zones
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We service every corner of {city.name}. Find your suburb below.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2">
            {grouped.flatMap((group) =>
              group.suburbs.map((suburb) => (
                <Link
                  key={suburb.slug}
                  href={`/locations/${city.slug}/${suburb.slug}`}
                >
                  <Badge
                    variant="outline"
                    className="text-sm px-4 py-1.5 font-semibold cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
                  >
                    {suburb.name}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      {projects.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div
              className="text-center mb-12"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Recent Projects in {city.name}
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See how we&apos;ve helped businesses in {city.name} with their
                commercial refrigeration needs.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((p, i) => (
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
                        sizes="(max-width: 768px) 100vw, 33vw"
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
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <Testimonials initialTestimonials={testimonials} />
      )}

      {/* Helpful Resources */}
      {posts.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <motion.div
              className="text-center mb-12"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
                Helpful Resources
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Expert guides and articles on commercial refrigeration.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((a, i) => (
                <motion.div
                  key={a.slug}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                >
                  <Link
                    href={`/resources/${a.slug}`}
                    className="block bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group h-full overflow-hidden"
                  >
                    {a.image_url && (
                      <div className="relative w-full h-40 overflow-hidden">
                        <Image
                          src={a.image_url}
                          alt={a.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                          <TypeIcon type={a.type} /> {a.type}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {a.date}
                        </span>
                      </div>
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                        {a.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {a.description}
                      </p>
                      <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="text-center mt-10"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="cursor-pointer"
              >
                <Link href="/resources">
                  View All Resources <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      <CTABanner />
    </Layout>
  );
};

export default CityHub;
