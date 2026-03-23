"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { testimonialsSection } from "@/data/home";

const AUTOPLAY_INTERVAL = 5000;

type ReviewItem = { name: string; role: string; quote: string; rating: number };
type TestimonialItem = ReviewItem & { id: string; position: number };

const TestimonialCard = ({ t }: { t: TestimonialItem }) => (
  <div className="bg-card rounded-2xl border border-border p-7 md:p-8 h-full flex flex-col">
    <div className="flex gap-0.5 mb-5">
      {[...Array(5)].map((_, j) => (
        <Star
          key={j}
          className={`w-4 h-4 ${
            j < (t.rating ?? 5)
              ? "fill-primary text-primary"
              : "text-muted-foreground/25"
          }`}
        />
      ))}
    </div>
    <blockquote className="flex-1 relative mb-6">
      <Quote
        className="absolute -top-1 -left-1 w-8 h-8 text-primary/10 fill-primary/10"
        aria-hidden="true"
      />
      <p className="text-sm md:text-base leading-relaxed text-muted-foreground pl-6">
        {t.quote}
      </p>
    </blockquote>
    <div className="flex items-center gap-3 pt-5 border-t border-border">
      <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0 select-none">
        {t.name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </div>
      <div>
        <div className="font-semibold text-sm">{t.name}</div>
        <div className="text-xs text-muted-foreground">{t.role}</div>
      </div>
    </div>
  </div>
);

const Testimonials = ({
  initialTestimonials,
}: {
  initialTestimonials: ReviewItem[];
}) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const items: TestimonialItem[] =
    initialTestimonials.length > 0
      ? initialTestimonials.map((t, i) => ({ id: String(i), ...t, position: i }))
      : testimonialsSection.testimonials.map((t, i) => ({
          id: String(i),
          ...t,
          rating: 5,
          position: i,
        }));

  const go = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      setIndex((prev) => (prev + dir + items.length) % items.length);
    },
    [items.length]
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (!document.hidden) go(1);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [paused, go]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -50 : 50, opacity: 0 }),
  };

  const t = items[index];

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {testimonialsSection.heading}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {testimonialsSection.subheading}
          </p>
        </ScrollReveal>

        {/* Desktop: all cards in a grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {items.map((item) => (
            <ScrollReveal key={item.id} delay={item.position * 100}>
              <TestimonialCard t={item} />
            </ScrollReveal>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div
          className="md:hidden relative"
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={t.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <TestimonialCard t={t} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="bg-card border border-border rounded-full p-2 shadow-sm hover:bg-accent transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === index
                      ? "bg-primary w-5"
                      : "bg-muted-foreground/30 w-1.5"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="bg-card border border-border rounded-full p-2 shadow-sm hover:bg-accent transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
