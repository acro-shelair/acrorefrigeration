"use client";

import Link from "next/link";
import Layout from "@/components/Layout";
import { ArrowRight, Clock, BookOpen, FileText, Video } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";
import type { Post } from "@/lib/supabase/posts";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: i * 0.08 },
  }),
};

function TypeIcon({ type, className }: { type: string; className?: string }) {
  if (type === "Guide") return <BookOpen className={className} />;
  if (type === "Video") return <Video className={className} />;
  return <FileText className={className} />;
}

type RelatedPost = {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  date: string;
};

const ResourcePage = ({
  post,
  relatedPosts,
}: {
  post: Post;
  relatedPosts: RelatedPost[];
}) => {
  return (
    <Layout>
      {/* Breadcrumb */}
      <div className="bg-secondary px-6 py-3">
        <div className="container-narrow">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/resources">Resources</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{post.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Hero */}
      <section className="section-padding bg-background">
        <div className="container-narrow">
          <div className="max-w-3xl">
            <motion.div variants={fadeUp} initial="hidden" animate="visible">
              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                  <TypeIcon type={post.type} className="w-3.5 h-3.5" />{" "}
                  {post.type}
                </span>
                <span className="text-sm text-muted-foreground">
                  {post.date}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" /> {post.read_time}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
                {post.title}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {post.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="pb-16 bg-background">
        <div className="container-narrow">
          <div className="max-w-3xl">
            <div className="border-t border-border pt-12 space-y-12">
              {post.post_sections?.map((section, i) => {
                const isFaq =
                  section.heading.toLowerCase().includes("faq") ||
                  section.heading.toLowerCase().includes("frequently asked");

                return (
                  <motion.div
                    key={section.id}
                    custom={i}
                    variants={cardVariant}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                  >
                    <h2 className="text-xl md:text-2xl font-extrabold mb-4">
                      {section.heading}
                    </h2>

                    {isFaq ? (
                      <Accordion type="single" collapsible className="space-y-2">
                        {section.content.map((item, j) => {
                          const qMark = item.indexOf("? ");
                          const question =
                            qMark !== -1 ? item.slice(0, qMark + 1) : item;
                          const answer =
                            qMark !== -1 ? item.slice(qMark + 2) : "";
                          return (
                            <AccordionItem
                              key={j}
                              value={`faq-${i}-${j}`}
                              className="border border-border rounded-xl px-5 data-[state=open]:border-primary/30"
                            >
                              <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4">
                                {question}
                              </AccordionTrigger>
                              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                                {answer}
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    ) : (
                      <div className="space-y-4">
                        {section.content.map((para, j) => (
                          <p key={j} className="text-muted-foreground leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Inline CTA */}
            <motion.div
              className="mt-12 bg-secondary rounded-2xl p-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-extrabold mb-2">
                Need expert advice for your business?
              </h3>
              <p className="text-muted-foreground text-sm mb-6">
                Our technicians are available 24/7 for emergency repairs,
                preventative maintenance and cold room builds across Brisbane,
                Gold Coast and the Sunshine Coast.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/contact">
                    Get a Quote <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <a href="tel:1300227600">Call 1300 227 600</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related articles */}
      {relatedPosts.length > 0 && (
        <section className="section-padding bg-secondary">
          <div className="container-narrow">
            <motion.h2
              className="text-2xl font-extrabold mb-8"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              Related Articles
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedPosts.map((rel, i) => (
                <motion.div
                  key={rel.slug}
                  custom={i}
                  variants={cardVariant}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <Link
                    href={`/resources/${rel.slug}`}
                    className="block bg-card rounded-2xl p-6 border border-border shadow-sm group hover:border-primary/20 h-full"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <TypeIcon type={rel.type} className="w-3 h-3" />{" "}
                        {rel.type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {rel.date}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                      {rel.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {rel.description}
                    </p>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More <ArrowRight className="w-4 h-4" />
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

export default ResourcePage;
