import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing | Nice Stitch",
  description:
    "Pricing for DTG, DTF, screen printing, embroidery, banners and signs at Nice Stitch in the LA Fashion District.",
};

// Transcribed 1:1 from the shop's price sheet (pricing.html). The tables are
// written out literally because their shapes differ; do not reword or reorder.
export default function PricingPage() {
  return (
    <section className="pricing-section">
      <div className="wrap">
        <h1>Pricing</h1>
        <p className="section-sub section-sub--left">Straightforward rates on the work we do most. Anything unusual, send it over and we&apos;ll quote it.</p>

        <div className="price-grid">
          <section className="price-card" id="price-dtg">
            <h2>DTG Printing</h2>
            <p className="price-card__note">Direct to garment. Full color, no setup fees. Front print, any size.</p>
            <table className="price-table">
              <thead>
                <tr><th>Quantity</th><th>Next day</th><th>Same day</th></tr>
              </thead>
              <tbody>
                <tr><td>1 to 24 pieces</td><td>$25</td><td>$35</td></tr>
                <tr><td>25+ pieces</td><td>$15 each</td><td>—</td></tr>
              </tbody>
            </table>
          </section>

          <section className="price-card" id="price-embroidery">
            <h2>Embroidery</h2>
            <table className="price-table">
              <thead>
                <tr><th>Placement</th><th>1 to 24</th><th>25+</th></tr>
              </thead>
              <tbody>
                <tr><td>Left chest</td><td>$9</td><td>$7</td></tr>
                <tr><td>Full front</td><td>$70</td><td>$50</td></tr>
              </tbody>
            </table>
            <p className="price-card__note">Price per piece. Final price depends on stitch count. Large or detailed logos are quoted per design.</p>
          </section>

          <section className="price-card" id="price-screen">
            <h2>Screen Printing</h2>
            <table className="price-table">
              <thead>
                <tr><th>Colors</th><th>Per shirt</th></tr>
              </thead>
              <tbody>
                <tr><td>1 color</td><td>$4</td></tr>
                <tr><td>2 colors</td><td>$5</td></tr>
                <tr><td>3 colors</td><td>$6</td></tr>
                <tr><td>4 colors</td><td>$7</td></tr>
              </tbody>
            </table>
            <p className="price-card__note">Minimums apply. Every print gets a white underbase — it keeps colors bright and stops cracking and chipping. The underbase counts as one color.</p>
          </section>

          <section className="price-card" id="price-dtf">
            <h2>DTF Printing</h2>
            <h3 className="price-card__sub">Pressed on your shirt</h3>
            <table className="price-table">
              <thead>
                <tr><th>Placement</th><th>1 to 24</th><th>25+</th></tr>
              </thead>
              <tbody>
                <tr><td>Full front</td><td>$18</td><td>$12</td></tr>
                <tr><td>Left chest</td><td>$12</td><td>$8</td></tr>
              </tbody>
            </table>
            <h3 className="price-card__sub">Transfers only — 22&quot; gang sheets</h3>
            <table className="price-table">
              <tbody>
                <tr><td>Per inch of height</td><td>$0.90</td></tr>
                <tr><td>5+ yards, per inch</td><td>$0.75</td></tr>
              </tbody>
            </table>
            <p className="price-card__note">$10 minimum on transfer orders.</p>
          </section>

          <section className="price-card" id="price-signs">
            <h2>Signs &amp; Banners</h2>
            <table className="price-table">
              <tbody>
                <tr><td>Banner, 120&quot; x 60&quot;</td><td>$250</td></tr>
                <tr><td>Banner, 72&quot; x 24&quot;</td><td>$180</td></tr>
                <tr><td>Step &amp; repeat, 10&apos; x 8&apos; with stand</td><td>$400</td></tr>
                <tr><td>Foam board sign, 24&quot; x 36&quot;</td><td>$75</td></tr>
              </tbody>
            </table>
          </section>

          <section className="price-card" id="price-brands">
            <h2>For Brands</h2>
            <table className="price-table">
              <tbody>
                <tr><td>Print on demand (DTG)</td><td>Ask us</td></tr>
                <tr><td>Informational website</td><td>$750</td></tr>
                <tr><td>Online store with payments</td><td>$800 to $1,200</td></tr>
              </tbody>
            </table>
            <p className="price-card__note">Print on demand: send us orders as they come in. No paying for inventory up front.</p>
          </section>
        </div>

        <div className="price-extras">
          <div className="price-extra">
            <span className="price-extra__amount">$20</span>
            <span className="price-extra__title">Art fee</span>
            <p>If your file isn&apos;t print ready (vector for print, DST for embroidery), we&apos;ll create it for you.</p>
          </div>
          <div className="price-extra">
            <span className="price-extra__amount">$100</span>
            <span className="price-extra__title">Rush fee</span>
            <p>Same day jobs, or work done outside our normal production schedule.</p>
          </div>
        </div>

        <div className="price-cta">
          <h2>Need a number for your job?</h2>
          <p>Send us the details and your artwork and we&apos;ll come back with exact pricing and turnaround.</p>
          <Link className="btn btn--primary btn--large" href="/quote">Request a Quote</Link>
        </div>
      </div>
    </section>
  );
}
