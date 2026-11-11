import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export const metadata: Metadata = {
  title:
    "Nice Stitch | DTF, DTG, Screen Printing, Embroidery & Banners — LA Fashion District",
  description:
    "Custom DTF transfers, DTG printing, screen printing, embroidery, and banners in the LA Fashion District, Downtown Los Angeles. Request a quote and upload your artwork.",
};

type HeroStyle = CSSProperties & { "--hero-image": string };

// The stylesheet layers a gradient over this photo (`.hero--photo`), so it
// stays a CSS background rather than an <Image>.
const heroStyle: HeroStyle = {
  "--hero-image": "url('/assets/img/hero.jpg')",
};

type ServiceCard = {
  title: string;
  price: string;
  priceHref: string;
  isQuoted: boolean;
  description: string;
  href: string;
  icon: ReactNode;
};

const serviceCards: readonly ServiceCard[] = [
  {
    title: "DTF Transfers & Gangsheets",
    price: "from $0.90 / inch",
    priceHref: "/pricing#price-dtf",
    isQuoted: false,
    description:
      "Ready-to-press transfers with vibrant color. Gang multiple designs onto one sheet to cut your cost per print.",
    href: "/services#dtf",
    icon: (
      <>
        <path d="M4 3h11l5 5v13H4z" />
        <path d="M15 3v5h5" />
        <path d="M8 13h8M8 17h5" />
      </>
    ),
  },
  {
    title: "UV DTF",
    price: "quoted per job",
    priceHref: "/quote",
    isQuoted: true,
    description:
      "Durable decals for hard surfaces — glass, plastic, metal, tumblers, and signage.",
    href: "/services#uv-dtf",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M12 7.5l1.4 3.1 3.1 1.4-3.1 1.4L12 16.5l-1.4-3.1L7.5 12l3.1-1.4z" />
      </>
    ),
  },
  {
    title: "DTG Printing",
    price: "from $15 / piece",
    priceHref: "/pricing#price-dtg",
    isQuoted: false,
    description:
      "Full-color, print-on-demand quality for small runs and one-offs. No minimums.",
    href: "/services#dtg",
    icon: (
      <>
        <path d="M6 9V3h12v6" />
        <path d="M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" />
        <rect x="6" y="14" width="12" height="7" />
      </>
    ),
  },
  {
    title: "Screen Printing",
    price: "from $4 / shirt",
    priceHref: "/pricing#price-screen",
    isQuoted: false,
    description:
      "The go-to for bulk orders — bold, durable color on tees, hoodies, and more.",
    href: "/services#screen-printing",
    icon: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
      </>
    ),
  },
  {
    title: "Embroidery",
    price: "from $7 / piece",
    priceHref: "/pricing#price-embroidery",
    isQuoted: false,
    description: "Clean, durable stitching for logos, hats, and uniforms.",
    href: "/services#embroidery",
    icon: (
      <>
        <path d="M19 5L9 15" />
        <circle cx="20" cy="4" r="1.5" />
        <path d="M3 21c3-1 5-3 6-6" />
        <path d="M6 15c2 0 4 1 5 3" />
      </>
    ),
  },
  {
    title: "Banners & Signage",
    price: "from $75",
    priceHref: "/pricing#price-signs",
    isQuoted: false,
    description:
      "Vinyl banners and signage for storefronts, events, and trade shows.",
    href: "/services#banners",
    icon: (
      <>
        <path d="M5 3v18" />
        <path d="M5 4h13l-3 4 3 4H5" />
      </>
    ),
  },
];

type WhyUsItem = {
  title: string;
  description: string;
  icon: ReactNode;
};

const whyUsItems: readonly WhyUsItem[] = [
  {
    title: "In-house production",
    description:
      "DTF, DTG, screen printing, embroidery, and banners all done on-site — no outsourcing, no surprises.",
    icon: (
      <>
        <path d="M21 8l-9-5-9 5 9 5 9-5z" />
        <path d="M3 8v8l9 5 9-5V8" />
        <path d="M12 13v8" />
      </>
    ),
  },
  {
    title: "Fast turnaround",
    description:
      "Bulk orders handled efficiently, with rush options for tight deadlines.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </>
    ),
  },
  {
    title: "No minimums on DTG",
    description:
      "Need just one shirt or a sample run? DTG printing has no minimum order quantity.",
    icon: (
      <>
        <path d="M12 2l2.4 1.7 2.9-.2 1 2.7 2.5 1.5-.7 2.8.7 2.8-2.5 1.5-1 2.7-2.9-.2L12 17l-2.4 1.7-2.9.2-1-2.7-2.5-1.5.7-2.8L3.2 9l2.5-1.5 1-2.7 2.9.2z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function HomePage() {
  return (
    <>
      <section className="hero hero--photo" style={heroStyle}>
        <div className="wrap hero__inner">
          <p className="hero__eyebrow">
            LA Fashion District · Downtown Los Angeles
          </p>
          <h1 className="hero__heading">
            Custom printing and embroidery, done right.
          </h1>
          <p className="hero__subheading">
            DTF transfers, DTG, screen printing, embroidery, and banners — all
            in-house, with fast turnaround on bulk orders.
          </p>
          <div className="hero__actions">
            <Link className="btn btn--primary btn--large" href="/quote">
              Request a Quote
            </Link>
            <Link className="btn btn--ghost btn--large" href="/services">
              See our services
            </Link>
          </div>
        </div>
      </section>

      <section className="services-overview">
        <div className="wrap">
          <h2 className="section-heading">What we print</h2>
          <p className="section-sub">
            Six services, one shop. Tell us what you need and we&apos;ll point
            you to the right process.
          </p>
          <div className="services-grid">
            {serviceCards.map((card) => (
              <div className="service-card" key={card.href}>
                <div className="service-card__icon">
                  <Icon>{card.icon}</Icon>
                </div>
                <h3>{card.title}</h3>
                <Link
                  className={
                    card.isQuoted
                      ? "service-card__price service-card__price--quote"
                      : "service-card__price"
                  }
                  href={card.priceHref}
                >
                  {card.price}
                </Link>
                <p>{card.description}</p>
                <Link className="service-card__link" href={card.href}>
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-us">
        <div className="wrap">
          <h2 className="section-heading">Why Nice Stitch</h2>
          <p className="section-sub">
            What you get working with a shop that does its own production.
          </p>
          <div className="why-us-grid">
            {whyUsItems.map((item) => (
              <div className="why-us-item" key={item.title}>
                <div className="why-us-item__icon">
                  <Icon>{item.icon}</Icon>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap wrap--narrow">
          <h2>Have a design ready?</h2>
          <p>
            Upload your artwork and we&apos;ll send back pricing and
            turnaround.
          </p>
          <Link className="btn btn--primary btn--large" href="/quote">
            Request a Quote
          </Link>
        </div>
      </section>
    </>
  );
}
