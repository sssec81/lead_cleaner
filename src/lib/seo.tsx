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
    },
  };
}

export function ToolJsonLd({ title, description, path, category = "WebApplication" }: ToolMetadataInput) {
  const siteUrl = getSiteUrl();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    url: new URL(path, `${siteUrl}/`).toString(),
    applicationCategory: category,
    operatingSystem: "WebBrowser",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
