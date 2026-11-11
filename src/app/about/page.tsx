import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Nice Stitch",
  description:
    "Nice Stitch — custom printing and embroidery in the LA Fashion District.",
};

export default function AboutPage() {
  return (
    <section className="about-section">
      <div className="wrap wrap--narrow">
        <h1>About Nice Stitch</h1>
        <div className="about-section__body">
          <p>Replace with your real shop story — how long you&apos;ve been printing in the Fashion District, what makes your work different, who you work with.</p>
        </div>
      </div>
    </section>
  );
}
