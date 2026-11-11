import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Services | Nice Stitch",
  description:
    "DTF transfers, DTG, screen printing, embroidery, and banners — all done in-house in the LA Fashion District.",
};

// `.service-detail__inner` is a two-column grid (3.5rem gap) inside the
// 1200px `.wrap` (24px side padding) and collapses to one column at 760px.
const mediaSizes =
  "(max-width: 760px) calc(100vw - 48px), (max-width: 1200px) calc(50vw - 52px), 548px";

type ServiceDetail = {
  id: string;
  isReversed: boolean;
  image: { src: string; alt: string; width: number; height: number };
  title: string;
  isQuoted: boolean;
  price: ReactNode;
  body: string;
  features: readonly string[];
};

const services: readonly ServiceDetail[] = [
  {
    id: "dtf",
    isReversed: false,
    image: {
      src: "/assets/img/dtf.jpg",
      alt: "A DTF transfer being heat pressed onto a garment",
      width: 1400,
      height: 2100,
    },
    title: "DTF Transfers & Gangsheets",
    isQuoted: false,
    price: (
      <Link href="/pricing#price-dtf">
        Transfers from $0.90 per inch · pressed from $8 per piece →
      </Link>
    ),
    body: "Direct-to-film transfers, ready to press onto almost any fabric. Gang multiple designs onto a single sheet and you only pay for the space you use — the cheapest way to run lots of small designs.",
    features: [
      "Works on cotton, poly, blends, and dark garments",
      "Gangsheets maximize the sheet and cut cost per design",
      "Press them yourself, or have us press them for you",
    ],
  },
  {
    id: "uv-dtf",
    isReversed: true,
    image: {
      src: "/assets/img/uv-dtf.jpg",
      alt: "A UV DTF vinyl decal applied to a hard surface",
      width: 1400,
      height: 789,
    },
    title: "UV DTF",
    isQuoted: true,
    price: (
      <>
        Quoted per job — <Link href="/quote">send us the details</Link>
      </>
    ),
    body: "Peel-and-stick decals for hard surfaces. No heat press needed — they apply straight onto glass, plastic, metal, and wood with a durable, full-color finish.",
    features: [
      "Tumblers, bottles, glass, signage, and packaging",
      "No heat required — just peel and apply",
      "Scratch- and water-resistant finish",
    ],
  },
  {
    id: "dtg",
    isReversed: false,
    image: {
      src: "/assets/img/dtg.jpg",
      alt: "A DTG printer printing a full-color design directly onto a shirt",
      width: 1600,
      height: 1067,
    },
    title: "DTG Printing",
    isQuoted: false,
    price: (
      <Link href="/pricing#price-dtg">
        From $15 per piece at 25+ · $25 for 1–24 →
      </Link>
    ),
    body: "Direct-to-garment printing for full-color designs, photo prints, and small or one-off runs — no screen setup, no minimums.",
    features: [
      "No minimum order quantity",
      "Full-color and photo-quality prints",
      "Great for samples, one-offs, and small batches",
    ],
  },
  {
    id: "screen-printing",
    isReversed: true,
    image: {
      src: "/assets/img/screen-printing.jpg",
      alt: "Screen printing a t-shirt in the workshop",
      width: 1400,
      height: 2100,
    },
    title: "Screen Printing",
    isQuoted: false,
    price: (
      <Link href="/pricing#price-screen">From $4 per shirt, 1 color →</Link>
    ),
    body: "The standard for bulk apparel orders — bold, long-lasting color at the best per-piece cost on larger runs.",
    features: [
      "Best pricing at volume",
      "Spot colors and multi-color designs",
      "Tees, hoodies, totes, and more",
    ],
  },
  {
    id: "embroidery",
    isReversed: false,
    image: {
      src: "/assets/img/embroidery.jpg",
      alt: "A multi-head embroidery machine stitching a design",
      width: 1600,
      height: 901,
    },
    title: "Embroidery",
    isQuoted: false,
    price: (
      <Link href="/pricing#price-embroidery">
        Left chest from $7 · full front from $50 →
      </Link>
    ),
    body: "Stitched logos and lettering for a clean, premium finish on hats, polos, jackets, and uniforms.",
    features: [
      "Digitizing of your logo or artwork",
      "Hats, polos, jackets, bags, uniforms",
      "Durable, professional finish",
    ],
  },
  {
    id: "banners",
    isReversed: true,
    image: {
      src: "/assets/img/banners.jpg",
      alt: "Large-format vinyl printing equipment",
      width: 1400,
      height: 932,
    },
    title: "Banners & Signage",
    isQuoted: false,
    price: (
      <Link href="/pricing#price-signs">
        Foam board from $75 · banners from $180 →
      </Link>
    ),
    body: "Vinyl banners and signage for storefronts, trade shows, and events — sized to your space.",
    features: [
      "Custom sizes",
      "Indoor and outdoor vinyl",
      "Grommets and finishing on request",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="about-section">
        <div className="wrap wrap--narrow">
          <h1>Services</h1>
          <div className="about-section__body">
            <p>
              DTF, DTG, screen printing, embroidery, and banners — all done
              in-house in the Fashion District.
            </p>
          </div>
        </div>
      </section>

      {services.map((service) => (
        <section className="service-detail" id={service.id} key={service.id}>
          <div
            className={
              service.isReversed
                ? "wrap service-detail__inner service-detail__inner--reverse"
                : "wrap service-detail__inner"
            }
          >
            <div className="service-detail__media">
              <Image
                src={service.image.src}
                alt={service.image.alt}
                width={service.image.width}
                height={service.image.height}
                sizes={mediaSizes}
                loading="lazy"
              />
            </div>
            <div className="service-detail__content">
              <h2>{service.title}</h2>
              <p
                className={
                  service.isQuoted
                    ? "service-detail__price service-detail__price--quote"
                    : "service-detail__price"
                }
              >
                {service.price}
              </p>
              <div className="service-detail__body">
                <p>{service.body}</p>
              </div>
              <ul className="service-detail__features">
                {service.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Link className="btn btn--primary" href="/quote">
                Get a quote
              </Link>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
