import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, emailHref, phoneHref } from "@/lib/site-config";
import { CANCELLATION_WINDOW, POLICY_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | Nice Stitch",
  description:
    "How refunds, cancellations and reprints work on custom printing and embroidery orders at Nice Stitch.",
};

export default function RefundsPage() {
  return (
    <section className="legal-section">
      <div className="wrap wrap--narrow">
        <h1>Refunds &amp; Cancellations</h1>
        <p className="legal-updated">Last updated {POLICY_LAST_UPDATED}</p>

        <div className="legal-callout">
          <p>
            <strong>The short version.</strong> Custom-printed goods can&apos;t
            be resold, so they&apos;re not returnable once made. If we got it
            wrong, we fix it or refund it. If the artwork you approved was
            wrong, we&apos;ll help you sort it at cost.
          </p>
        </div>

        <h2>Cancelling an order</h2>
        <p>
          Cancel within {CANCELLATION_WINDOW} of ordering and you get a full
          refund, provided we have not yet started artwork preparation,
          ordered materials or begun production.
        </p>
        <p>
          After that point we refund the balance less work already done —
          typically the art fee, any blanks or materials bought for your job,
          and any production already run.
        </p>

        <h2>Custom work is not returnable</h2>
        <p>
          Printed and embroidered goods are made to your specification and
          cannot be restocked or resold, so we do not accept returns or offer
          refunds for change of mind, ordering the wrong size or quantity, or
          approving artwork that turned out not to be what you wanted.
        </p>

        <h2>If we made a mistake</h2>
        <p>
          If the finished work does not match the proof or order you approved —
          wrong placement, wrong colour, wrong garment, defective printing or
          stitching — tell us within <strong>7 days of receiving it</strong>{" "}
          and we will reprint the affected pieces at no charge, or refund them
          if a reprint will not work for you. We may ask for photographs, or
          for the pieces back.
        </p>

        <h2>Defective blanks</h2>
        <p>
          Occasionally a garment is faulty from the mill. Where the blank was
          supplied by us, we replace and reprint it. Where you supplied the
          garments, we can reprint but cannot replace the garment itself.
        </p>

        <h2>Colour and finish variation</h2>
        <p>
          Reasonable variation in colour, placement within normal tolerance,
          and differences between processes are not defects. See{" "}
          <Link href="/terms">our terms</Link> for what to expect.
        </p>

        <h2>Unclaimed orders</h2>
        <p>
          Completed orders not collected within 60 days may be disposed of, and
          payment is not refundable at that point. We will try to reach you
          first.
        </p>

        <h2>How refunds are paid</h2>
        <p>
          Refunds go back to the original payment method. Card refunds are
          processed through Stripe and usually appear within 5–10 business
          days, depending on your bank.
        </p>

        <h2>Talk to us first</h2>
        <p>
          If something is wrong, contact us before raising a dispute with your
          bank — it is almost always faster to fix directly.
        </p>
        <p>
          {siteConfig.phone ? (
            <>
              Call or text <a href={phoneHref}>{siteConfig.phone}</a>
              <br />
            </>
          ) : null}
          {siteConfig.email ? (
            <>
              Email <a href={emailHref}>{siteConfig.email}</a>
              <br />
            </>
          ) : null}
          Or use our <Link href="/contact">contact page</Link>.
        </p>
      </div>
    </section>
  );
}
