// ---------------------------------------------------------------------------
// OUR WORK — add a job by dropping a photo into public/assets/img/work/ and
// adding an entry below. Newest first. Only put real Nice Stitch jobs here.
//
//   { file: "bakery-hoodies.jpg",       // file inside public/assets/img/work/
//     title: "Glendura Bakery hoodies", // what it is
//     service: "Embroidery",            // Embroidery | DTF | UV DTF | DTG |
//                                       // Screen Printing | Banners
//     detail: "24 pieces, left chest" } // optional extra line
//
// While this list is empty, /gallery shows "Portfolio coming soon" and stays
// out of the sitemap; both switch over on their own once there is an entry.
// The nav link does not: add { href: "/gallery", label: "Our Work" } to
// navLinks in site-config.ts once there are a few jobs to show.
// ---------------------------------------------------------------------------
export type WorkService =
  | "Embroidery"
  | "DTF"
  | "UV DTF"
  | "DTG"
  | "Screen Printing"
  | "Banners";

export type WorkItem = {
  file: string;
  title: string;
  service: WorkService;
  detail?: string;
};

export const work: readonly WorkItem[] = [
  // Example of the shape — delete this line and add real jobs:
  // { file: "bakery-hoodies.jpg", title: "Glendura Bakery hoodies", service: "Embroidery", detail: "24 pieces, left chest" },
];
