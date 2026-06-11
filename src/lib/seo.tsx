import type { Metadata } from "next";

export type ToolMetadataInput = {
 title: string;
 description: string;
 path: string;
 category?: string;
 keywords?: string[];
};

const DEFAULT_SITE_URL = "https://leadcleanr.com";

function getSiteUrl() {
 const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

 if (!rawSiteUrl) {
 return DEFAULT_SITE_URL;
 }

 const withProtocol = /^https?:\/\//i.test(rawSiteUrl)
 ? rawSiteUrl
 : `https://${rawSiteUrl}`;

 try {
 return new URL(withProtocol).toString().replace(/\/$/, "");
 } catch {
 return DEFAULT_SITE_URL;
 }
}

export function buildToolMetadata({
 title,
 description,
 path,
 keywords = [],
}: ToolMetadataInput): Metadata {
 const siteUrl = getSiteUrl();
 const url = new URL(path, `${siteUrl}/`).toString();

 return {
 title,
 description,
 keywords,
 alternates: {
 canonical: url,
 },
 openGraph: {
 title,
 description,
 url,
 type: "website",
 siteName: "LeadCleanr",
 images: [
 {
 url: `${siteUrl}/opengraph-image`,
 width: 1200,
 height: 630,
 alt: title,
 },
 ],
 },
 twitter: {
 card: "summary_large_image",
 title,
 description,
 images: [`${siteUrl}/twitter-image`],
 },
 };
}

export function ToolJsonLd({
 title,
 description,
 path,
 category = "WebApplication",
}: ToolMetadataInput) {
 const siteUrl = getSiteUrl();
 const jsonLd = {
 "@context": "https://schema.org",
 "@type": "SoftwareApplication",
 name: title,
 description,
 url: new URL(path, `${siteUrl}/`).toString(),
 applicationCategory: category,
 operatingSystem: "WebBrowser",
 offers: {
 "@type": "Offer",
 price: "0",
 priceCurrency: "USD",
 },
 };

 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
 />
 );
}

export type FaqItem = {
 question: string;
 answer: string;
};

export function FaqJsonLd({ faqEntries }: { faqEntries: FaqItem[] }) {
 const jsonLd = {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 mainEntity: faqEntries.map((faq) => ({
 "@type": "Question",
 name: faq.question,
 acceptedAnswer: {
 "@type": "Answer",
 text: faq.answer,
 },
 })),
 };

 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
 />
 );
}

export type BreadcrumbItem = {
 name: string;
 url: string;
};

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
 const siteUrl = getSiteUrl();
 const jsonLd = {
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 itemListElement: items.map((item, index) => ({
 "@type": "ListItem",
 position: index + 1,
 name: item.name,
 item: item.url.startsWith("http")
 ? item.url
 : new URL(item.url, `${siteUrl}/`).toString(),
 })),
 };

 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
 />
 );
}
