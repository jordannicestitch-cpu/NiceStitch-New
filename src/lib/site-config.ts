// Single place to edit shop info shown across the site (top bar, header,
// footer, contact page). Phone, email and social links are hidden everywhere
// they are left blank.
export const siteConfig = {
  name: "Nice Stitch",
  url: "https://www.nicestitchla.com",
  phone: "(951) 775-6492",
  // Public contact email shown to visitors (separate from the
  // quote-notification inbox, which is the NOTIFY_EMAIL env var).
  email: "",
  addressLines: ["1301 S Main St, Unit 103", "Los Angeles, CA 90015"],
  hours: ["Mon–Fri: 9am–6pm"],
  // Short selling points shown in the top bar. Keep these to things that are
  // actually true.
  trustPoints: [
    "Fast Turnaround",
    "No Minimums on DTG & DTF",
    "Wholesale & Retail",
  ],
  instagram: "",
  facebook: "",
} as const;

export const phoneHref = siteConfig.phone
  ? `tel:${siteConfig.phone.replace(/[^\d+]/g, "")}`
  : "";

export const emailHref = siteConfig.email ? `mailto:${siteConfig.email}` : "";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
