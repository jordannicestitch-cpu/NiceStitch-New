import { NextResponse } from "next/server";
import { formatMoney, priceSelection, type Selection } from "@/lib/catalog";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { siteConfig } from "@/lib/site-config";

type Body = {
  productId?: unknown;
  quantity?: unknown;
  option?: unknown;
  addOns?: unknown;
  notes?: unknown;
};

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  if (!stripeConfigured()) {
    console.error("Checkout attempted but STRIPE_SECRET_KEY is not set.");
    return NextResponse.json(
      { error: "Online payment isn't switched on yet. Please request a quote instead." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return badRequest("Could not read the order.");
  }

  // Only selections cross the wire. Prices are computed here, never accepted.
  const selection: Selection = {
    productId: String(body.productId ?? ""),
    quantity: Number(body.quantity),
    option: body.option === undefined ? undefined : String(body.option),
    addOns: Array.isArray(body.addOns) ? body.addOns.map(String) : [],
  };

  const priced = priceSelection(selection);
  if (!priced.ok) return badRequest(priced.error);

  const notes = typeof body.notes === "string" ? body.notes.slice(0, 500) : "";

  const origin =
    process.env.ALLOWED_ORIGIN?.trim() || siteConfig.url || new URL(request.url).origin;

  try {
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: priced.lines.map((line) => ({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: line.unitAmount,
          product_data: {
            name: line.name,
            description: line.description,
          },
        },
      })),
      // Stripe collects the email; the shop needs a phone to chase artwork.
      phone_number_collection: { enabled: true },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/order?cancelled=1`,
      // Echoed back on the webhook so the shop email can describe the job
      // without re-deriving it from line items.
      metadata: {
        productId: selection.productId,
        quantity: String(selection.quantity),
        option: selection.option ?? "",
        addOns: (selection.addOns ?? []).join(",") || "none",
        notes,
        computedTotal: formatMoney(priced.total),
      },
    });

    if (!session.url) {
      console.error("Stripe session created without a URL", session.id);
      return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Failed to create Stripe Checkout session", error);
    return NextResponse.json({ error: "Could not start checkout." }, { status: 502 });
  }
}
