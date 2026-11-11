import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found | Nice Stitch",
};

export default function NotFound() {
  return (
    <section className="not-found">
      <div className="wrap wrap--narrow">
        <h1>Page not found</h1>
        <p>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link className="btn btn--primary" href="/">
          Back to homepage
        </Link>
      </div>
    </section>
  );
}
