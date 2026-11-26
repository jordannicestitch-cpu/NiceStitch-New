import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About | Nice Stitch",
  description:
    "Nice Stitch is a print and embroidery shop in the LA Fashion District — DTF, DTG, screen printing, embroidery, banners and signs, all produced in-house.",
};

// Everything here is drawn from things that are verifiably true: the address,
// the services, the published prices. How long the shop has run, how many
// clients it has and who it works for have deliberately NOT been invented —
// add those once the shop confirms them.
export default function AboutPage() {
  return (
    <section className="about-section">
      <div className="wrap wrap--narrow">
        <h1>About {siteConfig.name}</h1>

        <div className="about-section__body">
          <p className="about-lede">
            We&apos;re a print and embroidery shop in the LA Fashion District,
            producing custom apparel and signage in-house at{" "}
            {siteConfig.addressLines.join(", ")}.
          </p>

          <h2>Everything under one roof</h2>
          <p>
            DTF transfers and gang sheets, UV DTF, direct-to-garment, screen
            printing, embroidery, banners and signs — all of it runs here, on
            our own equipment. Nothing is sent out to a third party, so nobody
            else sets your turnaround or your quality.
          </p>
          <p>
            That matters most when a job needs more than one process: a
            screen-printed run with embroidered hats to match, or DTF transfers
            you press yourself alongside pieces we finish for you.
          </p>

          <h2>The right process, not the expensive one</h2>
          <p>
            Different jobs want different methods. DTG has no minimum and
            handles full-colour artwork, which suits samples and short runs.
            Screen printing gets cheaper the more you order, so it wins on
            volume. DTF presses onto fabrics the others struggle with.
            Embroidery lasts longest on hats, polos and workwear.
          </p>
          <p>
            Tell us what you&apos;re making and we&apos;ll point you at the
            cheapest way to make it — including when that means talking you out
            of the option you walked in asking for.
          </p>

          <h2>Straight pricing</h2>
          <p>
            Our rates are published on the{" "}
            <Link href="/pricing">pricing page</Link> rather than hidden behind
            a form. Work that genuinely depends on the artwork — embroidery
            priced by stitch count, or anything unusual — is quoted
            individually, and we say so rather than guessing.
          </p>

          <h2>Working with us</h2>
          <p>
            Send your artwork and the details of the job and we&apos;ll come
            back with pricing and turnaround. If your file isn&apos;t
            print-ready we can prepare it. We confirm artwork and timing with
            you before anything goes on press.
          </p>

          <p>
            <Link className="btn btn--primary" href="/quote">
              Request a quote
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
