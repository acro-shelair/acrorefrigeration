"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import acroLogo from "@/assets/acro-logo.png";
import { createClient } from "@/lib/supabase/client";
import type { SiteSettings, FooterLink } from "@/lib/supabase/content";

// ─── Admin login link (smart redirect) ────────────────────────────────────────

function AdminLink() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => {
        setIsLoggedIn(!!user);
        setChecking(false);
      });
  }, []);

  if (checking) return null;

  return (
    <button
      onClick={() => router.push(isLoggedIn ? "/admin" : "/admin/login")}
      className="text-dark-foreground/30 hover:text-dark-foreground/60 transition-colors text-xs"
    >
      {isLoggedIn ? "Dashboard" : "Staff Login"}
    </button>
  );
}

// ─── Fallback while loading ────────────────────────────────────────────────────

const DEFAULTS = {
  phone: "1300227600",
  email: "operations@acrorefrigeration.com.au",
  address: "Brisbane, SE Queensland, Deception Bay, Robina",
  abn: "43 672 578 264",
  tagline:
    "Australia's trusted commercial refrigeration contractor. 24/7 emergency repairs, maintenance plans and cold room builds across SE Queensland.",
  facebook_url: "https://www.facebook.com/acrorefrigeration/",
  linkedin_url: "https://www.linkedin.com/company/acro-refrigeration-qld/",
  instagram_url: "",
  footer_company_links: [
    { label: "Our Process", href: "/process" },
    { label: "Projects", href: "/projects" },
    { label: "Pricing", href: "/pricing" },
    { label: "Resources", href: "/resources" },
    { label: "Contact", href: "/contact" },
  ] as FooterLink[],
  footer_service_links: [
    { label: "24/7 Emergency Repairs", href: "/services" },
    { label: "Preventative Maintenance", href: "/services" },
    { label: "Compliance & Certification", href: "/services" },
    { label: "Smart Monitoring", href: "/services" },
    { label: "Energy Audits & Upgrades", href: "/services" },
    { label: "Cold Room Construction", href: "/services" },
  ] as FooterLink[],
  footer_industry_links: [
    {
      label: "Restaurants & Hospitality",
      href: "/industries/restaurants-hospitality",
    },
    { label: "Supermarkets & Retail", href: "/industries/supermarkets-retail" },
    { label: "Pharmaceuticals", href: "/industries/pharmaceuticals" },
    {
      label: "Warehousing & Logistics",
      href: "/industries/warehousing-logistics",
    },
    { label: "Food Production", href: "/industries/food-production" },
  ] as FooterLink[],
};

// ─── Footer ────────────────────────────────────────────────────────────────────

const Footer = () => {
  const [settings, setSettings] = useState<Partial<SiteSettings>>(DEFAULTS);
  const [services, setServices] = useState<
    { slug: string | null; title: string }[]
  >([]);
  const [industries, setIndustries] = useState<
    { slug: string; title: string }[]
  >([]);
  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setSettings(data);
      });
    supabase
      .from("services")
      .select("slug, title")
      .not("slug", "is", null)
      .order("position")
      .limit(6)
      .then(({ data }) => {
        if (data) setServices(data);
      });
    supabase
      .from("industries")
      .select("slug, title")
      .order("position")
      .then(({ data }) => {
        if (data) setIndustries(data);
      });
  }, []);

  const phone = settings.phone ?? DEFAULTS.phone;
  const email = settings.email ?? DEFAULTS.email;
  const address = settings.address ?? DEFAULTS.address;
  const abn = settings.abn ?? DEFAULTS.abn;
  const tagline = settings.tagline ?? DEFAULTS.tagline;
  const fbUrl = settings.facebook_url ?? DEFAULTS.facebook_url;
  const liUrl = settings.linkedin_url ?? DEFAULTS.linkedin_url;
  const igUrl = settings.instagram_url ?? "";
  const companyLinks =
    (settings.footer_company_links as FooterLink[] | undefined) ??
    DEFAULTS.footer_company_links;

  const serviceLinks =
    services.length > 0
      ? services.map((s) => ({
          label: s.title,
          href: s.slug ? `/services/${s.slug}` : "/services",
        }))
      : DEFAULTS.footer_service_links;

  const industryLinks =
    industries.length > 0
      ? industries.map((i) => ({
          label: i.title,
          href: `/industries/${i.slug}`,
        }))
      : DEFAULTS.footer_industry_links;

  return (
    <footer className="bg-dark text-dark-foreground">
      <div className="container-narrow section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Brand + Contact */}
          <div>
            <div className="flex items-center gap-2 font-extrabold text-xl mb-4">
              <Image
                src={acroLogo}
                alt="Acro Refrigeration"
                width={40}
                height={40}
                className="object-contain"
              />
              Acro Refrigeration
            </div>
            <p className="text-dark-foreground/60 text-sm leading-relaxed mb-6">
              {tagline}
            </p>
            <div className="flex flex-col gap-3 text-sm text-dark-foreground/60">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                {phone.replace(/(\d{4})(\d{3})(\d{3})/, "$1 $2 $3")}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" /> {email}
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {address}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-6">
              {fbUrl && (
                <a
                  href={fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-lg bg-dark-foreground/10 flex items-center justify-center text-dark-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {liUrl && (
                <a
                  href={liUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-lg bg-dark-foreground/10 flex items-center justify-center text-dark-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {igUrl && (
                <a
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-lg bg-dark-foreground/10 flex items-center justify-center text-dark-foreground/60 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/40">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-dark-foreground/60">
              {serviceLinks.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.href}
                    className="hover:text-primary transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/40">
              Industries
            </h4>
            <ul className="space-y-2.5 text-sm text-dark-foreground/60">
              {industryLinks.map((i) => (
                <li key={i.label}>
                  <Link
                    href={i.href}
                    className="hover:text-primary transition-colors"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-dark-foreground/40">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm text-dark-foreground/60">
              {companyLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Credentials line */}
        <div className="border-t border-dark-foreground/10 pt-6 pb-4 text-center">
          <p className="text-[11px] text-dark-foreground/30 leading-relaxed">
            ARCtick AU61340 &middot; QBCC 15413155 &middot; Electrical
            Contractor 92536 &middot; NSW Contractor 479925C &middot; NECA
            Member &middot; Veteran Community Business
          </p>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-foreground/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-dark-foreground/40">
          <p>
            © {new Date().getFullYear()} Acro Refrigeration. All rights
            reserved. ABN {abn}
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <AdminLink />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
