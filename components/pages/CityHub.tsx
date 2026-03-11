"use client";

import Link from "next/link";
import Layout from "@/components/Layout";
import { MapPin, ArrowRight, Phone, Clock, Wrench, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { LocationCity } from "@/lib/supabase/content";

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

const statIcons = [Clock, CheckCircle, Wrench, Users];

const CityHub = ({ city }: { city: LocationCity }) => {
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
          <motion.div className="max-w-3xl" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              <MapPin className="w-3.5 h-3.5" /> {city.name}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Commercial Refrigeration Repairs {city.name}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{city.region_description}</p>
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

      {/* Stats */}
      {city.stats?.length > 0 && (
        <section className="bg-secondary py-8 px-6">
          <div className="container-narrow">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {(city.stats as { label: string; value: string }[]).map((stat, i) => {
                const Icon = statIcons[i] ?? Clock;
                return (
                  <motion.div key={stat.label} custom={i} variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-extrabold text-lg">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Coverage Zones */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div className="text-center mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{city.name} Coverage Zones</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We service every corner of {city.name}. Find your suburb below.</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {city.zones.map((zone) => (
              <Badge key={zone} className="text-sm px-4 py-1.5 font-semibold">{zone}</Badge>
            ))}
          </div>

          {grouped.map((group, gi) => group.suburbs.length > 0 && (
            <motion.div key={group.zone} custom={gi} variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} className="mb-10">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> {group.zone}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.suburbs.map((suburb) => (
                  <Link key={suburb.slug} href={`/locations/${city.slug}/${suburb.slug}`}
                    className="block bg-card rounded-xl p-5 border border-border shadow-sm hover:border-primary/20 group transition-colors">
                    <h4 className="font-bold mb-1 group-hover:text-primary transition-colors">{suburb.name}</h4>
                    <p className="text-sm text-muted-foreground">{suburb.business_types}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <CTABanner />
    </Layout>
  );
};

export default CityHub;
