"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { capabilitiesGrid } from "@/data/home";

const CapabilitiesGrid = () => (
  <section className="section-padding bg-secondary">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {capabilitiesGrid.heading}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {capabilitiesGrid.subheading}
        </p>
      </ScrollReveal>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {capabilitiesGrid.capabilities.map((c, i) => (
          <ScrollReveal key={c.title} delay={i * 80}>
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover-lift h-full group">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <c.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{c.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {c.desc}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default CapabilitiesGrid;
