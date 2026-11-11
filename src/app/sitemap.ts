import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { work } from "@/lib/work";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    "/pricing",
    // The gallery is listed only once it has jobs to show.
    ...(work.length > 0 ? ["/gallery"] : []),
    "/about",
    "/contact",
    "/quote",
  ];

  return paths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
  }));
}
