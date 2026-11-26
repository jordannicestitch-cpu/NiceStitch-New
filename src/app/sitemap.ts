import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { work } from "@/lib/work";
import { stripeConfigured } from "@/lib/stripe";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    "/pricing",
    // The gallery is listed only once it has jobs to show.
    ...(work.length > 0 ? ["/gallery"] : []),
    // Likewise /order — listing a page that only says payment is switched off
    // would be worse than not listing it.
    ...(stripeConfigured() ? ["/order"] : []),
    "/about",
    "/contact",
    "/quote",
    "/terms",
    "/refunds",
    "/privacy",
  ];

  return paths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
  }));
}
