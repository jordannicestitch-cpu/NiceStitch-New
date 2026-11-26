import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig, emailHref, phoneHref } from "@/lib/site-config";
import { POLICY_LAST_UPDATED } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy Policy | Nice Stitch",
  description:
    "What information Nice Stitch collects through this website, why, and who it is shared with.",
};

export default function PrivacyPage() {
  return (
    <section className="legal-section">
      <div className="wrap wrap--narrow">
        <h1>Privacy Policy</h1>
        <p className="legal-updated">Last updated {POLICY_LAST_UPDATED}</p>

        <p>
          This policy covers {siteConfig.url.replace("https://", "")}. In
          short: we collect what we need to quote and produce your order, and
          nothing else. We do not sell your information.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Quote requests</strong> — your name, email, phone,
            company, and whatever you describe about the job, plus any artwork
            you upload.
          </li>
          <li>
            <strong>Orders</strong> — your name, email and phone, collected by
            Stripe during checkout, along with what you ordered.
          </li>
        </ul>
        <p>
          We do not run analytics, advertising pixels or third-party trackers
          on this site, and we do not set cookies of our own.
        </p>

        <h2>Card details</h2>
        <p>
          Card payments are handled entirely by Stripe. Card numbers are
          submitted directly to Stripe and never pass through or get stored on
          this website. Stripe&apos;s handling of that data is covered by{" "}
          <a
            href="https://stripe.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripe&apos;s privacy policy
          </a>
          .
        </p>

        <h2>Who processes your information</h2>
        <ul>
          <li>
            <strong>Vercel</strong> — hosts the website and receives standard
            server request logs.
          </li>
          <li>
            <strong>Resend</strong> — delivers quote requests and order
            notifications to our inbox.
          </li>
          <li>
            <strong>Stripe</strong> — processes payments.
          </li>
        </ul>
        <p>
          Each receives only what it needs to do that job. We do not sell or
          rent your information to anyone.
        </p>

        <h2>Artwork you send us</h2>
        <p>
          We keep your artwork so we can reproduce or reorder your job later.
          Ask us and we will delete it. We do not use customer artwork as
          portfolio or marketing material without permission — see our{" "}
          <Link href="/gallery">work page</Link>.
        </p>

        <h2>How long we keep things</h2>
        <p>
          Quote and order records are retained while we have a working
          relationship and afterwards as long as needed for tax and accounting
          purposes. Artwork is kept until you ask us to remove it.
        </p>

        <h2>Your choices</h2>
        <p>
          You can ask us what we hold about you, ask for it to be corrected, or
          ask us to delete it. California residents have specific rights under
          the CCPA, including the right to know and the right to deletion — the
          same request process applies.
        </p>

        <h2>Contact</h2>
        <p>
          {siteConfig.name}
          <br />
          {siteConfig.addressLines.join(", ")}
          {siteConfig.phone ? (
            <>
              <br />
              <a href={phoneHref}>{siteConfig.phone}</a>
            </>
          ) : null}
          {siteConfig.email ? (
            <>
              <br />
              <a href={emailHref}>{siteConfig.email}</a>
            </>
          ) : null}
        </p>
      </div>
    </section>
  );
}
