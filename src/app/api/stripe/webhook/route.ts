import type Stripe from "stripe";
import { Resend } from "resend";
import { getStripe, stripeConfigured } from "@/lib/stripe";

// Stripe calls this after a payment. It is the only trustworthy signal that
// money actually moved — the browser returning to /order/success proves
// nothing, since anyone can visit that URL.
//
// The raw request body is required for signature verification, so this handler
// must never parse the body before verifying it.

export const maxDuration = 30;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function row(label: string, value: string): string {
  if (!value) return "";
  return `<tr><td style="padding:4px 12px;font-weight:600;">${escapeHtml(
    label,
  )}</td><td style="padding:4px 12px;">${escapeHtml(value)}</td></tr>`;
}

export async function POST(request: Request) {
  if (!stripeConfigured()) {
    return Response.json({ error: "Stripe is not configured." }, { status: 503 });
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    // Without the signing secret anyone could POST a fake "paid" event, so
    // refuse rather than trusting the payload.
    console.error("STRIPE_WEBHOOK_SECRET is not set — refusing to process webhook.");
    return Response.json({ error: "Webhook not configured." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });

  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = await getStripe().webhooks.constructEventAsync(payload, signature, secret);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    // Acknowledge everything else so Stripe stops retrying.
    return Response.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Guard against acting on a session that isn't actually paid.
  if (session.payment_status !== "paid") {
    return Response.json({ received: true });
  }

  const notifyEmail = process.env.NOTIFY_EMAIL?.trim();
  const fromEmail = process.env.FROM_EMAIL?.trim();
  const resendKey = process.env.RESEND_API_KEY?.trim();

  if (!notifyEmail || !fromEmail || !resendKey) {
    // Returning 200 would tell Stripe the event was handled when the shop was
    // never told about the order. 500 makes Stripe retry.
    console.error("Paid order received but email env vars are missing", { id: session.id });
    return Response.json({ error: "Notification not configured." }, { status: 500 });
  }

  const meta = session.metadata ?? {};
  const amount =
    typeof session.amount_total === "number"
      ? `$${(session.amount_total / 100).toFixed(2)}`
      : "unknown";

  const rows = [
    row("Order total", amount),
    row("Service", meta.productId ?? ""),
    row("Option", meta.option ?? ""),
    row("Quantity", meta.quantity ?? ""),
    row("Add-ons", meta.addOns && meta.addOns !== "none" ? meta.addOns : ""),
    row("Customer email", session.customer_details?.email ?? ""),
    row("Customer phone", session.customer_details?.phone ?? ""),
    row("Customer name", session.customer_details?.name ?? ""),
    row("Stripe session", session.id),
  ].join("");

  const notes = meta.notes
    ? `<p><strong>Customer notes:</strong></p><p>${escapeHtml(meta.notes).replace(/\n/g, "<br>")}</p>`
    : "";

  const html = `
    <h2>Paid order — Nice Stitch</h2>
    <p>This order has been <strong>paid</strong> through the website.</p>
    <table>${rows}</table>
    ${notes}
    <p><strong>Artwork is not attached.</strong> The checkout does not take file
    uploads — follow up with the customer to collect print-ready files.</p>
  `;

  try {
    const { error } = await new Resend(resendKey).emails.send({
      from: fromEmail,
      to: notifyEmail,
      replyTo: session.customer_details?.email ?? undefined,
      subject: `Paid order ${amount} — ${meta.productId ?? "Nice Stitch"}`,
      html,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Failed to email paid-order notification", error);
    // Non-200 so Stripe retries rather than dropping a paid order silently.
    return Response.json({ error: "Could not send notification." }, { status: 500 });
  }

  return Response.json({ received: true });
}
