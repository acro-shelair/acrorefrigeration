"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScrollReveal from "@/components/ScrollReveal";
import { faqSection } from "@/data/home";

type FaqItem = { q: string; a: string };

const FAQSection = ({ initialFaqs }: { initialFaqs?: FaqItem[] }) => {
  const items = initialFaqs?.length ? initialFaqs : faqSection.faqs;

  return (
    <section className="section-padding bg-background">
      <div className="container-narrow max-w-3xl">
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">{faqSection.heading}</h2>
          <p className="text-muted-foreground text-lg">{faqSection.subheading}</p>
        </ScrollReveal>
        <Accordion type="single" collapsible className="space-y-2">
          {items.map((faq, i) => (
            <ScrollReveal key={i} delay={i * 50}>
              <AccordionItem
                value={`faq-${i}`}
                className="bg-card rounded-xl border border-border px-5 sm:px-6 hover:border-primary/25 transition-colors duration-200"
              >
                <AccordionTrigger className="text-left font-semibold text-sm py-5 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            </ScrollReveal>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQSection;
