import type { Metadata } from "next";

export type ToolMetadataInput = {
 title: string;
 description: string;
 path: string;
 name?: string;
 category?: string;
 keywords?: string[];
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
 return (
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
 />
 );
}

const DEFAULT_SITE_URL = "https://leadcleanr.com";

export function getSiteUrl() {
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
 name,
 title,
 description,
 path,
 category = "WebApplication",
}: ToolMetadataInput) {
 const siteUrl = getSiteUrl();
 const toolName = name ?? title.split(/[|:]/)[0]?.trim() ?? title;
 const jsonLd = {
 "@context": "https://schema.org",
 "@type": "SoftwareApplication",
 name: toolName,
 description,
 url: new URL(path, `${siteUrl}/`).toString(),
 applicationCategory: category,
 operatingSystem: "Any",
 brand: {
 "@type": "Brand",
 name: "LeadCleanr",
 },
 isAccessibleForFree: true,
 offers: {
 "@type": "Offer",
 price: "0",
 priceCurrency: "USD",
 },
 };

 return <JsonLd data={jsonLd} />;
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

 return <JsonLd data={jsonLd} />;
}

export function SiteJsonLd() {
 const siteUrl = getSiteUrl();
 const organizationId = `${siteUrl}/#organization`;
 const websiteId = `${siteUrl}/#website`;
 const jsonLd = {
 "@context": "https://schema.org",
 "@graph": [
 {
 "@type": "Organization",
 "@id": organizationId,
 name: "LeadCleanr",
 url: siteUrl,
 logo: {
 "@type": "ImageObject",
 url: `${siteUrl}/icon-512.png`,
 width: 512,
 height: 512,
 },
 },
 {
 "@type": "WebSite",
 "@id": websiteId,
 url: siteUrl,
 name: "LeadCleanr",
 description: "Browser-first tools for cleaning lead CSV files before CRM import.",
 publisher: { "@id": organizationId },
 inLanguage: "en",
 },
 ],
 };

 return <JsonLd data={jsonLd} />;
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

 return <JsonLd data={jsonLd} />;
}
