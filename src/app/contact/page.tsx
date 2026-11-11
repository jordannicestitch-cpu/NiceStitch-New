import type { Metadata } from "next";
import Link from "next/link";
import { emailHref, phoneHref, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact | Nice Stitch",
  description:
    "Contact Nice Stitch — custom printing and embroidery in the LA Fashion District.",
};

export default function ContactPage() {
  const { phone, email, addressLines, hours } = siteConfig;

  return (
    <section className="contact-section">
      <div className="wrap wrap--narrow">
        <h1>Contact</h1>

        <div className="contact-section__grid">
          <div>
            <h3>Visit</h3>
            <div>
              {addressLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div>
              {hours.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
          <div>
            <h3>Reach us</h3>
            {phone && (
              <p>
                <a href={phoneHref}>{phone}</a>
              </p>
            )}
            {email && (
              <p>
                <a href={emailHref}>{email}</a>
              </p>
            )}
          </div>
        </div>

        {/* Once the exact shop address is confirmed, replace this with a Google Maps embed iframe. */}

        <p className="contact-section__cta">
          Have a project in mind? <Link href="/quote">Request a quote →</Link>
        </p>
      </div>
    </section>
  );
}
