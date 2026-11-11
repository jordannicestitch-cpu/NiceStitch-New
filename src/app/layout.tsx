import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import { SiteFooter } from "./_components/SiteFooter";
import { SiteHeader } from "./_components/SiteHeader";
import { UtilityBar } from "./_components/UtilityBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title:
    "Nice Stitch | DTF, DTG, Screen Printing, Embroidery & Banners — LA Fashion District",
  description:
    "Custom DTF transfers, DTG printing, screen printing, embroidery, and banners in the LA Fashion District, Downtown Los Angeles. Request a quote and upload your artwork.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a className="skip-to-content" href="#MainContent">
          Skip to content
        </a>
        <UtilityBar />
        <SiteHeader />
        <main id="MainContent">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
