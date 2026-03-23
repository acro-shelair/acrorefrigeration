"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import { processSteps, processPage } from "@/data/process";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const Process = () => (
  <Layout>
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
            {processPage.badge}
          </motion.span>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold mb-6">
            {processPage.heading}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-muted-foreground">
            {processPage.subheading}
          </motion.p>
        </motion.div>

        <div className="space-y-5">
          {processSteps.map((s, i) => (
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

        <div className="mt-10 bg-secondary rounded-xl p-8 md:p-12 border border-border">
          <h2 className="text-2xl font-extrabold mb-4">{processPage.coldRoomNote.heading}</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">{processPage.coldRoomNote.body}</p>
          <Button asChild className="cursor-pointer">
            <Link href="/contact">
              Request a Build Quote <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Button asChild size="lg" className="text-base px-8 cursor-pointer">
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
