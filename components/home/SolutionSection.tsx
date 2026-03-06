"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { solutionSection } from "@/data/home";

const SolutionSection = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-10 md:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
          {solutionSection.badge}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {solutionSection.heading}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {solutionSection.subheading}
        </p>
      </ScrollReveal>
      <div className="grid md:grid-cols-3 gap-5 md:gap-8">
        {solutionSection.steps.map((s, i) => (
          <ScrollReveal key={s.step} delay={i * 150}>
            <div className="bg-card rounded-2xl p-5 md:p-8 border border-border shadow-sm hover-lift h-full group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-cta flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <s.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-4xl font-extrabold text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                  {s.step}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {s.desc}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
