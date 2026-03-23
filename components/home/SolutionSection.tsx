"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { solutionSection } from "@/data/home";

const SolutionSection = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-12 md:mb-16">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary border border-primary/35 bg-primary/5 px-3 py-1.5 rounded mb-4">
          {solutionSection.badge}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {solutionSection.heading}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {solutionSection.subheading}
        </p>
      </ScrollReveal>

      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {solutionSection.steps.map((s, i) => (
          <ScrollReveal key={s.step} delay={i * 120}>
            <div className="relative bg-card rounded-2xl border border-border p-7 md:p-8 h-full group hover:border-primary/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
              {/* Large ghost step number */}
              <span
                className="absolute top-3 right-5 text-8xl font-extrabold text-muted-foreground/[0.055] select-none leading-none group-hover:text-primary/[0.07] transition-colors duration-300"
                aria-hidden="true"
              >
                {s.step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
                <s.icon className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold mb-3">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default SolutionSection;
