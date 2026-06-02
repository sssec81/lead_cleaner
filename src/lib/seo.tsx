import type { Metadata } from "next";

type ToolMetadataInput = {
  title: string;
  description: string;
  path: `/tools/${string}`;
  keywords: string[];
};

type ToolJsonLdProps = ToolMetadataInput & {
  category: string;
};

const SITE_URL = "https://leadcleanr.com";
const SITE_NAME = "LeadCleanr";

export function buildToolMetadata({
  title,
  description,
  path,
  keywords,
}: ToolMetadataInput): Metadata {
  const canonicalUrl = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
    },
  };
}

export function ToolJsonLd({
  title,
  description,
  path,
  category,
}: ToolJsonLdProps) {
  const pageUrl = new URL(path, SITE_URL).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${title} | ${SITE_NAME}`,
        description,
        url: pageUrl,
        applicationCategory: category,
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript. Works in modern browsers.",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        publisher: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Tools",
            item: `${SITE_URL}/tools`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
