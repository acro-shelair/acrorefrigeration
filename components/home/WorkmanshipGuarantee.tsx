"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { workmanshipGuarantee } from "@/data/home";

const WorkmanshipGuarantee = () => {
  const { heading, subheading, bodyCopy, highlights, note, comparison, trustCards, cta, blogStrip } =
    workmanshipGuarantee;

  return (
    <section
      className="py-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 bg-background"
      aria-label="5-Year Workmanship Guarantee by Acro Refrigeration"
    >
      <div className="container-narrow">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <ScrollReveal className="text-center mb-8 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            {heading}
          </h2>
          <h3 className="text-lg font-semibold text-muted-foreground">
            {subheading}
          </h3>
        </ScrollReveal>

        {/* ── Body + Highlights (left) · Comparison (right) ──────────────── */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">

          {/* Left column */}
          <ScrollReveal className="flex flex-col gap-5">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {bodyCopy}
            </p>
            <div className="bg-card rounded-2xl border border-border p-5">
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mb-4">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2
                      className="w-4 h-4 text-green-600 mt-0.5 shrink-0"
                      aria-hidden="true"
                    />
                    <span className="text-sm leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-primary/40 pl-3">
                {note}
              </p>
            </div>
          </ScrollReveal>

          {/* Right column — Comparison table */}
          <ScrollReveal>
            <div className="rounded-2xl border border-border overflow-hidden shadow-sm h-full">

              {/* Header row */}
              <div className="grid grid-cols-2 text-xs font-bold">
                <div className="px-4 py-3 text-center border-r border-border bg-card">
                  <strong>{comparison.col1.heading}</strong>
                </div>
                <div className="px-4 py-3 text-center gradient-cta text-primary-foreground">
                  <strong>{comparison.col2.heading}</strong>
                </div>
              </div>

              {/* Data rows */}
              {comparison.col1.rows.map((row1, i) => {
                const row2 = comparison.col2.rows[i];
                return (
                  <div
                    key={i}
                    className="grid grid-cols-2 border-t border-border text-xs"
                  >
                    <div className="px-4 py-3 border-r border-border bg-card flex flex-col gap-0.5">
                      <span
                        className={
                          row1.type === "negative"
                            ? "font-semibold text-red-600"
                            : "font-medium text-foreground"
                        }
                      >
                        {row1.label}
                      </span>
                      <span
                        className={
                          row1.type === "negative"
                            ? "text-muted-foreground line-through"
                            : "text-muted-foreground"
                        }
                      >
                        {row1.value}
                      </span>
                    </div>
                    <div className="px-4 py-3 bg-primary/5 flex flex-col gap-0.5">
                      <span
                        className={
                          row2.type === "positive"
                            ? "font-semibold text-primary"
                            : "font-medium text-foreground"
                        }
                      >
                        {row2.label}
                      </span>
                      <span
                        className={
                          row2.type === "positive"
                            ? "font-semibold text-primary"
                            : "text-muted-foreground"
                        }
                      >
                        {row2.value}
                      </span>
                    </div>
                  </div>
                );
              })}

            </div>
          </ScrollReveal>
        </div>

        {/* ── Trust Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {trustCards.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 80}>
              <div className="bg-card rounded-2xl p-4 md:p-5 border border-border shadow-sm hover-lift h-full group">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <card.icon
                    className="w-4 h-4 text-primary"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="font-bold text-xs mb-1.5">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {card.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* ── CTA Block ──────────────────────────────────────────────────── */}
        <ScrollReveal className="text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-3">
            <Button asChild size="lg">
              <Link href={cta.primary.href}>{cta.primary.label}</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground/70 mb-5">{cta.finePrint}</p>

          {/* ── Blog Callout Strip ──────────────────────────────────── */}
          <div className="border border-border bg-card rounded-xl px-5 py-4 max-w-3xl mx-auto text-left">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold mb-1">
              {blogStrip.prefix}
            </p>
            <strong className="block text-sm font-medium text-foreground mb-3">
              {blogStrip.headline}
            </strong>
            <nav aria-label="Workmanship guarantee related articles">
              <ul className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-2 gap-x-0">
                {blogStrip.links.map((link, i) => (
                  <li key={link.href} className="flex items-center">
                    {i > 0 && (
                      <span
                        className="hidden sm:inline-block mx-3 text-border select-none"
                        aria-hidden="true"
                      >
                        ·
                      </span>
                    )}
                    <a
                      href={link.href}
                      className="text-xs text-primary hover:underline underline-offset-4 font-medium"
                    >
                      {link.label} →
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

        </ScrollReveal>

      </div>
    </section>
  );
};

export default WorkmanshipGuarantee;
