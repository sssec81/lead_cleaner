import type { MetadataRoute } from "next";

const staticRoutes = [
  "",
  "/tools",
  "/tools/csv-lead-cleaner",
  "/tools/extract-emails-from-csv",
  "/tools/extract-emails-from-text",
  "/tools/extract-phone-numbers-from-text",
  "/tools/extract-urls-from-text",
  "/tools/extract-domains-from-emails",
  "/tools/clean-email-list",
  "/tools/remove-duplicate-emails",
  "/tools/remove-duplicate-phone-numbers",
  "/tools/remove-duplicate-urls",
  "/tools/extract-phone-numbers-from-csv",
  "/tools/remove-empty-rows-from-csv",
  "/tools/validate-email-list",
  "/tools/count-words-characters-text",
  "/tools/convert-csv-to-json",
  "/tools/merge-csv-files",
  "/pricing",
  "/privacy",
  "/terms",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = process.env.BUILD_TIME 
    ? new Date(process.env.BUILD_TIME) 
    : new Date();

  return staticRoutes.map((route) => ({
    url: `https://leadcleanr.com${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.startsWith("/tools/") ? 0.8 : 0.6,
  }));
}
