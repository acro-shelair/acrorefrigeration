"use client";

import Image from "next/image";
import ScrollReveal from "@/components/ScrollReveal";
import { clientsSection } from "@/data/home";

import brisbanClub from "@/assets/clients/brisbane-club.webp";
import marriott from "@/assets/clients/client-marriot.webp";
import gambaro from "@/assets/clients/gambaro.webp";
import geebungRsl from "@/assets/clients/geebungrsl-logo-3.webp";
import kedron from "@/assets/clients/kedron.webp";
import norths from "@/assets/clients/norths.webp";
import orford from "@/assets/clients/orford.webp";
import stamford from "@/assets/clients/stamford-1.webp";

const clients = [
  { src: brisbanClub, alt: "Brisbane Club" },
  { src: marriott, alt: "Marriott" },
  { src: gambaro, alt: "Gambaro" },
  { src: geebungRsl, alt: "Geebung RSL" },
  { src: kedron, alt: "Kedron" },
  { src: norths, alt: "Norths" },
  { src: orford, alt: "Orford" },
  { src: stamford, alt: "Stamford" },
];

const ClientsSection = () => (
  <section className="bg-secondary py-12 sm:py-16 px-4 sm:px-6">
    <div className="container-narrow">
      <ScrollReveal className="text-center mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
          {clientsSection.eyebrow}
        </p>
        <h2 className="text-2xl md:text-3xl font-extrabold">
          {clientsSection.heading}
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 items-center">
        {clients.map((client, i) => (
          <ScrollReveal key={client.alt} delay={i * 70}>
            <div className="flex items-center justify-center p-4 rounded-xl bg-background border border-border h-24 hover:border-primary/25 hover:shadow-sm transition-all duration-300">
              <div className="relative w-full h-14">
                <Image
                  src={client.src}
                  alt={client.alt}
                  fill
                  className="object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  loading="lazy"
                  sizes="(max-width: 640px) 45vw, 22vw"
                />
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default ClientsSection;
