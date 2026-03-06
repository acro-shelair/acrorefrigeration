"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import { processSteps, processPage } from "@/data/process";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Process = () => (
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
            {processPage.badge}
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            {processPage.heading}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            {processPage.subheading}
          </motion.p>
        </motion.div>

        <div className="space-y-6">
          {processSteps.map((s, i) => (
            <motion.div
              key={s.num}
              className="grid md:grid-cols-[80px_1fr] gap-6 items-start"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.05 }}
            >
              <motion.div
                className="w-16 h-16 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground font-extrabold text-lg shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {s.num}
              </motion.div>
              <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <s.icon className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold">{s.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-secondary rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl font-extrabold mb-4">
            {processPage.coldRoomNote.heading}
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            {processPage.coldRoomNote.body}
          </p>
          <Button asChild>
            <Link href="/contact">
              Request a Build Quote <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Button asChild size="lg" className="text-base px-8">
            <a href={`tel:${processPage.phone}`}>
              <Phone className="w-4 h-4 mr-2" /> {processPage.callCta}{" "}
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
    <CTABanner />
  </Layout>
);

export default Process;
