"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ADD_ONS,
  PRODUCTS,
  findProduct,
  formatMoney,
  priceSelection,
} from "@/lib/catalog";

// The same priceSelection() the server uses runs here purely to show a running
// total. It is never sent — /api/checkout recomputes from the selection, so a
// tampered preview cannot change the amount charged.

export function OrderForm() {
  const [productId, setProductId] = useState<string>(PRODUCTS[0]?.id ?? "");
  const [quantity, setQuantity] = useState<string>("1");
  const [option, setOption] = useState<string>("");
  const [addOns, setAddOns] = useState<readonly string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const product = findProduct(productId);

  // Reset the option whenever the product changes, so a stale placement from a
  // previous product can't be submitted.
  function selectProduct(nextId: string) {
    setProductId(nextId);
    const next = findProduct(nextId);
    setOption(next?.kind === "per_piece" ? next.option.choices[0]?.value ?? "" : "");
    setQuantity(next?.kind === "per_piece" ? String(next.minQty) : "1");
    setError("");
  }

  const preview = useMemo(
    () =>
      priceSelection({
        productId,
        quantity: Number(quantity),
        option: option || undefined,
        addOns,
      }),
    [productId, quantity, option, addOns],
  );

  function toggleAddOn(id: string) {
    setAddOns((current) =>
      current.includes(id) ? current.filter((a) => a !== id) : [...current, id],
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!preview.ok) {
      setError(preview.error);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: Number(quantity),
          option: option || undefined,
          addOns,
          notes,
        }),
      });
      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? "Could not start checkout. Please try again.");
        setSubmitting(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Could not reach the payment service. Please try again.");
      setSubmitting(false);
    }
  }

  const quantityLabel =
    product?.kind === "per_inch" ? `Height (${product.unitLabel})` : "Quantity";

  return (
    <form className="quote-form" onSubmit={handleSubmit}>
      <div className="quote-form__row">
        <label htmlFor="OrderProduct">What do you need? *</label>
        <select
          id="OrderProduct"
          value={productId}
          onChange={(e) => selectProduct(e.target.value)}
        >
          {PRODUCTS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        {product ? <p className="quote-form__help">{product.blurb}</p> : null}
      </div>

      {product?.kind === "per_piece" ? (
        <div className="quote-form__row">
          <label htmlFor="OrderOption">{product.option.label} *</label>
          <select
            id="OrderOption"
            value={option}
            onChange={(e) => setOption(e.target.value)}
          >
            {product.option.choices.map((choice) => (
              <option key={choice.value} value={choice.value}>
                {choice.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="quote-form__row">
        <label htmlFor="OrderQuantity">{quantityLabel} *</label>
        <input
          id="OrderQuantity"
          type="number"
          min={product?.kind === "per_piece" ? product.minQty : 1}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />
        {product?.note ? <p className="quote-form__help">{product.note}</p> : null}
      </div>

      <fieldset className="order-addons">
        <legend>Add-ons</legend>
        {ADD_ONS.map((addOn) => (
          <label key={addOn.id} className="order-addon">
            <input
              type="checkbox"
              checked={addOns.includes(addOn.id)}
              onChange={() => toggleAddOn(addOn.id)}
            />
            <span>
              <strong>
                {addOn.name} — {formatMoney(addOn.price)}
              </strong>
              <span className="order-addon__blurb">{addOn.blurb}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="quote-form__row">
        <label htmlFor="OrderNotes">Anything we should know?</label>
        <textarea
          id="OrderNotes"
          rows={4}
          value={notes}
          maxLength={500}
          placeholder="Garment colors, sizes, placement notes, deadline…"
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className="order-total" aria-live="polite">
        {preview.ok ? (
          <>
            <ul className="order-total__lines">
              {preview.lines.map((line, i) => (
                <li key={i}>
                  <span>{line.name}</span>
                  <span>{formatMoney(line.subtotal)}</span>
                </li>
              ))}
            </ul>
            <p className="order-total__sum">
              <span>Total</span>
              <span>{formatMoney(preview.total)}</span>
            </p>
          </>
        ) : (
          <p className="order-total__invalid">{preview.error}</p>
        )}
      </div>

      {error ? (
        <p className="quote-form__status" data-state="error">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="btn btn--primary btn--large quote-form__submit"
        disabled={submitting || !preview.ok}
      >
        {submitting ? "Taking you to checkout…" : "Continue to payment"}
      </button>

      <p className="quote-form__help">
        Payment is handled by Stripe — card details never touch this site.
        Need embroidery, UV DTF, or something custom?{" "}
        <Link href="/quote">Request a quote</Link> instead.
      </p>
    </form>
  );
}
