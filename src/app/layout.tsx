import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { profile, socials } from "@/data/portfolio";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: "Vinayak Vashisth | codeRED",
  description:
    "Full-stack engineer building secure, expressive products: backends, interfaces, and everything in between.",
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
    title: "Vinayak Vashisth | codeRED",
    description: "Building secure, expressive products for the web. Backend to pixel.",
    url: profile.siteUrl,
    siteName: "codeRED",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "codeRED: Vinayak Vashisth, full-stack engineer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@codeREDxbt",
    creator: "@codeREDxbt",
    title: "Vinayak Vashisth | codeRED",
    description: "Building secure, expressive products for the web. Backend to pixel.",
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

/**
 * Structured data for answer/generative engines (AEO/GEO): who this person
 * is, what this site is, and where else they live on the web.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${profile.siteUrl}/#person`,
      name: profile.name,
      alternateName: profile.handle,
      url: profile.siteUrl,
      email: `mailto:${profile.email}`,
      jobTitle: profile.role,
      description:
        "Full-stack engineer building secure, expressive products: backends, interfaces, and everything in between.",
      knowsAbout: [
        "Full-stack development",
        "Next.js",
        "React",
        "TypeScript",
        "Web3",
        "Smart contracts",
        "Stellar",
        "Aptos",
        "Zero-knowledge proofs",
      ],
      sameAs: socials.map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${profile.siteUrl}/#website`,
      url: profile.siteUrl,
      name: `${profile.name} (${profile.handle})`,
      description:
        "Portfolio of Vinayak Vashisth (codeRED): case studies in Web3, SaaS, and product engineering.",
      inLanguage: "en",
      publisher: { "@id": `${profile.siteUrl}/#person` },
    },
    {
      "@type": "ProfilePage",
      "@id": `${profile.siteUrl}/#profile`,
      url: profile.siteUrl,
      name: `${profile.name} (${profile.handle})`,
      inLanguage: "en",
      isPartOf: { "@id": `${profile.siteUrl}/#website` },
      mainEntity: { "@id": `${profile.siteUrl}/#person` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
