import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AnalyticsScripts } from "@/components/analytics-scripts";
import { TelemetryProvider } from "@/components/telemetry-provider";
import { getSiteUrl } from "@/lib/seo";

import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
 metadataBase: new URL(siteUrl),
 applicationName: "LeadCleanr",
 title: {
 default: "LeadCleanr — Clean Messy Lead CSVs Before CRM Import",
 template: "%s | LeadCleanr",
 },
 description:
 "Clean messy lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal email addresses locally in your browser.",
 keywords: [
 "lead cleaner",
 "csv lead cleaner",
 "crm import cleanup",
 "lead list cleanup",
 "browser-based csv cleaner",
 ],
 openGraph: {
 title: "LeadCleanr — Clean Messy Lead CSVs Before CRM Import",
 description:
 "Clean messy lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal email addresses locally in your browser.",
 url: siteUrl,
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
 title: "LeadCleanr — Clean Messy Lead CSVs Before CRM Import",
 description:
 "Clean messy lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal email addresses locally in your browser.",
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
 <a href="#main-content" className="skip-link">
 Skip to main content
 </a>
 <AnalyticsScripts />
 <TelemetryProvider />
 {children}
 </body>
 </html>
 );
}
