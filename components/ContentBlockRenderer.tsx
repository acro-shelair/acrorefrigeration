"use client";

import Image from "next/image";
import type { ContentBlock } from "@/lib/supabase/posts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function ContentBlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="text-muted-foreground leading-relaxed">{block.text}</p>
      );

    case "image":
      return (
        <figure className="my-4">
          <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-sm ring-1 ring-border">
            <Image
              src={block.src}
              alt={block.alt || ""}
              fill
              sizes="(max-width: 768px) 100vw, 700px"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="text-xs text-muted-foreground mt-3 text-center italic">
              {block.caption}
            </figcaption>
          )}
        </figure>
      );

    case "blockquote":
      return (
        <blockquote className="border-l-4 border-primary/50 pl-5 py-4 my-2 bg-primary/5 rounded-r-xl">
          <p className="text-foreground/80 leading-relaxed italic font-medium">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.cite && (
            <cite className="text-xs text-muted-foreground mt-2 block not-italic font-semibold tracking-wide uppercase">
              — {block.cite}
            </cite>
          )}
        </blockquote>
      );

    case "list": {
      const Tag = block.style === "bullet" ? "ul" : "ol";
      const listClass =
        block.style === "bullet"
          ? "list-disc marker:text-primary"
          : block.style === "number"
          ? "list-decimal marker:text-primary marker:font-bold"
          : "list-[lower-alpha] marker:text-primary";
      return (
        <Tag
          className={`${listClass} pl-6 space-y-2 text-muted-foreground leading-relaxed`}
        >
          {block.items.map((item, k) => (
            <li key={k} className="pl-1">
              {item}
            </li>
          ))}
        </Tag>
      );
    }

    case "faq":
      return (
        <Accordion type="single" collapsible className="space-y-2">
          {block.items.map((item, k) => (
            <AccordionItem
              key={k}
              value={`faq-${k}`}
              className="border border-border rounded-xl px-5 shadow-sm transition-all duration-200 hover:border-primary/20 hover:shadow-md data-[state=open]:border-primary/30 data-[state=open]:shadow-md data-[state=open]:bg-primary/[0.02]"
            >
              <AccordionTrigger className="text-sm font-semibold text-left hover:no-underline py-4 hover:text-primary transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      );

    case "media-cards": {
      if (block.layout === "row") {
        return (
          <div className="space-y-3 my-2">
            {block.items.map((item, k) => (
              <div
                key={k}
                className="flex gap-4 items-center border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 group"
              >
                {item.src && (
                  <div className="relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt || ""}
                      fill
                      sizes="112px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="space-y-1 min-w-0">
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      }
      if (block.layout === "grid") {
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-2">
            {block.items.map((item, k) => (
              <div
                key={k}
                className="border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200 group bg-card"
              >
                {item.src && (
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.alt || ""}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4 space-y-1.5">
                  <h4 className="font-semibold text-sm group-hover:text-primary transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        );
      }
      return (
        <div className="space-y-6 my-2">
          {block.items.map((item, k) => (
            <div
              key={k}
              className="border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group bg-card"
            >
              {item.src && (
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt || ""}
                    fill
                    sizes="(max-width: 768px) 100vw, 700px"
                    className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5 space-y-2">
                <h4 className="font-semibold text-base group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      );
    }

    case "comparison":
      return (
        <div className="my-2 overflow-hidden rounded-xl border border-border shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/60">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground w-1/3">
                  Feature
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  {block.leftLabel}
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground border-l border-border">
                  {block.rightLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, k) => (
                <tr
                  key={k}
                  className="border-b border-border last:border-0 odd:bg-background even:bg-secondary/20 hover:bg-primary/5 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-foreground/80">
                    {row.feature}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.left}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground border-l border-border">
                    {row.right}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "columns": {
      const colClasses: Record<number, string> = {
        2: "grid-cols-1 sm:grid-cols-2",
        3: "grid-cols-1 sm:grid-cols-3",
        4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      };
      const colClass =
        colClasses[block.columns.length] ?? "grid-cols-1 sm:grid-cols-2";
      return (
        <div className={`grid ${colClass} gap-4 my-2`}>
          {block.columns.map((col, ci) => (
            <div key={ci} className="space-y-4 min-w-0">
              {col.blocks.map((b, bi) => (
                <ContentBlockRenderer key={bi} block={b} />
              ))}
            </div>
          ))}
        </div>
      );
    }

    default:
      return null;
  }
}
