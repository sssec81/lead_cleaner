import type { Metadata } from "next";

export type ToolMetadataInput = {
  title: string;
  description: string;
  path: string;
  category?: string;
  keywords?: string[];
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://leadcleanr.com";

export function buildToolMetadata({
  title,
  description,
  path,
  keywords = [],
}: ToolMetadataInput): Metadata {
  const url = `${SITE_URL}${path}`;

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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    url: `${SITE_URL}${path}`,
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