"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import { industries, industriesPage } from "@/data/industries";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const featureVariant: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const featureStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const Industries = () => (
  <Layout>
    
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <motion.div
          className="max-w-3xl mb-16"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          <motion.div
            variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"
          >
            {industriesPage.badge}
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            {industriesPage.heading}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            {industriesPage.subheading}
          </motion.p>
        </motion.div>

        <div className="space-y-8">
          {industries.map((ind, i) => (
            <motion.div
              key={ind.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`grid lg:grid-cols-2 gap-8 items-center bg-card rounded-2xl border border-border shadow-sm p-8 md:p-12 ${
                i % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                  <ind.icon className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-extrabold mb-3">{ind.title}</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {ind.desc ?? ind.shortDesc}
                </p>
                <Button asChild>
                  <Link href="/contact">
                    Get a Service Quote <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <motion.div
                className="grid grid-cols-2 gap-3"
                variants={featureStagger}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
              >
                {ind.features.map((f) => (
                  <motion.div
                    key={f}
                    variants={featureVariant}
                    className="bg-secondary rounded-xl px-4 py-3 text-sm font-medium text-center"
                  >
                    {f}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <CTABanner />
  </Layout>
);

export default Industries;
