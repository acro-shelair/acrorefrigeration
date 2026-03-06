export interface Project {
  title: string;
  type: string;
  size: string;
  desc: string;
}

// ─── Page-level copy ──────────────────────────────────────────────────────────

export const projectsPage = {
  badge: "Our Work",
  heading: "Featured Projects",
  subheading: "A selection of commercial refrigeration projects delivered across Australia.",
  cta: { label: "Discuss Your Needs", href: "/contact" },
};

// ─── Projects list ────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    title: "FreshMart National Fleet",
    type: "Maintenance Contract",
    size: "48 stores",
    desc: "Ongoing preventative maintenance across 48 supermarket locations. Reduced emergency call-outs by 60% in the first year through proactive servicing.",
  },
  {
    title: "Harbour Kitchen — Emergency",
    type: "Emergency Repair",
    size: "Compressor failure",
    desc: "2am compressor failure at a high-volume waterfront restaurant. Technician on-site within 90 minutes, system restored before morning prep.",
  },
  {
    title: "PharmaLogix Brisbane",
    type: "Maintenance & Monitoring",
    size: "120 sqm facility",
    desc: "TGA-compliant maintenance contract with 24/7 remote monitoring. Zero temperature excursions since program inception.",
  },
  {
    title: "Aussie Meats Processing",
    type: "Cold Room Build",
    size: "300 sqm blast freezer",
    desc: "High-capacity blast freezing facility with processing rooms designed for continuous 24/7 operation. Delivered on time and on budget.",
  },
  {
    title: "GreenGrocer Co-op",
    type: "System Upgrade",
    size: "80 sqm multi-temp",
    desc: "Ageing refrigeration system upgraded with energy-efficient compressors and smart monitoring. 28% reduction in energy costs.",
  },
  {
    title: "ColdChain Logistics",
    type: "Emergency + Maintenance",
    size: "500 sqm warehouse",
    desc: "Started with an emergency condenser repair, now a full preventative maintenance client with quarterly servicing across two facilities.",
  },
];
