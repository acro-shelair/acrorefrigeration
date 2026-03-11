"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, ChevronDown, MapPin, Wrench, Building2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import acroLogo from "@/assets/acro-logo.png";
import { createClient } from "@/lib/supabase/client";

type DropdownKey = "services" | "industries" | "brands" | "locations";
type MenuItem = { label: string; href: string; topLink?: true };
type DynamicItem = { slug: string; title: string };

// All dropdowns are now dynamic — no static menus needed
const staticMenus: Record<string, MenuItem[]> = {};

const plainLinks = [
  { label: "Resources", href: "/resources" },
  { label: "Contact", href: "/contact" },
];

const dropdownKeys: { key: DropdownKey; label: string }[] = [
  { key: "services",   label: "Services" },
  { key: "industries", label: "Industries" },
  { key: "brands",     label: "Brands" },
  { key: "locations",  label: "Locations" },
];

const topIcon: Record<DropdownKey, React.ReactNode> = {
  services:   <Wrench   className="w-3.5 h-3.5 text-primary shrink-0" />,
  industries: <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />,
  brands:     <Tag      className="w-3.5 h-3.5 text-primary shrink-0" />,
  locations:  <MapPin   className="w-3.5 h-3.5 text-primary shrink-0" />,
};

const Navbar = () => {
  const [serviceItems, setServiceItems]   = useState<DynamicItem[]>([]);
  const [industryItems, setIndustryItems] = useState<DynamicItem[]>([]);
  const [brandItems, setBrandItems]       = useState<DynamicItem[]>([]);
  const [cityItems, setCityItems]         = useState<DynamicItem[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.from("services").select("slug, title").not("slug", "is", null).order("position")
      .then(({ data }) => { if (data) setServiceItems(data); });
    supabase.from("industries").select("slug, title").order("position")
      .then(({ data }) => { if (data) setIndustryItems(data); });
    supabase.from("brands").select("slug, name").order("position")
      .then(({ data }) => { if (data) setBrandItems(data.map((b) => ({ slug: b.slug, title: b.name }))); });
    supabase.from("location_cities").select("slug, name").order("position")
      .then(({ data }) => { if (data) setCityItems(data.map((c) => ({ slug: c.slug, title: c.name }))); });
  }, []);
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<DropdownKey | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  const serviceMenu: MenuItem[] = [
    { label: "All Services", href: "/services", topLink: true },
    ...serviceItems.map((s) => ({ label: s.title, href: `/services/${s.slug}` })),
  ];

  const industryMenu: MenuItem[] = [
    { label: "All Industries", href: "/industries", topLink: true },
    ...industryItems.map((i) => ({ label: i.title, href: `/industries/${i.slug}` })),
  ];

  const brandMenu: MenuItem[] = [
    { label: "All Brands", href: "/brands", topLink: true },
    ...brandItems.map((b) => ({ label: b.title, href: `/brands/${b.slug}` })),
  ];

  const locationMenu: MenuItem[] = [
    { label: "All Service Areas", href: "/locations", topLink: true },
    ...cityItems.map((c) => ({ label: c.title, href: `/locations/${c.slug}` })),
  ];

  const getMenu = (key: DropdownKey): MenuItem[] => {
    if (key === "services")   return serviceMenu;
    if (key === "industries") return industryMenu;
    if (key === "brands")     return brandMenu;
    if (key === "locations")  return locationMenu;
    return staticMenus[key];
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node))
        setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setActiveDropdown(null);
    setMobileExpanded(null);
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (key: DropdownKey) => pathname.startsWith(`/${key === "services" ? "services" : key === "industries" ? "industries" : key === "brands" ? "brands" : "locations"}`);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container-narrow flex items-center justify-between h-16 md:h-20 px-6">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
          <Image src={acroLogo} alt="Acro Refrigeration" width={40} height={40} className="object-contain" priority />
          <span>Acro Refrigeration</span>
        </Link>

        {/* Desktop nav */}
        <nav ref={navRef} className="hidden lg:flex items-center gap-1">
          {dropdownKeys.map(({ key, label }) => (
            <div key={key} className="relative">
              <button
                onClick={() => setActiveDropdown((prev) => (prev === key ? null : key))}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-secondary ${isActive(key) ? "text-foreground bg-secondary" : "text-muted-foreground"}`}
              >
                {label}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === key ? "rotate-180" : ""}`} />
              </button>

              {activeDropdown === key && (
                <div className="absolute top-full left-0 mt-1.5 w-56 bg-background border border-border rounded-xl shadow-lg py-1.5 z-50">
                  {getMenu(key).map((item, i) => (
                    <div key={item.href}>
                      {item.topLink && i > 0 && <div className="mx-3 my-1 border-t border-border" />}
                      <Link
                        href={item.href}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-secondary ${item.topLink ? "font-medium" : ""} ${pathname === item.href ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {item.topLink && topIcon[key]}
                        {item.label}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {plainLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-secondary ${pathname === link.href ? "text-foreground bg-secondary" : "text-muted-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a href="tel:1300227600" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Phone className="w-4 h-4" /> 1300 227 600
          </a>
          <Button asChild><Link href="/contact">Get a Quote</Link></Button>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2.5 -mr-1">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-background border-b border-border px-6 pb-6">
          <nav className="flex flex-col gap-1">
            {dropdownKeys.map(({ key, label }) => (
              <div key={key}>
                <button
                  onClick={() => setMobileExpanded((prev) => (prev === key ? null : key))}
                  className={`flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive(key) ? "text-foreground bg-secondary" : "text-muted-foreground"}`}
                >
                  {label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${mobileExpanded === key ? "rotate-180" : ""}`} />
                </button>

                {mobileExpanded === key && (
                  <div className="ml-3 flex flex-col gap-0.5 border-l border-border pl-3 mb-1">
                    {getMenu(key).map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${item.topLink ? "font-medium" : ""} ${pathname === item.href ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {item.topLink && topIcon[key]}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {plainLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${pathname === link.href ? "text-foreground bg-secondary" : "text-muted-foreground"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2">
            <a href="tel:1300227600" className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" /> 1300 227 600
            </a>
            <Button asChild className="w-full">
              <Link href="/contact" onClick={() => setMobileOpen(false)}>Get a Quote</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
