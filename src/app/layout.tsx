import type { Metadata } from "next";
import { DM_Sans, Inter, JetBrains_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { AnalyticsScripts } from "@/components/analytics-scripts";
import { TelemetryProvider } from "@/components/telemetry-provider";
import { getSiteUrl } from "@/lib/seo";

import "./globals.css";

const siteUrl = getSiteUrl();
const fontDisplay = DM_Sans({
 subsets: ["latin"],
 weight: ["400", "500", "700"],
 variable: "--font-display",
 display: "swap",
});
const fontBody = Inter({
 subsets: ["latin"],
 weight: ["400", "500", "600"],
 variable: "--font-body",
 display: "swap",
});
const fontMono = JetBrains_Mono({
 subsets: ["latin"],
 weight: ["400", "500"],
 variable: "--font-mono",
 display: "swap",
});

export const metadata: Metadata = {
 metadataBase: new URL(siteUrl),
 applicationName: "LeadCleanr",
 title: {
 default: "LeadCleanr: Clean Messy Lead CSVs Before CRM Import",
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
 verification: {
 google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
 other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
 ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
 : undefined,
 },
 openGraph: {
 title: "LeadCleanr: Clean Messy Lead CSVs Before CRM Import",
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
 title: "LeadCleanr: Clean Messy Lead CSVs Before CRM Import",
 description:
 "Clean messy lead CSVs before CRM import. Remove duplicates, invalid emails, blank rows, and personal email addresses locally in your browser.",
 images: ["/twitter-image"],
 },
 manifest: "/manifest.webmanifest",
 icons: {
 icon: "/icon.png",
 },
};

export default function RootLayout({ children }: { children: ReactNode }) {
 return (
 <html lang="en">
 <body className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}>
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
