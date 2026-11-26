import Stripe from "stripe";

/**
 * Lazily constructed so the module can be imported during a build that has no
 * Stripe key configured. Throws only when a request actually needs Stripe.
 */
let client: Stripe | null = null;

export function getStripe(): Stripe {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  client = new Stripe(key);
  return client;
}

/** True when the shop is wired up to take payments at all. */
export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

/**
 * Live keys start `sk_live_`, test keys `sk_test_`. Surfaced in the UI so the
 * shop can tell at a glance whether real cards are being charged.
 */
export function stripeIsLiveMode(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim().startsWith("sk_live_"));
}
