"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const LocationsHub = ({ cities }: { cities: LocationCity[] }) => (
  <Layout>
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div className="max-w-3xl mb-16" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
            <MapPin className="w-3.5 h-3.5" /> Service Areas
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
            Commercial Refrigeration Repairs Near You
          </h1>
          <p className="text-lg text-muted-foreground">
            24/7 emergency repairs, preventative maintenance and cold room builds across South-East Queensland. Find your local team.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {cities.map((city, i) => (
            <motion.div
              key={city.slug} custom={i} variants={cardVariant}
              initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/locations/${city.slug}`} className="block bg-card rounded-2xl p-8 border border-border shadow-sm group hover:border-primary/20 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-extrabold mb-2">{city.name}</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{city.region_description}</p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {city.sample_suburbs.map((s) => (
                    <Badge key={s} variant="secondary" className="text-xs font-medium">{s}</Badge>
                  ))}
                </div>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  View {city.name} areas <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <CTABanner />
  </Layout>
);

export default LocationsHub;
