"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { processTimeline } from "@/data/home";

const { steps } = processTimeline;

const AnimatedStep = ({
  step,
  index,
}: {
  step: (typeof steps)[0];
  index: number;
}) => {
  const { ref, isVisible } = useScrollReveal(0.2);

  return (
    <div ref={ref} className="flex flex-col items-center text-center group">
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "scale(1)" : "scale(0.65)",
          transition: `all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 110}ms`,
        }}
        className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center text-primary-foreground font-extrabold text-lg shadow-md shadow-primary/25 group-hover:shadow-lg group-hover:shadow-primary/35 group-hover:scale-105 transition-shadow duration-300"
      >
        {step.num}
      </div>
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.35s ease ${index * 110 + 180}ms`,
        }}
        className="mt-4"
      >
        <h3 className="font-bold text-sm mb-1">{step.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[120px] mx-auto">
          {step.desc}
        </p>
      </div>
    </div>
  );
};

const ProcessTimeline = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-12 md:mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {processTimeline.heading}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {processTimeline.subheading}
        </p>
      </ScrollReveal>

      <div className="relative">
        {/* Background connector line */}
        <div className="hidden lg:block absolute top-7 left-[calc(100%/12)] right-[calc(100%/12)] h-px bg-border" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 gap-y-10">
          {steps.map((s, i) => (
            <AnimatedStep key={s.num} step={s} index={i} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ProcessTimeline;
