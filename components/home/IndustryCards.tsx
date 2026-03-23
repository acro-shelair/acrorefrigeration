"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { industriesHomeSection } from "@/data/industries";
import { getIcon } from "@/app/admin/services/icons";
import type { Industry } from "@/lib/supabase/content";

const IndustryCards = ({ industries }: { industries: Industry[] }) => (
  <section className="section-padding bg-secondary">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {industriesHomeSection.heading}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {industriesHomeSection.subheading}
        </p>
      </ScrollReveal>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {industries.map((ind, i) => {
          const Icon = getIcon(ind.icon_name);
          return (
            <ScrollReveal key={ind.id} delay={i * 80}>
              <Link
                href={`/industries/${ind.slug}`}
                className="block bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-300 group h-full overflow-hidden"
              >
                {ind.image_url && (
                  <div className="w-full h-36 overflow-hidden">
                    <img
                      src={ind.image_url}
                      alt={ind.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-5 md:p-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="font-bold mb-2">{ind.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{ind.short_desc}</p>
                  <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all duration-200">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  </section>
);

export default IndustryCards;
