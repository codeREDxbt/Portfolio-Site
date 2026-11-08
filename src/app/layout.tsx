import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { profile } from "@/data/portfolio";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: "Vinayak Vashisth — codeRED",
  description:
    "Web3 and full-stack engineer building secure, expressive products with polished interfaces.",
  keywords: [
    "Vinayak Vashisth",
    "codeRED",
    "Web3 developer",
    "Full-stack engineer",
    "Design engineer",
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vinayak Vashisth — codeRED",
    description:
      "Building secure, expressive products for the decentralized web.",
    url: profile.siteUrl,
    siteName: "codeRED",
    images: [{ url: "/images/og.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinayak Vashisth — codeRED",
    description:
      "Building secure, expressive products for the decentralized web.",
    images: ["/images/og.png"],
  },
  icons: { icon: "/brand/codeRED-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0C0A09",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
