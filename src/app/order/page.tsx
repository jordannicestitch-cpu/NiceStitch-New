import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { OrderForm } from "./_components/OrderForm";
import { stripeConfigured, stripeIsLiveMode } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Order & Pay | Nice Stitch",
  description:
    "Order DTG printing, screen printing, DTF transfers, banners and signs online and pay by card. Embroidery and custom work are quoted first.",
};

type SearchParams = Promise<{ cancelled?: string }>;

/**
 * Reading searchParams is request-time data. Under `cacheComponents` it has to
 * sit inside Suspense so the rest of the page can still be prerendered.
 */
async function CancelledNotice({ searchParams }: { searchParams: SearchParams }) {
  const { cancelled } = await searchParams;
  if (!cancelled) return null;
  return (
    <p className="quote-form__status" data-state="error">
      Checkout was cancelled — nothing has been charged.
    </p>
  );
}

export default function OrderPage({ searchParams }: { searchParams: SearchParams }) {
  const configured = stripeConfigured();
  const live = stripeIsLiveMode();

  return (
    <section className="quote-form-section">
      <div className="wrap wrap--narrow">
        <h1>Order &amp; Pay</h1>
        <p className="quote-form__intro">
          Fixed-price work you can order and pay for right now. Embroidery, UV
          DTF and anything custom is <Link href="/quote">quoted first</Link>.
        </p>

        {!configured ? (
          <p className="quote-form__status" data-state="error">
            Online payment isn&apos;t switched on yet. Please{" "}
            <Link href="/quote">request a quote</Link> and we&apos;ll follow up.
          </p>
        ) : null}

        {configured && !live ? (
          <p className="quote-form__status" data-state="error">
            <strong>Test mode.</strong> Payments here are not real and no money
            is taken.
          </p>
        ) : null}

        <Suspense fallback={null}>
          <CancelledNotice searchParams={searchParams} />
        </Suspense>

        <OrderForm />
      </div>
    </section>
  );
}
