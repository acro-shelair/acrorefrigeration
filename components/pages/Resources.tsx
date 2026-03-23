"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Video, ChevronLeft, ChevronRight } from "lucide-react";
import type { Post } from "@/lib/supabase/posts";
import CTABanner from "@/components/home/CTABanner";
import { motion, Variants } from "framer-motion";

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

function TypeIcon({ type }: { type: string }) {
  if (type === "Guide") return <BookOpen className="w-3 h-3" />;
  if (type === "Video") return <Video className="w-3 h-3" />;
  return <FileText className="w-3 h-3" />;
}

const Resources = ({ posts, page, totalPages }: { posts: Post[]; page: number; totalPages: number }) => (
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
            Resources
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-extrabold mb-6"
          >
            Guides, Articles & Insights
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-lg text-muted-foreground"
          >
            Expert knowledge to help you make informed decisions about
            commercial refrigeration.
          </motion.p>
        </motion.div>

        {posts.length === 0 ? (
          <p className="text-muted-foreground">No articles published yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((a, i) => (
              <motion.div
                key={a.slug}
                custom={i}
                variants={cardVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Link
                  href={`/resources/${a.slug}`}
                  className="block bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow group h-full overflow-hidden"
                >
                  {a.image_url && (
                    <div className="w-full h-40 overflow-hidden">
                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full flex items-center gap-1">
                      <TypeIcon type={a.type} /> {a.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {a.date}
                    </span>
                  </div>
                  <h3 className="font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                    {a.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {a.description}
                  </p>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-14">
            {page > 1 ? (
              <Link
                href={`/resources?page=${page - 1}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium opacity-30 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> Previous
              </span>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/resources?page=${p}`}
                  className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                    p === page
                      ? "gradient-cta text-primary-foreground"
                      : "border border-border bg-card hover:border-primary/40 hover:text-primary"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>

            {page < totalPages ? (
              <Link
                href={`/resources?page=${page + 1}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
              >
                Next <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm font-medium opacity-30 cursor-not-allowed">
                Next <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        )}
      </div>
    </section>
    <CTABanner />
  </Layout>
);

export default Resources;
