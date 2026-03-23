"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, CheckCircle } from "lucide-react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
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

type RelatedService = { slug: string | null; title: string; description: string };

const ServicePage = ({ service, relatedServices }: { service: Service; relatedServices: RelatedService[] }) => {
  const Icon = getIcon(service.icon_name);

  return (
    <Layout>
      {/* Breadcrumb */}
      <section className="bg-secondary px-6 py-4 border-b border-border">
        <div className="container-narrow">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/">Home</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink asChild><Link href="/services">Services</Link></BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>{service.subtitle || service.title}</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </section>

      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <motion.div className="max-w-3xl" variants={fadeUp} initial="hidden" animate="visible">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
              <Icon className="w-3 h-3" /> {service.subtitle || service.title}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{service.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">{service.hero_desc || service.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="cursor-pointer">
                <Link href="/contact">Get a Quote <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="destructive" className="gradient-cta border-0 cursor-pointer">
                <a href="tel:1300227600"><Phone className="w-4 h-4 mr-2" /> 1300 227 600</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      {service.stats?.length > 0 && (
        <section className="bg-foreground text-background py-7 px-6">
          <div className="container-narrow">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {service.stats.map((s, i) => (
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

      {/* Overview & Benefits */}
      {(service.overview || service.benefits?.length > 0) && (
        <section className="section-padding bg-background">
          <div className="container-narrow grid lg:grid-cols-2 gap-12 items-start">
            {service.overview && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <h2 className="text-3xl font-extrabold mb-4">What&apos;s Included</h2>
                <p className="text-muted-foreground leading-relaxed mb-6">{service.overview}</p>
                <Button asChild variant="outline" className="cursor-pointer">
                  <Link href="/contact">Discuss Your Needs <ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
              </motion.div>
            )}
            {service.benefits?.length > 0 && (
              <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} transition={{ delay: 0.1 }}>
                <div className="bg-card rounded-xl border border-border p-7">
                  <h3 className="font-bold text-lg mb-5">Key Benefits</h3>
                  <ul className="space-y-3">
                    {service.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Process */}
      {service.process_steps?.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="text-center mb-12" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl md:text-4xl font-extrabold mb-4">How It Works</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {service.process_steps.map((p, i) => (
                <motion.div
                  key={p.step}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 hover:shadow-sm transition-all duration-300 h-full"
                >
                  <div className="w-10 h-10 rounded-xl gradient-cta text-primary-foreground flex items-center justify-center font-extrabold text-sm mb-4">
                    {p.step}
                  </div>
                  <h3 className="font-bold mb-2">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faqs?.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-narrow max-w-3xl">
            <motion.div className="mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-4">Frequently Asked Questions</h2>
            </motion.div>
            <div className="space-y-3">
              {service.faqs.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  className="bg-card rounded-xl border border-border p-6 hover:border-primary/25 transition-colors duration-200"
                >
                  <h3 className="font-bold mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      {relatedServices.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.div className="mb-10" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="text-3xl font-extrabold mb-4">Related Services</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-5">
              {relatedServices.map((rs, i) => (
                <motion.div key={rs.slug} custom={i} variants={cardVariant} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
                  <Link href={`/services/${rs.slug}`} className="block bg-card rounded-xl p-7 border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group h-full">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-200">{rs.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{rs.description}</p>
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

export default ServicePage;
