"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { capabilitiesGrid } from "@/data/home";

const CapabilitiesGrid = () => (
  <section className="section-padding bg-secondary">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {capabilitiesGrid.heading}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {capabilitiesGrid.subheading}
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {capabilitiesGrid.capabilities.map((c, i) => (
          <ScrollReveal key={c.title} delay={i * 80}>
            <div className="bg-card rounded-xl border border-border p-6 h-full group hover:border-primary/30 hover:shadow-md transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors duration-300">
                  <c.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold mb-1.5 leading-snug">{c.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default CapabilitiesGrid;
