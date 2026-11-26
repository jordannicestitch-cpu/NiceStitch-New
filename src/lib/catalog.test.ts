import { describe, expect, it } from "vitest";
import { PRODUCTS, SCREEN_PRINT_MIN_QTY, priceSelection } from "./catalog";

function total(selection: Parameters<typeof priceSelection>[0]) {
  const result = priceSelection(selection);
  if (!result.ok) throw new Error(`expected ok, got: ${result.error}`);
  return result.total;
}

describe("DTG tiers", () => {
  it("charges $25/piece under 25 on next day", () => {
    expect(total({ productId: "dtg", quantity: 24, option: "next_day" })).toBe(24 * 2500);
  });

  it("drops to $15/piece at exactly 25", () => {
    expect(total({ productId: "dtg", quantity: 25, option: "next_day" })).toBe(25 * 1500);
  });

  it("keeps same-day at $35 even in bulk — the sheet lists no 25+ same-day rate", () => {
    expect(total({ productId: "dtg", quantity: 30, option: "same_day" })).toBe(30 * 3500);
  });

  it("rejects a missing turnaround choice", () => {
    expect(priceSelection({ productId: "dtg", quantity: 5 }).ok).toBe(false);
  });
});

describe("screen print minimum", () => {
  it("rejects below the minimum", () => {
    const result = priceSelection({
      productId: "screen_print",
      quantity: SCREEN_PRINT_MIN_QTY - 1,
      option: "1",
    });
    expect(result.ok).toBe(false);
  });

  it("accepts at the minimum and prices per colour", () => {
    expect(total({ productId: "screen_print", quantity: SCREEN_PRINT_MIN_QTY, option: "4" })).toBe(
      SCREEN_PRINT_MIN_QTY * 700,
    );
  });
});

describe("DTF pressed tiers", () => {
  it("full front is $18 under 25 and $12 at 25+", () => {
    expect(total({ productId: "dtf_pressed", quantity: 10, option: "full_front" })).toBe(10 * 1800);
    expect(total({ productId: "dtf_pressed", quantity: 25, option: "full_front" })).toBe(25 * 1200);
  });

  it("left chest is $12 under 25 and $8 at 25+", () => {
    expect(total({ productId: "dtf_pressed", quantity: 10, option: "left_chest" })).toBe(10 * 1200);
    expect(total({ productId: "dtf_pressed", quantity: 25, option: "left_chest" })).toBe(25 * 800);
  });
});

describe("DTF transfers priced per inch", () => {
  it("applies the $10 minimum on small orders", () => {
    // 5" x $0.90 = $4.50, below the $10 minimum
    expect(total({ productId: "dtf_transfers", quantity: 5 })).toBe(1000);
  });

  it("charges $0.90/inch above the minimum", () => {
    expect(total({ productId: "dtf_transfers", quantity: 50 })).toBe(50 * 90);
  });

  it("drops to $0.75/inch at 5 yards", () => {
    expect(total({ productId: "dtf_transfers", quantity: 180 })).toBe(180 * 75);
  });

  it("still charges the higher rate one inch below the threshold", () => {
    expect(total({ productId: "dtf_transfers", quantity: 179 })).toBe(179 * 90);
  });

  it("keeps quantity * unitAmount equal to the subtotal when the minimum kicks in", () => {
    const result = priceSelection({ productId: "dtf_transfers", quantity: 5 });
    if (!result.ok) throw new Error("expected ok");
    for (const line of result.lines) {
      expect(line.unitAmount * line.quantity).toBe(line.subtotal);
    }
  });
});

describe("fixed-price items", () => {
  it("prices banners from the sheet", () => {
    expect(total({ productId: "banner_120x60", quantity: 1 })).toBe(25000);
    expect(total({ productId: "banner_72x24", quantity: 1 })).toBe(18000);
    expect(total({ productId: "step_repeat", quantity: 1 })).toBe(40000);
    expect(total({ productId: "foam_board", quantity: 1 })).toBe(7500);
  });

  it("multiplies by quantity", () => {
    expect(total({ productId: "foam_board", quantity: 3 })).toBe(3 * 7500);
  });
});

describe("add-ons", () => {
  it("adds art and rush fees once each", () => {
    expect(
      total({
        productId: "foam_board",
        quantity: 1,
        addOns: ["art_fee", "rush_fee"],
      }),
    ).toBe(7500 + 2000 + 10000);
  });

  it("rejects an unknown add-on", () => {
    expect(
      priceSelection({ productId: "foam_board", quantity: 1, addOns: ["free_stuff"] }).ok,
    ).toBe(false);
  });
});

describe("input is not trusted", () => {
  it("rejects unknown products", () => {
    expect(priceSelection({ productId: "embroidery", quantity: 10 }).ok).toBe(false);
    expect(priceSelection({ productId: "uv_dtf", quantity: 10 }).ok).toBe(false);
  });

  it.each([0, -5, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 1_000_000])(
    "rejects quantity %p",
    (qty) => {
      expect(priceSelection({ productId: "foam_board", quantity: qty as number }).ok).toBe(false);
    },
  );

  it("never produces a negative or zero total", () => {
    for (const product of PRODUCTS) {
      const option = product.kind === "per_piece" ? product.option.choices[0]?.value : undefined;
      const qty = product.kind === "per_piece" ? product.minQty : 1;
      const result = priceSelection({ productId: product.id, quantity: qty, option });
      if (!result.ok) throw new Error(`${product.id}: ${result.error}`);
      expect(result.total).toBeGreaterThan(0);
    }
  });
});
