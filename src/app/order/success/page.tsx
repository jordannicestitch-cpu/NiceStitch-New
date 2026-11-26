import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { siteConfig, emailHref, phoneHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Order received | Nice Stitch",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ session_id?: string }>;

/**
 * Landing on this URL proves nothing — anyone can open it. The session is
 * fetched from Stripe and its payment_status checked before we confirm
 * anything to the customer.
 */
async function Confirmation({ searchParams }: { searchParams: SearchParams }) {
  const { session_id: sessionId } = await searchParams;

  let paid = false;
  let amount = "";
  let email = "";

  if (sessionId && stripeConfigured()) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      paid = session.payment_status === "paid";
      if (typeof session.amount_total === "number") {
        amount = `$${(session.amount_total / 100).toFixed(2)}`;
      }
      email = session.customer_details?.email ?? "";
    } catch (error) {
      console.error("Could not retrieve Stripe session on success page", error);
    }
  }

  if (!paid) {
    return (
      <>
        <h1>We couldn&apos;t confirm that payment</h1>
        <p className="quote-form__intro">
          If you were charged, nothing is lost — get in touch and we&apos;ll
          sort it out right away.
        </p>
        <ul>
          {siteConfig.phone ? (
            <li>
              Call or text <a href={phoneHref}>{siteConfig.phone}</a>
            </li>
          ) : null}
          <li>
            <Link href="/contact">Contact us</Link>
          </li>
        </ul>
      </>
    );
  }

  return (
    <>
      <h1>Thanks — your order is in.</h1>
      <p className="quote-form__intro">
        We&apos;ve received your payment{amount ? ` of ${amount}` : ""}.
        {email ? ` A receipt is on its way to ${email}.` : ""}
      </p>

      <div className="order-next">
        <h2>One more thing — send us your artwork</h2>
        <p>
          Checkout can&apos;t take file uploads, so your print-ready files need
          to reach us separately. Whichever is easiest:
        </p>
        <ul>
          <li>
            <Link href="/quote">Use the upload form</Link> and mention your
            order
          </li>
          {siteConfig.email ? (
            <li>
              Email <a href={emailHref}>{siteConfig.email}</a>
            </li>
          ) : null}
          {siteConfig.phone ? (
            <li>
              Call or text <a href={phoneHref}>{siteConfig.phone}</a>
            </li>
          ) : null}
        </ul>
        <p>
          We&apos;ll confirm artwork and turnaround before anything goes on
          press.
        </p>
      </div>
    </>
  );
}

export default function OrderSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <section className="quote-form-section">
      <div className="wrap wrap--narrow">
        <Suspense
          fallback={
            <>
              <h1>Confirming your payment…</h1>
              <p className="quote-form__intro">One moment.</p>
            </>
          }
        >
          <Confirmation searchParams={searchParams} />
        </Suspense>

        <p style={{ marginTop: "2rem" }}>
          <Link className="btn btn--ghost" href="/">
            Back to the site
          </Link>
        </p>
      </div>
    </section>
  );
}
