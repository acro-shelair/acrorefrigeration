"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { trustBar } from "@/data/home";

const TrustBar = () => (
  <section className="bg-foreground text-background py-7 px-6">
    <div className="container-narrow">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {trustBar.map((b, i) => (
          <ScrollReveal key={b.label} delay={i * 80}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center shrink-0">
                <b.icon className="w-5 h-5 text-background" />
              </div>
              <div>
                <div className="font-bold text-sm text-background leading-tight">{b.label}</div>
                <div className="text-xs text-background/55 mt-0.5">{b.desc}</div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default TrustBar;
