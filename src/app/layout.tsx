import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AnalyticsScripts } from "@/components/analytics-scripts";
import { TelemetryProvider } from "@/components/telemetry-provider";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://leadcleanr.com"),
  applicationName: "LeadCleanr",
  title: {
    default: "LeadCleanr | Clean Messy Lead Lists Instantly",
    template: "%s | LeadCleanr",
  },
  description:
    "Paste text or upload a CSV to extract emails, phone numbers, URLs, domains, and remove duplicates in your browser.",
  keywords: [
    "lead cleaner",
    "csv lead cleaner",
    "email extractor",
    "lead list cleanup",
    "csv dedupe",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LeadCleanr | Clean Messy Lead Lists Instantly",
    description:
      "Paste text or upload a CSV to extract emails, phone numbers, URLs, domains, and remove duplicates in your browser.",
    url: "https://leadcleanr.com",
    siteName: "LeadCleanr",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "LeadCleanr",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LeadCleanr | Clean Messy Lead Lists Instantly",
    description:
      "Paste text or upload a CSV to extract emails, phone numbers, URLs, domains, and remove duplicates in your browser.",
    images: ["/twitter-image"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AnalyticsScripts />
        <TelemetryProvider />
        {children}
      </body>
    </html>
  );
}
