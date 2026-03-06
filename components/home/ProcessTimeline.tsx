"use client";

import ScrollReveal from "@/components/ScrollReveal";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { useEffect, useState } from "react";

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
  const [showLine, setShowLine] = useState(false);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowLine(true), 400 + index * 150);
      return () => clearTimeout(timer);
    }
  }, [isVisible, index]);

  return (
    <div ref={ref} className="text-center group">
      <div
        className="relative"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible
            ? "translateY(0) scale(1)"
            : "translateY(20px) scale(0.8)",
          transition: `all 0.5s ease-out ${index * 150}ms`,
        }}
      >
        <div className="w-14 h-14 rounded-2xl gradient-cta flex items-center justify-center mx-auto mb-4 text-primary-foreground font-extrabold text-lg shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
          {step.num}
        </div>
      </div>
      <div
        style={{
          opacity: isVisible ? 1 : 0,
          transition: `opacity 0.4s ease-out ${index * 150 + 200}ms`,
        }}
      >
        <h3 className="font-bold text-sm mb-1">{step.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {step.desc}
        </p>
      </div>
    </div>
  );
};

const ProcessTimeline = () => (
  <section className="section-padding bg-background">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          {processTimeline.heading}
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {processTimeline.subheading}
        </p>
      </ScrollReveal>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {steps.map((s, i) => (
          <AnimatedStep key={s.num} step={s} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default ProcessTimeline;
