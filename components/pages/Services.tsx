"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import CTABanner from "@/components/home/CTABanner";
import FAQSection from "@/components/home/FAQSection";
import equipmentImg from "@/assets/equipment.jpg";
import { motion, Variants } from "framer-motion";
import { serviceSteps, servicesPage } from "@/data/services";
import type { Service } from "@/lib/supabase/content";
import { getIcon } from "@/app/admin/services/icons";

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

const Services = ({ services }: { services: Service[] }) => (
  <Layout>
    {/* Hero & service cards */}
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
            className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4"
          >
            {servicesPage.badge}
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold mb-6">
            {servicesPage.heading}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            {servicesPage.subheading}
          </motion.p>
        </motion.div>

        {/* Emergency callout banner */}
        <motion.div
          className="gradient-cta rounded-xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-4"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-primary-foreground mb-1">
              {servicesPage.emergencyBanner.heading}
            </h2>
            <p className="text-primary-foreground/80 text-sm">
              {servicesPage.emergencyBanner.subheading}
            </p>
          </div>
          <Button asChild size="lg" variant="secondary" className="shrink-0 cursor-pointer">
            <a href={`tel:${servicesPage.emergencyBanner.phone}`}>
              <Phone className="w-4 h-4 mr-2" /> 1300 227 600
            </a>
          </Button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {services.map((s, i) => {
            const Icon = getIcon(s.icon_name);
            return (
              <motion.div
                key={s.id}
                custom={i}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="bg-card rounded-xl p-7 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {s.description}
                </p>
                <Button asChild variant="ghost" className="px-0 text-primary hover:text-primary cursor-pointer">
                  <Link href="/contact">
                    Get in Touch <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-extrabold mb-4">
              {servicesPage.allBrandsSection.heading}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {servicesPage.allBrandsSection.body1}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              {servicesPage.allBrandsSection.body2}
            </p>
          </motion.div>
          <motion.div
            className="rounded-xl overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <img
              src={equipmentImg.src}
              alt="Commercial refrigeration equipment"
              className="w-full h-[350px] object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>

    {/* How It Works */}
    <section className="section-padding bg-secondary">
      <div className="container-narrow">
        <motion.div
          className="max-w-2xl mb-12"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
            {servicesPage.processSection.badge}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {servicesPage.processSection.heading}
          </h2>
          <p className="text-lg text-muted-foreground">
            {servicesPage.processSection.subheading}
          </p>
        </motion.div>

        <div className="space-y-5">
          {serviceSteps.map((s, i) => (
            <motion.div
              key={s.num}
              className="grid md:grid-cols-[80px_1fr] gap-5 items-start"
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.05 }}
            >
              <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground font-extrabold text-lg shadow-md shadow-primary/20">
                {s.num}
              </div>
              <div className="bg-card rounded-xl p-7 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <s.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold">{s.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-10 bg-card rounded-xl p-8 md:p-12 border border-border"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-extrabold mb-4">
            {servicesPage.processSection.coldRoomNote.heading}
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-6">
            {servicesPage.processSection.coldRoomNote.body}
          </p>
          <Button asChild className="cursor-pointer">
            <Link href="/contact">
              Request a Build Quote <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>

    <CTABanner />
    <FAQSection />
  </Layout>
);

export default Services;
