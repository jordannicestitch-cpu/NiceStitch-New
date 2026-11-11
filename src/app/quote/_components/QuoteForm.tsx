"use client";

import { useState, type FormEvent } from "react";
import {
  QUOTE_MAX_UPLOAD_BYTES,
  QUOTE_MAX_UPLOAD_LABEL,
  QUOTE_SERVICE_OPTIONS,
} from "@/lib/quote";

const ENDPOINT = "/api/quote";

const SUBMIT_TEXT = "Send quote request";
const SUBMITTING_TEXT = "Sending…";
const SUCCESS_TEXT =
  "Thanks — your request is in. We'll follow up by email shortly.";
const ERROR_TEXT =
  "Something went wrong sending your request. Please email us directly or try again.";
const TOO_LARGE_TEXT = `Artwork files are too large (${QUOTE_MAX_UPLOAD_LABEL} max total). Please remove a file or compress it.`;

type Status = { state: "success" | "error"; message: string };

export function QuoteForm() {
  const [status, setStatus] = useState<Status | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Read now: React clears `currentTarget` once the handler yields.
    const form = event.currentTarget;
    const formData = new FormData(form);

    let totalBytes = 0;
    for (const entry of formData.getAll("artwork")) {
      if (typeof entry !== "string") totalBytes += entry.size;
    }
    if (totalBytes > QUOTE_MAX_UPLOAD_BYTES) {
      setStatus({ state: "error", message: TOO_LARGE_TEXT });
      return;
    }

    setSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Quote request failed with status ${response.status}`);
      }
      setStatus({ state: "success", message: SUCCESS_TEXT });
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus({ state: "error", message: ERROR_TEXT });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // No `noValidate`: the original form set it, which let a submit with a
    // missing name, email or service reach the API and come back as the
    // generic error. The browser now enforces the `required` fields itself.
    <form id="QuoteForm" className="quote-form" onSubmit={handleSubmit}>
      <div className="quote-form__row">
        <label htmlFor="QuoteName">Full name *</label>
        <input id="QuoteName" name="name" type="text" required />
      </div>

      <div className="quote-form__row">
        <label htmlFor="QuoteCompany">Company / team (optional)</label>
        <input id="QuoteCompany" name="company" type="text" />
      </div>

      <div className="quote-form__row-group">
        <div className="quote-form__row">
          <label htmlFor="QuoteEmail">Email *</label>
          <input id="QuoteEmail" name="email" type="email" required />
        </div>
        <div className="quote-form__row">
          <label htmlFor="QuotePhone">Phone</label>
          <input id="QuotePhone" name="phone" type="tel" />
        </div>
      </div>

      <div className="quote-form__row">
        <label htmlFor="QuoteServiceType">Service needed *</label>
        <select
          id="QuoteServiceType"
          name="service_type"
          required
          defaultValue=""
        >
          <option value="">—</option>
          {QUOTE_SERVICE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="quote-form__row-group">
        <div className="quote-form__row">
          <label htmlFor="QuoteQuantity">Approximate quantity</label>
          <input
            id="QuoteQuantity"
            name="quantity"
            type="text"
            placeholder="e.g. 50"
          />
        </div>
        <div className="quote-form__row">
          <label htmlFor="QuoteDeadline">Needed by</label>
          <input id="QuoteDeadline" name="deadline" type="date" />
        </div>
      </div>

      <div className="quote-form__row">
        <label htmlFor="QuoteDetails">Project details</label>
        <textarea
          id="QuoteDetails"
          name="details"
          rows={5}
          placeholder="Garment type, colors, placement, sizes, design notes..."
        />
      </div>

      <div className="quote-form__row">
        <label htmlFor="QuoteArtwork">Upload artwork</label>
        <input
          id="QuoteArtwork"
          name="artwork"
          type="file"
          multiple
          accept=".png,.jpg,.jpeg,.pdf,.ai,.eps,.svg"
        />
        <p className="quote-form__help">
          PNG, JPG, PDF, AI, EPS — up to {QUOTE_MAX_UPLOAD_LABEL} total.
        </p>
      </div>

      <button
        type="submit"
        className="btn btn--primary btn--large quote-form__submit"
        disabled={submitting}
      >
        <span className="quote-form__submit-label">
          {submitting ? SUBMITTING_TEXT : SUBMIT_TEXT}
        </span>
      </button>

      <p
        className="quote-form__status"
        role="status"
        aria-live="polite"
        data-state={status?.state}
        hidden={status === null}
      >
        {status?.message}
      </p>
    </form>
  );
}
