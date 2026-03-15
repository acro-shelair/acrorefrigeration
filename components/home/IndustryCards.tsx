"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { industries, industriesHomeSection } from "@/data/industries";

const IndustryCards = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-10 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{industriesHomeSection.heading}</h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {industriesHomeSection.subheading}
        </p>
      </ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {industries.map((ind, i) => (
          <ScrollReveal key={ind.title} delay={i * 80}>
            <Link
              href="/industries"
              className="block bg-card rounded-2xl p-4 md:p-6 border border-border shadow-sm hover-lift group hover:border-primary/20 h-full"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <ind.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{ind.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{ind.shortDesc}</p>
              <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default IndustryCards;
