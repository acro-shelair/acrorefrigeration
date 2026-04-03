"use client";

import Link from "next/link";
import Layout from "@/components/Layout";
import { MapPin, ArrowRight, Phone, Clock, Wrench, Shield, Headphones } from "lucide-react";
import { getIcon } from "@/app/admin/services/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { LocationCity, LocationSuburb, Service, Industry } from "@/lib/supabase/content";

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

const SuburbPage = ({
  city, suburb, services, industries,
}: {
  city: LocationCity;
  suburb: LocationSuburb;
  services: Service[];
  industries: Industry[];
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

      <CTABanner />
    </Layout>
  );
};

export default SuburbPage;
