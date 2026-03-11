"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import heroImg from "@/assets/hero-coldroom.jpg";
import { hero } from "@/data/home";

function StatCard({
  value,
  label,
  delay,
  pulseDelay,
  className,
}: {
  value: string;
  label: string;
  delay: number;
  pulseDelay: number;
  className: string;
}) {
  return (
    <motion.div
      className={`${className} z-10`}
      suppressHydrationWarning
      initial={{ opacity: 0, scale: 0.75 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: "backOut" }}
    >
      <motion.div
        className="bg-background/90 backdrop-blur-md rounded-xl border border-border px-4 py-3 shadow-lg text-center min-w-[130px]"
        animate={{ y: [0, -8, 0] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: pulseDelay,
        }}
      >
        <span className="block text-xl font-extrabold text-primary leading-tight">
          {value}
        </span>
        <span className="text-xs text-muted-foreground font-medium mt-0.5 block whitespace-nowrap">
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const Hero = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left column */}
          <motion.div
            className="max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 cursor-default"
            >
              {hero.badge}
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6"
            >
              {hero.heading}
              <span className="text-primary">{hero.headingHighlight}</span>
              {hero.headingEnd}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md"
            >
              {hero.subheading}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row flex-wrap gap-3"
            >
              <Button
                asChild
                size="lg"
                className="text-base px-8 w-full sm:w-auto"
              >
                <Link href={hero.primaryCta.href}>
                  {hero.primaryCta.label}{" "}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-base px-8 w-full sm:w-auto"
              >
                <Link href={hero.secondaryCta.href}>
                  <Calendar className="w-4 h-4 mr-2" />{" "}
                  {hero.secondaryCta.label}
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right column — image + floating stat cards */}
          <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-2xl shadow-foreground/5 mx-8">
              <div className="relative w-full h-[500px]">
                <Image
                  src={heroImg}
                  alt="Commercial cold room installation by Acro Refrigeration"
                  fill
                  className="object-cover"
                  priority
                  sizes="50vw"
                />
              </div>
            </div>

            {/* Stat card — left center */}
            <StatCard
              value="50+"
              label="Years Experience"
              delay={0.7}
              pulseDelay={0}
              className="absolute left-0 top-1/2 -translate-y-1/2"
            />

            {/* Stat card — top right */}
            <StatCard
              value="HACCP-Certified"
              label="HACCP Certified"
              delay={0.9}
              pulseDelay={0.9}
              className="absolute right-0 top-12"
            />

            {/* Stat card — bottom right */}
            <StatCard
              value="24/7 Support"
              label="Emergency Response"
              delay={1.1}
              pulseDelay={1.8}
              className="absolute right-0 bottom-12"
            />
          </motion.div>

          {/* Mobile image — no stats */}
          <motion.div
            className="lg:hidden rounded-2xl overflow-hidden shadow-2xl shadow-foreground/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-full h-[240px] sm:h-[320px]">
              <Image
                src={heroImg}
                alt="Commercial cold room installation by Acro Refrigeration"
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
