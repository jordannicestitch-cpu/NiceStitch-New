import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { emailHref, phoneHref, siteConfig } from "@/lib/site-config";

// Cache Components rejects an uncached `new Date()` during prerender, so the
// year is captured in the static shell and refreshed daily.
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export function SiteFooter() {
  const { name, phone, email, addressLines, hours, instagram, facebook } =
    siteConfig;

  return (
    <footer className="site-footer">
      <div className="wrap site-footer__inner">
        <div className="site-footer__col">
          <Image
            className="site-footer__logo"
            src="/assets/img/ns-logo-light.png"
            alt="Nice Stitch — Embroidery & Direct to Garment"
            width={300}
            height={124}
          />
          <p>
            DTF, DTG, screen printing, embroidery &amp; banners — LA Fashion
            District
          </p>
        </div>
        <div className="site-footer__col">
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
        <div className="site-footer__col">
          <h3>Contact</h3>
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
          {(instagram || facebook) && (
            <p>
              {instagram && <a href={instagram}>Instagram</a>}{" "}
              {facebook && <a href={facebook}>Facebook</a>}
            </p>
          )}
        </div>
        <div className="site-footer__col">
          <h3>Quotes</h3>
          <p>
            <Link href="/pricing">See pricing →</Link>
          </p>
          <p>
            <Link href="/quote">Request a quote →</Link>
          </p>
        </div>
      </div>
      <div className="wrap site-footer__bottom">
        <p>
          &copy; <CopyrightYear /> {name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
