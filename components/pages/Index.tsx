"use client";

import dynamic from "next/dynamic";
import Layout from "@/components/Layout";
import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";

const ProblemSection = dynamic(() => import("@/components/home/ProblemSection"));
const SolutionSection = dynamic(() => import("@/components/home/SolutionSection"));
const CapabilitiesGrid = dynamic(() => import("@/components/home/CapabilitiesGrid"));
const ProcessTimeline = dynamic(() => import("@/components/home/ProcessTimeline"));
const IndustryCards = dynamic(() => import("@/components/home/IndustryCards"));
const BrandsSection = dynamic(() => import("@/components/home/BrandsSection"));
const Testimonials = dynamic(() => import("@/components/home/Testimonials"));
const ClientsSection = dynamic(() => import("@/components/home/ClientsSection"));
const LocationsSection = dynamic(() => import("@/components/home/LocationsSection"));
const CTABanner = dynamic(() => import("@/components/home/CTABanner"));
const FAQSection = dynamic(() => import("@/components/home/FAQSection"));

const Index = () => (
  <Layout>
    <Hero />
    <TrustBar />
    <ProblemSection />
    <SolutionSection />
    <CapabilitiesGrid />
    <ProcessTimeline />
    <IndustryCards />
    <BrandsSection />
    <Testimonials />
    <ClientsSection />
    <LocationsSection />
    <CTABanner />
    <FAQSection />
  </Layout>
);

export default Index;
