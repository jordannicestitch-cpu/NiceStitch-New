"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navLinks, siteConfig } from "@/lib/site-config";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const close = () => setIsOpen(false);

  return (
    <header className="site-header">
      <div className="wrap site-header__inner">
        <Link href="/" className="site-header__logo" onClick={close}>
          <Image
            className="site-header__logo-img"
            src="/assets/img/ns-wordmark.png"
            alt={siteConfig.name}
            width={250}
            height={92}
            loading="eager"
          />
        </Link>
        <nav className="site-header__nav" aria-label="Primary">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <Link className="btn btn--primary site-header__cta" href="/quote">
          Get a Quote
        </Link>
        <button
          type="button"
          className="site-header__menu-toggle"
          aria-expanded={isOpen}
          aria-controls="MobileNav"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <nav
        id="MobileNav"
        className="site-header__mobile-nav"
        aria-label="Mobile"
        hidden={!isOpen}
      >
        {navLinks.map((link) => (
          <Link key={link.href} href={link.href} onClick={close}>
            {link.label}
          </Link>
        ))}
        <Link className="btn btn--primary" href="/quote" onClick={close}>
          Get a Quote
        </Link>
      </nav>
    </header>
  );
}
