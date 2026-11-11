import type { Metadata } from "next";
import { QuoteForm } from "./_components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote | Nice Stitch",
  description:
    "Request a quote for DTG printing, screen printing, embroidery, or banners. Upload your artwork and we'll follow up with pricing and turnaround.",
};

export default function QuotePage() {
  return (
    <section className="quote-form-section">
      <div className="wrap wrap--narrow">
        <h1>Request a Quote</h1>
        <p className="quote-form__intro">
          Tell us what you need printed or embroidered. Upload your artwork and
          we&apos;ll get back to you with pricing and turnaround.
        </p>

        <QuoteForm />
      </div>
    </section>
  );
}
