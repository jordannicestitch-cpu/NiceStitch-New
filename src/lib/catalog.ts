// Server-authoritative product catalog, transcribed from the shop price sheet.
//
// SECURITY: the browser only ever submits *selections* (what service, how many,
// which options). Every amount charged is computed here, on the server, from
// these constants. Nothing price-shaped is accepted from the client, so a
// tampered request cannot change what Stripe charges.
//
// Services deliberately NOT sold online (they stay quote-only):
//   - Embroidery  — price depends on stitch count
//   - UV DTF      — no published price
//   - Online store builds — quoted as a $800–$1,200 range, not a fixed price
//   - Print on demand — "ask us"

export type Money = number; // always integer cents

/** Everything on the site is priced in USD. */
export const CURRENCY = "usd";

// ---------------------------------------------------------------------------
// ⚠ NEEDS CONFIRMATION FROM THE SHOP
// The price sheet says "Minimums apply" for screen printing but never states
// the number. 24 matches the shop's own 1–24 / 25+ tier break elsewhere on the
// sheet, so it is used as the default. Change this one constant if it's wrong.
// ---------------------------------------------------------------------------
export const SCREEN_PRINT_MIN_QTY = 24;

/** DTF gang sheets are billed per inch of height; 5+ yards earns the lower rate. */
const DTF_TRANSFER_BULK_THRESHOLD_INCHES = 5 * 36; // 5 yards
const DTF_TRANSFER_MIN_CHARGE: Money = 1000; // "$10 minimum on transfer orders"

/** The quantity at which per-piece apparel pricing drops to the bulk tier. */
const BULK_TIER_MIN_QTY = 25;

export type OptionChoice = {
  readonly value: string;
  readonly label: string;
};

export type Product =
  | {
      readonly kind: "per_piece";
      readonly id: string;
      readonly name: string;
      readonly blurb: string;
      /** Option that changes the rate (placement, color count, turnaround). */
      readonly option: { readonly label: string; readonly choices: readonly OptionChoice[] };
      readonly minQty: number;
      /** cents per piece, by option value then tier */
      readonly rates: Readonly<Record<string, { readonly standard: Money; readonly bulk: Money | null }>>;
      readonly note?: string;
    }
  | {
      readonly kind: "per_inch";
      readonly id: string;
      readonly name: string;
      readonly blurb: string;
      readonly unitLabel: string;
      readonly standardRate: Money;
      readonly bulkRate: Money;
      readonly bulkThreshold: number;
      readonly minCharge: Money;
      readonly note?: string;
    }
  | {
      readonly kind: "fixed";
      readonly id: string;
      readonly name: string;
      readonly blurb: string;
      readonly price: Money;
      readonly note?: string;
    };

export const PRODUCTS: readonly Product[] = [
  {
    kind: "per_piece",
    id: "dtg",
    name: "DTG Printing",
    blurb: "Direct to garment. Full color, no setup fees. Front print, any size.",
    option: {
      label: "Turnaround",
      choices: [
        { value: "next_day", label: "Next day" },
        { value: "same_day", label: "Same day" },
      ],
    },
    minQty: 1,
    rates: {
      // The sheet lists no 25+ same-day rate, so same-day has no bulk tier and
      // stays at its per-piece price however many are ordered.
      next_day: { standard: 2500, bulk: 1500 },
      same_day: { standard: 3500, bulk: null },
    },
    note: "No minimum. 25+ pieces drops to $15 each on next-day turnaround.",
  },
  {
    kind: "per_piece",
    id: "screen_print",
    name: "Screen Printing",
    blurb: "Bold, durable color. Best per-piece cost on larger runs.",
    option: {
      label: "Colors in the design",
      choices: [
        { value: "1", label: "1 color" },
        { value: "2", label: "2 colors" },
        { value: "3", label: "3 colors" },
        { value: "4", label: "4 colors" },
      ],
    },
    minQty: SCREEN_PRINT_MIN_QTY,
    rates: {
      "1": { standard: 400, bulk: null },
      "2": { standard: 500, bulk: null },
      "3": { standard: 600, bulk: null },
      "4": { standard: 700, bulk: null },
    },
    note:
      "Every print gets a white underbase — it keeps colors bright and stops cracking and chipping. The underbase counts as one color.",
  },
  {
    kind: "per_piece",
    id: "dtf_pressed",
    name: "DTF — pressed on your shirt",
    blurb: "We press your transfer onto garments you supply.",
    option: {
      label: "Placement",
      choices: [
        { value: "full_front", label: "Full front" },
        { value: "left_chest", label: "Left chest" },
      ],
    },
    minQty: 1,
    rates: {
      full_front: { standard: 1800, bulk: 1200 },
      left_chest: { standard: 1200, bulk: 800 },
    },
    note: "Priced for garments you supply. 25+ pieces drops to the bulk rate.",
  },
  {
    kind: "per_inch",
    id: "dtf_transfers",
    name: "DTF Transfers — 22\" gang sheets",
    blurb: "Ready-to-press transfers. Gang your designs onto one sheet.",
    unitLabel: "inches of height",
    standardRate: 90,
    bulkRate: 75,
    bulkThreshold: DTF_TRANSFER_BULK_THRESHOLD_INCHES,
    minCharge: DTF_TRANSFER_MIN_CHARGE,
    note: "$10 minimum. 5+ yards (180\") drops to $0.75 per inch.",
  },
  {
    kind: "fixed",
    id: "banner_120x60",
    name: 'Banner — 120" x 60"',
    blurb: "Large vinyl banner.",
    price: 25000,
  },
  {
    kind: "fixed",
    id: "banner_72x24",
    name: 'Banner — 72" x 24"',
    blurb: "Vinyl banner.",
    price: 18000,
  },
  {
    kind: "fixed",
    id: "step_repeat",
    name: "Step & repeat — 10' x 8' with stand",
    blurb: "Event backdrop, includes the stand.",
    price: 40000,
  },
  {
    kind: "fixed",
    id: "foam_board",
    name: 'Foam board sign — 24" x 36"',
    blurb: "Rigid foam board sign.",
    price: 7500,
  },
  {
    kind: "fixed",
    id: "website",
    name: "Informational website",
    blurb: "A site for your brand. Online stores are quoted separately.",
    price: 75000,
  },
] as const;

