import type { Metadata } from "next";
import Link from "next/link";
import { work } from "@/lib/work";
import { WorkGallery } from "./_components/WorkGallery";

export const metadata: Metadata = {
  title: "Our Work | Nice Stitch",
  description:
    "Recent custom printing and embroidery work from Nice Stitch in the LA Fashion District.",
};

export default function GalleryPage() {
  return (
    <section className="work-section">
      <div className="wrap">
        <h1>Our Work</h1>
        <p className="section-sub section-sub--left">
          A look at recent jobs that have come through the shop.
        </p>

        {work.length > 0 ? (
          <WorkGallery items={work} />
        ) : (
          <div id="WorkEmpty" className="work-empty">
            <h2>Portfolio coming soon</h2>
            <p>
              We&apos;re photographing recent jobs. In the meantime, tell us
              what you need and we&apos;ll show you samples directly.
            </p>
            <Link className="btn btn--primary btn--large" href="/quote">
              Request a Quote
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
