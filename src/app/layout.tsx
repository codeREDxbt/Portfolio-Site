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
    "Full-stack engineer building secure, expressive products — backends, interfaces, and everything in between.",
  keywords: [
    "Vinayak Vashisth",
    "codeRED",
    "Full-stack developer",
    "Next.js",
    "React",
    "Web3 developer",
    "Smart contract developer",
  ],
  authors: [{ name: profile.name, url: profile.siteUrl }],
  creator: profile.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Vinayak Vashisth — codeRED",
    description: "Building secure, expressive products for the web — backend to pixel.",
    url: profile.siteUrl,
    siteName: "codeRED",
    images: [{ url: "/images/og.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vinayak Vashisth — codeRED",
    description: "Building secure, expressive products for the web — backend to pixel.",
    images: ["/images/og.png"],
  },
  icons: { icon: "/brand/codeRED-logo.png" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0C0A09" },
    { media: "(prefers-color-scheme: light)", color: "#F7F2E8" },
  ],
  colorScheme: "dark light",
};

/**
 * Runs before first paint so the saved/system theme applies with no flash.
 */
const themeInit = `(function(){try{var t=localStorage.getItem("codered-theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="dark";}})();`;

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
