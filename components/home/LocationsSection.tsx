"use client";

import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { LocationCity } from "@/lib/supabase/content";
import { locationsSection } from "@/data/home";
import { motion, Variants } from "framer-motion";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: i * 0.08 },
  }),
};

const LocationsSection = ({ cities }: { cities: LocationCity[] }) => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <motion.div
        className="text-center mb-12 md:mb-16"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
          <MapPin className="w-3 h-3" /> {locationsSection.badge}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {locationsSection.heading}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {locationsSection.subheading}
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {cities.map((city, i) => (
          <motion.div
            key={city.slug}
            custom={i}
            variants={cardVariant}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <Link
              href={`/locations/${city.slug}`}
              className="block bg-card rounded-xl p-7 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group h-full"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors duration-300">
                <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-extrabold mb-2">{city.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {city.region_description}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {city.sample_suburbs.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs font-medium">
                    {s}
                  </Badge>
                ))}
              </div>
              <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                View {city.name} areas <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="text-center mt-10"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <Link
          href="/locations"
          className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all duration-200"
        >
          {locationsSection.viewAllLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default LocationsSection;