/** Optional extras that can be added to any order. */
export const ADD_ONS = [
  {
    id: "art_fee",
    name: "Art fee",
    price: 2000 as Money,
    blurb:
      "If your file isn't print ready (vector for print, DST for embroidery), we'll create it for you.",
  },
  {
    id: "rush_fee",
    name: "Rush fee",
    price: 10000 as Money,
    blurb: "Same day jobs, or work done outside our normal production schedule.",
  },
] as const;

export function findProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function findAddOn(id: string) {
  return ADD_ONS.find((a) => a.id === id);
}

export type PricedLine = {
  readonly name: string;
  readonly description: string;
  readonly unitAmount: Money;
  readonly quantity: number;
  /** unitAmount * quantity */
  readonly subtotal: Money;
};

export type PriceResult =
  | { readonly ok: true; readonly lines: readonly PricedLine[]; readonly total: Money }
  | { readonly ok: false; readonly error: string };

export type Selection = {
  readonly productId: string;
  /** Pieces for per_piece, inches for per_inch, ignored for fixed. */
  readonly quantity: number;
  readonly option?: string;
  readonly addOns?: readonly string[];
};

/**
 * The single place an order total is decided. Returns a flat error rather than
 * throwing so the route handler can turn it into a 400 the customer can act on.
 */
export function priceSelection(selection: Selection): PriceResult {
  const product = findProduct(selection.productId);
  if (!product) return { ok: false, error: "Unknown product." };

  const lines: PricedLine[] = [];

  if (product.kind === "fixed") {
    const qty = normaliseQty(selection.quantity, 1);
    if (qty === null) return { ok: false, error: "Quantity must be a whole number of at least 1." };
    lines.push({
      name: product.name,
      description: product.blurb,
      unitAmount: product.price,
      quantity: qty,
      subtotal: product.price * qty,
    });
  }

  if (product.kind === "per_piece") {
    const qty = normaliseQty(selection.quantity, product.minQty);
    if (qty === null) {
      return {
        ok: false,
        error:
          product.minQty > 1
            ? `${product.name} has a ${product.minQty}-piece minimum.`
            : "Quantity must be a whole number of at least 1.",
      };
    }
    const optionValue = selection.option ?? "";
    const rate = product.rates[optionValue];
    const choice = product.option.choices.find((c) => c.value === optionValue);
    if (!rate || !choice) {
      return { ok: false, error: `Choose a ${product.option.label.toLowerCase()}.` };
    }
    const useBulk = rate.bulk !== null && qty >= BULK_TIER_MIN_QTY;
    const unitAmount = useBulk ? (rate.bulk as Money) : rate.standard;
    lines.push({
      name: `${product.name} — ${choice.label}`,
      description: useBulk
        ? `${qty} pieces at the ${BULK_TIER_MIN_QTY}+ rate`
        : `${qty} piece${qty === 1 ? "" : "s"}`,
      unitAmount,
      quantity: qty,
      subtotal: unitAmount * qty,
    });
  }

  if (product.kind === "per_inch") {
    const inches = normaliseQty(selection.quantity, 1);
    if (inches === null) return { ok: false, error: "Enter a whole number of inches, at least 1." };
    const useBulk = inches >= product.bulkThreshold;
    const rate = useBulk ? product.bulkRate : product.standardRate;
    const raw = rate * inches;
    // The $10 minimum applies to the transfer line, not the whole order.
    const subtotal = Math.max(raw, product.minCharge);
    lines.push({
      name: product.name,
      description:
        subtotal > raw
          ? `${inches}" of height — $10 order minimum applied`
          : `${inches}" of height at $${(rate / 100).toFixed(2)} per inch`,
      // Stripe needs unit_amount * quantity to equal the subtotal, so a line
      // lifted to the minimum is sent as a single unit at the minimum price.
      unitAmount: subtotal > raw ? subtotal : rate,
      quantity: subtotal > raw ? 1 : inches,
      subtotal,
    });
  }

  for (const addOnId of selection.addOns ?? []) {
    const addOn = findAddOn(addOnId);
    if (!addOn) return { ok: false, error: "Unknown add-on." };
    lines.push({
      name: addOn.name,
      description: addOn.blurb,
      unitAmount: addOn.price,
      quantity: 1,
      subtotal: addOn.price,
    });
  }

  if (lines.length === 0) return { ok: false, error: "Nothing to charge." };

  const total = lines.reduce((sum, line) => sum + line.subtotal, 0);
  return { ok: true, lines, total };
}

/** Whole number, at or above `min`, and small enough to be a real order. */
function normaliseQty(value: unknown, min: number): number | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(n) || n < min || n > 100_000) return null;
  return n;
}

export function formatMoney(cents: Money): string {
  return `$${(cents / 100).toFixed(2)}`;
}
