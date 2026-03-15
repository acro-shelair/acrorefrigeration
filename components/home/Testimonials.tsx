"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import ScrollReveal from "@/components/ScrollReveal";
import { testimonialsSection } from "@/data/home";

const AUTOPLAY_INTERVAL = 5000;

type ReviewItem = { name: string; role: string; quote: string; rating: number };

const Testimonials = ({ initialTestimonials }: { initialTestimonials: ReviewItem[] }) => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const items =
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
    const id = setInterval(() => { if (!document.hidden) go(1); }, AUTOPLAY_INTERVAL);
    return () => clearInterval(id);
  }, [paused, go]);

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  const t = items[index];

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow">
        <ScrollReveal className="text-center mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {testimonialsSection.heading}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {testimonialsSection.subheading}
          </p>
        </ScrollReveal>

        <div
          className="relative max-w-2xl mx-auto"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slide */}
          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={t.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="bg-card rounded-2xl p-8 md:p-10 border border-border shadow-sm"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className={`w-5 h-5 ${
                        j < (t.rating ?? 5)
                          ? "fill-primary text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-base md:text-lg leading-relaxed mb-8 text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="absolute -left-5 md:-left-12 top-1/2 -translate-y-1/2 bg-card border border-border rounded-full p-2 shadow hover:bg-accent transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="absolute -right-5 md:-right-12 top-1/2 -translate-y-1/2 bg-card border border-border rounded-full p-2 shadow hover:bg-accent transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === index ? "bg-primary w-5" : "bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
