import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, emailHref, phoneHref } from "@/lib/site-config";
import {
  ARTWORK_REVIEW_NOTE,
  CANCELLATION_WINDOW,
  POLICY_LAST_UPDATED,
} from "@/lib/legal";

export const metadata: Metadata = {
  title: "Terms of Service | Nice Stitch",
  description:
    "The terms that apply to custom printing, embroidery and signage orders placed with Nice Stitch.",
};

export default function TermsPage() {
  return (
    <section className="legal-section">
      <div className="wrap wrap--narrow">
        <h1>Terms of Service</h1>
        <p className="legal-updated">Last updated {POLICY_LAST_UPDATED}</p>

        <p>
          These terms apply when you order custom printing, embroidery or
          signage from {siteConfig.name}, whether you pay online, in the shop
          or against an invoice.
        </p>

        <h2>Quotes and prices</h2>
        <p>
          Published prices cover standard work as described on our{" "}
          <Link href="/pricing">pricing page</Link>. Jobs priced by stitch
          count, artwork size or unusual materials are quoted individually, and
          a quote is valid for 30 days unless we say otherwise. Where a
          published price and a written quote disagree, the written quote
          applies.
        </p>

        <h2>Artwork</h2>
        <p>
          You are responsible for supplying print-ready files and for holding
          the rights to everything you ask us to reproduce. By placing an order
          you confirm you own the artwork or have permission to use it, and
          that printing it will not infringe anyone&apos;s trademark or
          copyright. We may decline any job we believe infringes those rights.
        </p>
        <p>
          If your file is not print ready we can prepare it for the art fee
          shown on the pricing page. {ARTWORK_REVIEW_NOTE}
        </p>

        <h2>Proofs and approval</h2>
        <p>
          Where a proof is supplied, production starts only once you approve
          it. Approving a proof means accepting the spelling, layout, colours
          and placement shown. We cannot rework a job at our cost for errors
          that were present in an approved proof.
        </p>

        <h2>Colour and materials</h2>
        <p>
          Printed colour varies with garment material, dye lot and process.
          Screens, DTG, DTF and embroidery thread will not match each other
          exactly, and none will match a screen or a printed sample precisely.
          We work to a close commercial match rather than an exact one.
        </p>

        <h2>Customer-supplied garments</h2>
        <p>
          We take care with goods you supply, but we cannot guarantee against
          occasional loss or damage during production, and we do not replace
          customer-supplied garments. We recommend supplying a small number of
          spares on larger runs.
        </p>

        <h2>Turnaround</h2>
        <p>
          Turnaround times run from artwork approval, not from order placement.
          Quoted times are estimates and are not guaranteed unless agreed in
          writing. Rush work is subject to the rush fee on the pricing page.
        </p>

        <h2>Payment</h2>
        <p>
          Online orders are paid in full at checkout. Card payments are
          processed by Stripe; we never see or store your card details. Invoiced
          work is due on the terms stated on the invoice.
        </p>

        <h2>Cancellation</h2>
        <p>
          You may cancel within {CANCELLATION_WINDOW} of ordering provided we
          have not begun production, artwork preparation or ordered materials.
          See our <Link href="/refunds">refund policy</Link> for what happens
          after that.
        </p>

        <h2>Liability</h2>
        <p>
          Our liability for any order is limited to the amount you paid for
          that order. We are not liable for indirect or consequential losses,
          including lost sales or missed events.
        </p>

        <h2>Contact</h2>
        <p>
          {siteConfig.name}
          <br />
          {siteConfig.addressLines.join(", ")}
          {siteConfig.phone ? (
            <>
              <br />
              <a href={phoneHref}>{siteConfig.phone}</a>
            </>
          ) : null}
          {siteConfig.email ? (
            <>
              <br />
              <a href={emailHref}>{siteConfig.email}</a>
            </>
          ) : null}
        </p>
      </div>
    </section>
  );
}
