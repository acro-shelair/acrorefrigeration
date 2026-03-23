"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Industry } from "@/lib/supabase/content";
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

type RelatedIndustry = { slug: string; title: string; description: string };

const IndustryPage = ({
  industry,
  relatedIndustries,
}: {
  industry: Industry;
  relatedIndustries: RelatedIndustry[];
}) => {
  const challenges       = (industry.challenges        ?? []) as { title: string; desc: string }[];
  const industryServices = (industry.industry_services ?? []) as { icon_name: string; title: string; desc: string }[];
  const stats            = (industry.stats             ?? []) as { value: string; label: string }[];
  const caseStudy        = industry.case_study as { company: string; challenge: string; solution: string; result: string } | null;

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-secondary px-6 py-4 border-b border-border">
        <div className="container-narrow">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/industries">Industries</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{industry.subtitle || industry.title}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div className="max-w-3xl" variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
              {industry.subtitle || industry.title}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{industry.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{industry.hero_desc || industry.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="cursor-pointer">
                <Link href="/contact">Get a Quote <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="destructive" className="gradient-cta border-0 cursor-pointer">
                <a href="tel:1300227600"><Phone className="w-4 h-4 mr-2" /> 1300 227 600</a>
              </Button>
            </div>
          </motion.div>

          {industry.image_url && (
            <motion.div
              className="mt-12 rounded-xl overflow-hidden shadow-lg"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img
                src={industry.image_url}
                alt={industry.title}
                className="w-full h-72 md:h-96 object-cover"
              />
            </motion.div>
          )}
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="bg-foreground text-background py-7 px-6">
          <div className="container-narrow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="text-center"
                >
                  <div className="text-3xl font-extrabold text-background leading-none">{s.value}</div>
                  <div className="text-sm text-background/60 mt-1">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Challenges */}
      {challenges.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-narrow">
            <motion.div className="mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-3">Your Challenges</h2>
              <p className="text-muted-foreground">
                We understand the unique pressures facing {(industry.subtitle || industry.title).toLowerCase()} businesses.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {challenges.map((c, i) => (
                <motion.div
                  key={c.title}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-300 h-full"
                >
                  <h3 className="font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services */}
      {industryServices.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">How We Help</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {industryServices.map((s, i) => {
                const ServiceIcon = getIcon(s.icon_name);
                return (
                  <motion.div
                    key={s.title}
                    custom={i}
                    variants={cardVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-300 h-full"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <ServiceIcon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Case Study */}
      {caseStudy?.company && (
        <section className="section-padding bg-background">
          <div className="container-narrow max-w-4xl">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="bg-card rounded-xl border border-border p-8 md:p-12">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-6">
                  Case Study
                </span>
                <h3 className="text-2xl font-extrabold mb-6">{caseStudy.company}</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Challenge</h4>
                    <p className="text-sm leading-relaxed">{caseStudy.challenge}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Solution</h4>
                    <p className="text-sm leading-relaxed">{caseStudy.solution}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Result</h4>
                    <p className="text-sm leading-relaxed font-medium">{caseStudy.result}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Related Industries */}
      {relatedIndustries.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold">Other Industries We Serve</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-5">
              {relatedIndustries.map((ri, i) => (
                <motion.div key={ri.slug} custom={i} variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                  <Link href={`/industries/${ri.slug}`} className="block bg-card rounded-xl p-7 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group h-full">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-200">{ri.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{ri.description}</p>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </Layout>
  );
};

export default IndustryPage;
