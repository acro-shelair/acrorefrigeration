"use client";

import Link from "next/link";
import Image from "next/image";
import Layout from "@/components/Layout";
import { MapPin, ArrowRight, Phone, Clock, Wrench, Shield, Headphones, BookOpen, FileText, Video } from "lucide-react";
import { getIcon } from "@/app/admin/services/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { LocationCity, LocationSuburb, Service, Industry, Project } from "@/lib/supabase/content";
import type { Post } from "@/lib/supabase/posts";
import heroImg from "@/assets/hero-coldroom.webp";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
  }),
};

const defaultTrustSignals = [
  { label: "Avg Response", value: "2 hrs" },
  { label: "First-Visit Fix", value: "98%" },
  { label: "HACCP Compliant", value: "Yes" },
  { label: "Support", value: "24/7" },
];

const trustIcons = [Clock, Wrench, Shield, Headphones];

function TypeIcon({ type }: { type: string }) {
  if (type === "Guide") return <BookOpen className="w-3 h-3" />;
  if (type === "Video") return <Video className="w-3 h-3" />;
  return <FileText className="w-3 h-3" />;
}

const SuburbPage = ({
  city, suburb, services, industries, projects, posts,
}: {
  city: LocationCity;
  suburb: LocationSuburb;
  services: Service[];
  industries: Industry[];
  projects: Project[];
  posts: Post[];
}) => {
  const allSuburbs = city.location_suburbs ?? [];

  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary px-6 py-3">
        <div className="container-narrow">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link href="/locations">Locations</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link href={`/locations/${city.slug}`}>{city.name}</Link></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{suburb.name}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div className="max-w-3xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <MapPin className="w-3.5 h-3.5" /> {suburb.name}, {city.name}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Commercial Refrigeration Repairs {suburb.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              24/7 emergency repairs, preventative maintenance and cold room builds in {suburb.name} and surrounding areas.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {suburb.venue_types.map((v) => (
                <Badge key={v} variant="secondary" className="text-xs">{v}</Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href="tel:1300227600"><Phone className="w-4 h-4 mr-2" /> 1300 227 600</a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/contact">Get a Quote <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-secondary py-8 px-6">
        <div className="container-narrow">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {(suburb.stats?.length > 0 ? suburb.stats : defaultTrustSignals).map((stat, i) => {
              const Icon = trustIcons[i] ?? Clock;
              return (
                <motion.div key={stat.label} custom={i} variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-sm leading-tight">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Local Context */}
      <section className="section-padding bg-background">
        <div className="container-narrow max-w-3xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Refrigeration Experts in {suburb.name}</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">{suburb.local_context_text}</p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-secondary">
        <div className="container-narrow">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Our Services in {suburb.name}</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = getIcon(s.icon_name);
              return (
              <motion.div key={s.id} custom={i} variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} whileHover={{ y: -4 }} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Industries We Serve in {suburb.name}</h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {industries.map((ind, i) => {
              const Icon = getIcon(ind.icon_name);
              return (
              <motion.div key={ind.id} custom={i} variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} whileHover={{ y: -4 }} className="bg-card rounded-xl p-5 border border-border shadow-sm text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-sm">{ind.title}</h3>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Nearby Suburbs */}
      {suburb.nearby_suburbs?.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-2xl font-extrabold mb-2">Nearby Suburbs We Service</h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-3">
              {suburb.nearby_suburbs.map((name) => {
                const linked = allSuburbs.find((s) => s.name === name);
                return linked ? (
                  <Link key={name} href={`/locations/${city.slug}/${linked.slug}`}
                    className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium hover:border-primary/30 hover:text-primary transition-colors">
                    {name}
                  </Link>
                ) : (
                  <span key={name} className="px-4 py-2 bg-card border border-border rounded-full text-sm font-medium text-muted-foreground">{name}</span>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Case Studies */}
      {projects.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Recent Projects in {city.name}</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                See how we&apos;ve helped businesses in {city.name} with their commercial refrigeration needs.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {projects.map((p, i) => (
                <motion.div key={p.id} custom={i} variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
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
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{p.type}</span>
                        <span className="text-xs text-muted-foreground">{p.size}</span>
                      </div>
                      <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-200">{p.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.description}</p>
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

      {/* Helpful Resources */}
      {posts.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Helpful Resources</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Expert guides and articles on commercial refrigeration.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {posts.map((a, i) => (
                <motion.div key={a.slug} custom={i} variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
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
                        <span className="text-xs text-muted-foreground">{a.date}</span>
                      </div>
                      <h3 className="font-bold mb-2 group-hover:text-primary transition-colors leading-snug">{a.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{a.description}</p>
                      <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <motion.div className="text-center mt-10" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <Button asChild variant="outline" size="lg" className="cursor-pointer">
                <Link href="/resources">View All Resources <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      <CTABanner />
    </Layout>
  );
};

export default SuburbPage;
