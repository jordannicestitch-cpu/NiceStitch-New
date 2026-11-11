import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The previous static site served every page as `/<name>.html`. Those URLs
  // are indexed and linked, so they redirect permanently to the clean routes
  // (browsers carry `#anchor` fragments across the redirect).
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      {
        source: "/:page(services|pricing|gallery|about|contact|quote).html",
        destination: "/:page",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
