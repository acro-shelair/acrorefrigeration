"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, Phone } from "lucide-react";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Brand, OtherBrand } from "@/lib/supabase/content";
import { brandsPage } from "@/data/brands";

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

const Brands = ({ brands, otherBrands }: { brands: Brand[]; otherBrands: OtherBrand[] }) => (
  <Layout>
    {/* Hero */}
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          className="max-w-3xl mb-14"
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.span
            variants={fadeUp}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4"
          >
            <Wrench className="w-3 h-3" /> {brandsPage.badge}
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold mb-6">
            {brandsPage.heading}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            {brandsPage.subheading}
          </motion.p>
        </motion.div>

        {/* Emergency banner */}
        <motion.div
          className="gradient-cta rounded-xl p-6 md:p-8 mb-14 flex flex-col md:flex-row items-center justify-between gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-primary-foreground mb-1">
              {brandsPage.emergencyBanner.heading}
            </h2>
            <p className="text-primary-foreground/80 text-sm">
              {brandsPage.emergencyBanner.subheading}
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="shrink-0 cursor-pointer">
            <a href={`tel:${brandsPage.emergencyBanner.phone}`}>
              <Phone className="w-4 h-4 mr-2" /> 1300 227 600
            </a>
          </Button>
        </motion.div>

        {/* Featured brands */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-8">
          <h2 className="text-2xl font-extrabold mb-2">{brandsPage.featuredHeading}</h2>
          <p className="text-muted-foreground">{brandsPage.featuredSubheading}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {brands.map((brand, i) => (
            <motion.div
              key={brand.slug}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              <Link
                href={`/brands/${brand.slug}`}
                className="block bg-card rounded-xl p-7 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group h-full"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground bg-secondary px-2.5 py-1 rounded-full">
                    {brand.speciality}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold mb-2 group-hover:text-primary transition-colors duration-200">
                  {brand.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{brand.detail}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{brand.description}</p>
                <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                  View {brand.name} Services <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Other Brands */}
    <section className="section-padding bg-secondary">
      <div className="container-narrow">
        <motion.div
          className="text-center mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {brandsPage.otherBrandsHeading}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {brandsPage.otherBrandsSubheading}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {otherBrands.map((brand, i) => (
            <motion.div
              key={brand.id}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              className="bg-card rounded-xl p-5 border border-border text-center hover:border-primary/30 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold text-sm mb-1">{brand.name}</h3>
              <p className="text-xs text-muted-foreground">{brand.category}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="bg-card rounded-xl p-8 md:p-12 border border-border text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-extrabold mb-3">{brandsPage.notListedHeading}</h3>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
            {brandsPage.notListedDesc}
          </p>
          <Button asChild size="lg" className="cursor-pointer">
            <Link href="/contact">
              Enquire About Your Brand <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>

    <CTABanner />
  </Layout>
);

export default Brands;
